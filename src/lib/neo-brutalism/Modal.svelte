<script module lang="ts">
	// Stable unique id per instance for aria-labelledby wiring.
	let uid = 0;
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../styles/neo-brutalism.css';

	// Built on the native <dialog> + showModal(): top-layer rendering (no z-index or
	// portal), a real focus trap, Esc-to-close, focus restored to the trigger, and a
	// ::backdrop — all for free. We add the NB skin, body scroll-lock, backdrop-click
	// dismissal, and an `open`/`onClose` controlled API on top.
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
	const headerId = `nb-modal-${uid++}`;

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
	// Native Esc fires `cancel`; we drive the close ourselves (so onClose fires and
	// bound `open` stays in sync), and block it entirely when not dismissible.
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
	class="nb-modal"
	data-has-header={!!header}
	aria-labelledby={header ? headerId : undefined}
	oncancel={onCancel}
	onclick={onDialogClick}
>
	<button type="button" class="nb-modal__close" aria-label="Close" onclick={dismiss}>
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
		<div class="nb-modal__header" id={headerId}>{@render header()}</div>
	{/if}
	<div class="nb-modal__body">{@render children?.()}</div>
	{#if footer}
		<div class="nb-modal__footer">{@render footer()}</div>
	{/if}
</dialog>

<style>
	.nb-modal {
		padding: 0;
		border: var(--nb-border);
		border-radius: var(--nb-radius);
		background: var(--nb-paper);
		color: var(--nb-ink);
		box-shadow: var(--nb-shadow-lg);
		width: 100%;
		max-width: min(92vw, 32rem);
		font-family: var(--nb-font);
	}
	/* Flat wash, no blur — that's not NB. */
	.nb-modal::backdrop {
		background: var(--nb-backdrop);
	}

	.nb-modal__close {
		position: absolute;
		top: 0.6rem;
		right: 0.6rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		padding: 0;
		background: transparent;
		border: none;
		color: var(--nb-ink);
		cursor: pointer;
	}
	/* Extend the click target to 40×40 without enlarging the visible button. */
	.nb-modal__close::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 40px;
		height: 40px;
		transform: translate(-50%, -50%);
	}
	.nb-modal__close svg {
		width: 18px;
		height: 18px;
	}
	.nb-modal__close:hover {
		background: var(--nb-muted);
	}

	.nb-modal__header {
		padding: 1.25rem 3rem 1.25rem 1.5rem; /* right room for the close button */
		border-bottom: var(--nb-border);
		font-size: var(--nb-size-title);
		font-weight: var(--nb-font-weight);
	}
	.nb-modal__body {
		padding: 1.5rem;
		font-weight: var(--nb-font-weight-regular);
		line-height: 1.5;
	}
	/* With no header, the close button floats over the body's top-right — give the
	   body top clearance so its first line drops below the button. */
	.nb-modal[data-has-header='false'] .nb-modal__body {
		padding-top: 3rem;
	}
	.nb-modal__footer {
		padding: 1.25rem 1.5rem;
		border-top: var(--nb-border);
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
	}
</style>
