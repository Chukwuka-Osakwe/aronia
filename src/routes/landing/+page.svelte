<script lang="ts">
	import { onMount } from 'svelte';

	// Landing-page WIREFRAME — deliberately black-and-white. We're judging layout,
	// hierarchy, and vertical rhythm only; palette + display type get locked later
	// on separate specimens. Everything sits on an 8px baseline: 8px minor unit,
	// 96px major (section) unit. Structural boxes stand in for real visuals.
	// Renders standalone via the root layout's `bare` branch (no docs shell).
	//
	// 6-section format (settled 2026-09-16): Hero · Problem/Benefit · Proof ·
	// How it works · FAQs · Footer. No eyebrows. Before/after is the visual spine
	// (hero + proof). Type is baseline-locked (no clamp).

	// The four looks — cycled through the single rotating slot in the "pick a look"
	// step of How it works. `bar` is a WIREFRAME stand-in colour (roughly each
	// family's vibe) so the looks read as distinct while the slot rotates; real
	// specimens replace the colour blocks at hi-fi. The slot is count-agnostic: it
	// shows the ACT of choosing one, not the whole catalog, so it holds at 4 or 20.
	const looks = [
		{ name: 'Swiss', line: 'Clean and grown-up. Calm, sharp, nothing wasted.', bar: '#f24405' },
		{ name: 'Neo-Brutalism', line: 'Loud and fearless. Thick lines, hard edges, impossible to ignore.', bar: '#ffd000' },
		{ name: 'Glassmorphism', line: 'Sleek and frosted. Soft, modern, a little futuristic.', bar: '#4da3ff' },
		{ name: 'Risograph', line: 'Warm and handmade. Grainy, printed, full of character.', bar: '#e8536e' }
	];

	// Proof = real before/after rebuilds, strongest first, family-agnostic. These are
	// placeholders for the user's real testing candidates (Riso leads).
	const proof: { site: string; look: string; after?: string }[] = [
		{ site: 'Real project A', look: 'Risograph' },
		{ site: 'Real project B', look: 'Neo-Brutalism' },
		{ site: 'Real project C', look: 'Glassmorphism' }
	];

	const faqs = [
		{
			q: 'Do I need to know how to code?',
			a: 'No. aronia sets up with one command, and from there you just tell your agent what to build in plain English. You never have to open the code unless you want to.'
		},
		{
			q: 'Do I need to know design to use this?',
			a: "No — that's the point. You pick the look, aronia writes the rules, and your agent follows them. You just describe what you want built."
		},
		{
			q: 'What am I actually installing?',
			a: "Real, editable code — copied straight into your project. Not a plugin, not a black box you rent. It's yours to keep and change."
		},
		{
			q: "Does it work with any framework I'm building with?",
			a: 'Yes — any framework your agent already uses: React, Svelte, plain HTML, whatever. You don’t switch anything.'
		},
		{
			q: 'Does it work with any AI coder?',
			a: 'Yes — any tool that can read a simple reference file: Cursor, Windsurf, v0, ChatGPT, Claude and others.'
		},
		{ q: 'Is it free?', a: 'Yes. Free and open.' },
		{
			q: 'What if I want to change something?',
			a: "Go for it — it's your code. Tweak a color, a corner, a font; nothing's locked. It's a starting point with taste built in, not a cage."
		},
		{
			q: 'How is this different from a template or UI kit?',
			a: 'A template is one fixed design you pour content into. aronia is a whole look your agent learns and keeps applying — so every new screen still fits, instead of you hunting for a matching page.'
		},
		{
			q: 'Which look should I pick?',
			a: "Whichever feels like you. And you can always try another — it's one command."
		},
		{
			q: 'What if none of the looks fit my project?',
			a: 'You can mix rules between looks, or use one as a starting point and edit it. More looks are on the way.'
		}
	];

	// Wireframe grid overlay — 8px baseline + 96px major lines + container/text-column
	// guides. Toggle to check everything actually lands on the rhythm.
	let grid = $state(true);

	// STUBBED hero motion — crude before→after box-flip to test the BEHAVIOUR/timing
	// only (auto-play once, rest on after; replay control; reduced-motion fallback).
	// The real Risograph print-in (ink bloom, grain, opacity-not-transforms) is a
	// hi-fi pass with real pixels — see the plan doc.
	let motionPhase = $state<'before' | 'after'>('before');
	let reducedMotion = $state(false);

	// Which look the rotating "pick a look" slot is currently showing.
	let lookIndex = $state(0);
	// Auto-rotation timer, hoisted so a manual pick can cancel it.
	let rotTimer: ReturnType<typeof setInterval> | undefined;

	onMount(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		if (mq.matches) {
			reducedMotion = true;
			motionPhase = 'after'; // reduced motion → skip the animation, land on the good state
			return; // …and don't auto-rotate; the dots are the manual control instead
		}
		// Hold on "before" (establish the pain), then settle on "after".
		const t = setTimeout(() => (motionPhase = 'after'), 3000);
		// Cycle the look slot so "pick a look" reads as choosing from many, not a grid.
		// Matches the hero's 3s hold so the two motions feel unified.
		rotTimer = setInterval(() => (lookIndex = (lookIndex + 1) % looks.length), 3000);
		return () => {
			clearTimeout(t);
			clearInterval(rotTimer);
		};
	});

	// Manual pick from the dots. Hands control to the reader: jump to the look and
	// stop auto-advancing so it won't yank them onward. Also the sole navigation for
	// reduced-motion users (who never had an interval running).
	function selectLook(i: number) {
		lookIndex = i;
		clearInterval(rotTimer);
		rotTimer = undefined;
	}

	function replayMotion() {
		if (reducedMotion) return;
		motionPhase = 'before';
		setTimeout(() => (motionPhase = 'after'), 1100);
	}

	// Copy the setup command from step 1 so a reader can grab it and run right away.
	let copied = $state(false);
	let copyTimer: ReturnType<typeof setTimeout> | undefined;
	function copyInit() {
		navigator.clipboard?.writeText('npx aronia init');
		copied = true;
		clearTimeout(copyTimer);
		copyTimer = setTimeout(() => (copied = false), 1500);
	}

	// Proof before/after (MOBILE ONLY) — each pair is one frame that defaults to the
	// AFTER (the payoff); a segmented Before/After control below it switches which pane
	// shows, reusing the hero's crossfade primitive. Desktop shows both panes side-by-
	// side and hides the control, so this per-pair phase only drives the mobile layout.
	let proofPhase = $state<('before' | 'after')[]>(proof.map(() => 'after' as 'before' | 'after'));
