<script lang="ts">
	import { onMount } from 'svelte';

	// Brand faces (Aronia design board): Gluten for display, SUSE for text/UI.
	// Both variable (wght 100–900); fontsource registers them as
	// 'Gluten Variable' / 'SUSE Variable'.
	import '@fontsource-variable/gluten';
	import '@fontsource-variable/suse';

	// Inter — loaded ONLY for the §2 "generic app" mirror. It's the single most
	// AI-default typeface, so the mockup reads instantly as "everyone else's app."
	// The brand itself never uses it (that's Gluten + SUSE above).
	import '@fontsource-variable/inter';

	// The rotator specimens render each family's real Card — pull them from the registry.
	import { registry } from './registry.js';

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
	// step of How it works. Each renders as the SAME aronia Card restyled per family
	// (see the specimen sheet at /landing/specimens) so the LOOK is the only variable;
	// `id` keys into the component registry. The slot is count-agnostic: it shows the
	// ACT of choosing one, not the whole catalog, so it holds at 4 or 20.
	const looks = [
		{ id: 'swiss', name: 'Swiss', line: 'Clean and grown-up. Calm, sharp, nothing wasted.' },
		{ id: 'neo-brutalism', name: 'Neo-Brutalism', line: 'Loud and fearless. Thick lines, hard edges, impossible to ignore.' },
		{ id: 'glassmorphism', name: 'Glassmorphism', line: 'Sleek and frosted. Soft, modern, a little futuristic.' },
		{ id: 'risograph', name: 'Risograph', line: 'Warm and handmade. Grainy, printed, full of character.' }
	];

	// Proof = multi-screen COHERENCE (pivoted off before/after 2026-09-30). One real app —
	// Setlist, a gig finder — built screen by screen with aronia's Risograph style. Four
	// DIFFERENT screens that still read as one world: that's the thing AI can't fake (the
	// FAQ promise "every new screen still fits"), which a single before/after structurally
	// can't show. The dark/light toggle flips all four at once, so "dark mode is free" rides
	// the same proof. (Retired before/after: the AI "before" looked too good, and there's
	// only ONE true before = §2's generic mirror, with every aronia style an "after".)
	const screens = [
		{ id: 'discover', label: 'Discover' },
		{ id: 'artists', label: 'Artists' },
		{ id: 'gig', label: 'Gig detail' },
		{ id: 'shows', label: 'My shows' }
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

	// ── HERO marquee — looks × devices, always on. The hero's job is RANGE: four style
	// families × light/dark, each on a DIFFERENT demo app and device, streaming past
	// full-bleed so more than one look is on screen at any moment (the §3 coherence proof
	// sells consistency; this sells versatility). A continuous CSS marquee — no stepping,
	// dots or auto-advance timer — so it reads as an endless ribbon of distinct looks.
	//
	// Each slide is a FLAT WebP baked from the real aronia-component mockup via the dev-only
	// /landing/capture sheet (world ground + device + screen all in one 2× image). Baking to
	// images is deliberate: the live components hit compositing glitches when zoomed and
	// animated together (esp. glass backdrop-filter across the loop seam); flat pixels have
	// none of that. The capture tiles ARE the real components, so this stays an honest
	// "built with aronia" proof — just pre-rendered. Re-capture: scripts/capture-hero.mjs.
	//
	// Order alternates light/dark and never repeats a family back-to-back (including across
	// the loop wrap). Panel width is the image's own aspect ratio at the band height (square
	// mobile → 600, desktop → 780, tablet → 900), so no per-slide width is needed.
	const slides = [
		{ img: 'riso', style: 'Risograph', device: 'mobile', app: 'Simmer', category: 'food', theme: 'light' },
		{ img: 'neo', style: 'Neo-Brutalism', device: 'desktop', app: 'Tally', category: 'SaaS', theme: 'dark' },
		{ img: 'halo', style: 'Glassmorphism', device: 'mobile', app: 'Halo', category: 'weather', theme: 'light' },
		{ img: 'depart', style: 'Swiss', device: 'desktop', app: 'Depart', category: 'departures', theme: 'dark' },
		{ img: 'drop', style: 'Neo-Brutalism', device: 'tablet', app: 'Drop', category: 'sneakers', theme: 'light' },
		{ img: 'spindle', style: 'Risograph', device: 'desktop', app: 'Spindle', category: 'vinyl', theme: 'dark' },
		{ img: 'swiss', style: 'Swiss', device: 'mobile', app: 'The Dispatch', category: 'news', theme: 'light' },
		{ img: 'glass', style: 'Glassmorphism', device: 'tablet', app: 'Pulse', category: 'fitness', theme: 'dark' }
	];
	// Rendered twice back-to-back so the marquee can loop seamlessly (animate 0 → -50%).
	const marquee = [...slides, ...slides];
	// Panel width per device at the 600px band height — matches each WebP's baked aspect
	// ratio, so the width/height attrs reserve the right box (no layout shift on load).
	const deviceW: Record<string, number> = { mobile: 600, desktop: 780, tablet: 900 };
	let reducedMotion = $state(false);

	// Section-heading word-by-word reveal, applied with `use:revealWords`. Splits the
	// heading into word spans (reading-order 80ms stagger, heavy ease) that hold muted
	// and fade to full once ~30% of the heading scrolls into view — fired once by an
	// IntersectionObserver. Skipped entirely under reduced motion (heading stays static).
	// startDelay (ms) offsets the whole stagger — used to sequence the hero sub after the
	// headline; 0 (the default) for every scroll-triggered section heading.
	function revealWords(node: HTMLElement, startDelay = 0) {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const words = (node.textContent ?? '').split(/\s+/).filter(Boolean);
		node.textContent = '';
		words.forEach((word, i) => {
			const span = document.createElement('span');
			span.className = 'word';
			span.style.transitionDelay = `${startDelay + i * 80}ms`;
			span.textContent = word;
			node.appendChild(span);
			if (i < words.length - 1) node.appendChild(document.createTextNode(' '));
		});
		node.classList.add('reveal-words');

		const io = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					node.classList.add('revealed');
					io.disconnect(); // once
				}
			},
			{ threshold: 0.3 }
		);
		io.observe(node);
		return { destroy: () => io.disconnect() };
	}

	// Footer reveal runway. The footer is a fixed, content-height band uncovered as
	// the page scrolls off it (desktop). The scroll runway — .wire-inner's bottom
	// margin — must equal the footer's rendered height so it reveals exactly and no
	// further. Measure the footer and publish it as --footer-reveal; a ResizeObserver
	// keeps it in sync when the band reflows (e.g. the sign-off headline rewrapping).
	//
	// Also forward wheel scrolling to .wire: because the footer is position:fixed its
	// scroll chain is the viewport (overflow:hidden), so a wheel over the revealed
	// footer can't scroll the page. Translating deltas onto .wire lets the reader
	// scroll from anywhere — including over the footer's links, which a pointer-events
	// hack would have disabled. deltaMode is normalised so line/page-mode mice match.
	function footerReveal(node: HTMLElement) {
		const wire = node.closest('.wire') as HTMLElement | null;
		if (!wire) return;
		const sync = () => wire.style.setProperty('--footer-reveal', `${node.offsetHeight}px`);
		sync();
		const ro = new ResizeObserver(sync);
		ro.observe(node);

		const onWheel = (e: WheelEvent) => {
			const step = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? wire.clientHeight : 1;
			wire.scrollTop += e.deltaY * step;
			e.preventDefault();
		};
		node.addEventListener('wheel', onWheel, { passive: false });

		return {
			destroy: () => {
				ro.disconnect();
				node.removeEventListener('wheel', onWheel);
			}
		};
	}

	// Which look the rotating "pick a look" slot is currently showing, and the one it just
	// left — the slide needs both: the outgoing pane exits left while the incoming enters
	// from the right (see the .look-stage transforms).
	let lookIndex = $state(0);
	let prevIndex = $state(-1);
	// Auto-rotation timer, hoisted so a manual pick can cancel it.
	let rotTimer: ReturnType<typeof setInterval> | undefined;

	// Signoff headline cycles its key word through aronia's range of uses. Started in onMount,
	// so it never runs under reduced motion (stays on the first word).
	const flipWords = ['design', 'product', 'website', 'app', 'dashboard'];
	let flipIndex = $state(0);
	let flipTimer: ReturnType<typeof setInterval> | undefined;

	// Advance the slot, remembering where we came from so the exiting pane knows to leave.
	function rotateTo(i: number) {
		prevIndex = lookIndex;
		lookIndex = i;
	}

	onMount(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		if (mq.matches) {
			reducedMotion = true;
			// The hero marquee halts via CSS; here just skip the §4 auto-rotate (dots are
			// the manual control instead).
			return;
		}
		// Cycle the §4 "pick a look" slot so it reads as choosing from many, not a grid.
		rotTimer = setInterval(() => rotateTo((lookIndex + 1) % looks.length), 3000);
		// Cycle the signoff headline's key word.
		flipTimer = setInterval(() => (flipIndex = (flipIndex + 1) % flipWords.length), 2200);
		return () => {
			clearInterval(rotTimer);
			clearInterval(flipTimer);
		};
	});

	// Manual pick from the dots. Hands control to the reader: jump to the look and
	// stop auto-advancing so it won't yank them onward. Also the sole navigation for
	// reduced-motion users (who never had an interval running).
	function selectLook(i: number) {
		rotateTo(i);
		clearInterval(rotTimer);
		rotTimer = undefined;
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

	// Both CTAs scroll to §4 ("Three steps. No code."). The page scrolls inside .wire (a
	// custom overflow container), so a bare hash link won't move it — scrollIntoView walks to
	// the real scrollable ancestor. Honour reduced motion with an instant jump.
	function goToSteps(e: Event) {
		e.preventDefault();
		const target = document.getElementById('steps');
		if (!target) return;
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
	}

	// Proof mode — the Light/Dark segmented toggle swaps the src of all four screens at
	// once. DARK leads (default): the dark screens sit in the dark section as one continuous
	// world. Flipping them together turns "dark mode is free/coherent" into part of the proof.
	let proofMode = $state<'dark' | 'light'>('dark');
</script>

<!-- Brand wordmark — the teal "aronia" with a hand-drawn marker loop. Rendered in both the
     hero (top-left) and the footer so the two can't drift; `extra` carries a placement class. -->
{#snippet wordmark(extra = '')}
	<span class="wordmark {extra}">
		aronia
		<svg class="wordmark-ring" viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true">
			<path
				d="M64 14 C24 16 8 44 20 68 C32 92 92 96 128 90 C170 83 196 60 188 36 C181 15 132 6 78 12 C58 14 44 18 36 26"
				vector-effect="non-scaling-stroke"
			/>
		</svg>
	</span>
{/snippet}

<div class="wire">
	<div class="wire-inner">
		<!-- ── 1 · HERO (What?) ────────────────────────────────────────── -->
		<section class="beat hero">
			{@render wordmark('hero-mark')}
			<div class="col">
				<h1 class="display" use:revealWords>Reject the default AI look.</h1>
				<!-- Sub starts after the headline's stagger lands (~700ms) so the two sequence. -->
				<p class="lead" use:revealWords={700}>
					With aronia every page you build comes out looking designed, distinctive, and
					consistent.
				</p>
			</div>
			<!-- Looks × devices marquee — full-bleed, always on. Each slide is a flat 2× WebP
			     baked from the real component mockup (see the slides manifest + capture note
			     above). The track is the slide set rendered twice; it scrolls 0 → -50% forever,
			     so the second copy covers the seam and the loop is seamless. -->
			<figure class="hero-carousel" aria-label="aronia across looks and devices">
				<div class="carousel-track">
					{#each marquee as slide, i (i)}
						<div
							class="carousel-slide"
							data-theme={slide.theme}
							aria-hidden={i >= slides.length ? 'true' : undefined}
						>
							<img
								class="slide-img"
								src="/landing/hero/{slide.img}.webp"
								alt={i < slides.length
									? `${slide.app}, a ${slide.category} app, in aronia's ${slide.style} style on ${slide.device}`
									: ''}
								width={deviceW[slide.device]}
								height="600"
								loading="eager"
								decoding="async"
							/>
						</div>
					{/each}
				</div>
			</figure>
			<div class="cmd-row">
				<a class="btn btn-primary" href="#steps" onclick={goToSteps}>Get started</a>
			</div>
		</section>

		<!-- ── 2 · PROBLEM (Why?) — hold up the generic mirror ─────────── -->
		<section class="beat split cream">
			<div class="col">
				<h2 use:revealWords>Your app works. It just looks like everyone else's.</h2>
				<p class="body">
					And that's not on you. AI doesn't have a point of view so when you ask it to design
					something it reaches for the most common look in its training data and your website
					ends up looking like everyone else's.
				</p>
			</div>
			<!-- The generic-app mirror: the platonic AI-default look — Inter, gray/slate,
			     rounded corners, a black shadcn-style button. A light window on the dark
			     page (its own colour world, not the brand tokens). Deliberately breaks the
			     page's border-radius:0 house rule — that contrast is the whole point.
			     Purely illustrative, so it's aria-hidden; the copy above carries the point. -->
			<figure class="generic-visual">
				<div class="mockup" aria-hidden="true">
					<div class="mockup-bar">
						<span class="mockup-dots"><i></i><i></i><i></i></span>
						<span class="mockup-url">myapp.com</span>
					</div>
					<div class="mockup-app">
						<header class="mock-nav">
							<span class="mock-brand">
								<span class="mock-logo"></span>
								<span class="mock-word">Acme</span>
							</span>
							<nav class="mock-links">
								<span>Features</span>
								<span>Pricing</span>
								<span>About</span>
							</nav>
							<span class="mock-cta">Sign up</span>
						</header>
						<div class="mock-hero">
							<span class="mock-badge">✨ Introducing Acme 2.0</span>
							<h3 class="mock-title">Build better products, faster.</h3>
							<p class="mock-sub">
								The all-in-one platform for modern teams to ship faster and scale with
								confidence.
							</p>
							<div class="mock-actions">
								<span class="mock-btn mock-btn-primary">Get started</span>
								<span class="mock-btn mock-btn-ghost">Learn more</span>
							</div>
						</div>
					</div>
				</div>
				<figcaption>Recognize it? It's probably your app.</figcaption>
			</figure>
		</section>

		<!-- ── 3 · PROOF — multi-screen coherence (one app, one look) ──── -->
		<section class="beat split">
			<div class="col">
				<h2 use:revealWords>One point of view, every screen.</h2>
				<p class="body">
					Setlist was built in a few hours with a few prompts (Opus 5.5) using aronia's
					Risograph look. Each screen is different, but they clearly belong together and that
					consistency is where AI struggles. Flip it to light mode to see that it still holds.
				</p>
			</div>
			<div class="proof">
				<div class="mode-bar">
					<div
						class="mode-toggle"
						role="group"
						aria-label="Preview Setlist in light or dark mode">
						<button
							class="mode-btn"
							type="button"
							aria-pressed={proofMode === 'dark'}
							onclick={() => (proofMode = 'dark')}>Dark</button>
						<button
							class="mode-btn"
							type="button"
							aria-pressed={proofMode === 'light'}
							onclick={() => (proofMode = 'light')}>Light</button>
					</div>
				</div>
				<div class="screens">
					{#each screens as s}
						<figure class="screen">
							<img
								class="screen-shot"
								src="/landing/setlist/{s.id}-{proofMode}.webp"
								alt="Setlist app — {s.label} screen in {proofMode} mode"
								width="2000"
								height="1096" />
							<figcaption class="screen-cap">{s.label}</figcaption>
						</figure>
					{/each}
				</div>
			</div>
		</section>

		<!-- ── 4 · HOW IT WORKS (How?) ─────────────────────────────────── -->
		<section id="steps" class="beat split how cream">
			<div class="col">
				<h2 use:revealWords>Three steps. No code.</h2>
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
					     the whole catalog, so it holds at 4 looks or 20. Each look renders as
					     the SAME Card restyled per family (the crossfading stack below); the
					     caption + dot row track which one is showing. -->
					<div class="look-rotator">
						<figure class="look-slot">
							<!-- The cards are decorative look specimens (the dots below are the real
							     control), so the stack is inert: its sample buttons stay out of the tab
							     order and the a11y tree. The figcaption names the current look. -->
							<div class="look-stack" inert>
								{#each looks as look, i (look.id)}
									{@const Card = registry[look.id].card}
									{@const Button = registry[look.id].button}
									{@const Badge = registry[look.id].badge}
									<div
										class="look-stage"
										data-style={look.id}
										data-pos={i === lookIndex ? 'current' : i === prevIndex ? 'prev' : 'next'}
										aria-hidden={i !== lookIndex}
									>
										<Card>
											{#snippet header()}
												<div class="spec-head">
													<span class="spec-title">This week</span>
													<Badge variant="accent">New</Badge>
												</div>
											{/snippet}
											<p class="spec-body">
												A calm home for the week — plan it, keep what matters, let the rest go.
											</p>
											{#snippet footer()}
												<Button variant="ghost">Later</Button>
												<Button variant="primary">Open</Button>
											{/snippet}
										</Card>
									</div>
								{/each}
							</div>
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
			<h2 use:revealWords>Frequently Asked Questions</h2>
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

	</div>

	<!-- ── 6 · FOOTER — full-bleed layer, revealed as the page scrolls off it (≥768).
	     Lives OUTSIDE .wire-inner and sits behind it (lower z); .wire-inner is opaque
	     and slides up to uncover it. The glow fills the whole section. Desktop-only
	     reveal — on mobile the footer just flows normally. See the reveal rules below. -->
	<footer class="site-footer" use:footerReveal>
		<div class="site-footer-inner">
			<!-- Sign-off: the page's one final CTA, over the section glow. -->
			<div class="signoff">
				<!-- Stable word for assistive tech; the cycling spans are aria-hidden. All words are
				     stacked in one grid cell so the slot is always as wide as the longest and the
				     line never re-wraps as the word changes. -->
				<h2 class="display-sm">
					Make your next <span class="flip-sr">design</span><span class="flip" aria-hidden="true"
						>{#each flipWords as w, i}<span class="flip-word" class:on={i === flipIndex}>{w}</span
							>{/each}</span
					> look like a choice.
				</h2>
				<a class="btn btn-primary" href="#steps" onclick={goToSteps}>Use aronia now</a>
			</div>

			<!-- Footer body: brand + the single outbound link. This is a self-contained
			     landing page, so there are no nav columns — GitHub is the one door out
			     (the repo README fans out to install, CLI, changelog, license). -->
			<div class="foot-body">
				<div class="foot-brand">
					{@render wordmark()}
					<p class="foot-tagline">A design language for coding agents.</p>
				</div>
			</div>

			<!-- Legal: GitHub + attribution on the left, colophon on the right; the
			     source link is the second honest door out. -->
			<div class="foot-legal">
				<span class="foot-legal-left">
					<a
						class="foot-gh"
						href="https://github.com/Chukwuka-Osakwe/aronia"
						target="_blank"
						rel="noopener"
						aria-label="aronia on GitHub"
					>
						<svg viewBox="0 0 16 16" width="20" height="20" aria-hidden="true" fill="currentColor">
							<path
								d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"
							/>
						</svg>
					</a>
					<span
						>© 2026 aronia ·
						<a href="https://github.com/Chukwuka-Osakwe/aronia">MIT-licensed source</a></span
					>
				</span>
				<span>Built for agents. Usable by humans. With love from Chukwuka.</span>
			</div>
		</div>
	</footer>
</div>

<style>
	/* ── Wireframe system ─────────────────────────────────────────────
	   Grayscale only. 8px baseline; --u* are 8px multiples, --major = 96px.
	   Neutral system stack deliberately signals "type not chosen yet." */
	.wire {
		/* ── Brand palette (Aronia board, dark-canonical) ──────────────
		   Derived from the aronia berry: near-black ground, cream flesh,
		   the berry's electric purple as the single accent, deep navy as a
		   support ground. Exact values read off the dark hero specimen. */
		--night: #090507; /* page ground */
		--cream: #eadbb8; /* primary text + primary-CTA fill */
		--muted: #b8b0a0; /* secondary warm-gray text on dark */
		--berry: #9b36d1; /* primary accent */
		--teal: #3fb6ad; /* secondary accent — hero wordmark + proof toggle */
		--navy: #0c1137; /* secondary/support ground */

		/* Semantic layer — every section reads through these, so the page
		   flips ground/ink by repointing HERE, not by touching selectors.
		   Neutrals below the two named text colours are derived from cream
		   over night so hairlines/surfaces stay in the same warm family. */
		--ink: var(--cream); /* primary text */
		--ink-2: var(--muted); /* secondary text */
		--ink-3: color-mix(in oklab, var(--cream) 45%, var(--night)); /* faint text */
		--line: color-mix(in oklab, var(--cream) 18%, var(--night)); /* hairlines on dark */
		--fill: color-mix(in oklab, var(--cream) 12%, var(--night)); /* inset fill */
		--paper: color-mix(in oklab, var(--cream) 7%, var(--night)); /* lifted surface box */
		--bg: var(--night); /* page field */

		/* Footer sweep tail — the far/outermost stop of the footer's radial glow. (Overscroll
		   is disabled on .wire, so there's no rubber-band peek to match anymore.) */
		--footer-peek: oklab(32% 0.079 0.043);

		--u1: 8px;
		--u2: 16px;
		--u3: 24px;
		--u4: 32px;
		--u5: 40px;
		--u6: 48px;
		--u8: 64px;
		--u15: 120px;
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
		--fs-label: 14px;
		--lh-label: 24px; /* 3 × 8 */

		/* ── Type stack (Aronia board) ────────────────────────────────
		   Gluten (rounded display) for headlines; SUSE for text + UI.
		   Both variable faces, registered by fontsource. */
		--font-display: 'Gluten Variable', system-ui, sans-serif;
		--font-body: 'SUSE Variable', system-ui, sans-serif;

		font-family: var(--font-body);
		color: var(--ink);
		/* Elastic overscroll is disabled (overscroll-behavior below). With the footer pinned to
		   100dvh it sits behind the whole viewport, so a top rubber-band would reveal its rust
		   over the hero. No bounce → scroll just stops at the ends, no peek either way. The
		   container ground is plain night (the page ground), so if a browser ever ignores
		   overscroll-behavior, night — not rust — is what shows. (Replaced the old split-gradient
		   peek, which only worked when the footer was a short band.) */
		background: var(--night);
		-webkit-font-smoothing: antialiased;
		/* Let height transitions interpolate to/from `auto` (inherited) — the FAQ answers
		   animate open/closed via ::details-content. No-op where unsupported (snaps, as before). */
		interpolate-size: allow-keywords;
		/* Own scroll container: the docs' global `html { overflow: hidden }` (desktop)
		   would otherwise clip this long page, so the wireframe scrolls internally. */
		height: 100vh;
		overflow-y: auto;
		/* No elastic rubber-band (see the background note) — keeps the 100dvh footer from
		   peeking over the hero on a top overscroll. */
		overscroll-behavior-y: none;
		/* The proof frames break out to full-viewport width; clip (not scroll) any
		   bleed past the edges so no horizontal scrollbar appears. */
		overflow-x: clip;
	}

	.wire :global(*) {
		box-sizing: border-box;
	}

	.wire-inner {
		position: relative;
		/* Opaque layer that covers the footer until scrolled off it (see the footer
		   reveal in the ≥768 block). z-index lifts it above the fixed footer. */
		z-index: 1;
		background: var(--bg);
	}

	/* Section = one idea. Uniform u15 (120px) top/bottom padding on every section (the hero
	   drops its top — see .beat.hero). */
	.beat {
		position: relative;
		max-width: 1080px;
		margin: 0 auto;
		padding: var(--u15) var(--u3);
	}
	/* Between-section spacing is fully padding-based now: each section's u10 top/bottom
	   padding is the only gap source (adjacent sections give 240px), so no margin. */
	.beat + .beat {
		margin-top: 0;
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
		font-family: var(--font-display);
		font-size: var(--fs-display);
		line-height: var(--lh-display);
		letter-spacing: -0.02em;
		font-weight: 700;
		/* The berry accent's home: the hero headline (board specimen). */
		color: var(--berry);
		margin: 0 0 var(--u4);
	}
	/* Section-heading word-by-word reveal (see the revealWords action). Words hold at
	   low opacity, then fade to full in reading order (per-word transition-delay, set
	   inline) once the heading scrolls ~30% into view. The heavy ease gives the "settle
	   into place" feel rather than a flat linear fade. Reduced motion never adds the
	   .reveal-words class, so headings stay static full-colour text. */
	/* The .word spans and the reveal-words/revealed classes are injected by the action
	   at runtime, so they carry no Svelte scope hash — anchor to the real .wire root
	   (which IS in the markup) and mark the dynamic descendants :global. */
	.wire :global(.reveal-words .word) {
		opacity: 0.3;
		transition: opacity 900ms cubic-bezier(0.32, 0.72, 0, 1);
	}
	.wire :global(.reveal-words.revealed .word) {
		opacity: 1;
	}
	.display-sm {
		font-family: var(--font-display);
		font-size: var(--fs-title);
		line-height: var(--lh-title);
		letter-spacing: -0.02em;
		font-weight: 700;
		margin: 0 0 var(--u4);
	}
	h2 {
		font-family: var(--font-display);
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
		font-size: var(--fs-body);
		line-height: var(--lh-body);
		color: var(--ink-2);
		margin: var(--u3) 0 0;
	}

	/* Hero is the first section: its top space is page-top breathing room (padding),
	   not an inter-section margin. A smaller step on mobile; a full major unit at ≥768. */
	/* Hero is the first section — a slim u4 (32px) up top instead of the shared u15,
	   so it sits close to the page top; full u8 on the bottom. Two-class selector so
	   it outranks the desktop `.beat` padding shorthand regardless of source order. */
	.beat.hero {
		padding-top: var(--u15);
	}
	/* Brand wordmark (shared by hero + footer via the {wordmark} snippet): teal Gluten with a
	   hand-drawn loop. position:relative + inline-block so it shrinks to the word and the loop
	   anchors to it; the loop inherits the teal via currentColor. */
	.wordmark {
		position: relative;
		display: inline-block;
		font-family: var(--font-display);
		font-size: var(--fs-feature);
		line-height: var(--lh-feature);
		font-weight: 700;
		letter-spacing: -0.01em;
		color: var(--teal);
	}
	/* Hero places the mark in the top-left corner — absolute so it escapes the section's
	   padding rhythm (the headline keeps its own top spacing). Flush to the 1080 column edge;
	   .beat is position:relative, so this anchors to the section. */
	.hero-mark {
		position: absolute;
		top: var(--u6);
		left: 0;
	}
	/* Hand-drawn marker loop around the wordmark — a loose ellipse with an overshoot tail
	   (the stroke crosses past where it began) for the real "circled by hand" tell. The SVG
	   overlays the word, extended beyond it so the loop has breathing room; non-scaling-stroke
	   keeps an even line weight whatever the word width. */
	.wordmark-ring {
		position: absolute;
		top: -0.3em;
		left: -0.55em;
		width: calc(100% + 1.1em);
		height: calc(100% + 0.5em);
		overflow: visible;
		pointer-events: none;
	}
	.wordmark-ring path {
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	/* Hero rides the default --night page ground (dark-canonical: cream text + cream CTA, no
	   inversion) — it's the first of the alternating dark bands, so it needs no ground paint;
	   .wire-inner's --night shows through. */
	/* Hero text is centered and wider than the default 62ch measure so the headline lands
	   on a single line at desktop (it needs ~906px at the 64px display size); below that it
	   wraps gracefully. The sub stays on a narrower centered measure for readability. */
	.hero .col {
		max-width: 58rem;
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
		margin-top: var(--u6);
	}
	.btn {
		font: inherit;
		font-size: var(--fs-body);
		font-weight: 600;
		padding: var(--u2) var(--u3);
		border-radius: 0;
		cursor: pointer;
		border: 1px solid var(--ink);
		/* Robust for both <button> and <a> (the footer CTA is a link). */
		display: inline-flex;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		transition:
			background-color 180ms ease,
			border-color 180ms ease,
			color 180ms ease;
	}
	.btn-primary {
		/* Inverted CTA (Aronia board): cream fill, near-black text. */
		background: var(--cream);
		color: var(--night);
		border-color: var(--cream);
	}
	/* Hover/focus (both CTAs) — the cream fill flips to the berry accent, the label to cream.
	   Cream-on-berry is ~4:1 (under the 4.5 bar for normal text) but this is a transient
	   hover state, not resting copy. */
	.btn-primary:hover,
	.btn-primary:focus-visible {
		background: var(--berry);
		border-color: var(--berry);
		color: var(--cream);
	}
	/* Hero CTA only — a slightly larger, heavier label than the footer CTA (keeps the base
	   near-black on cream). */
	.cmd-row .btn-primary {
		font-weight: 700;
		font-size: 18px;
	}

	/* ── Hero marquee — looks × devices, always on ─────────
	   Full-bleed: margin-inline: calc(50% − 50vw) pulls the figure out of the 1080 column to
	   the viewport edges (.wire's overflow-x: clip keeps 100vw from adding a scrollbar). Slides
	   run hard to the viewport edges (overflow: hidden clips them). */
	.hero-carousel {
		margin: var(--u6) 0 0;
		margin-inline: calc(50% - 50vw);
		overflow: hidden;
	}
	/* The slide set rendered twice, streaming left forever; -50% lands the second copy
	   exactly where the first began. Per-slide margin-right (not flex gap) keeps the two
	   halves equal width so that wrap is seamless. Tune the duration here. Pause on hover to
	   inspect a look. */
	.carousel-track {
		display: flex;
		width: max-content;
		animation: hero-marquee 30s linear infinite;
	}
	.hero-carousel:hover .carousel-track {
		animation-play-state: paused;
	}
	@keyframes hero-marquee {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-50%);
		}
	}
	.carousel-slide {
		flex: 0 0 auto;
		margin-right: var(--u4);
	}
	/* Each slide is a flat 2× WebP with its "world" ground baked in. Fixed band height; the
	   image's own aspect ratio sets the width (square mobile → 600, desktop → 780, tablet →
	   900), matching the width/height attrs so there's no layout shift on load. */
	.slide-img {
		display: block;
		height: 600px;
		width: auto;
	}
	@media (prefers-reduced-motion: reduce) {
		.carousel-track {
			animation: none;
		}
	}
	/* ── §3 Proof — multi-screen coherence ────────────────────────────
	   One app (Setlist), four real screens stacked, all sharing one Risograph look. A
	   Light/Dark segmented toggle swaps every screen's src at once. MOBILE (base): screens
	   stack one per row; the toggle sits above, right-aligned. */
	/* ── Cream band modifier (the alternating light grounds) ──────────
	   Inverts the dark page to a full-bleed CREAM ground with dark text. Everything inside
	   reads through the semantic tokens, so a section flips by adding `cream` — no inner
	   selector changes. --paper is a LIFTED light cream (not the ground itself) so surfaces
	   like §4's .prompt-box still lift off the band, while staying legible as text sitting on
	   an --ink (night) fill. `color: var(--ink)` re-resolves the inherited (cream) text colour
	   in this scope — the root set it once to cream and headings never re-read --ink. */
	.beat.cream {
		--ink: var(--night);
		--ink-2: color-mix(in oklab, var(--night) 70%, var(--cream));
		--ink-3: color-mix(in oklab, var(--night) 45%, var(--cream));
		--line: color-mix(in oklab, var(--night) 18%, var(--cream));
		--paper: color-mix(in oklab, var(--cream) 80%, white);
		color: var(--ink);
	}
	/* The cream ground spans the full VIEWPORT width (the section box is capped at 1080)
	   while staying clipped to this section's height — a full-bleed band, not a column-width
	   panel. Painted on ::after (::before is the grid overlay) at z-index 0: above
	   .wire-inner's bg, below the content. 100vw + left:50% + translateX(-50%) full-bleeds it. */
	.beat.cream::after {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		left: 50%;
		width: 100vw;
		transform: translateX(-50%);
		z-index: 0;
		background: var(--cream);
	}
	/* Content rides above the full-bleed band. */
	.beat.cream > * {
		position: relative;
		z-index: 1;
	}
	.proof {
		margin-top: var(--u6);
	}
	/* The toggle rides the section's right guide (echoes the staggered sub above it). */
	.mode-bar {
		display: flex;
		justify-content: flex-end;
		margin-bottom: var(--u4);
	}
	/* Segmented control — active segment INVERTS (fill), never bolds: state via
	   colour/contrast, and it advertises both modes before you tap. */
	.mode-toggle {
		display: inline-flex;
		border: 4px solid var(--teal);
	}
	.mode-btn {
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: var(--fs-label);
		line-height: var(--lh-label);
		padding: var(--u1) var(--u3);
		border: 0;
		border-radius: 0;
		background: transparent;
		color: var(--ink-2);
		cursor: pointer;
	}
	.mode-btn + .mode-btn {
		border-left: 4px solid var(--teal);
	}
	.mode-btn[aria-pressed='true'] {
		background: var(--ink);
		color: var(--paper);
	}
	.screens {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--u4);
	}
	.screen {
		margin: 0;
	}
	.screen-shot {
		display: block;
		width: 100%;
		height: auto;
		/* Neutral gray frame (not the warm --line hairline) — a soft "framed screenshot"
		   treatment like the portfolio reference. */
		border: 4px solid #8c8c8c;
		border-radius: 0;
	}
	.screen-cap {
		margin-top: var(--u2);
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: var(--fs-label);
		line-height: var(--lh-label);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--ink-2);
	}

	/* Section 2 — the static generic-app mirror (not before/after; that's hero+proof).
	   The mockup is its OWN colour world (Inter, slate palette, rounded), a light window
	   on the dark page — so it reads as "everyone else's app." Base = phone; the hero
	   type + nav links scale up at the 768 seam (see the min-width block). */
	.generic-visual {
		margin: var(--u6) 0 0;
	}
	.generic-visual figcaption {
		margin-top: var(--u3);
		font-size: var(--fs-small);
		line-height: var(--lh-small);
		color: var(--ink-2);
		text-align: center;
	}
	.mockup {
		/* Local palette — deliberately the AI-default slate ramp, NOT the brand tokens. */
		--m-bg: #f8fafc; /* slate-50 app ground */
		--m-surface: #ffffff;
		--m-ink: #0f172a; /* slate-900 */
		--m-muted: #64748b; /* slate-500 */
		--m-line: #e2e8f0; /* slate-200 */
		/* The obligatory indigo→violet gradient — the real AI-default tell (headlines,
		   buttons, logo marks, hero glow all reach for it). Distinct from the brand berry. */
		--m-grad: linear-gradient(135deg, #6366f1, #8b5cf6);
		font-family: 'Inter Variable', system-ui, sans-serif;
		color: var(--m-ink);
		text-align: left;
		background: var(--m-surface);
		border: 1px solid var(--m-line);
		/* Square — the mock honours the page's border-radius:0 house rule; the gradients
		   carry the "generic AI" read instead of rounded corners. */
		border-radius: 0;
		overflow: hidden;
		box-shadow: 0 24px 48px -24px rgba(0, 0, 0, 0.55);
	}
	/* Browser chrome — traffic lights + a fake URL pill sell "this is a real site." */
	.mockup-bar {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 10px 14px;
		background: #f1f5f9; /* slate-100 */
		border-bottom: 1px solid var(--m-line);
	}
	.mockup-dots {
		display: inline-flex;
		gap: 6px;
		flex: none;
	}
	.mockup-dots i {
		width: 10px;
		height: 10px;
		background: #cbd5e1; /* slate-300 */
	}
	.mockup-url {
		flex: 1;
		max-width: 240px;
		font-size: 12px;
		color: var(--m-muted);
		background: var(--m-surface);
		border: 1px solid var(--m-line);
		padding: 3px 10px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.mockup-app {
		/* Soft violet glow blooming from the top-centre over the slate ground — the
		   generic "gradient hero" wash. */
		background:
			radial-gradient(90% 70% at 50% -8%, rgba(124, 58, 237, 0.16), transparent 62%),
			var(--m-bg);
		padding: 20px;
	}
	/* Generic top nav: logo + wordmark, centre links (hidden on phone), a rounded CTA. */
	.mock-nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding-bottom: 8px;
	}
	.mock-brand {
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}
	.mock-logo {
		width: 24px;
		height: 24px;
		background: var(--m-grad);
	}
	.mock-word {
		font-size: 15px;
		font-weight: 600;
		letter-spacing: -0.01em;
	}
	.mock-links {
		display: none;
		gap: 24px;
		font-size: 14px;
		color: var(--m-muted);
	}
	.mock-cta {
		flex: none;
		font-size: 13px;
		font-weight: 500;
		color: #fff;
		background: var(--m-grad);
		padding: 7px 14px;
	}
	/* Centered generic hero: pill badge → heading → muted sub → two rounded buttons. */
	.mock-hero {
		text-align: center;
		padding: 28px 8px 32px;
	}
	.mock-badge {
		display: inline-block;
		font-size: 12px;
		color: var(--m-muted);
		background: var(--m-surface);
		border: 1px solid var(--m-line);
		padding: 5px 12px;
		margin-bottom: 16px;
	}
	.mock-title {
		margin: 0 0 12px;
		font-size: 26px;
		line-height: 1.15;
		font-weight: 700;
		letter-spacing: -0.02em;
		/* Gradient headline text — the single most AI-default flourish. */
		background: var(--m-grad);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}
	.mock-sub {
		margin: 0 auto 20px;
		max-width: 42ch;
		font-size: 14px;
		line-height: 1.5;
		color: var(--m-muted);
	}
	.mock-actions {
		display: inline-flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 10px;
	}
	.mock-btn {
		font-size: 13px;
		font-weight: 500;
		padding: 9px 16px;
	}
	.mock-btn-primary {
		background: var(--m-grad);
		color: #fff;
	}
	.mock-btn-ghost {
		background: var(--m-surface);
		color: var(--m-ink);
		border: 1px solid var(--m-line);
	}


	/* ── How it works — ledger frame ──────────────────────────────────
	   Two rule sets on different widths: the VERTICAL rules ride the 1080 content-column edges
	   and wrap ONLY the steps list (they live on .steps — so they skip the heading AND the space
	   below the last divider); the HORIZONTAL step dividers span the full VIEWPORT width (centred
	   100vw pseudo-rules on each .step), running out past the verticals to the screen edges. The
	   beat's inline padding is dropped so .steps spans the full 1080 and its verticals land on the
	   edge; the readable gutter lives on the heading + step content instead. */
	.beat.how {
		padding-inline: 0;
	}
	.how > .col {
		padding-inline: var(--u3);
	}
	/* Verticals: contained to the steps block, on the 1080 content-column edges. */
	.how > .steps {
		border-left: 1px solid var(--line);
		border-right: 1px solid var(--line);
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
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--u3);
		/* Inline padding keeps content off the vertical rules. */
		padding: var(--u8) var(--u3);
	}
	/* Step dividers span the full VIEWPORT width (centred 100vw pseudo-rules), running out past
	   the contained vertical rules to the screen edges. Top rule on every step; the last step
	   also caps with a bottom rule. */
	.step::before,
	.step:last-child::after {
		content: '';
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		width: 100vw;
		border-top: 1px solid var(--line);
	}
	.step::before {
		top: 0;
	}
	.step:last-child::after {
		bottom: 0;
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
	/* The specimen stack: the four family cards share ONE grid cell (all at grid-area 1/1),
	   so the slot always sizes to the tallest card and never reflows on swap. They slide
	   horizontally — current on stage, previous exiting left, the rest parked off the right
	   — a carousel where the incoming look always enters from the right. */
	.look-stack {
		display: grid;
		/* Clip the off-stage panes as they slide in/out. */
		overflow: hidden;
	}
	.look-stage {
		grid-area: 1 / 1;
		/* Light so each family's light-dark() tokens resolve to their bright grounds,
		   regardless of page/OS theme — these are little colour windows on the dark page. */
		color-scheme: light;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--u5);
		/* SLIDE (Figma "move in") + fade: incoming enters from the right, outgoing exits left.
		   Both panes carry their own full-bleed ground, so a pure slide butts two grounds
		   against a hard seam mid-transition — the fade blends them through each other
		   instead. Opacity runs a touch quicker than the slide so the old ground clears
		   before the card fully leaves. easeInOutQuart: symmetric slow → fast → slow, no
		   overshoot, with slow ends. Travel is a short 60% "peek", not a full card width. */
		transition:
			transform 500ms cubic-bezier(0.76, 0, 0.24, 1),
			opacity 350ms ease;
	}
	/* current = on stage; prev = fading out to the left; next = parked off the right (hidden).
	   Only current is opaque; prev/next fade to 0 so grounds never hard-clash. */
	.look-stage[data-pos='current'] {
		transform: translateX(0);
		opacity: 1;
	}
	.look-stage[data-pos='prev'] {
		transform: translateX(-60%);
		opacity: 0;
		pointer-events: none;
	}
	.look-stage[data-pos='next'] {
		transform: translateX(60%);
		opacity: 0;
		pointer-events: none;
	}
	.look-stage :global(.swiss-card),
	.look-stage :global(.nb-card),
	.look-stage :global(.glass-card),
	.look-stage :global(.riso-card) {
		width: min(360px, 100%);
	}
	/* Card content (shared across all four) — title + accent badge in the header, one body
	   line, ghost + primary buttons in the footer. */
	.spec-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--u2);
	}
	.spec-title {
		font-size: 1.15rem;
		font-weight: 700;
	}
	.spec-body {
		margin: 0;
	}
	/* Per-family grounds (mirror /landing/specimens): Swiss + Neo have no ground of their
	   own → a clean neutral; Glass gets the vivid gradient so the frost has colour to
	   refract; Riso gets warm printed paper carrying strong grain (its load-bearing tell). */
	.look-stage[data-style='swiss'] {
		background: #f1f1f3;
	}
	.look-stage[data-style='neo-brutalism'] {
		background: #ecebe4;
	}
	.look-stage[data-style='glassmorphism'] {
		background:
			radial-gradient(120% 120% at 0% 0%, #a78bfa 0%, transparent 55%),
			radial-gradient(120% 120% at 100% 100%, #7dd3fc 0%, transparent 55%),
			linear-gradient(135deg, #c4b5fd, #f0abfc);
	}
	.look-stage[data-style='risograph'] {
		background-color: #ecdcbe;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='90' height='90'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E");
		background-size: 90px 90px;
		background-blend-mode: multiply;
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
		.look-stage,
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

	/* FAQ rides the default --night page ground (last of the alternating dark bands) — no
	   inversion, the semantic tokens stay dark and the .wire-inner --night shows through. */

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
	/* Answer expand/collapse — height 0↔auto (needs interpolate-size on .wire) plus a fade,
	   on the §4 rotator's ease-in-out-quart so open/close matches the page's motion. The
	   discrete content-visibility toggle rides the same curve so the close animates too.
	   Browsers without ::details-content just snap (the prior native behaviour). */
	.faq::details-content {
		height: 0;
		overflow: hidden;
		opacity: 0;
		transition:
			height 350ms cubic-bezier(0.76, 0, 0.24, 1),
			opacity 350ms cubic-bezier(0.76, 0, 0.24, 1),
			content-visibility 350ms;
		transition-behavior: allow-discrete;
	}
	.faq[open]::details-content {
		height: auto;
		opacity: 1;
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
		/* Same ease/duration as the answer expand so the chevron turns in sync. */
		transition: transform 350ms cubic-bezier(0.76, 0, 0.24, 1);
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
		.faq-icon::before,
		.faq::details-content {
			transition: none;
		}
	}

	/* ── Footer (full-bleed reveal layer) ─────────────────────────────
	   The footer sits behind .wire-inner and is uncovered as the page scrolls
	   off it (desktop only; see the ≥768 block). The warm glow is the "Sign-off
	   band" radial bloom copied verbatim from the Aronia board (node 6U-0): a
	   lower-right ellipse interpolated in oklab, so it "fills in" as more of the
	   footer is revealed. Values are 1:1 with Paper — do not hand-tune. Uses the
	   "new sweep 1" variant: saturated RUST peak that stays warm all the way down (no
	   near-black tail — the whole band glows rust). */
	.site-footer {
		background: radial-gradient(
			ellipse 145% 155% at 82% 128% in oklab,
			oklab(65.9% 0.136 0.114) 0%,
			oklab(47.3% 0.098 0.082) 20.21%,
			oklab(48% 0.105 0.088) 35.39%,
			oklab(34.6% 0.102 0.057) 53.7%,
			oklab(28.1% 0.086 0.048) 72%,
			var(--footer-peek) 100%
		);
	}
	.site-footer-inner {
		position: relative;
		max-width: 1080px;
		margin: 0 auto;
		padding: var(--u8) var(--u3);
		display: flex;
		flex-direction: column;
		/* Pin the footer to a full viewport and center the content block vertically within it
		   (border-box, so this is exactly the height including padding). 100dvh tracks the
		   *visible* viewport, so mobile address-bar chrome doesn't push content under the
		   toolbar. min-height — not height — so it still grows if content ever exceeds it;
		   internal spacing (padding + child margins) is untouched. */
		min-height: 100dvh;
		justify-content: center;
	}
	/* Sign-off — the page's one final CTA, sitting over the section glow. */
	.signoff {
		max-width: none;
	}
	/* Gap down from the headline to the button is the standard headline→body u3. */
	.signoff .display-sm {
		margin-bottom: var(--u3);
	}
	/* Cycling key word. Every word shares one grid cell, so the slot is always as wide as the
	   longest — the sentence never re-wraps as the word changes (short words leave invisible
	   trailing space). The current word fades in over the rest; CSS opacity, so no intro fade
	   on first paint and nothing to animate under reduced motion. */
	.flip {
		display: inline-grid;
		vertical-align: baseline;
	}
	.flip-word {
		grid-area: 1 / 1;
		white-space: nowrap;
		opacity: 0;
		transition: opacity 320ms cubic-bezier(0.76, 0, 0.24, 1);
	}
	.flip-word.on {
		opacity: 1;
	}
	.flip-sr {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		padding: 0;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
	/* Footer body — brand block + the single outbound link (GitHub). u8 gap above it
	   is the single source of truth (no desktop override), matching the page-wide u8. */
	.foot-body {
		display: flex;
		flex-direction: column;
		gap: var(--u4);
		margin-top: var(--u8);
	}
	.foot-brand {
		max-width: 42ch;
	}
	/* Footer body/legal text sits on the gradient's lighter bands, so it's night (not the
	   dark-section --ink ramp) to stay legible there; hovers lift to the berry accent (cream
	   would disappear on a light band). */
	.foot-tagline {
		margin: var(--u1) 0 0;
		font-size: var(--fs-small);
		line-height: var(--lh-small);
		color: var(--night);
	}
	.foot-gh {
		display: inline-flex;
		flex: none;
		color: var(--night);
		transition: color 200ms ease;
	}
	.foot-gh:hover {
		color: var(--berry);
	}

	/* Legal — attribution + colophon on a hairline. u8 gap above it is the single
	   source of truth (no desktop override), matching the page-wide u8. */
	.foot-legal {
		display: flex;
		flex-direction: column;
		gap: var(--u1);
		margin-top: var(--u8);
		padding-top: var(--u4);
		border-top: 1px solid var(--night);
	}
	.foot-legal span {
		font-size: var(--fs-small);
		line-height: var(--lh-small);
		color: var(--night);
	}
	.foot-legal a {
		color: inherit;
		text-decoration: underline;
		text-underline-offset: 2px;
	}
	/* GitHub icon + attribution grouped on the left so space-between keeps them
	   together against the colophon, and the icon sits centered on the text line. */
	.foot-legal-left {
		display: flex;
		align-items: center;
		gap: var(--u2);
	}
	.foot-legal-left .foot-gh {
		text-decoration: none;
	}
	.foot-legal a:hover {
		color: var(--berry);
	}

	/* ── Wider-screen enhancement (mobile-first base is above) ─────────
	   The page is authored mobile-first: every base rule is the phone layout, and
	   this layer ADDS the wide arrangement at the 768 portrait-tablet seam — rows go
	   side-by-side, §2 splits, type steps up. New seams get earned per-section as
	   content strains, not declared up front. */
	@media (min-width: 768px) {
		.beat {
			padding: var(--u15) var(--u4);
		}
		/* Framed §4: the edge rules ride the 1080 content-column guide; the inner content gets
		   the wider gutter here while the step dividers keep spanning the full framed width. */
		.how > .col,
		.step {
			padding-inline: var(--u4);
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

		/* §2 mirror: give the mock more room, reveal the centre nav links, and let the
		   generic hero headline grow into the larger frame — still Inter/slate/rounded. */
		.mockup-app {
			padding: 28px 32px 40px;
		}
		.mock-links {
			display: inline-flex;
		}
		.mock-hero {
			padding: 40px 8px 48px;
		}
		.mock-title {
			font-size: 40px;
		}
		.mock-sub {
			font-size: 16px;
			margin-bottom: 24px;
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

		/* §3 Proof — the four screens stay STACKED one-per-row at desktop too (not 2×2):
		   full-width on the 1080 content grid keeps each screen large enough to read the
		   riso detail that does the convincing (mono tags, duotone, the glitch wordmark),
		   reading like a scroll-through of one coherent app. The cost is a tall section. */
		.screens {
			gap: var(--u6);
		}

		/* ── Footer reveal ────────────────────────────────────────────
		   The footer is a FIXED 70vh band pinned to the bottom, behind the opaque
		   .wire-inner (z-index 1 vs 0). .wire-inner reserves a matching 70vh of scroll
		   space, so scrolling the end slides the page up and off the footer to uncover
		   it — 70% of a viewport of travel, not a whole one. Fixed is viewport-relative,
		   which is what we want inside .wire's own scroll container; vh tracks resizes. */
		.wire {
			/* The reveal runway (.wire-inner margin-bottom below) must equal the footer's
			   rendered height, so the page scrolls off it exactly. The footer is pinned to 100dvh,
			   measured at runtime and published here by use:footerReveal; this is only the
			   pre-hydration fallback (≈ the pinned height). */
			--footer-reveal: 100dvh;
		}
		.wire-inner {
			margin-bottom: var(--footer-reveal);
			/* Rounded lifted edge: round the bottom corners of the opaque page layer so
			   it reads as a panel peeling up off the footer as it scrolls. overflow:clip
			   trims the children to the rounded box so the FAQ's full-bleed navy (a
			   box-shadow with square corners) can't fill the corner notch back in — the
			   warm footer shows through the round instead. */
			border-bottom-left-radius: var(--u2);
			border-bottom-right-radius: var(--u2);
			overflow: clip;
		}
		.site-footer {
			position: fixed;
			inset: auto 0 0 0;
			z-index: 0;
		}
		.site-footer-inner {
			padding-block: var(--u8);
			padding-inline: var(--u4);
		}
		/* The two footer blocks stagger like a section header: the sign-off keeps its
		   natural width on the left guide, the brand pins to the right guide (right
		   half, pushed right), with u6 between them — matching the brand→legal gap. */
		.foot-body {
			width: 50%;
			margin-left: auto;
		}
		/* Brand hugs the tagline's width and pins to the right guide (align-self), so
		   its right edge snaps to the guide while the wordmark left-aligns to the
		   tagline's start below it. */
		.foot-brand {
			align-self: flex-end;
			text-align: left;
		}
		/* Legal hairline goes to a row here; the u8 gap above it comes from the base
		   rule (single source), since the band hugs content with no free space to absorb. */
		.foot-legal {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			gap: var(--u4);
		}
	}
</style>
