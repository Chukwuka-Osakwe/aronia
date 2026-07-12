// Public entry point for the component library.
// Styles are grouped by design family; import from a namespace to stay explicit.
export * as neoBrutalism from './neo-brutalism/index.js';
export * as glassmorphism from './glassmorphism/index.js';
export * as swiss from './swiss/index.js';

// Machine-readable catalogue of styles/components/props — the "agentic" artifact.
export { manifest } from './manifest/index.js';
export type {
	Manifest,
	StyleSpec,
	ComponentSpec,
	PropSpec,
	SnippetSpec,
	PropType
} from './manifest/schema.js';
