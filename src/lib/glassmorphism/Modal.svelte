<script module lang="ts">
	// Stable unique id per instance for aria-labelledby wiring.
	let uid = 0;
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../styles/glassmorphism.css';

	// Built on the native <dialog> + showModal(): top-layer rendering, a real focus
	// trap, Esc-to-close, focus restored to the trigger, and a ::backdrop — all free.
	// We add the frosted-glass skin (the panel AND the backdrop blur the page behind),
	// body scroll-lock, backdrop-click dismissal, and an `open`/`onClose` API.
	type Props = {
		open?: boolean;
		/** Fires when the user dismisses (Esc, backdrop, or the × button). */
		onClose?: () => void;
		/** Whether Esc / backdrop-click dismiss the modal. */
		dismissible?: boolean;
		header?: Snippet;
		children?: Snippet;
		footer?: Snippet;
	};

	let {
		open = $bindable(false),
		onClose,
		dismissible = true,
		header,
		children,
		footer
	}: Props = $props();

	let dialog = $state<HTMLDialogElement>();
	const headerId = `glass-modal-${uid++}`;

	// Drive the native modal state from `open`.
	$effect(() => {
		const el = dialog;
		if (!el) return;
		if (open && !el.open) el.showModal();
		else if (!open && el.open) el.close();
	});

	// Lock background scroll while open; restore on close/teardown.
	$effect(() => {
		if (!open) return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = prev;
		};
	});

	function dismiss() {
		open = false;
		onClose?.();
	}
	// Native Esc fires `cancel`; we drive close ourselves (so onClose fires + bound
	// `open` stays in sync), and block it entirely when not dismissible.
	function onCancel(e: Event) {
		e.preventDefault();
		if (dismissible) dismiss();
	}
	// A click whose target is the <dialog> itself (not its contents) is the backdrop.
	function onDialogClick(e: MouseEvent) {
		if (dismissible && e.target === dialog) dismiss();
	}
</script>

<dialog
	bind:this={dialog}
	class="glass-modal"
	data-has-header={!!header}
	aria-labelledby={header ? headerId : undefined}
	oncancel={onCancel}
	onclick={onDialogClick}
>
	<button type="button" class="glass-modal__close" aria-label="Close" onclick={dismiss}>
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="3"
			stroke-linecap="round"
			aria-hidden="true"
		>
			<line x1="6" y1="6" x2="18" y2="18" />
			<line x1="18" y1="6" x2="6" y2="18" />
		</svg>
	</button>
	{#if header}
		<div class="glass-modal__header" id={headerId}>{@render header()}</div>
	{/if}
	<div class="glass-modal__body">{@render children?.()}</div>
	{#if footer}
		<div class="glass-modal__footer">{@render footer()}</div>
	{/if}
</dialog>

<style>
	.glass-modal {
		padding: 0;
		border: var(--glass-border);
		border-radius: var(--glass-radius);
		/* A more-solid frosted surface than the surfaces elsewhere — it carries body
		   text over an unknown page, so it leans opaque for reliable AA contrast. */
		background: rgba(255, 255, 255, 0.82);
		-webkit-backdrop-filter: blur(calc(var(--glass-blur) * 1.4));
		backdrop-filter: blur(calc(var(--glass-blur) * 1.4));
		color: var(--glass-ink);
		box-shadow: var(--glass-shadow-lg), var(--glass-highlight);
		width: 100%;
		max-width: min(92vw, 32rem);
		font-family: var(--glass-font);
		/* Entry/exit: fade + scale in (same treatment as the Dropdown). overlay +
		   display (allow-discrete) keep the dialog in the top layer through its exit,
		   so it animates OUT. Progressive enhancement — older browsers just snap. */
		opacity: 0;
		transform: translateY(8px) scale(0.97);
		transition:
			opacity 200ms ease,
			transform 200ms cubic-bezier(0.2, 0, 0, 1),
			overlay 200ms allow-discrete,
			display 200ms allow-discrete;
	}
	.glass-modal[open] {
		opacity: 1;
		transform: translateY(0) scale(1);
	}
	@starting-style {
		.glass-modal[open] {
			opacity: 0;
			transform: translateY(8px) scale(0.97);
		}
	}
	/* Dim + blur the page behind (not a flat wash) — the glass signature; fades in
	   and out with the dialog. */
	.glass-modal::backdrop {
		background: color-mix(in srgb, var(--glass-ink) 32%, transparent);
		-webkit-backdrop-filter: blur(3px);
		backdrop-filter: blur(3px);
		opacity: 0;
		transition:
			opacity 200ms ease,
			overlay 200ms allow-discrete,
			display 200ms allow-discrete;
	}
	.glass-modal[open]::backdrop {
		opacity: 1;
	}
	@starting-style {
		.glass-modal[open]::backdrop {
			opacity: 0;
		}
	}

	.glass-modal__close {
		position: absolute;
		top: 0.7rem;
		right: 0.7rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		padding: 0;
		background: transparent;
		border: none;
		border-radius: 50%;
		color: var(--glass-ink);
		cursor: pointer;
		transition: background-color 140ms ease;
	}
	/* Extend the click target to 40×40 without enlarging the visible button. */
	.glass-modal__close::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 40px;
		height: 40px;
		transform: translate(-50%, -50%);
	}
	.glass-modal__close svg {
		width: 18px;
		height: 18px;
	}
	.glass-modal__close:hover {
		background: var(--glass-surface);
	}

	.glass-modal__header {
		padding: 1.25rem 3rem 1.25rem 1.5rem; /* right room for the close button */
		border-bottom: var(--glass-divider);
		font-size: var(--glass-size-title);
		font-weight: var(--glass-font-weight);
	}
	.glass-modal__body {
		padding: 1.5rem;
		font-weight: var(--glass-font-weight-regular);
		line-height: 1.5;
	}
	/* With no header, the close button floats over the body's top-right — give the
	   body top clearance so its first line drops below the button. */
	.glass-modal[data-has-header='false'] .glass-modal__body {
		padding-top: 3rem;
	}
	.glass-modal__footer {
		padding: 1.25rem 1.5rem;
		border-top: var(--glass-divider);
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
	}

	/* Snap open/closed — no fade or scale. */
	@media (prefers-reduced-motion: reduce) {
		.glass-modal,
		.glass-modal[open],
		.glass-modal::backdrop {
			transition: none;
			transform: none;
		}
	}
</style>
