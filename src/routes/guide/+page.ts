// Landing-only launch: the guide is held back with the rest of the docs until the
// registry opens to the public. Dev-only for now — opt out of the site-wide prerender
// (see ../+layout.ts) and hard-404 anywhere but dev.
import { dev } from '$app/environment';
import { error } from '@sveltejs/kit';

export const prerender = false;

export function load() {
	if (!dev) error(404, 'Not found');
}
