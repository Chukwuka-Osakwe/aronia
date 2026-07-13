<script lang="ts">
	// Static "How to use" guide: import, the manifest, and the theme contract.
	// The theming section is STYLE-AWARE — the three families expose genuinely
	// different token vocabularies (Swiss has status -ink tones and no primary/
	// shadow-offset; glass has blur/surface; nb has primary/shadow). Pick a family
	// and its own tokens + example load. Same lists recorded in DESIGN.md.
	type Row = [token: string, role: string];
	interface Theme {
		id: string;
		name: string;
		/** Palette — safe to override; recolours without touching the structure. */
		brand: Row[];
		/** Structure — IS the style; override deliberately. */
		structure: Row[];
		/** Component knobs — a prop gives presets, the token takes any value. */
		component: Row[];
		example: string;
		structureNote: string;
		paletteNote: string;
	}

	const THEMES: Theme[] = [
		{
			id: 'neo-brutalism',
			name: 'Neo-Brutalism',
			brand: [
				['--nb-ink', 'Text, borders, and shadows (the “black”).'],
				['--nb-paper', 'Surface / card background (the “white”).'],
				['--nb-primary', 'Primary emphasis — primary buttons, active tab, checkbox/radio fill.'],
				['--nb-secondary', 'Secondary emphasis — secondary buttons.'],
				['--nb-muted', 'Muted surfaces — disabled, ghost hover, toggle track.'],
				['--nb-accent', 'Focus rings and error / required marks.'],
				['--nb-info · --nb-success · --nb-warning · --nb-danger', 'Alert & status colours.'],
				['--nb-backdrop', 'Modal / overlay dim (derives from --nb-ink).'],
				['--nb-font · --nb-font-weight', 'Display font family and weight.']
			],
			structure: [
				['--nb-border-width', 'Border thickness (3px).'],
				['--nb-radius', 'Corner radius (0 = square). Raise it and it stops reading as NB.'],
				['--nb-shadow-offset', 'Control shadow depth (1.5px).'],
				['--nb-shadow-lg-offset', 'Large-surface (Modal) shadow depth (4px).']
			],
			component: [
				['--nb-spinner-duration', 'Spinner rotation duration — any value; overrides the `speed` preset.']
			],
			example: `:root {
  --nb-primary:   #6b4eff;   /* brand purple replaces the yellow */
  --nb-secondary: #00c2b8;
  --nb-ink:       #14121f;
  --nb-accent:    #ff3d7f;
  --nb-success:   #1db954;
}`,
			structureNote: 'These change the style’s identity itself — raise the radius and it stops reading as NB.',
			paletteNote:
				'<code>--nb-primary</code> paints <em>every</em> primary surface at once (buttons, active tab, checkbox fill). That’s deliberate — consistent brand — but it’s broad reach.'
		},
		{
			id: 'glassmorphism',
			name: 'Glassmorphism',
			brand: [
				['--glass-ink · --glass-ink-soft', 'Primary and secondary text over the frost.'],
				['--glass-surface · --glass-surface-strong', 'Frosted surface fills (strong = raised / hover).'],
				['--glass-primary', 'Primary emphasis — a translucent fill that carries white text.'],
				['--glass-secondary', 'Secondary emphasis — secondary buttons.'],
				['--glass-accent · --glass-link-ink', 'Focus ring (accent) and link / active text (AA as text).'],
				['--glass-info · --glass-success · --glass-warning · --glass-danger', 'Alert & status fills.'],
				['--glass-font · --glass-font-weight', 'Display font family and weight.']
			],
			structure: [
				['--glass-blur', 'Backdrop blur radius (14px) — the frost itself.'],
				['--glass-border-color', 'The light rim highlight on edges.'],
				['--glass-radius', 'Corner radius (16px — soft). Lower it and it stops reading as glass.'],
				['--glass-shadow', 'Diffuse depth shadow (no hard offset).']
			],
			component: [
				['--glass-spinner-duration', 'Spinner rotation duration — any value; overrides the `speed` preset.']
			],
			example: `:root {
  --glass-primary: rgba(124, 58, 237, 0.9);  /* violet, keep it dark for white text */
  --glass-accent:  #7c3aed;
  --glass-ink:     #16162a;
  --glass-radius:  20px;
}`,
			structureNote: 'These change the style’s identity — drop the blur or the radius and it stops reading as glass.',
			paletteNote:
				'<code>--glass-primary</code> is a <em>translucent</em> fill tuned to carry white text on any backdrop — keep a new value dark enough (≥4.5:1 over white) or the label drops below AA.'
		},
		{
			id: 'swiss',
			name: 'Swiss',
			brand: [
				['--swiss-ink', 'Text and hairline borders (the “ink”).'],
				['--swiss-paper', 'Surface / card background (the “paper”).'],
				['--swiss-accent', 'The single accent — used sparingly (primary button, toggle-on, progress fill, focus rings).'],
				['--swiss-accent-ink · --swiss-accent-text', 'Text ON the accent fill, and the darker accent for link / emphasis TEXT.'],
				['--swiss-muted · --swiss-ink-soft', 'Subtle grey fills, and secondary text (help lines, placeholders).'],
				['--swiss-info · --swiss-success · --swiss-warning · --swiss-danger (+ -ink)', 'Status colours; the -ink tones are AA as text & icons.'],
				['--swiss-backdrop', 'Modal / overlay dim (derives from --swiss-ink).'],
				['--swiss-font · --swiss-font-weight', 'Display font family and weight.']
			],
			structure: [
				['--swiss-border-width', 'Hairline border thickness (1px).'],
				['--swiss-radius', 'Corner radius (2px — crisp). Raise it and it drifts from Swiss.'],
				['--swiss-shadow-overlay', 'The one elevation — modal / menu / toast lift (flat everywhere else).']
			],
			component: [
				['--swiss-spinner-duration', 'Spinner rotation duration — any value; overrides the `speed` preset.']
			],
			example: `:root {
  --swiss-accent:      #1f6feb;   /* a blue accent */
  --swiss-accent-ink:  #ffffff;   /* white text on the blue fill */
  --swiss-accent-text: #1a5fd0;   /* darker blue for link text (AA) */
}`,
			structureNote: 'These change the style’s identity — raise the radius or add shadow and it stops reading as Swiss.',
			paletteNote:
				'Swiss reserves the accent for one emphasis at a time, so <code>--swiss-accent</code> recolours the primary button, toggle-on, progress fill, and focus rings together. Move <code>--swiss-accent-ink</code> and <code>--swiss-accent-text</code> with it so text on/off the accent stays AA.'
		}
	];

	let activeId = $state(THEMES[0].id);
	const theme = $derived(THEMES.find((t) => t.id === activeId) ?? THEMES[0]);
