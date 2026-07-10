<script lang="ts">
	// Static "How to use" guide: import, the manifest, and the theme contract.
	// The theming section is the load-bearing part — it's the same token list
	// recorded in DESIGN.md, surfaced for humans (and agents) who want to rebrand.

	// Brand palette — safe to override; changes colour without touching the style.
	const brandTokens: [string, string][] = [
		['--nb-ink', 'Text, borders, and shadows (the “black”).'],
		['--nb-paper', 'Surface / card background (the “white”).'],
		['--nb-primary', 'Primary emphasis — primary buttons, active tab, checkbox/radio fill.'],
		['--nb-secondary', 'Secondary emphasis — secondary buttons.'],
		['--nb-muted', 'Muted surfaces — disabled, ghost hover, toggle track.'],
		['--nb-accent', 'Focus rings and error / required marks.'],
		['--nb-info · --nb-success · --nb-warning · --nb-danger', 'Alert & status colours.'],
		['--nb-backdrop', 'Modal / overlay dim (derives from --nb-ink).'],
		['--nb-font · --nb-font-weight', 'Display font family and weight.']
	];

	// Structure — this IS the style. Override deliberately; it changes NB's identity.
	const structureTokens: [string, string][] = [
		['--nb-border-width', 'Border thickness (3px).'],
		['--nb-radius', 'Corner radius (0 = square). Raise it and it stops looking NB.'],
		['--nb-shadow-offset', 'Control shadow depth (1.5px).'],
		['--nb-shadow-lg-offset', 'Large-surface (Modal) shadow depth (4px).']
	];

	// Component-level tokens — a prop gives presets, the token takes any value and
	// wins over the preset (it's read first in the var() chain, so no specificity
	// fight). This table grows as components expose their own knobs.
	const componentTokens: [string, string][] = [
		['--nb-spinner-duration', 'Spinner rotation duration — any value; overrides the `speed` preset.']
	];
</script>

<svelte:head><title>How to use · viny</title></svelte:head>

