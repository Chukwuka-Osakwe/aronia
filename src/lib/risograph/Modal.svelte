<script module lang="ts">
	// Stable unique id per instance for aria-labelledby wiring.
	let uid = 0;
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../styles/riso.css';
	import './css/modal.css';

	// Built on the native <dialog> + showModal(): top-layer rendering (no z-index or
	// portal), a real focus trap, Esc-to-close, focus restored to the trigger, and a
	// ::backdrop — all for free. We add the Riso skin (zero elevation — separation
	// via the plum backdrop dim + the printed masthead header), body scroll-lock,
	// backdrop-click dismissal, and an `open`/`onClose` controlled API on top.
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
	const headerId = `riso-modal-${uid++}`;

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
	class="riso-modal"
	data-has-header={!!header}
	aria-labelledby={header ? headerId : undefined}
	oncancel={onCancel}
	onclick={onDialogClick}
>
	<button type="button" class="riso-modal__close" aria-label="Close" onclick={dismiss}>
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
		<div class="riso-modal__header" id={headerId}>{@render header()}</div>
	{/if}
	<div class="riso-modal__body">{@render children?.()}</div>
	{#if footer}
		<div class="riso-modal__footer">{@render footer()}</div>
	{/if}
</dialog>