</script>

<div class="wire" class:show-grid={grid}>
	<button class="grid-toggle" type="button" onclick={() => (grid = !grid)}>
		grid: {grid ? 'on' : 'off'}
	</button>

	<div class="wire-inner">
		<!-- Grid overlay: 8/96 baseline + container/text-column guides. Sits on top,
		     click-through, only painted when `.show-grid`. -->
		<div class="grid-overlay" aria-hidden="true">
			<div class="col-guide"><div class="col-guide-inner"></div></div>
		</div>

		<!-- ── 1 · HERO (What?) ────────────────────────────────────────── -->
		<section class="beat hero">
			<div class="col">
				<h1 class="display">Reject the default AI look.</h1>
				<p class="lead">
					With aronia every page you build comes out looking designed, distinctive, and
					consistent.
				</p>
			</div>
			<figure class="ba-hero-motion">
				<div class="ba-motion" data-phase={motionPhase}>
					<div class="ba-pane ba-before">
						<span class="ba-tag">Before</span>
						<span class="ph-label">[ real app — generic look ]</span>
					</div>
					<div class="ba-pane ba-after">
						<span class="ba-tag">After — Risograph</span>
						<span class="ph-label">[ same app, built with aronia ]</span>
					</div>
					<button class="ba-replay" type="button" onclick={replayMotion}>↻ replay</button>
				</div>
				<figcaption class="stub-note">
					Stubbed motion (before → after). Real Risograph print-in is a hi-fi pass — see plan.
				</figcaption>
			</figure>
			<div class="cmd-row">
				<button class="btn btn-primary" type="button">Get started</button>
			</div>
		</section>

		<!-- ── 2 · PROBLEM (Why?) — hold up the generic mirror ─────────── -->
		<section class="beat split">
			<div class="col">
				<h2>Your app works. It just looks like everyone else's.</h2>
				<p class="body">
					And that's not on you. AI doesn't have a point of view so when you ask it to design
					something it reaches for the most common look in its training data and your website
					ends up looking like everyone else's.
				</p>
			</div>
			<figure class="generic-visual">
				<span class="ph-label">[ generic AI app — gray / rounded / Inter ]</span>
				<figcaption>Recognize it? It's probably your app.</figcaption>
			</figure>
		</section>

		<!-- ── 3 · PROOF ───────────────────────────────────────────────── -->
		<section class="beat split">
			<div class="col">
				<h2>Having a point of view makes a world of difference.</h2>
				<p class="body">
					Every one of these is a real project an AI agent built — first on its own, then again
					with aronia. Nothing else changed but the results are different, that's the difference a
					point of view makes.
				</p>
			</div>
			<div class="proof-list">
				{#each proof as p, i}
					<figure class="ba" data-phase={proofPhase[i]}>
						<div class="ba-frame">
							<div class="ba-pane ba-before">
								<span class="ba-tag">Before</span>
								<span class="ph-label">[ {p.site} — generic ]</span>
							</div>
							<div class="ba-pane ba-after">
								<span class="ba-tag">After — {p.look}</span>
								{#if p.after}
									<img class="ba-shot" src={p.after} alt="{p.site} rebuilt with aronia" />
								{:else}
									<span class="ph-label">[ {p.site} — aronia ]</span>
								{/if}
							</div>
						</div>
						<div class="ba-seg" role="group" aria-label="Show the before or after">
							<button
								class="ba-seg-btn"
								type="button"
								aria-pressed={proofPhase[i] === 'before'}
								onclick={() => (proofPhase[i] = 'before')}>Before aronia</button>
							<button
								class="ba-seg-btn"
								type="button"
								aria-pressed={proofPhase[i] === 'after'}
								onclick={() => (proofPhase[i] = 'after')}>After aronia</button>
						</div>
					</figure>
				{/each}
			</div>
		</section>

		<!-- ── 4 · HOW IT WORKS (How?) ─────────────────────────────────── -->
		<section class="beat split">
			<div class="col">
				<h2>Three steps. No code.</h2>
				<p class="body">
					All it takes is one command to set up aronia. After that, you just talk to your agent
					in your own words.
				</p>
			</div>
			<ol class="steps">
				<li class="step">
					<div class="step-head">
						<span class="step-n">01</span>
						<h3 class="step-h">Run one command</h3>
					</div>
					<!-- Same prompt-box shell as step 03: command up top, a toolbar below with a
					     terminal glyph (decorative) and a real copy button in the primary slot. -->
					<div class="prompt-box">
						<p class="prompt-text prompt-mono">npx aronia init</p>
						<div class="prompt-bar">
							<span class="prompt-btn" aria-hidden="true">
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"><path d="M4 6l5 6-5 6M13 18h7" /></svg>
							</span>
							<button
								class="prompt-primary"
								type="button"
								onclick={copyInit}
								aria-label={copied ? 'Copied' : 'Copy the command'}>
								{#if copied}
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
								{:else}
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										aria-hidden="true"><rect x="8" y="8" width="12" height="12" /><path
											d="M4 16V4h12" /></svg>
								{/if}
							</button>
						</div>
					</div>
					<p class="micro">
						This command sets up aronia in your project in seconds, and it works with whatever
						agent you use for coding.
					</p>
				</li>
				<li class="step">
					<div class="step-head">
						<span class="step-n">02</span>
						<h3 class="step-h">Pick a look</h3>
					</div>
					<!-- Single rotating slot — represents the ACT of choosing one look, not
					     the whole catalog, so it holds at 4 looks or 20. The colour bar +
					     caption cycle through `looks`; the dot row shows position/count. -->
					<div class="look-rotator">
						<figure class="look-slot">
							<div class="look-bar" style="background: {looks[lookIndex].bar}"></div>
							<figcaption>
								<strong>{looks[lookIndex].name}</strong>
								<span>{looks[lookIndex].line}</span>
							</figcaption>
						</figure>
						<div class="look-dots">
							{#each looks as look, i}
								<button
									class="look-dot"
									class:on={i === lookIndex}
									type="button"
									aria-label={`Show ${look.name}`}
									aria-pressed={i === lookIndex}
									onclick={() => selectLook(i)}></button>
							{/each}
						</div>
						<p class="micro">
							aronia lets you choose from a variety of styles for building your project. Pick
							whichever one you like best.
						</p>
						<!-- Points at the intended /gallery route — the page doesn't exist yet, so
						     this 404s until it's built (see landing-page plan). -->
						<a class="gallery-link" href="/gallery">
							Explore all the styles in more depth in the gallery →
						</a>
					</div>
				</li>
				<li class="step">
					<div class="step-head">
						<span class="step-n">03</span>
						<h3 class="step-h">Tell your agent</h3>
					</div>
					<!-- Loosely a ChatGPT-style prompt box: message up top, a decorative
					     toolbar below (+ · mic · send). Square, no "You"/"Auto" chrome. -->
					<div class="prompt-box">
						<p class="prompt-text">Build my landing page with aronia's risograph style.</p>
						<div class="prompt-bar" aria-hidden="true">
							<span class="prompt-btn">
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"><path d="M12 5v14M5 12h14" /></svg>
							</span>
							<span class="prompt-actions">
								<span class="prompt-btn">
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										><rect x="9" y="3" width="6" height="11" rx="3" /><path
											d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>
								</span>
								<span class="prompt-primary">
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
								</span>
							</span>
						</div>
					</div>
					<p class="micro">
						Once you've picked a style, just tell your agent what you want it to build in that
						style. That's it.
					</p>
				</li>
			</ol>
		</section>

		<!-- ── 5 · FAQs ────────────────────────────────────────────────── -->
		<section class="beat">
			<h2>Frequently Asked Questions</h2>
			<!-- Accordion via native <details>/<summary>: keyboard + screen-reader
			     support and the reduced-motion story come for free, no JS state.
			     All closed by default — the list is scannable, tap to open one.
			     Rows span the full container so the chevron sits at the far edge. -->
			<div class="faqs">
				{#each faqs as f}
					<details class="faq">
						<summary class="faq-q">
							<span>{f.q}</span>
							<!-- Chevron: points down closed, rotates to point up on open. -->
							<span class="faq-icon" aria-hidden="true"></span>
						</summary>
						<p class="faq-a">{f.a}</p>
					</details>
				{/each}
			</div>
		</section>

		<!-- ── 6 · FOOTER ──────────────────────────────────────────────── -->
		<section class="beat cta">
			<span class="beat-tag">06 · Footer</span>
			<div class="col">
				<h2 class="display-sm">Make your next app look like yours.</h2>
				<code class="cmd cmd-block copyable">npx aronia init</code>
				<div class="cmd-row">
					<button class="btn btn-primary" type="button">Copy command</button>
					<button class="btn btn-ghost" type="button">Read the guide</button>
				</div>
			</div>
			<footer class="foot">
				<span>Free and open</span>
				<span>Works with whatever you're already building in</span>
				<span>The code lives in your project — tweak anything</span>
			</footer>
		</section>
	</div>
</div>

<style>
	/* ── Wireframe system ─────────────────────────────────────────────
	   Grayscale only. 8px baseline; --u* are 8px multiples, --major = 96px.
	   Neutral system stack deliberately signals "type not chosen yet." */
	.wire {
		--ink: #111;
		--ink-2: #555;
		--ink-3: #888;
		--line: #ccc;
		--fill: #ededed;
		--paper: #fff;
		/* Page field — a warm near-white; easier on the eyes than pure white. Surfaces
		   (panes, cards, chrome) stay --paper so they read as distinct boxes on top. */
		--bg: oklch(96.5% 0.006 92);

		--u1: 8px;
		--u2: 16px;
		--u3: 24px;
		--u4: 32px;
		--u6: 48px;
		--u8: 64px;
		--major: 96px;

		/* ── Type scale ───────────────────────────────────────────────
		   One standardised, baseline-locked scale (fs + matching lh pairs).
		   Every line-height is an 8px multiple so line boxes tile the grid;
		   sizes are fixed (no clamp). Mobile-first: these ARE the phone
		   values — the four responsive steps (display/title/heading/lead)
		   bump up at the 768 seam by redefining their tokens (see below). */
		--fs-display: 40px;
		--lh-display: 48px; /* 6 × 8 */
		--fs-title: 32px;
		--lh-title: 40px; /* 5 × 8 */
		--fs-heading: 28px;
		--lh-heading: 32px; /* 4 × 8 */
		--fs-feature: 24px;
		--lh-feature: 32px; /* 4 × 8 */
		--fs-lead: 18px;
		--lh-lead: 24px; /* 3 × 8 */
		--fs-body: 16px;
		--lh-body: 24px; /* 3 × 8 */
		--fs-small: 14px;
		--lh-small: 24px; /* 3 × 8 */
		--fs-label: 12px;
		--lh-label: 24px; /* 3 × 8 */

		font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
		color: var(--ink);
		background: var(--bg);
		-webkit-font-smoothing: antialiased;
		/* Own scroll container: the docs' global `html { overflow: hidden }` (desktop)
		   would otherwise clip this long page, so the wireframe scrolls internally. */
		height: 100vh;
		overflow-y: auto;
		/* The proof frames break out to full-viewport width; clip (not scroll) any
		   bleed past the edges so no horizontal scrollbar appears. */
		overflow-x: clip;
	}

	.wire :global(*) {
		box-sizing: border-box;
	}

	/* ── Grid overlay ─────────────────────────────────────────────────
	   Painted only under `.show-grid`. Violet so it reads as chrome,
	   distinct from the wireframe's own gray hairlines. Click-through. */
	.wire-inner {
		position: relative;
	}
	.grid-overlay {
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: 5;
		display: none;
	}
	.show-grid .grid-overlay {
		display: block;
	}
	/* Horizontal 8/96 rhythm, painted PER SECTION rather than as one continuous
	   global ruler. Each `.beat` is position:relative with no border, so the ::before
	   (inset:0 → the padding box, whose top edge is the section's own top) restarts
	   the grid at each section. That means every section's `padding-top: var(--major)`
	   lands its heading on that section's first major line — a single global ruler
	   drifted because section heights aren't 96px multiples. 8px baseline (light) +
	   96px major (stronger); semi-transparent, drawn over content, click-through. */
	.show-grid .beat::before {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: 5;
		background-image:
			repeating-linear-gradient(
				to bottom,
				rgba(99, 62, 191, 0.14) 0,
				rgba(99, 62, 191, 0.14) 1px,
				transparent 1px,
				transparent 8px
			),
			repeating-linear-gradient(
				to bottom,
				rgba(99, 62, 191, 0.42) 0,
				rgba(99, 62, 191, 0.42) 2px,
				transparent 2px,
				transparent 96px
			);
	}
	/* Vertical guides: the 1080px container edges (solid) + the 32px text-column
	   inset where copy actually starts (dashed). */
	.col-guide {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 1080px;
		max-width: 100%;
		border-left: 1px solid rgba(99, 62, 191, 0.4);
		border-right: 1px solid rgba(99, 62, 191, 0.4);
	}
	.col-guide-inner {
		height: 100%;
		margin: 0 32px;
		border-left: 1px dashed rgba(99, 62, 191, 0.3);
		border-right: 1px dashed rgba(99, 62, 191, 0.3);
	}

	/* Toggle control — fixed, wireframe chrome. */
	.grid-toggle {
		position: fixed;
		top: 12px;
		right: 12px;
		z-index: 20;
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: var(--fs-label);
		padding: 6px 10px;
		border: 1px solid var(--ink);
		border-radius: 0;
		background: var(--paper);
		color: var(--ink);
		cursor: pointer;
	}

	/* Section = one idea, separated by the major unit. */
	.beat {
		position: relative;
		max-width: 1080px;
		margin: 0 auto;
		padding: var(--u2) var(--u3);
	}
	/* Inter-section spacing lives on ONE margin between sections, not additive
	   top+bottom paddings. Sections carry no vertical padding, so each heading sits
	   at its section's top — flush on the section-local grid's first major line —
	   and this margin is honest, ungridded whitespace between blocks. */
	.beat + .beat {
		margin-top: var(--u8);
	}

	/* Wireframe chrome: a section index marker, clearly not final content. */
	.beat-tag {
		position: absolute;
		top: var(--u3);
		left: var(--u4);
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: var(--fs-label);
		letter-spacing: 0.04em;
		color: var(--ink-3);
		text-transform: uppercase;
	}

	/* Text column — cold-email measure (~62ch). */
	.col {
		max-width: 62ch;
	}

	/* Baseline-locked type. Every line-height is an 8px multiple, so line boxes
	   tile on the grid; sizes are fixed (no clamp). Mobile-first: the base sizes
	   here ARE the phone sizes, and they step UP at the 768 layout seam (see the
	   min-width block). Type stays on-baseline at every width instead of drifting
	   between clamp endpoints. */
	.display {
		font-size: var(--fs-display);
		line-height: var(--lh-display);
		letter-spacing: -0.02em;
		font-weight: 800;
		margin: 0 0 var(--u4);
	}
	.display-sm {
		font-size: var(--fs-title);
		line-height: var(--lh-title);
		letter-spacing: -0.02em;
		font-weight: 800;
		margin: 0 0 var(--u4);
	}
	h2 {
		font-size: var(--fs-heading);
		line-height: var(--lh-heading);
		letter-spacing: -0.01em;
		font-weight: 700;
		margin: 0 0 var(--u3);
		/* Snap the cap-height to the gridline: trim the line-box leading above the
		   caps so the letterforms — not the invisible leading — define the top of
		   the section. Section headings are always the first element on the major
		   line, so this lands them flush. Graceful no-op where unsupported. */
		text-box-trim: trim-start;
		text-box-edge: cap alphabetic;
	}

	.lead {
		font-size: var(--fs-lead);
		line-height: var(--lh-lead);
		color: var(--ink);
		margin: 0 0 var(--u4);
	}
	.body {
		font-size: var(--fs-body);
		line-height: var(--lh-body);
		color: var(--ink-2);
		margin: 0;
	}
	.micro {
		font-size: var(--fs-small);
		line-height: var(--lh-small);
		color: var(--ink-3);
		margin: var(--u3) 0 0;
	}

	/* Hero is the first section: its top space is page-top breathing room (padding),
	   not an inter-section margin. A smaller step on mobile; a full major unit at ≥768. */
	.hero {
		padding-top: var(--u8);
	}
	/* Hero text is centered and wider than the default column so the headline lands
	   as a clean two lines (via the <br />) rather than wrapping in the 62ch measure.
	   The sub stays on a narrower centered measure for readability. */
	.hero .col {
		max-width: 56rem;
		margin-inline: auto;
		text-align: center;
	}
	.hero .lead {
		max-width: 40rem;
		margin-inline: auto;
	}

	/* Split header (§2 Problem + §3 Proof) — headline / subheadline stagger. Stacked
	   full-width on mobile (base); at ≥768 the two split onto the section's left/right
	   text-inset guides (see the min-width block). The col spans the full width. */
	.split .col {
		max-width: none;
	}

	/* Command + buttons */
	.cmd-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--u2);
		margin-top: var(--u4);
	}
	.cmd {
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: var(--fs-body);
		line-height: var(--lh-body);
		padding: var(--u2) var(--u3);
		border: 1px solid var(--line);
		border-radius: 0;
		background: var(--fill);
		color: var(--ink);
	}
	.cmd-block {
		display: inline-block;
		margin-top: var(--u2);
	}
	.copyable {
		position: relative;
	}
	.btn {
		font: inherit;
		font-size: var(--fs-body);
		font-weight: 600;
		padding: var(--u2) var(--u3);
		border-radius: 0;
		cursor: pointer;
		border: 1px solid var(--ink);
	}
	.btn-primary {
		background: var(--ink);
		color: var(--paper);
	}
	.btn-ghost {
		background: transparent;
		color: var(--ink);
	}

	/* ── Before/after (the proof spine) ───────────────────────────────
	   Each pair is a <figure>. MOBILE (base): one frame (the two panes crossfade)
	   stacked over the flip button. DESKTOP: the panes go side-by-side (see min-width
	   block) and the button is hidden. */
	.ba {
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--u2);
	}
	.ba-pane {
		position: relative;
		min-height: 240px;
		border: 1px solid var(--line);
		border-radius: 0;
		background: repeating-linear-gradient(
			-45deg,
			var(--paper),
			var(--paper) 10px,
			#f6f6f6 10px,
			#f6f6f6 20px
		);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--u4);
	}
	/* STUBBED hero motion: two panes stacked, cross-fading on phase change. Crude on
	   purpose — testing behaviour/timing, not the real riso print-in. */
	.ba-hero-motion {
		margin: var(--u6) 0 0;
	}
	.ba-motion {
		position: relative;
		min-height: 320px;
	}
	.ba-motion .ba-pane {
		position: absolute;
		inset: 0;
		margin: 0;
		min-height: 320px;
	}
	/* ── Before/after crossfade primitive — SHARED by the hero motion and the proof
	   tap-flip. Two stacked panes, opacity toggled by `data-phase` on the container;
	   the default state is set by the container's initial attribute (hero = before,
	   proof = after). */
	.ba-before,
	.ba-after {
		transition: opacity 600ms ease;
	}
	.ba-before {
		opacity: 1;
	}
	.ba-after {
		opacity: 0;
	}
	[data-phase='after'] .ba-before {
		opacity: 0;
	}
	[data-phase='after'] .ba-after {
		opacity: 1;
	}
	.ba-replay {
		position: absolute;
		bottom: var(--u2);
		right: var(--u2);
		z-index: 2;
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: var(--fs-label);
		padding: 4px 8px;
		border: 1px solid var(--ink);
		border-radius: 0;
		background: var(--paper);
		color: var(--ink);
		cursor: pointer;
	}
	.stub-note {
		margin-top: var(--u1);
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: var(--fs-label);
		line-height: var(--lh-label);
		color: var(--ink-3);
	}
	@media (prefers-reduced-motion: reduce) {
		.ba-before,
		.ba-after {
			transition: none;
		}
	}
	.ba-tag {
		position: absolute;
		top: var(--u2);
		left: var(--u2);
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: var(--fs-label);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--ink-3);
		background: var(--paper);
		border: 1px solid var(--line);
		padding: 2px 6px;
	}
	.proof-list {
		/* DIAL — the shared before/after frame ratio. One knob for every proof frame;
		   retune once real screenshots land and the natural shape settles (sample of
		   one right now = a Slow Miles hero at ~1.83:1, contained into this). */
		--proof-ratio: 600 / 386;
		margin-top: var(--u6);
		display: flex;
		flex-direction: column;
		gap: var(--u4);
	}
	/* Mobile (base): one frame per pair carries the 1.55:1 shape; the two panes stack
	   absolutely inside it and crossfade (shared primitive), toggled by the button. */
	.proof-list .ba-frame {
		position: relative;
		aspect-ratio: var(--proof-ratio);
	}
	.proof-list .ba-pane {
		position: absolute;
		inset: 0;
		min-height: 0;
	}
	/* A real screenshot fills the frame edge-to-edge (drop the placeholder padding)
	   and letterboxes to fit — nothing cropped. */
	.proof-list .ba-pane:has(img) {
		padding: 0;
	}
	/* The signifier sits BELOW the frame (mobile only) — a segmented Before/After
	   control (two real buttons). The active segment inverts (fill), never bolds —
	   state via colour/contrast. It advertises both states even before you tap. */
	.ba-seg {
		align-self: flex-end;
		display: inline-flex;
		border: 1px solid var(--ink);
	}
	.ba-seg-btn {
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: var(--fs-label);
		line-height: var(--lh-label);
		padding: var(--u1) var(--u2);
		border: 0;
		border-radius: 0;
		background: var(--paper);
		color: var(--ink);
		cursor: pointer;
	}
	.ba-seg-btn + .ba-seg-btn {
		border-left: 1px solid var(--ink);
	}
	.ba-seg-btn[aria-pressed='true'] {
		background: var(--ink);
		color: var(--paper);
	}
	.ba-shot {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	/* Section 2 — the static generic-app mirror (not before/after; that's hero+proof). */
	.generic-visual {
		margin: var(--u6) 0 0;
		border: 1px solid var(--line);
		background: repeating-linear-gradient(
			-45deg,
			var(--paper),
			var(--paper) 10px,
			#f6f6f6 10px,
			#f6f6f6 20px
		);
		min-height: 320px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--u2);
		padding: var(--u6) var(--u4);
	}
	.generic-visual figcaption {
		font-size: var(--fs-small);
		line-height: var(--lh-small);
		color: var(--ink-2);
	}

	/* Placeholder label inside any wireframe box. */
	.ph-label {
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: var(--fs-label);
		color: var(--ink-3);
		text-align: center;
	}

	/* ── How it works — steps ─────────────────────────────────────────
	   A hairline-ruled numbered list (rhymes with the FAQ list below): each step
	   is a top-ruled row (bottom rule on the last), the zero-padded index sits in
	   a left gutter as plain muted mono — NOT a boxed chip — and the heading +
	   its content share one indented column. */
	.steps {
		list-style: none;
		margin: var(--u6) 0 0;
		padding: 0;
		display: flex;
		flex-direction: column;
	}
	/* Each step is a centered vertical stack of frames: [number + heading] on one
	   line, then the block(s) beneath — every frame centers on the section axis,
	   the widest frame setting the effective width. */
	.step {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--u3);
		padding: var(--u8) 0;
		border-top: 1px solid var(--line);
	}
	.step:last-child {
		border-bottom: 1px solid var(--line);
	}
	/* Number + heading = one frame; the index rides on the heading baseline. */
	.step-head {
		display: flex;
		align-items: baseline;
		gap: var(--u2);
	}
	.step-n {
		flex: none;
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: var(--fs-feature); /* match the heading */
		line-height: var(--lh-feature); /* same as .step-h */
		color: var(--ink-3);
	}
	.step-h {
		font-size: var(--fs-feature);
		line-height: var(--lh-feature);
		font-weight: 700;
		margin: 0;
	}
	/* Step-1's caption is a top-level frame (centered); the rotator's own caption is
	   a block internal (stays left) because it lives inside .look-rotator. */
	.step > .micro {
		margin-top: 0;
		text-align: center;
	}
	/* Look rotator (step 2) — ONE slot, count-agnostic. A colour bar (wireframe
	   specimen stand-in) + caption cycle through the looks; the colour tweens on
	   change so the rotation reads as a smooth shift. Sized to the content column,
	   never a grid, so 4 looks and 20 looks share the exact same footprint. */
	/* Pinned to a fixed width (not shrink-to-content) so the card doesn't resize as
	   different-length look captions rotate through. Full-bleed within the step on
	   narrow screens. */
	.look-rotator {
		width: min(32rem, 100%);
	}
	.look-slot {
		margin: 0;
		border: 1px solid var(--line);
		border-radius: 0;
		overflow: hidden;
	}
	.look-bar {
		height: 160px;
		transition: background-color 500ms ease;
	}
	.look-slot figcaption {
		display: flex;
		flex-direction: column;
		gap: var(--u1);
		padding: var(--u3);
		border-top: 1px solid var(--line);
	}
	.look-slot figcaption strong {
		font-size: var(--fs-body);
		line-height: var(--lh-body);
		color: var(--ink);
	}
	.look-slot figcaption span {
		font-size: var(--fs-small);
		line-height: var(--lh-small);
		color: var(--ink-2);
	}
	/* Position/count row — one square per look, current one filled. Scales as a
	   thin row whether there are 4 or 20; state via fill, not size. */
	.look-dots {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		margin-top: var(--u2);
	}
	/* The rotator's own caption centers under the card (the card's name/description
	   stay left as block internals). */
	.look-rotator .micro {
		text-align: center;
	}
	/* Quiet link to the (future) gallery — subordinate to the page's one CTA. */
	.gallery-link {
		display: block;
		margin-top: var(--u1);
		text-align: center;
		font-size: var(--fs-small);
		line-height: var(--lh-small);
		color: var(--ink);
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.gallery-link:hover {
		color: var(--ink-2);
	}
	/* The visible marker stays an 8px square, but the button is a 28px hit surface
	   (padding around the mark) so it's a comfortable tap/click target — well past
	   the 24px WCAG minimum. */
	.look-dot {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		padding: 0;
		border: 0;
		border-radius: 0;
		background: transparent;
		cursor: pointer;
	}
	.look-dot::before {
		content: '';
		width: 8px;
		height: 8px;
		border: 1px solid var(--ink-3);
		background: transparent;
		transition: background-color 300ms ease;
	}
	.look-dot:hover::before {
		border-color: var(--ink);
	}
	.look-dot.on::before {
		background: var(--ink);
		border-color: var(--ink);
	}
	@media (prefers-reduced-motion: reduce) {
		.look-bar,
		.look-dot::before {
			transition: none;
		}
	}

	/* Plain-English prompt box (step 3) — loosely a ChatGPT composer: message on top,
	   a decorative +/mic/send toolbar below. Square, no "You"/"Auto" chrome. */
	.prompt-box {
		width: min(32rem, 100%);
		padding: var(--u3);
		border: 1px solid var(--line);
		border-radius: 0;
		background: var(--paper);
		display: flex;
		flex-direction: column;
		gap: var(--u4);
		text-align: left;
	}
	.prompt-text {
		margin: 0;
		font-size: var(--fs-body);
		line-height: var(--lh-body);
		color: var(--ink);
	}
	/* Step 1's command reads as monospace inside the same box. */
	.prompt-mono {
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: var(--fs-body);
	}
	.prompt-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.prompt-actions {
		display: flex;
		align-items: center;
		gap: var(--u2);
	}
	.prompt-btn,
	.prompt-primary {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: 0;
	}
	.prompt-btn {
		border: 1px solid var(--line);
		color: var(--ink-2);
	}
	.prompt-primary {
		border: 1px solid var(--ink);
		background: var(--ink);
		color: var(--paper);
	}
	/* When the primary slot is a real button (step 1's copy), make it interactive. */
	button.prompt-primary {
		cursor: pointer;
	}
	button.prompt-primary:hover {
		background: var(--ink-2);
		border-color: var(--ink-2);
	}

	/* ── FAQs ───────────────────────────────────────────────────────
	   A hairline-ruled disclosure list (rhymes with the steps list): each row is
	   a native <details> with a top rule (bottom rule on the last). The <summary>
	   is the clickable question; the answer expands beneath. Padding lives on the
	   summary (top+bottom) and answer (bottom) so both the closed and open rows
	   land on the 8px grid. */
	.faqs {
		margin: var(--u6) 0 0;
	}
	.faq {
		border-top: 1px solid var(--line);
	}
	.faq:last-child {
		border-bottom: 1px solid var(--line);
	}
	.faq-q {
		display: flex;
		/* Pin the icon to the first line (not the middle of a wrapped question). */
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--u2);
		padding: var(--u3) 0;
		cursor: pointer;
		font-size: var(--fs-body);
		line-height: var(--lh-body);
		font-weight: 600;
		color: var(--ink);
		/* Kill the native disclosure triangle (we draw our own +/−). */
		list-style: none;
	}
	.faq-q::-webkit-details-marker {
		display: none;
	}
	.faq-q:focus-visible {
		outline: 2px solid var(--ink);
		outline-offset: 2px;
	}
	/* Chevron: an 8px square showing only its bottom + right borders, rotated 45°
	   so it points down (closed). On open it rotates to 225° and points up. */
	.faq-icon {
		position: relative;
		flex: none;
		width: 16px;
		height: 16px;
		/* Optically center on the 24px first line: (24 − 16) / 2. */
		margin-top: 4px;
	}
	.faq-icon::before {
		content: '';
		position: absolute;
		top: 3px;
		left: 4px;
		width: 8px;
		height: 8px;
		border-right: 1.5px solid var(--ink-2);
		border-bottom: 1.5px solid var(--ink-2);
		transform: rotate(45deg);
		transform-origin: center;
		transition: transform 200ms ease;
	}
	.faq[open] .faq-icon::before {
		transform: rotate(225deg);
	}
	.faq-a {
		margin: 0;
		/* Rows span the full container, but keep the answer on a readable measure. */
		max-width: 62ch;
		padding: 0 0 var(--u3);
		font-size: var(--fs-body);
		line-height: var(--lh-body);
		color: var(--ink-2);
	}
	@media (prefers-reduced-motion: reduce) {
		.faq-icon::before {
			transition: none;
		}
	}

	/* ── Footer ───────────────────────────────────────────────────── */
	.cta {
		text-align: left;
	}
	.foot {
		display: flex;
		flex-wrap: wrap;
		gap: var(--u4);
		margin-top: var(--u8);
		padding-top: var(--u4);
		border-top: 1px solid var(--line);
	}
	.foot span {
		font-size: var(--fs-label);
		line-height: var(--lh-label);
		color: var(--ink-3);
	}

	/* ── Wider-screen enhancement (mobile-first base is above) ─────────
	   The page is authored mobile-first: every base rule is the phone layout, and
	   this layer ADDS the wide arrangement at the 768 portrait-tablet seam — rows go
	   side-by-side, §2 splits, type steps up. New seams get earned per-section as
	   content strains, not declared up front. */
	@media (min-width: 768px) {
		.beat {
			padding: var(--u2) var(--u4);
		}
		.beat + .beat {
			margin-top: var(--major);
		}
		.hero {
			padding-top: var(--major);
		}

		/* Multi-part rows go side-by-side. */
		.ba {
			grid-template-columns: 1fr 1fr;
		}

		/* Split header — headline pinned to the left guide, subheadline to the right,
		   each capped at half the content width; justify flushes the sub's full lines
		   onto the right guide (last line ragged). Stacked below this seam. */
		.split h2 {
			max-width: 50%;
			text-align: left;
		}
		.split .body {
			max-width: 50%;
			margin-left: auto;
			text-align: justify;
			text-align-last: left;
		}

		/* Type steps up: the four responsive steps bump to their wide values by
		   redefining their tokens on the root — each still baseline-locked (8px-multiple
		   line-heights), a discrete step, not a fluid ramp. The token consumers below
		   (.display, .display-sm, h2, .lead) inherit the new values, no per-selector
		   overrides needed. */
		.wire {
			--fs-display: 64px;
			--lh-display: 72px; /* 9 × 8 */
			--fs-title: 48px;
			--lh-title: 56px; /* 7 × 8 */
			--fs-heading: 40px;
			--lh-heading: 48px; /* 6 × 8 */
			--fs-lead: 20px;
			--lh-lead: 32px; /* 4 × 8 */
		}

		/* §3 Proof — frames keep the 1.55:1 browser shape and go two-up. The pair is FLUID
		   and full-bleed: it fills the viewport minus a 48px edge gutter, BREAKING THE GRID
		   past the 1080 container and centering on the viewport, scaling with the window
		   (aspect ratio locked, never clips). A 1440px ceiling on the pair tames ultra-wide
		   monitors only — it freezes at a ~1536px viewport (frames top out ~704px), so
		   normal laptops still scale. The heading above stays on the container grid. */
		.proof-list {
			width: 100vw;
			margin-left: 50%;
			transform: translateX(-50%);
		}
		.proof-list .ba {
			width: min(1440px, 100vw - 96px);
			margin-inline: auto;
		}
		/* Desktop: the pair goes side-by-side (grid), both panes visible — no flip. */
		.proof-list .ba-frame {
			aspect-ratio: auto;
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: var(--u4);
		}
		.proof-list .ba-pane {
			position: relative;
			inset: auto;
			aspect-ratio: var(--proof-ratio);
		}
		.proof-list .ba-before,
		.proof-list .ba-after {
			opacity: 1;
		}
		.ba-seg {
			display: none;
		}
	}
</style>
