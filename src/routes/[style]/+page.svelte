<script lang="ts">
	import { manifest } from '$lib/index.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Non-null: the load function already 404'd on an unknown style.
	const style = $derived(manifest.styles.find((s) => s.id === data.styleId)!);
	const firstHref = $derived(`/${style.id}/${style.components[0].id}`);
</script>

<article class="about">
	<header data-style={style.id}>
		<p class="eyebrow">Library</p>
		<h1>{style.name}</h1>
		<p class="lede">{style.description}</p>
	</header>

	<dl class="facts">
		<div>
			<dt>When to use</dt>
			<dd>{style.whenToUse}</dd>
		</div>
		{#if style.requires}
			<!-- Hard usage constraint (manifest `requires`) — the same caveat an agent
			     reads from the schema, surfaced for a human. -->
			<div>
				<dt>Requires</dt>
				<dd>{style.requires}</dd>
			</div>
		{/if}
	</dl>

	<a class="cta" href={firstHref}>Explore {style.components.length} components →</a>
</article>

<style>
	.about {
		max-width: 62ch;
	}
	.eyebrow {
		text-transform: uppercase;
		letter-spacing: var(--doc-tracking-label);
		font-size: var(--doc-label);
		font-weight: 700;
		color: var(--doc-muted);
		margin: 0 0 0.6rem;
	}
	h1 {
		font-size: 2.75rem;
		font-weight: 800;
		letter-spacing: -0.02em;
		line-height: 1.05;
		margin: 0;
	}
	/* The heading is a type specimen: it adopts the library's own display font (same
	   pattern as the component-page h1). Add one rule per new style. */
	header[data-style='neo-brutalism'] h1 {
		font-family: var(--nb-font);
	}
	header[data-style='glassmorphism'] h1 {
		font-family: var(--glass-font);
	}
	.lede {
		font-size: var(--doc-lede);
		color: var(--doc-muted);
		line-height: 1.6;
		margin: 0.9rem 0 0;
	}

	.facts {
		margin: var(--doc-gap-pane) 0 0;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
	.facts dt {
		text-transform: uppercase;
		letter-spacing: var(--doc-tracking-label);
		font-size: var(--doc-label);
		font-weight: 700;
		color: var(--doc-muted);
		margin-bottom: 0.35rem;
	}
	.facts dd {
		margin: 0;
		font-size: 1rem;
		line-height: 1.6;
		color: var(--doc-ink);
	}

	.cta {
		display: inline-block;
		margin-top: var(--doc-gap-pane);
		font-size: 1rem;
		font-weight: 600;
		color: var(--doc-ink);
		text-decoration: underline;
		text-decoration-thickness: 2px;
		text-underline-offset: 3px;
	}
</style>
