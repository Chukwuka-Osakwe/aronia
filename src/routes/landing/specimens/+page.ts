// Dev-only capture/QA surface for the §4 rotator specimens (the four family cards on their
// grounds). NEVER ship it: the live rotator on /landing renders these cards itself, so this
// route exists only for local eyeballing + screenshots. Opt out of the site-wide prerender
// (see ../../+layout.ts) and hard-404 anywhere but dev, so it can't leak onto the live site.
import { dev } from '$app/environment';
import { error } from '@sveltejs/kit';

export const prerender = false;

export function load() {
	if (!dev) error(404, 'Not found');
}
