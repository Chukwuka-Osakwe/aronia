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

	// The four looks — shown in the "pick a look" step of How it works.
	const looks = [
		{ name: 'Swiss', line: 'Clean and grown-up. Calm, sharp, nothing wasted.' },
		{ name: 'Neo-Brutalism', line: 'Loud and fearless. Thick lines, hard edges, impossible to ignore.' },
		{ name: 'Glassmorphism', line: 'Sleek and frosted. Soft, modern, a little futuristic.' },
		{ name: 'Risograph', line: 'Warm and handmade. Grainy, printed, full of character.' }
	];

	// Proof = real before/after rebuilds, strongest first, family-agnostic. These are
	// placeholders for the user's real testing candidates (Riso leads).
	const proof = [
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
			q: 'What am I actually installing?',
			a: "Real, editable code — copied straight into your project. Not a plugin, not a black box you rent. It's yours to keep and change."
		},
		{
			q: "Does it work with what I'm building in?",
			a: 'Yes — any framework your agent already uses: React, Svelte, plain HTML, whatever. You don’t switch anything.'
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

	onMount(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		if (mq.matches) {
			reducedMotion = true;
			motionPhase = 'after'; // reduced motion → skip the animation, land on the good state
			return;
		}
		// Hold on "before" (establish the pain), then settle on "after".
		const t = setTimeout(() => (motionPhase = 'after'), 3000);
		return () => clearTimeout(t);
	});

	function replayMotion() {
		if (reducedMotion) return;
		motionPhase = 'before';
		setTimeout(() => (motionPhase = 'after'), 1100);
	}
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
		<section class="beat problem">
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
		<section class="beat">
			<div class="col">
				<h2>Same app. One of them had a design language.</h2>
				<p class="body">
					Every one of these is a real project an AI agent built — first on its own, then again
					with aronia. Nothing else changed. That's the difference a point of view makes.
				</p>
			</div>
			<div class="proof-list">
				{#each proof as p}
					<figure class="ba">
						<div class="ba-pane">
							<span class="ba-tag">Before</span>
							<span class="ph-label">[ {p.site} — generic ]</span>
						</div>
						<div class="ba-pane">
							<span class="ba-tag">After — {p.look}</span>
							<span class="ph-label">[ {p.site} — aronia ]</span>
						</div>
					</figure>
				{/each}
			</div>
		</section>

		<!-- ── 4 · HOW IT WORKS (How?) ─────────────────────────────────── -->
		<section class="beat">
			<span class="beat-tag">04 · How it works — How</span>
			<div class="col">
				<h2>Three steps. No code.</h2>
				<p class="body">
					You won't touch a line of code. One command sets it up; after that you just talk to
					your agent in plain English.
				</p>
			</div>
			<ol class="steps">
				<li class="step">
					<span class="step-n">1</span>
					<div class="step-body">
						<h3 class="step-h">Run one command</h3>
						<code class="cmd cmd-block">npx aronia init</code>
						<p class="micro">Sets everything up in your project. Takes seconds.</p>
					</div>
				</li>
				<li class="step">
					<span class="step-n">2</span>
					<div class="step-body">
						<h3 class="step-h">Pick a look</h3>
						<div class="looks">
							{#each looks as look}
								<figure class="visual look">
									<span class="ph-label">[ specimen: {look.name} ]</span>
									<figcaption>
										<strong>{look.name}</strong>
										<span>{look.line}</span>
									</figcaption>
								</figure>
							{/each}
						</div>
					</div>
				</li>
				<li class="step">
					<span class="step-n">3</span>
					<div class="step-body">
						<h3 class="step-h">Tell your agent</h3>
						<div class="chat-line">
							<span class="chat-you">You</span>
							<p>"Build my landing page with aronia — Risograph style."</p>
						</div>
						<p class="micro">
							It reads the look and builds every screen to match. Screen five looks like screen
							one.
						</p>
					</div>
				</li>
			</ol>
			<p class="micro closing">No CSS, no design skills, no idea what a hex code is required.</p>
		</section>

		<!-- ── 5 · FAQs ────────────────────────────────────────────────── -->
		<section class="beat">
			<span class="beat-tag">05 · FAQs</span>
			<div class="col">
				<h2>Questions</h2>
				<dl class="faqs">
					{#each faqs as f}
						<div class="faq">
							<dt>{f.q}</dt>
							<dd>{f.a}</dd>
						</div>
					{/each}
				</dl>
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

		--u1: 8px;
		--u2: 16px;
		--u3: 24px;
		--u4: 32px;
		--u6: 48px;
		--u8: 64px;
		--major: 96px;

		font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
		color: var(--ink);
		background: var(--paper);
		-webkit-font-smoothing: antialiased;
		/* Own scroll container: the docs' global `html { overflow: hidden }` (desktop)
		   would otherwise clip this long page, so the wireframe scrolls internally. */
		height: 100vh;
		overflow-y: auto;
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
		font-size: 12px;
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
		font-size: 11px;
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
		font-size: 40px;
		line-height: 48px; /* 6 × 8 */
		letter-spacing: -0.02em;
		font-weight: 800;
		margin: 0 0 var(--u4);
	}
	.display-sm {
		font-size: 32px;
		line-height: 40px; /* 5 × 8 */
		letter-spacing: -0.02em;
		font-weight: 800;
		margin: 0 0 var(--u4);
	}
	h2 {
		font-size: 28px;
		line-height: 32px; /* 4 × 8 */
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
		font-size: 18px;
		line-height: 24px; /* 3 × 8 */
		color: var(--ink);
		margin: 0 0 var(--u4);
	}
	.body {
		font-size: 16px;
		line-height: 24px; /* 3 × 8 */
		color: var(--ink-2);
		margin: 0;
	}
	.micro {
		font-size: 14px;
		line-height: 24px; /* 3 × 8 */
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

	/* §2 Problem — stacked headline over subheadline on mobile (base). At ≥768 the two
	   split apart onto the section's left/right text-inset guides (see the min-width
	   block below). The col spans the full content width either way. */
	.problem .col {
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
		font-size: 15px;
		line-height: 24px; /* 3 × 8 */
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
		font-size: 15px;
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
	   Two placeholder panes side by side, each tagged Before / After. */
	.ba {
		margin: var(--u6) 0 0;
		display: grid;
		grid-template-columns: 1fr;
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
		transition: opacity 600ms ease;
	}
	.ba-before {
		opacity: 1;
	}
	.ba-after {
		opacity: 0;
	}
	.ba-motion[data-phase='after'] .ba-before {
		opacity: 0;
	}
	.ba-motion[data-phase='after'] .ba-after {
		opacity: 1;
	}
	.ba-replay {
		position: absolute;
		bottom: var(--u2);
		right: var(--u2);
		z-index: 2;
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: 12px;
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
		font-size: 11px;
		line-height: 24px;
		color: var(--ink-3);
	}
	@media (prefers-reduced-motion: reduce) {
		.ba-motion .ba-pane {
			transition: none;
		}
	}
	.ba-tag {
		position: absolute;
		top: var(--u2);
		left: var(--u2);
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: 12px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--ink-3);
		background: var(--paper);
		border: 1px solid var(--line);
		padding: 2px 6px;
	}
	.proof-list {
		margin-top: var(--u6);
		display: flex;
		flex-direction: column;
		gap: var(--u4);
	}
	.proof-list .ba {
		margin-top: 0;
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
		font-size: 14px;
		line-height: 24px;
		color: var(--ink-2);
	}

	/* Placeholder label inside any wireframe box. */
	.ph-label {
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: 13px;
		color: var(--ink-3);
		text-align: center;
	}

	/* ── How it works — steps ─────────────────────────────────────── */
	.steps {
		list-style: none;
		margin: var(--u6) 0 0;
		padding: 0;
		max-width: 760px;
		display: flex;
		flex-direction: column;
		gap: var(--u6);
	}
	.step {
		display: flex;
		gap: var(--u3);
		align-items: flex-start;
	}
	.step-n {
		flex: none;
		width: 40px;
		height: 40px;
		border: 1px solid var(--ink);
		border-radius: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: 18px;
		line-height: 1;
	}
	.step-body {
		flex: 1;
		min-width: 0;
	}
	.step-h {
		font-size: 24px;
		line-height: 32px; /* 4 × 8 */
		font-weight: 700;
		margin: 0 0 var(--u2);
	}
	.closing {
		margin-top: var(--u6);
	}

	/* Look specimens (in step 2) — 2×2 grid. */
	.looks {
		margin-top: var(--u2);
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--u3);
	}
	.visual {
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
		flex-direction: column;
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--u2);
		padding: var(--u4);
		min-height: 200px;
		margin: 0;
	}
	.look figcaption {
		display: flex;
		flex-direction: column;
		gap: var(--u1);
		text-align: left;
	}
	.look figcaption strong {
		font-size: 18px;
		line-height: 24px;
		color: var(--ink);
	}
	.look figcaption span {
		font-size: 14px;
		line-height: 24px;
		color: var(--ink-2);
	}

	/* Plain-English chat line (step 3). */
	.chat-line {
		display: flex;
		gap: var(--u2);
		align-items: baseline;
		padding: var(--u3);
		border: 1px solid var(--line);
		border-radius: 0;
		background: var(--fill);
	}
	.chat-you {
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: 12px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--ink-3);
	}
	.chat-line p {
		margin: 0;
		font-size: 16px;
		line-height: 24px; /* 3 × 8 */
		color: var(--ink);
	}

	/* ── FAQs ─────────────────────────────────────────────────────── */
	.faqs {
		margin: var(--u6) 0 0;
	}
	.faq {
		padding: var(--u3) 0;
		border-top: 1px solid var(--line);
	}
	.faq:last-child {
		border-bottom: 1px solid var(--line);
	}
	.faq dt {
		font-size: 18px;
		line-height: 24px; /* 3 × 8 */
		font-weight: 600;
		margin: 0 0 var(--u1);
	}
	.faq dd {
		margin: 0;
		font-size: 16px;
		line-height: 24px; /* 3 × 8 */
		color: var(--ink-2);
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
		font-size: 13px;
		line-height: 24px;
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
		.ba,
		.looks {
			grid-template-columns: 1fr 1fr;
		}

		/* §2 Problem — headline pinned to the left guide, subheadline to the right,
		   each capped at half the content width; justify flushes the sub's full lines
		   onto the right guide (last line ragged). Stacked below this seam. */
		.problem h2 {
			max-width: 50%;
			text-align: left;
		}
		.problem .body {
			max-width: 50%;
			margin-left: auto;
			text-align: justify;
			text-align-last: left;
		}

		/* Type steps up to the display sizes — each still baseline-locked (8px-multiple
		   line-heights), a discrete step, not a fluid ramp. */
		.display {
			font-size: 64px;
			line-height: 72px; /* 9 × 8 */
		}
		.display-sm {
			font-size: 48px;
			line-height: 56px; /* 7 × 8 */
		}
		h2 {
			font-size: 40px;
			line-height: 48px; /* 6 × 8 */
		}
		.lead {
			font-size: 20px;
			line-height: 32px; /* 4 × 8 */
		}
	}
</style>
