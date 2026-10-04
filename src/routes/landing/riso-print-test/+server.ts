// Dev-only THROWAWAY: the Risograph "print-in" hero feel-test (a self-contained HTML
// prototype, co-located as ./print-test.html and inlined here via Vite's `?raw`). It
// used to live in static/ — which meant it shipped as a public URL — so it's now a
// server route that hard-404s outside dev and opts out of the site-wide prerender
// (see ../../+layout.ts), keeping it reachable locally but off the live site.
import { dev } from '$app/environment';
import { error } from '@sveltejs/kit';
import html from './print-test.html?raw';

export const prerender = false;

export function GET() {
	if (!dev) error(404, 'Not found');
	return new Response(html, { headers: { 'content-type': 'text/html' } });
}
