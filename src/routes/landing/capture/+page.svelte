<script lang="ts">
	// Hero-slide CAPTURE sheet. Each tile is one slide's full composition — the world panel
	// with the device floating inside — rendered at the EXACT size it occupies in the hero
	// marquee. Screenshot each tile (a retina grab gives a 2× asset), save as the named WebP
	// in static/landing/hero/, and the marquee swaps its live components for those <img>s.
	// This bakes the glass backdrop-filter into flat pixels, which is the whole point: flat
	// images animate with none of the live compositing glitches.
	import RisoPhone from '../slides/RisoPhone.svelte';
	import NeoWindow from '../slides/NeoWindow.svelte';
	import GlassTablet from '../slides/GlassTablet.svelte';
	import SwissPhone from '../slides/SwissPhone.svelte';
	import SpindleWindow from '../slides/SpindleWindow.svelte';
	import DropTablet from '../slides/DropTablet.svelte';
	import HaloPhone from '../slides/HaloPhone.svelte';
	import DepartWindow from '../slides/DepartWindow.svelte';
</script>

<div class="sheet">
	<p class="note">
		Hero-slide capture. Screenshot each tile exactly (⌘⇧4, or ⌘⇧4 then space to grab the
		tile), save as <code>static/landing/hero/&lt;name&gt;.webp</code>. Each tile is the exact
		marquee panel size — a retina screenshot is a 2× asset. The label is not part of the shot.
	</p>

	<figure class="cap">
		<div class="cap-tile" data-style="risograph">
			<div class="cap-mock phone"><RisoPhone theme="light" /></div>
		</div>
		<figcaption>riso.webp — 600 × 600</figcaption>
	</figure>

	<figure class="cap">
		<div class="cap-tile" data-style="neo-brutalism">
			<div class="cap-mock"><NeoWindow /></div>
		</div>
		<figcaption>neo.webp — 780 × 600</figcaption>
	</figure>

	<figure class="cap">
		<div class="cap-tile" data-style="glassmorphism">
			<div class="cap-mock glass"><GlassTablet /></div>
		</div>
		<figcaption>glass.webp — 900 × 600</figcaption>
	</figure>

	<figure class="cap">
		<div class="cap-tile" data-style="swiss">
			<div class="cap-mock phone"><SwissPhone theme="light" /></div>
		</div>
		<figcaption>swiss.webp — 600 × 600</figcaption>
	</figure>

	<figure class="cap">
		<div class="cap-tile" data-style="spindle">
			<div class="cap-mock"><SpindleWindow /></div>
		</div>
		<figcaption>spindle.webp — 780 × 600 (Riso · dark · desktop)</figcaption>
	</figure>

	<figure class="cap">
		<div class="cap-tile" data-style="drop">
			<div class="cap-mock"><DropTablet /></div>
		</div>
		<figcaption>drop.webp — 900 × 600 (Neo · light · tablet)</figcaption>
	</figure>

	<figure class="cap">
		<div class="cap-tile" data-style="halo">
			<div class="cap-mock phone"><HaloPhone /></div>
		</div>
		<figcaption>halo.webp — 600 × 600 (Glass · light · mobile)</figcaption>
	</figure>

	<figure class="cap">
		<div class="cap-tile" data-style="depart">
			<div class="cap-mock"><DepartWindow /></div>
		</div>
		<figcaption>depart.webp — 780 × 600 (Swiss · dark · desktop)</figcaption>
	</figure>
</div>

<style>
	.sheet {
		height: 100vh;
		overflow-y: auto;
		background: #1c1c20;
		padding: 3rem clamp(1.5rem, 4vw, 4rem) 6rem;
		font-family: system-ui, sans-serif;
	}
	.note {
		max-width: 920px;
		margin: 0 auto 2.5rem;
		color: #b7b8be;
		font-size: 0.9rem;
		line-height: 1.5;
	}
	.note code {
		font-family: ui-monospace, monospace;
		color: #e4e4e8;
	}
	.cap {
		margin: 0 auto 3rem;
		width: fit-content;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	figcaption {
		font-family: ui-monospace, monospace;
		color: #d8d9dd;
		font-size: 0.8rem;
	}

	/* The capture target: exact marquee panel size, world baked in, device floating inside.
	   An OUTSIDE outline marks the crop edge without adding to the box. */
	.cap-tile {
		display: grid;
		place-items: center;
		height: 600px;
		overflow: hidden;
		outline: 1px dashed rgba(255, 255, 255, 0.25);
		outline-offset: 2px;
	}
	.cap-tile[data-style='risograph'] {
		width: 600px;
		background: #e7dbc2;
	}
	.cap-tile[data-style='neo-brutalism'] {
		width: 780px;
		background-color: #ffe600;
		background-image: radial-gradient(circle, rgba(17, 17, 17, 0.16) 1.6px, transparent 1.7px);
		background-size: 22px 22px;
	}
	.cap-tile[data-style='glassmorphism'] {
		width: 900px;
		background:
			radial-gradient(120% 120% at 15% 8%, #2a1a5c 0%, transparent 55%),
			radial-gradient(120% 120% at 88% 92%, #4a1248 0%, transparent 55%),
			linear-gradient(135deg, #171433, #0f1130);
	}
	.cap-tile[data-style='swiss'] {
		width: 600px;
		background:
			repeating-linear-gradient(to right, rgba(20, 20, 20, 0.05) 0 1px, transparent 1px 48px),
			#ffffff;
	}
	/* Riso dark world — a deep plum-black the plum-stock window lifts off of. */
	.cap-tile[data-style='spindle'] {
		width: 780px;
		background:
			radial-gradient(130% 120% at 18% 0%, #2a2140 0%, transparent 60%),
			#140f1c;
	}
	/* Neo light world — a bold flat cyan + black dot-grid (a different neo accent than Tally's
	   yellow, so the two neo slides read distinct). */
	.cap-tile[data-style='drop'] {
		width: 900px;
		background-color: #4dabf7;
		background-image: radial-gradient(circle, rgba(17, 17, 17, 0.18) 1.6px, transparent 1.7px);
		background-size: 22px 22px;
	}
	/* Glass light world — a bright airy gradient for the frost to refract. */
	.cap-tile[data-style='halo'] {
		width: 600px;
		background: linear-gradient(135deg, #e0c3fc, #8ec5fc);
	}
	/* Swiss dark world — a deeper off-black than the window stock + a faint signage grid. */
	.cap-tile[data-style='depart'] {
		width: 780px;
		background-color: #0e0e10;
		background-image: repeating-linear-gradient(to right, rgba(255, 255, 255, 0.04) 0 1px, transparent 1px 48px);
	}

	/* Same per-device scales as the marquee so the capture == the final panel appearance. */
	.cap-mock {
		zoom: 0.64;
	}
	.cap-mock.glass {
		zoom: 0.78;
	}
	.cap-mock.phone {
		zoom: 0.64;
	}
</style>
