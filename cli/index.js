#!/usr/bin/env node
// aronia — copy an agent-friendly design language into your repo.
//
// The whole idea (DESIGN.md Entries 31–33): rather than importing a black-box
// package, this writes real source — tokens, the stylesheet, and a component in
// YOUR framework — into `aronia/<style>/`, where your coding agent can read it
// as a worked example and generate the rest of your UI in the same language.
//
// Two commands:
//   aronia init                     bring the language + onboarding in, pick no style yet
//   aronia add button --style neo-brutalism   add components (adopts a style on first use)
//
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));

// --- registry resolution -------------------------------------------------
// A registry is either an http(s) base URL or a local directory of `<style>/
// <component>.json` items (plus an `index.json`). Default: the copy bundled
// with the CLI, else the repo's build output when running inside the workspace.
function defaultRegistry() {
	if (process.env.ARONIA_REGISTRY) return process.env.ARONIA_REGISTRY;
	const bundled = join(HERE, 'r');
	if (existsSync(bundled)) return bundled;
	return join(HERE, '..', 'static', 'r'); // workspace dev fallback
}

async function loadItem(registry, style, component) {
	if (/^https?:\/\//.test(registry)) {
		const res = await fetch(`${registry.replace(/\/$/, '')}/${style}/${component}.json`);
		if (!res.ok) throw new Error(`registry ${res.status} for ${style}/${component}`);
		return res.json();
	}
	const path = join(registry, style, `${component}.json`);
	if (!existsSync(path)) throw new Error(`registry item not found: ${style}/${component}`);
	return JSON.parse(readFileSync(path, 'utf8'));
}

// Load a binary registry asset (a self-hosted font) as a Buffer. Fonts are the
// one non-JSON payload: too big to base64 into every component item, they ride
// alongside the JSON as sidecar files (`<style>/fonts/…`) — over http for a
// hosted registry, off disk for the CLI's bundled copy or the dev workspace.
async function loadBinary(registry, style, relPath) {
	if (/^https?:\/\//.test(registry)) {
		const res = await fetch(`${registry.replace(/\/$/, '')}/${style}/${relPath}`);
		if (!res.ok) throw new Error(`registry ${res.status} for ${style}/${relPath}`);
		return Buffer.from(await res.arrayBuffer());
	}
	const path = join(registry, style, relPath);
	if (!existsSync(path)) throw new Error(`registry file not found: ${style}/${relPath}`);
	return readFileSync(path); // no encoding → Buffer
}

async function loadIndex(registry) {
	if (/^https?:\/\//.test(registry)) {
		const res = await fetch(`${registry.replace(/\/$/, '')}/index.json`);
		if (!res.ok) throw new Error(`registry ${res.status} for index.json`);
		return res.json();
	}
	const path = join(registry, 'index.json');
	if (!existsSync(path)) throw new Error('registry index not found');
	return JSON.parse(readFileSync(path, 'utf8'));
}

// The per-style entry recorded in the consumer manifest: how to compose in this
// design language (principles + anti-patterns), its page-level composition
// guidance, and how to swap the typeface without dissolving the family. Same
// shape whether written by `init` (whole menu) or `add` (as each component
// lands), so the two never disagree.
function styleEntry(item) {
	const entry = { ...(item.styleGuidance ?? {}) };
	if (item.composition) entry.composition = item.composition;
	if (item.fontGuidance) entry.fontGuidance = item.fontGuidance;
	return entry;
}

// Build the full family menu — every style's identity/guidance, no components —
// by reading one item per style from the registry. This is what lets an agent
// describe all three families during the START.md conversation before any style
// is committed.
async function buildStyleMenu(registry, index) {
	const styles = {};
	const seen = new Set();
	for (const it of index.items) {
		if (seen.has(it.style)) continue;
		seen.add(it.style);
		styles[it.style] = styleEntry(await loadItem(registry, it.style, it.component));
	}
	return styles;
}

// --- bundled docs --------------------------------------------------------
// START.md (the onboarding gate) and AGENTS.md (the build rules) ship with the
// published CLI; in the workspace they live at the repo root.
function docPath(name) {
	const bundled = join(HERE, name);
	return existsSync(bundled) ? bundled : join(HERE, '..', name);
}

