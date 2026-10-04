import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// The whole public site is prerendered (see src/routes/+layout.ts), so we ship
			// a plain folder of static files — no serverless runtime needed. adapter-static
			// emits that into build/; deployable to Vercel or any static host. Swap back to
			// adapter-vercel if we ever add a public server route. The only non-prerendered
			// routes are the dev-only surfaces (prerender = false + dev-404); they simply
			// aren't emitted, so they 404 in production — hence strict: false (don't treat
			// their absence as a build error).
			adapter: adapter({ strict: false })
		})
	]
});