<article class="guide">
	<header class="guide__head">
		<p class="eyebrow">Guide</p>
		<h1>How to use</h1>
		<p class="lede">
			Import a component, drop it in, and — when you want it to look like <em>your</em> product —
			re-skin it by overriding a handful of CSS custom properties.
		</p>
	</header>

	<section>
		<h2>Import &amp; use</h2>
		<p>Every family is a namespaced import; props are the closed, documented API.</p>
		<pre><code>{`import { neoBrutalism } from '$lib';
const { Button, Alert } = neoBrutalism;`}</code></pre>
		<pre><code>{`<Button variant="primary" size="md">Save</Button>
<Alert variant="success" title="Done">Your changes were saved.</Alert>`}</code></pre>
	</section>

	<section>
		<h2>The manifest</h2>
		<p>
			Every component, prop, enum, and slot is described in a machine-readable
			<a href="/manifest.json">manifest.json</a>. It's the single source of truth the docs are built
			from — and what lets an AI agent use the library correctly from the schema alone.
		</p>
	</section>

	<section>
		<h2>Theming: bring your own brand</h2>
		<p class="split">
			The tokens split cleanly into two layers.
			<strong>Structure</strong> — border width, square corners, the hard shadow — <em>is</em>
			Neo-Brutalism and normally stays put. <strong>Palette</strong> is your brand. Override the
			palette and every component follows, because these are CSS custom properties that cascade
			through the components' scoped styles.
		</p>

		<h3>Brand colours (override freely)</h3>
		<table>
			<tbody>
				{#each brandTokens as [token, role] (token)}
					<tr>
						<td><code>{token}</code></td>
						<td>{role}</td>
					</tr>
				{/each}
			</tbody>
		</table>

		<p>Drop this <em>after</em> the library's styles (so it wins the cascade), or scope it to a subtree:</p>
		<pre><code>{`:root {
  --nb-primary:   #6b4eff;   /* brand purple replaces the yellow */
  --nb-secondary: #00c2b8;
  --nb-ink:       #14121f;
  --nb-accent:    #ff3d7f;
  --nb-success:   #1db954;
}`}</code></pre>
		<p class="note">
			One thing to know: <code>--nb-primary</code> paints <em>every</em> primary surface at once
			(buttons, active tab, checkbox fill). That's deliberate — consistent brand — but it's broad
			reach.
		</p>

		<h3>Structure (override deliberately)</h3>
		<p>These change the style's identity itself — raise the radius and it stops reading as NB.</p>
		<table>
			<tbody>
				{#each structureTokens as [token, role] (token)}
					<tr>
						<td><code>{token}</code></td>
						<td>{role}</td>
					</tr>
				{/each}
			</tbody>
		</table>

		<h3>Component tokens</h3>
		<p>
			Some components go further than their props. The pattern: a <strong>prop</strong> gives the
			common presets, and a <strong>token</strong> takes any value — the token wins even from a
			plain rule, because it's read <em>ahead</em> of the preset in the <code>var()</code> chain
			(no specificity fight). Accessibility still wins over both (e.g. reduced-motion).
		</p>
		<table>
			<tbody>
				{#each componentTokens as [token, role] (token)}
					<tr>
						<td><code>{token}</code></td>
						<td>{role}</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<pre><code>{`<Spinner speed="fast" />                 <!-- preset -->
:root { --nb-spinner-duration: 1.2s; }   /* any value — wins over the preset */`}</code></pre>
	</section>
</article>

<style>
	.guide {
		max-width: 60rem;
		margin: 0 auto;
		color: var(--doc-ink);
	}
	.guide__head {
		border-bottom: 1px solid var(--doc-ink);
		padding-bottom: 1.5rem;
		margin-bottom: 2.5rem;
	}
	.eyebrow {
		font-size: var(--doc-label);
		text-transform: uppercase;
		letter-spacing: var(--doc-tracking-label);
		font-weight: 700;
		color: var(--doc-muted);
		margin: 0 0 0.5rem;
	}
	h1 {
		font-size: var(--doc-h1);
		font-weight: 800;
		letter-spacing: -0.02em;
		line-height: 1.05;
		margin: 0;
	}
	.lede {
		font-size: var(--doc-lede);
		line-height: 1.55;
		color: var(--doc-muted);
		max-width: 60ch;
		margin: 1rem 0 0;
	}
	section {
		margin-bottom: 3rem;
	}
	h2 {
		font-size: 1.25rem;
		font-weight: 700;
		margin: 0 0 0.75rem;
	}
	h3 {
		font-size: 1rem;
		font-weight: 700;
		margin: 2rem 0 0.75rem;
	}
	p {
		font-size: var(--doc-body);
		line-height: 1.6;
		max-width: 68ch;
		margin: 0 0 1rem;
	}
	a {
		color: var(--doc-ink);
		text-underline-offset: 3px;
	}
	.note {
		font-size: var(--doc-sm);
		color: var(--doc-muted);
		border-left: 3px solid var(--doc-line);
		padding-left: 1rem;
	}
	pre {
		background: var(--doc-panel);
		border: 1px solid var(--doc-ink);
		box-shadow: 4px 4px 0 0 var(--doc-ink);
		padding: 1.25rem 1.5rem;
		overflow-x: auto;
		margin: 0 0 1rem;
	}
	code {
		font-family: var(--doc-code);
		font-size: 0.875rem;
	}
	pre code {
		white-space: pre;
		line-height: 1.6;
	}
	table {
		width: 100%;
		border-collapse: collapse;
		margin: 0 0 1.25rem;
		font-size: var(--doc-sm);
	}
	td {
		border-top: 1px solid var(--doc-line);
		padding: 0.6rem 0.75rem 0.6rem 0;
		vertical-align: top;
		line-height: 1.5;
	}
	td:first-child {
		white-space: nowrap;
		padding-right: 1.5rem;
	}
	td code {
		color: var(--doc-ink);
	}
</style>
