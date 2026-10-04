import { dev } from '$app/environment';
import { error } from '@sveltejs/kit';
import { manifest } from '$lib/index.js';
import type { PageLoad } from './$types';

// Landing-only launch: the component browser is held back (dev-only). Opt out of the
// site-wide prerender and hard-404 outside dev. The prerender `entries` generator is
// gone with it — these doc pages don't ship until the registry opens to the public.
export const prerender = false;

export const load: PageLoad = ({ params }) => {
	if (!dev) error(404, 'Not found');
	const style = manifest.styles.find((s) => s.id === params.style);
	const spec = style?.components.find((c) => c.id === params.component);
	if (!style || !spec) error(404, `Unknown component: ${params.style}/${params.component}`);
	// Return only serializable ids; the page re-resolves the spec + component.
	return { styleId: style.id, componentId: spec.id };
};
