<script lang="ts">
	// Kitchen sink: every component used with real, typed props. Beyond being a
	// handy overview, this page is the type-checked-usage guard from DESIGN.md
	// Entry 5 — `npm run check` fails here if a prop is renamed or removed.
	import { neoBrutalism } from '$lib/index.js';
	const { Button, Card, Badge, Input, Toggle } = neoBrutalism;

	let name = $state('');
	let notifications = $state(true);
	let darkMode = $state(false);
</script>

<h1 class="ks-title">Kitchen sink</h1>

<section>
	<h2>Button</h2>
	<div class="row">
		<Button variant="primary">Primary</Button>
		<Button variant="secondary">Secondary</Button>
		<Button variant="muted">Muted</Button>
		<Button variant="ghost">Ghost</Button>
		<Button size="xs">XS</Button>
		<Button size="lg">LG</Button>
		<Button shape="pill">Pill</Button>
		<Button>
			{#snippet icon()}→{/snippet}
			Next
		</Button>
		<Button disabled>Disabled</Button>
		<Button href="https://svelte.dev" target="_blank" rel="noreferrer">As link</Button>
	</div>
</section>

<section>
	<h2>Badge</h2>
	<div class="row">
		<Badge variant="primary">New</Badge>
		<Badge variant="secondary">Beta</Badge>
		<Badge variant="muted">Draft</Badge>
		<Badge variant="accent">Hot</Badge>
	</div>
</section>

<section>
	<h2>Input</h2>
	<div class="row">
		<Input bind:value={name} placeholder="Type your name…" />
		<Input size="sm" placeholder="Small" />
		<Input size="lg" placeholder="Large" />
		<Input placeholder="Disabled" disabled />
	</div>
	<p class="readout">value: <code>{name || '—'}</code></p>
</section>

<section>
	<h2>Toggle</h2>
	<div class="row">
		<Toggle bind:checked={notifications} label="Notifications" />
		<Toggle bind:checked={darkMode} label="Dark mode" />
		<Toggle checked disabled label="Locked on" />
	</div>
	<p class="readout">notifications: <code>{notifications}</code> · darkMode: <code>{darkMode}</code></p>
</section>

<section>
	<h2>Card</h2>
	<div class="card-grid">
		<Card>
			{#snippet header()}Basic card{/snippet}
			A plain paper card with a header and footer separated by hard rules.
			{#snippet footer()}
				<Button size="sm">Action</Button>
			{/snippet}
		</Card>
		<Card variant="primary">
			{#snippet header()}
				Featured <Badge variant="accent">Hot</Badge>
			{/snippet}
			Cards take a variant for the background, so they compose with the rest of the family.
			{#snippet footer()}
				<Button size="sm" variant="muted">Dismiss</Button>
			{/snippet}
		</Card>
		<Card variant="muted">A card with a body only — no header or footer regions rendered.</Card>
	</div>
</section>

<style>
	.ks-title {
		font-size: 2.5rem;
		font-weight: 800;
		margin: 0 0 1rem;
	}
	section {
		margin-top: 2.5rem;
	}
	h2 {
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		border-bottom: 2px solid #111;
		padding-bottom: 0.4rem;
		margin-bottom: 1.25rem;
	}
	.row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem;
	}
	.readout {
		margin-top: 1rem;
		font-size: 0.875rem;
		opacity: 0.75;
	}
	.readout code {
		background: #fff;
		border: 2px solid #111;
		padding: 0.05rem 0.35rem;
	}
	.card-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: 1.5rem;
		align-items: start;
	}
</style>
