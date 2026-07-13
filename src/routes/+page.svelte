<script lang="ts">
	import { manifest } from '$lib/index.js';
	import { registry } from './registry.js';
	import CopyMenu, { type Framework } from './CopyMenu.svelte';

	// The headline call-to-action: aronia is delivered by a command, not an import.
	// The Copy control is a framework dropdown; react is the CLI default so its flag
	// stays implicit — one language, any framework.
	const DISPLAY_INSTALL = 'npx aronia add button --style neo-brutalism';
	const installFor = (fw: Framework) =>
		`${DISPLAY_INSTALL}${fw === 'react' ? '' : ` --framework ${fw}`}`;
</script>

<div class="home">
	<header>
		<p class="eyebrow">Design language · v{manifest.version}</p>
		<h1>An agent-friendly design language</h1>
		<p class="lede">
			Run one command and aronia copies real, editable component source — plus a machine-readable
			<a href="/manifest.json">manifest</a> — into your repo. Your coding agent reads it as a worked
			example and builds the rest of your UI in the same style. Not a black-box dependency; a
			language your agent learns from your own code.
		</p>

		<div class="install">
			<code>{DISPLAY_INSTALL}</code>
			<CopyMenu label="Copy" getText={installFor} />
		</div>
		<p class="install__hint">New here? Read the <a href="/guide">guide</a>.</p>
	</header>

	<!-- One card per style, rendered in that style's OWN Card component — so each
	     card is itself a specimen of the library it links into. -->
	<section class="styles">
		{#each manifest.styles as style (style.id)}
			{@const Card = registry[style.id]?.card}
			{@const href = `/${style.id}/${style.components[0].id}`}
			{#if Card}
				<a class="style-card" {href} data-style={style.id} aria-label="Explore {style.name}">
					<Card>
						{#snippet header()}
							<span class="style-card__name">{style.name}</span>
						{/snippet}
						<p class="style-card__desc">{style.description}</p>
						{#if style.requires}
							<!-- Hard usage constraint (manifest `requires`) — a human deciding to
							     enter the library sees the same caveat an agent reads from the schema. -->
							<p class="style-card__note">Needs {style.requires}</p>
						{/if}
						{#snippet footer()}
							<span class="style-card__cta">Explore {style.components.length} components →</span>
						{/snippet}
					</Card>
				</a>
			{/if}
		{/each}
	</section>
</div>

<style>
	.eyebrow {
		text-transform: uppercase;
		letter-spacing: var(--doc-tracking-label);
		font-size: var(--doc-label);
		font-weight: 700;
		color: var(--doc-accent); /* brand pop atop the hero */
		margin: 0 0 0.6rem;
	}
	h1 {
		font-size: 2.75rem;
		font-weight: 800;
		letter-spacing: -0.02em;
		line-height: 1.05;
		margin: 0;
		max-width: 18ch;
	}
	.lede {
		font-size: var(--doc-lede);
		max-width: 60ch;
		color: var(--doc-muted);
		line-height: 1.6;
		margin: 0.9rem 0 0;
	}

	/* The install command is the primary CTA — a bordered slab with the docs' hard
	   shadow (same language as the guide's code blocks). Sized to its content so it
	   reads as one tappable command, not a full-width bar. */
	.install {
		display: inline-flex;
		align-items: center;
		gap: 1rem;
		margin: 1.75rem 0 0.75rem;
		max-width: 100%;
		background: var(--doc-panel);
		border: 1px solid var(--doc-ink);
		padding: 0.7rem 0.7rem 0.7rem 1.15rem;
	}
	.install code {
		font-family: var(--doc-code);
		font-size: 0.95rem;
		white-space: nowrap;
		overflow-x: auto;
	}
	.install__hint {
		font-size: var(--doc-sm);
		color: var(--doc-muted);
		margin: 0;
	}
	.install__hint a {
		color: var(--doc-ink);
		text-underline-offset: 3px;
	}

	.styles {
		margin-top: var(--doc-gap-pane);
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;
	}
	.style-card {
		display: block;
		width: 360px;
		max-width: 100%;
		text-decoration: none;
		color: inherit;
	}

	/* The specimen card gets real presence (large shadow) and the NB "shove" — half
	   on hover, full on press — same tactile language as the buttons. The scoped
	   `.style-card` prefix out-specifies the Card's own shadow, so these win. */
	.style-card :global(.nb-card) {
		box-shadow: var(--nb-shadow-lg);
		transition:
			transform 100ms ease,
			box-shadow 100ms ease;
	}
	.style-card:hover :global(.nb-card) {
		transform: translate(2px, 2px);
		box-shadow: 2px 2px 0 0 var(--nb-shadow-color);
	}
	.style-card:active :global(.nb-card) {
		transform: translate(4px, 4px);
		box-shadow: 0 0 0 0 var(--nb-shadow-color);
	}
	.style-card:focus-visible :global(.nb-card) {
		outline: 3px solid var(--nb-accent);
		outline-offset: 3px;
	}

	/* Glass specimen: a vivid gradient tile sits behind the (translucent) card so
	   the frost has something to refract on the otherwise-flat landing. Glass
	   floats on hover — its own motion language, not the NB shove. */
	.style-card[data-style='glassmorphism'] {
		border-radius: var(--glass-radius, 16px);
		background:
			radial-gradient(120% 120% at 0% 0%, #a78bfa 0%, transparent 55%),
			radial-gradient(120% 120% at 100% 100%, #7dd3fc 0%, transparent 55%),
			linear-gradient(135deg, #c4b5fd, #f0abfc);
	}
	.style-card :global(.glass-card) {
		transition:
			transform 160ms cubic-bezier(0.2, 0, 0, 1),
			box-shadow 160ms cubic-bezier(0.2, 0, 0, 1);
	}
	.style-card:hover :global(.glass-card) {
		transform: translateY(-3px);
		box-shadow: var(--glass-shadow-lg), var(--glass-highlight);
	}
	.style-card:focus-visible :global(.glass-card) {
		outline: 2px solid var(--glass-accent);
		outline-offset: 3px;
	}

	.style-card__name {
		font-size: 1.5rem;
	}
	.style-card__desc {
		margin: 0;
	}
	/* Caveat line — subordinate to the pitch via SIZE + a divider, never via lowered
	   contrast (opacity/faint colour would drop it below WCAG AA). It inherits the
	   card's full-strength ink, which is AA on the frosted surface. */
	.style-card__note {
		margin: 0.75rem 0 0;
		padding-top: 0.6rem;
		border-top: 1px solid color-mix(in srgb, currentColor 18%, transparent);
		font-size: var(--doc-xs);
		line-height: 1.45;
	}
	.style-card__cta {
		font-size: 0.95rem;
	}
</style>
