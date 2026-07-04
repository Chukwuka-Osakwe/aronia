import { error } from '@sveltejs/kit';
import { manifest } from '$lib/index.js';
import type { EntryGenerator, PageLoad } from './$types';

// Enumerate every style/component pair so all doc pages prerender to static HTML.
export const entries: EntryGenerator = () =>
	manifest.styles.flatMap((s) => s.components.map((c) => ({ style: s.id, component: c.id })));

export const load: PageLoad = ({ params }) => {
	const style = manifest.styles.find((s) => s.id === params.style);
	const spec = style?.components.find((c) => c.id === params.component);
	if (!style || !spec) error(404, `Unknown component: ${params.style}/${params.component}`);
	// Return only serializable ids; the page re-resolves the spec + component.
	return { styleId: style.id, componentId: spec.id };
};