// --- consumer manifest ---------------------------------------------------
function manifestPath(cwd) {
	return join(cwd, 'aronia', 'aronia.manifest.json');
}
function readManifest(cwd) {
	const path = manifestPath(cwd);
	return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : null;
}
function writeManifest(cwd, manifest) {
	writeFileSync(manifestPath(cwd), JSON.stringify(manifest, null, '\t') + '\n');
}
// The manifest is a GENERATED artifact — every `init`/`add` rewrites it. This
// top-level marker warns an agent (which may reconcile the file without reading
// AGENTS.md) against hand-editing or merging it; the fix for a broken manifest is
// to re-run `aronia add`, not to patch it by hand.
const GENERATED_NOTE = 'by aronia; do not hand-edit or merge — re-run npx aronia add';
function emptyManifest() {
	return {
		_generated: GENERATED_NOTE,
		name: 'aronia',
		version: null,
		registry: null,
		adopted: null,
		framework: null,
		styles: {},
		components: []
	};
}
// Where these components came from, recorded at the manifest top so a version bump
// can be traced. `"bundled"` (the CLI-embedded registry) by default — never the
// absolute cache path, which would leak — or the explicit url/dir when chosen.
function registrySource(flags) {
	return flags.registry ?? process.env.ARONIA_REGISTRY ?? 'bundled';
}

// Best-effort framework detection from the consumer's package.json, so `init`
// can pre-fill it. Ambiguous or unknown → null (the conversation / first add
// settles it; `add` falls back to react).
function detectFramework(cwd) {
	const pkgPath = join(cwd, 'package.json');
	if (!existsSync(pkgPath)) return null;
	try {
		const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
		const deps = { ...pkg.dependencies, ...pkg.devDependencies };
		if (deps.svelte || deps['@sveltejs/kit']) return 'svelte';
		if (deps.react) return 'react';
	} catch {
		// unreadable package.json — just skip detection
	}
	return null;
}

// --- install -------------------------------------------------------------
// Build one component's manifest entry: the durable {style, component, framework}
// tuple (what a `rebuild` trusts) + the version it was pulled at + the
// registry-derived fields (styleClass/dataAttrs/files/spec). Extracted so `add`
// and a future `rebuild` emit byte-identical entries. `version` is the registry
// index's version at install time — per-component so a mixed-version project
// surfaces its own skew instead of one top-level field going stale-wrong.
function manifestEntry(item, framework, version) {
	const skinFiles = item.skins[framework];
	return {
		style: item.style,
		component: item.component,
		framework,
		name: item.name,
		version: version ?? null,
		styleClass: item.styleClass,
		dataAttrs: item.dataAttrs,
		files: [...skinFiles.map((f) => f.file), item.css.file, item.tokens.file, ...(item.fonts ?? [])],
		spec: item.spec
	};
}

// Write one component's files into `aronia/<style>/` and record it in the
// consumer-facing manifest. Returns the relative paths written.
function installItem(item, framework, cwd, version) {
	const skinFiles = item.skins[framework];
	if (!skinFiles) {
		const have = Object.keys(item.skins).join(', ');
		throw new Error(`${item.style}/${item.component} has no "${framework}" skin (available: ${have})`);
	}

	const destDir = join(cwd, 'aronia', item.style);
	mkdirSync(destDir, { recursive: true });

	const written = [];
	const put = (name, content) => {
		writeFileSync(join(destDir, name), content);
		written.push(join('aronia', item.style, name));
	};
	put(item.tokens.file, item.tokens.content); // tokens.css (once per style)
	put(item.css.file, item.css.content); // <component>.css
	for (const f of skinFiles) put(f.file, f.content); // one or more skin files

	// Merge the agent-facing contract into aronia/aronia.manifest.json.
	const manifest = readManifest(cwd) ?? emptyManifest();
	// Record the style's identity + composition guidance once per style, so the
	// consumer's agent can read HOW to compose tastefully in this design language
	// (principles + anti-patterns + page composition), not just reuse components.
	manifest.styles ??= {};
	if (item.styleGuidance || item.composition) manifest.styles[item.style] = styleEntry(item);
	manifest.components ??= [];
	manifest.components = manifest.components.filter(
		(c) => !(c.style === item.style && c.component === item.component && c.framework === framework)
	);
	manifest.components.push(manifestEntry(item, framework, version));
	writeManifest(cwd, manifest);

	return written;
}

