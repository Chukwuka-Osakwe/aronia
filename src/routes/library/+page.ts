// Landing-only launch: the component library (/library + the per-component pages) and
// the guide are held back until we're ready to open the registry to the public. This
// page is dev-only for now — opt out of the site-wide prerender (see ../+layout.ts) and
// hard-404 anywhere but dev, so only the marketing landing (/) ships.
import { dev } from '$app/environment';
import { error } from '@sveltejs/kit';

export const prerender = false;

export function load() {
	if (!dev) error(404, 'Not found');
}
