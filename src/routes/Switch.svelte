<script lang="ts">
	// Docs-chrome toggle switch (neutral styling) for boolean controls in the
	// right rail. Deliberately NOT the library's Neo-Brutalism Toggle, so the docs
	// chrome stays style-agnostic. Controlled (checked down, change up via
	// callback) rather than two-way `bind:` — the parent's control state objects
	// are reassigned wholesale, which doesn't play well with `$bindable` bound to
	// a member expression. It's a real checkbox (visually hidden) in a label, so
	// it stays keyboard-accessible.
	let {
		checked = false,
		onChange
	}: { checked?: boolean; onChange?: (value: boolean) => void } = $props();
</script>

<label class="switch">
	<input type="checkbox" {checked} onchange={(e) => onChange?.(e.currentTarget.checked)} />
	<span class="track"><span class="thumb"></span></span>
</label>

<style>
	.switch {
		display: inline-flex;
		cursor: pointer;
	}
	input {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
	}
	.track {
		position: relative;
		width: 44px;
		height: 22px;
		background: var(--doc-line);
		border: 1px solid var(--doc-ink);
		border-radius: 999px;
		transition: background 120ms ease;
	}
	.thumb {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 16px;
		height: 16px;
		background: var(--doc-panel);
		border: 1px solid var(--doc-ink);
		border-radius: 50%;
		box-sizing: border-box;
		transition: transform 120ms ease;
	}
	input:checked + .track {
		background: var(--doc-ink);
	}
	input:checked + .track .thumb {
		transform: translateX(22px);
	}
	input:focus-visible + .track {
		outline: 2px solid var(--doc-ink);
		outline-offset: 2px;
	}
</style>