// Copy a style's self-hosted fonts (if any) into `aronia/<style>/fonts/`, once
// per style. Idempotent; the tokens.css `@font-face`s reference them by the same
// relative path here and in the docs source, so a consumer renders offline.
async function installFonts(registry, item, cwd, seen) {
	const fontsKey = `fonts:${item.style}`;
	if (!item.fonts?.length || seen.has(fontsKey)) return [];
	seen.add(fontsKey);
	const written = [];
	for (const rel of item.fonts) {
		const dest = join(cwd, 'aronia', item.style, rel);
		mkdirSync(dirname(dest), { recursive: true });
		writeFileSync(dest, await loadBinary(registry, item.style, rel));
		written.push(join('aronia', item.style, rel));
	}
	return written;
}

// Resolve a component and its registry dependencies (depth-first, deps first),
// installing each once. `seen` guards against duplicates / cycles.
async function installTree(registry, style, component, framework, cwd, seen, written, version) {
	const key = `${style}/${component}`;
	if (seen.has(key)) return;
	seen.add(key);

	const item = await loadItem(registry, style, component);
	for (const dep of item.registryDeps ?? []) {
		await installTree(registry, style, dep, framework, cwd, seen, written, version);
	}
	const files = installItem(item, framework, cwd, version);
	files.push(...(await installFonts(registry, item, cwd, seen)));
	written.push({ name: item.name, files });
}

// --- arg parsing ---------------------------------------------------------
function parseArgs(argv) {
	const positional = [];
	const flags = {};
	for (let i = 0; i < argv.length; i++) {
		const a = argv[i];
		if (a.startsWith('--')) flags[a.slice(2)] = argv[++i];
		else positional.push(a);
	}
	return { positional, flags };
}

const HELP = `aronia — copy a design language into your repo

Usage:
  aronia init [options]                bring the language + onboarding in, no style yet
  aronia add <component...> [options]  add one or more components (adopts a style on first use)

Options:
  --style <id>        neo-brutalism | glassmorphism | swiss | risograph
                      required for the first add unless \`init\` + conversation chose one
  --framework <fw>    react | html | svelte              [default: detected, else react]
  --cwd <dir>         where to write the aronia/ folder   [default: .]
  --registry <src>    registry URL or local dir           [default: bundled]

Typical flow:
  npx aronia init            # brings aronia in; point your agent at aronia/START.md
  npx aronia add button      # once a style is chosen, pull components — no --style needed
`;

// --- the `init` command --------------------------------------------------
// Bootstrap without committing to a style: copy in the onboarding gate + build
// rules, and write a manifest holding the whole family menu but zero components
// and no adopted style. The agent then runs START.md, and the first `add`
// commits the chosen style.
async function init(flags) {
	const cwd = flags.cwd || process.cwd();
	const registry = flags.registry || defaultRegistry();

	const destDir = join(cwd, 'aronia');
	mkdirSync(destDir, { recursive: true });
	for (const doc of ['START.md', 'AGENTS.md']) {
		writeFileSync(join(destDir, doc), readFileSync(docPath(doc), 'utf8'));
	}

	const index = await loadIndex(registry);
	const manifest = readManifest(cwd) ?? emptyManifest();
	manifest.styles = await buildStyleMenu(registry, index); // refresh the full menu
	manifest.adopted ??= null;
	manifest.framework = flags.framework ?? manifest.framework ?? detectFramework(cwd) ?? null;
	manifest.components ??= [];
	manifest._generated = GENERATED_NOTE;
	manifest.version = index.version ?? null;
	manifest.registry = registrySource(flags);
	writeManifest(cwd, manifest);

	const styleCount = Object.keys(manifest.styles).length;
	console.log(`\n✓ aronia initialised — the design language and its onboarding are in aronia/.\n`);
	console.log(`  aronia/START.md`);
	console.log(`  aronia/AGENTS.md`);
	console.log(`  aronia/aronia.manifest.json  (${styleCount} styles, no components yet)`);
	console.log(
		`\nNext: tell your agent —\n  "Start at aronia/START.md and follow it before writing any UI."\n`
	);
}

