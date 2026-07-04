// Emits the manifest as JSON. `prerender = true` means SvelteKit writes a static
// manifest.json into the build output at build time (and it's also live in dev at
// /manifest.json) — the retrievable artifact for an agent, no separate script.
import { json } from '@sveltejs/kit';
import { manifest } from '$lib/manifest/index.js';

export const prerender = true;

export function GET() {
	return json(manifest);
}
