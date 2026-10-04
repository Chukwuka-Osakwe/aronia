// Dev-only kitchen-sink: an internal QA surface that renders every component at once.
// NEVER ship it: opt out of the site-wide prerender (see ../+layout.ts) and hard-404
// anywhere but dev, so it can't leak onto the live site.
import { dev } from '$app/environment';
import { error } from '@sveltejs/kit';

export const prerender = false;

export function load() {
	if (!dev) error(404, 'Not found');
}
