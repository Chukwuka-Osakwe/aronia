// Discover which local-only tuning labs exist under the gitignored
// src/routes/lab/<style>/, so the playground footer can link the active style's
// lab in dev. Empty in any clone without the local labs → no link → nothing
// lab-related ships in git.
//
// This lives in a plain .ts module rather than the layout's <script> because the
// glob pattern's `*/` token trips svelte-check's script-boundary scanner (the
// runtime compiles it fine either way).
export const labStyles = new Set(
	Object.keys(import.meta.glob('/src/routes/lab/*/+page.svelte')).map((p) => p.split('/')[4])
);
