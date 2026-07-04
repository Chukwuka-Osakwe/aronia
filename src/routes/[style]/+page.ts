import { error } from '@sveltejs/kit';
import { manifest } from '$lib/index.js';
import type { EntryGenerator, PageLoad } from './$types';

// Prerender one "about" page per library.
export const entries: EntryGenerator = () => manifest.styles.map((s) => ({ style: s.id }));

export const load: PageLoad = ({ params }) => {
	const style = manifest.styles.find((s) => s.id === params.style);
	if (!style) error(404, `Unknown library: ${params.style}`);
	return { styleId: style.id };
};