</script>

<svelte:head><title>How to use · aronia</title></svelte:head>

<article class="guide">
	<header class="guide__head">
		<p class="eyebrow">Guide</p>
		<h1>How to use</h1>
		<p class="lede">
			Copy a component into your repo with one command, point your agent at it, and — when you want
			it to look like <em>your</em> product — re-skin it by overriding a handful of CSS custom
			properties.
		</p>
	</header>

	<section>
		<h2>Add to your repo</h2>
		<p>
			aronia is delivered by a command, not a package install. Pick a component and a style family
			and it writes real, editable source into <code>aronia/&lt;style&gt;/</code> — yours to keep and
			change.
		</p>
		<pre><code>{`npx aronia add button --style neo-brutalism`}</code></pre>
		<p>That writes the tokens, the component's styles, and a thin skin in your framework — plus a manifest:</p>
		<pre><code>{`aronia/
  neo-brutalism/
    tokens.css     # design tokens (written once per style)
    button.css     # the component's styles — the actual "language"
    Button.tsx     # a thin skin in your framework
  aronia.manifest.json`}</code></pre>
		<p>
			Choose your framework with <code>--framework react|svelte|html</code> (defaults to
			<code>react</code>). Also: <code>--cwd &lt;dir&gt;</code> to write somewhere other than the
			current directory, and <code>--registry &lt;url|dir&gt;</code> to point at a specific registry.
			Components pull in their dependencies automatically (e.g. <code>toast</code> also adds
			<code>alert</code>).
		</p>
	</section>

	<section>
		<h2>Point your agent at it</h2>
		<p>
			This is the real payoff: your coding agent reads the copied source as a worked example and
			builds the rest of your UI in the same language. After adding a component or two, tell it —
		</p>
		<pre><code>{`Use aronia for all UI — read aronia/aronia.manifest.json
and match the components in aronia/.`}</code></pre>
		<p>
			<code>aronia/aronia.manifest.json</code> records every component you've added — its style
			class, data attributes, files, and full prop spec — so the agent works from the exact
			contract, not a guess.
		</p>
	</section>

	<section>
		<h2>Use it</h2>
		<p>Import the file that landed and drop it in — props are the closed, documented API (identical across frameworks).</p>
		<pre><code>{`import { Button } from './aronia/neo-brutalism/Button';

<Button variant="primary" size="md">Save</Button>`}</code></pre>
	</section>

	<section>
		<h2>Manifest &amp; registry</h2>
		<p>
			Two manifests, two audiences. Locally, <code>aronia/aronia.manifest.json</code> is the
			consumer-facing contract for the components you've added — the file your agent reads.
		</p>
		<p>
			Hosted here is the full registry the CLI and agents pull from: the whole catalog at
			<a href="/manifest.json">/manifest.json</a> (or a single family at
			<code>/&lt;style&gt;/manifest.json</code>), and per-component items indexed by
			<a href="/r/index.json">/r/index.json</a> → <code>/r/&lt;style&gt;/&lt;component&gt;.json</code>,
			each embedding the prop spec, tokens, CSS, and every framework skin. It's the single source of
			truth the docs, the CLI, and any agent build from.
		</p>
	</section>

	<section>
		<h2>Theming: bring your own brand</h2>
		<p class="split">
			The tokens split cleanly into two layers. <strong>Structure</strong> — border width, corners,
			shadow — <em>is</em> the style and normally stays put. <strong>Palette</strong> is your brand.
			Override the palette and every component follows, because these are CSS custom properties that
			cascade through the components' scoped styles. Each family prefixes its own tokens — pick one:
		</p>

		<!-- Style-aware: each family exposes a genuinely different token vocabulary. -->
		<div class="theme-switch" role="group" aria-label="Style family">
			{#each THEMES as t (t.id)}
				<button
					type="button"
					class="theme-switch__btn"
					data-active={t.id === activeId}
					aria-pressed={t.id === activeId}
					onclick={() => (activeId = t.id)}
				>
					{t.name}
				</button>
			{/each}
		</div>

		<h3>Brand colours (override freely)</h3>
		<table>
			<tbody>
				{#each theme.brand as [token, role] (token)}
					<tr>
						<td><code>{token}</code></td>
						<td>{role}</td>
					</tr>
				{/each}
			</tbody>
		</table>

		<p>Drop this <em>after</em> the library's styles (so it wins the cascade), or scope it to a subtree:</p>
		<pre><code>{theme.example}</code></pre>
		<p class="note">{@html theme.paletteNote}</p>

		<h3>Structure (override deliberately)</h3>
		<p>{theme.structureNote}</p>
		<table>
			<tbody>
				{#each theme.structure as [token, role] (token)}
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
				{#each theme.component as [token, role] (token)}
					<tr>
						<td><code>{token}</code></td>
						<td>{role}</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<pre><code>{`<Spinner speed="fast" />   <!-- preset -->
:root { ${theme.component[0][0]}: 1.2s; }   /* any value — wins over the preset */`}</code></pre>
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
	/* Style-family selector — the active family takes the aronia brand accent. */
	.theme-switch {
		display: inline-flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin: 0 0 1.75rem;
	}
	.theme-switch__btn {
		font-family: var(--doc-font);
		font-size: var(--doc-xs);
		text-transform: uppercase;
		letter-spacing: var(--doc-tracking-label);
		border: 1px solid var(--doc-ink);
		background: transparent;
		color: var(--doc-ink);
		padding: 0.4rem 0.8rem;
		cursor: pointer;
	}
	.theme-switch__btn:hover {
		background: color-mix(in srgb, var(--doc-ink) 8%, transparent);
	}
	.theme-switch__btn[data-active='true'] {
		background: var(--doc-accent);
		color: var(--doc-panel);
		border-color: var(--doc-accent);
	}
	pre {
		background: var(--doc-panel);
		border: 1px solid var(--doc-ink);
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
