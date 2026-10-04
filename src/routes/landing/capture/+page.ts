// Dev-only CAPTURE surface for the hero marquee slides. Each tile renders one slide's full
// composition (world panel + device) at its exact marquee panel size, so a retina screenshot
// yields a clean 2× WebP. NEVER ship it: same guard as the specimens sheet — opt out of the
// site-wide prerender (see ../../+layout.ts) and hard-404 anywhere but dev.
import { dev } from '$app/environment';
import { error } from '@sveltejs/kit';

export const prerender = false;

export function load() {
	if (!dev) error(404, 'Not found');
}