// --- the `add` command ---------------------------------------------------
async function add(components, flags) {
	const cwd = flags.cwd || process.cwd();
	const registry = flags.registry || defaultRegistry();
	const manifest = readManifest(cwd);
	const adopted = manifest?.adopted ?? null;

	const style = flags.style || adopted;
	if (!components.length || !style) {
		if (components.length && !style) {
			console.error(
				`error: no style adopted yet.\n       Run \`aronia init\` and follow aronia/START.md, or pass \`--style <style>\`.\n`
			);
		} else {
			console.error('error: `aronia add <component> --style <style>` requires both.\n');
		}
		process.stderr.write(HELP);
		process.exit(1);
	}

	// Validate the style + every component against the registry index BEFORE any
	// filesystem lookup, so a typo yields a clear "unknown … — choose from: …"
	// instead of a raw file-not-found that leaks an internal cache path. Done
	// before the mixed-family note too, so a bogus id is never mistaken for a
	// real family.
	const index = await loadIndex(registry);
	const validStyles = [...new Set(index.items.map((i) => i.style))];
	if (!validStyles.includes(style)) {
		console.error(`error: unknown style "${style}" — choose from: ${validStyles.join(', ')}`);
		process.exit(1);
	}
	const validComponents = new Set(
		index.items.filter((i) => i.style === style).map((i) => i.component)
	);
	const unknown = components.filter((c) => !validComponents.has(c));
	if (unknown.length) {
		const names = unknown.map((c) => `"${c}"`).join(', ');
		console.error(
			`error: unknown component${unknown.length > 1 ? 's' : ''} ${names} — available: ${[...validComponents].join(', ')}`
		);
		process.exit(1);
	}

	if (flags.style && adopted && flags.style !== adopted) {
		console.error(`note: this project adopted "${adopted}"; adding "${flags.style}" mixes two families.`);
	}
	const framework = flags.framework || manifest?.framework || 'react';

	const written = [];
	const seen = new Set();
	for (const component of components) {
		await installTree(registry, style, component, framework, cwd, seen, written, index.version);
	}

	// Adopt-on-first-add: remember the style + framework so later `add`s need no
	// flags — `aronia add card` then reads as "a component of my language".
	const after = readManifest(cwd);
	const justAdopted = !adopted;
	after.adopted ??= style;
	after.framework ??= framework;
	after._generated = GENERATED_NOTE;
	after.version = index.version ?? null;
	after.registry = registrySource(flags);
	writeManifest(cwd, after);

	console.log(`\n✓ added ${written.map((w) => w.name).join(', ')} (${style}, ${framework})`);
	console.log('');
	const files = [];
	for (const w of written) for (const f of w.files) if (!files.includes(f)) files.push(f); // tokens.css is shared
	for (const f of files) console.log(`  ${f}`);
	console.log(`  aronia/aronia.manifest.json`);
	if (justAdopted) {
		console.log(`\nAdopted ${style}. Further components need no --style: aronia add <component>`);
	}
	console.log('');
}

// --- entry ---------------------------------------------------------------
async function main() {
	const { positional, flags } = parseArgs(process.argv.slice(2));
	const cmd = positional[0];
	if (!cmd || cmd === 'help' || flags.help) {
		process.stdout.write(HELP);
		return;
	}
	if (cmd === 'init') {
		await init(flags);
		return;
	}
	if (cmd === 'add') {
		await add(positional.slice(1), flags);
		return;
	}
	console.error(`unknown command: ${cmd}\n`);
	process.stderr.write(HELP);
	process.exit(1);
}

main().catch((err) => {
	console.error(`error: ${err.message}`);
	process.exit(1);
});
