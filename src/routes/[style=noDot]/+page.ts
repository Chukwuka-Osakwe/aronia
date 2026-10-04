import { dev } from '$app/environment';
import { error } from '@sveltejs/kit';
import { manifest } from '$lib/index.js';
import type { PageLoad } from './$types';

// Landing-only launch: the per-library "about" page is held back (dev-only). Opt out of
// the site-wide prerender and hard-404 outside dev. The prerender `entries` generator is
// gone with it — nothing ships these until the registry opens to the public.
export const prerender = false;

export const load: PageLoad = ({ params }) => {
	if (!dev) error(404, 'Not found');
	const style = manifest.styles.find((s) => s.id === params.style);
	if (!style) error(404, `Unknown library: ${params.style}`);
	return { styleId: style.id };
};
