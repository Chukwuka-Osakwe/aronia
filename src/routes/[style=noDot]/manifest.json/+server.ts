// Emits a single style family's manifest as JSON at /<style>/manifest.json —
// the per-style counterpart to the root /manifest.json (which combines all
// families). `prerender = true` writes one static file per style at build time.
import { json, error } from '@sveltejs/kit';
import { manifest } from '$lib/manifest/index.js';
import type { EntryGenerator, RequestHandler } from './$types';

// Prerender one endpoint per style (same set as the [style] about pages).
export const prerender = true;
export const entries: EntryGenerator = () => manifest.styles.map((s) => ({ style: s.id }));

export const GET: RequestHandler = ({ params }) => {
	const style = manifest.styles.find((s) => s.id === params.style);
	if (!style) error(404, `Unknown library: ${params.style}`);
	return json(style);
};
