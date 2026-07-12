#!/usr/bin/env node
// aronia — copy an agent-friendly design language into your repo.
//
// The whole idea (DESIGN.md Entries 31–33): rather than importing a black-box
// package, this writes real source — tokens, the stylesheet, and a component in
// YOUR framework — into `aronia/<style>/`, where your coding agent can read it
// as a worked example and generate the rest of your UI in the same language.
//
//   npx aronia add button --style neo-brutalism [--framework react|html|svelte]
//
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));

// --- registry resolution -------------------------------------------------
// A registry is either an http(s) base URL or a local directory of `<style>/
// <component>.json` items. Default: the copy bundled with the CLI, else the
// repo's build output when running inside the workspace (dev).
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
	if (!existsSync(path)) throw new Error(`no registry item at ${path}`);
	return JSON.parse(readFileSync(path, 'utf8'));
}

// --- install -------------------------------------------------------------
// Write one component's files into `aronia/<style>/` and record it in the
// consumer-facing manifest. Returns the relative paths written.
function installItem(item, framework, cwd) {
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
	const manifestPath = join(cwd, 'aronia', 'aronia.manifest.json');
	const manifest = existsSync(manifestPath)
		? JSON.parse(readFileSync(manifestPath, 'utf8'))
		: { name: 'aronia', styles: {}, components: [] };
	// Record the style's identity + composition guidance once per style, so the
	// consumer's agent can read HOW to compose tastefully in this design language
	// (principles + anti-patterns), not just reuse the components.
	manifest.styles ??= {};
	if (item.styleGuidance) manifest.styles[item.style] = item.styleGuidance;
	manifest.components = manifest.components.filter(
		(c) => !(c.style === item.style && c.component === item.component && c.framework === framework)
	);
	manifest.components.push({
		style: item.style,
		component: item.component,
		framework,
		name: item.name,
		styleClass: item.styleClass,
		dataAttrs: item.dataAttrs,
		files: [...skinFiles.map((f) => f.file), item.css.file, item.tokens.file],
		spec: item.spec
	});
	writeFileSync(manifestPath, JSON.stringify(manifest, null, '\t') + '\n');

	return written;
}

// Resolve a component and its registry dependencies (depth-first, deps first),
// installing each once. `seen` guards against duplicates / cycles.
async function installTree(registry, style, component, framework, cwd, seen, written) {
	const key = `${style}/${component}`;
	if (seen.has(key)) return;
	seen.add(key);

	const item = await loadItem(registry, style, component);
	for (const dep of item.registryDeps ?? []) {
		await installTree(registry, style, dep, framework, cwd, seen, written);
	}
	written.push({ name: item.name, files: installItem(item, framework, cwd) });
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
  aronia add <component> --style <style> [options]

Options:
  --style <id>        design-language family (e.g. neo-brutalism)   [required]
  --framework <fw>    react | html | svelte                         [default: react]
  --cwd <dir>         where to write the aronia/ folder             [default: .]
  --registry <src>    registry URL or local dir                    [default: bundled]
`;

// --- the `add` command ---------------------------------------------------
async function add(component, flags) {
	const style = flags.style;
	if (!component || !style) {
		console.error('error: `aronia add <component> --style <style>` requires both.\n');
		process.stdout.write(HELP);
		process.exit(1);
	}
	const framework = flags.framework || 'react';
	const cwd = flags.cwd || process.cwd();
	const registry = flags.registry || defaultRegistry();

	const written = [];
	await installTree(registry, style, component, framework, cwd, new Set(), written);

	const primary = written[written.length - 1];
	const deps = written.slice(0, -1);
	console.log(`\n✓ added ${primary.name} (${style}, ${framework})`);
	if (deps.length) console.log(`  + dependencies: ${deps.map((d) => d.name).join(', ')}`);
	console.log('');
	for (const w of written) for (const f of w.files) console.log(`  ${f}`);
	console.log(`  aronia/aronia.manifest.json`);
	console.log(
		`\nNext: tell your agent —\n  "Use aronia for all UI — read aronia/aronia.manifest.json and match the components in aronia/."\n`
	);
}

// --- entry ---------------------------------------------------------------
async function main() {
	const { positional, flags } = parseArgs(process.argv.slice(2));
	const cmd = positional[0];
	if (!cmd || cmd === 'help' || flags.help) {
		process.stdout.write(HELP);
		return;
	}
	if (cmd === 'add') {
		await add(positional[1], flags);
		return;
	}
	console.error(`unknown command: ${cmd}\n`);
	process.stdout.write(HELP);
	process.exit(1);
}

main().catch((err) => {
	console.error(`error: ${err.message}`);
	process.exit(1);
});
