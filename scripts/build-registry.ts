// Registry build — turns the manifest + source files into self-contained JSON
// registry items the aronia CLI copies into a consumer's repo.
//
// For every component that declares `files` (i.e. has been ported to the
// copy-into-repo registry, DESIGN.md Entries 31–32), we inline the ACTUAL file
// contents — Layer-1 tokens, the Layer-2 stylesheet, and each Layer-3 skin — so
// an item is everything needed to install with no path resolution at consume
// time. Output lands in `static/r/`, which SvelteKit serves at `/r/…`, so the
// same artifacts are both bundled-with-the-CLI and hostable as a live registry.
//
// Run: `npm run registry` (via tsx).
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join, basename, dirname } from 'node:path';
import { manifest } from '../src/lib/manifest/index.js';
import type { ComponentSpec } from '../src/lib/manifest/schema.js';

const ROOT = process.cwd();
const OUT = join(ROOT, 'static', 'r');

type FilePayload = { file: string; content: string };
interface RegistryItem {
	style: string;
	component: string;
	name: string;
	description: string;
	styleClass?: string;
	dataAttrs?: readonly string[];
	/** The full component contract (props, snippets, states) for agent context. */
	spec: Omit<ComponentSpec, 'files'>;
	/** The parent style's identity + composition guidance, denormalized onto every
	 *  item so `aronia add` can record it in the consumer manifest — telling the
	 *  agent how to compose tastefully in the style, not just reuse components. */
	styleGuidance: {
		name: string;
		description: string;
		principles?: readonly string[];
		avoid?: readonly string[];
	};
	/** Other component ids (same family) the CLI must install first. */
	registryDeps?: readonly string[];
	/** Layer 1 — written to the consumer as `tokens.css`. */
	tokens: FilePayload;
	/** Layer 2 — the design language for this component. */
	css: FilePayload;
	/** Layer 3 — thin prop→data-attr skins by framework; each is one or more files. */
	skins: Partial<Record<'react' | 'svelte' | 'html', FilePayload[]>>;
}

function read(relPath: string): string {
	return readFileSync(join(ROOT, relPath), 'utf8');
}

// The docs site self-hosts fonts via `@import '@fontsource-…'` (a bare npm
// specifier). A consumer's copied `aronia/` folder has no such package, so when
// we ship the tokens we swap each npm font import for a zero-install Google
// Fonts CDN import and rewrite the fontsource family name to the CDN one. The
// docs source is left as-is; only the emitted artifact is adapted.
const FONT_CDN: Record<string, { css: string; family: [string, string] }> = {
	'@fontsource-variable/archivo': {
		css: "@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@100..900&display=swap');",
		family: ['Archivo Variable', 'Archivo']
	},
	'@fontsource-variable/inter': {
		css: "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');",
		family: ['Inter Variable', 'Inter']
	}
};

// Svelte skins are the live source components, whose imports are repo-relative
// (`../styles/<style>.css`, `./css/<id>.css`). Rewrite them to the flat consumer
// layout (`aronia/<style>/`): the token sheet becomes ./tokens.css and the
// per-component sheet drops the css/ dir. (The `./options.js` type import is
// handled separately — options.ts is shipped co-located.)
function adaptSvelteSkin(code: string): string {
	return code
		.replace(/(['"])\.\.\/styles\/[a-z-]+\.css\1/g, "'./tokens.css'")
		.replace(/(['"])\.\/css\/([a-z0-9-]+)\.css\1/g, "'./$2.css'");
}

function adaptTokensForConsumers(css: string): string {
	let out = css;
	for (const [pkg, { css: cdn, family }] of Object.entries(FONT_CDN)) {
		if (!out.includes(pkg)) continue;
		out = out.replace(new RegExp(`@import\\s+['"]${pkg}['"];`), cdn);
		out = out.split(family[0]).join(family[1]);
	}
	// Drop docs-only comments that would be inaccurate in a shipped copy — they
	// describe self-hosting via @fontsource / the Svelte component importing the
	// font, neither of which is true once the tokens are CDN-loaded in a consumer.
	out = out.replace(/[ \t]*\/\*[^]*?\*\/\n?/g, (block) =>
		/fontsource|self-hosted|Button\.svelte/i.test(block) ? '' : block
	);
	return out;
}

function writeJson(path: string, data: unknown) {
	mkdirSync(dirname(path), { recursive: true });
	writeFileSync(path, JSON.stringify(data, null, '\t') + '\n');
}

rmSync(OUT, { recursive: true, force: true });

const index: { style: string; component: string; frameworks: string[] }[] = [];

for (const style of manifest.styles) {
	if (!style.tokens) continue; // style not yet ported to the registry
	const tokensContent = adaptTokensForConsumers(read(style.tokens));

	for (const component of style.components) {
		if (!component.files) continue; // component not yet ported

		const { files, ...spec } = component;

		const skins: RegistryItem['skins'] = {};
		for (const [fw, val] of Object.entries(files.skins)) {
			if (!val) continue;
			const paths = Array.isArray(val) ? val : [val];
			const payloads = paths.map((p) => ({
				file: basename(p),
				content: fw === 'svelte' ? adaptSvelteSkin(read(p)) : read(p)
			}));
			if (fw === 'svelte') {
				// Svelte skins reference the family's option unions via `./options.js`;
				// ship options.ts co-located so it resolves in the flat layout.
				const optionsPath = join(dirname(files.style), '..', 'options.ts');
				payloads.push({ file: 'options.ts', content: read(optionsPath) });
			}
			skins[fw as keyof RegistryItem['skins']] = payloads;
		}

		const item: RegistryItem = {
			style: style.id,
			component: component.id,
			name: component.name,
			description: component.description,
			styleClass: component.styleClass,
			dataAttrs: component.dataAttrs,
			registryDeps: component.registryDeps,
			spec,
			styleGuidance: {
				name: style.name,
				description: style.description,
				principles: style.principles,
				avoid: style.avoid
			},
			tokens: { file: 'tokens.css', content: tokensContent },
			css: { file: basename(files.style), content: read(files.style) },
			skins
		};

		writeJson(join(OUT, style.id, `${component.id}.json`), item);
		index.push({
			style: style.id,
			component: component.id,
			frameworks: Object.keys(skins)
		});
	}
}

writeJson(join(OUT, 'index.json'), { name: 'aronia', version: manifest.version, items: index });

console.log(`aronia registry: wrote ${index.length} item(s) to static/r/`);
for (const i of index) console.log(`  • ${i.style}/${i.component}  [${i.frameworks.join(', ')}]`);
