<script lang="ts">
	import '../styles/neo-brutalism.css';
	import Alert from './Alert.svelte';
	import { toasts, dismiss } from './toast.svelte.js';

	// The single host for the toast store. Mount once at the app root; it renders
	// whatever `toast()` has pushed into `toasts`, bottom-right in a fixed stack.
	// Each toast reuses <Alert> for its skin — same variant colours + icons — and
	// Alert's own role="alert"/"status" is what a screen reader announces on
	// insertion, so the stack itself is a plain region, not a second live area.
</script>

<div class="nb-toaster" role="region" aria-label="Notifications">
	{#each toasts as t (t.id)}
		<div class="nb-toast">
			<Alert variant={t.variant} size="sm">{t.message}</Alert>
			<button type="button" class="nb-toast__close" aria-label="Dismiss" onclick={() => dismiss(t.id)}>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true">
					<line x1="6" y1="6" x2="18" y2="18" />
					<line x1="18" y1="6" x2="6" y2="18" />
				</svg>
			</button>
		</div>
	{/each}
</div>

<style>
	.nb-toaster {
		position: fixed;
		top: 1.25rem;
		right: 1.25rem;
		z-index: 1000;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		width: min(24rem, calc(100vw - 2.5rem));
		/* Let clicks fall through the empty gaps; the toasts themselves opt back in. */
		pointer-events: none;
	}
	.nb-toast {
		position: relative;
		pointer-events: auto;
		animation: nb-toast-in 150ms ease;
	}
	/* The toast reuses <Alert>, but a toast is one line, not a paragraph. Alert
	   top-aligns its icon (right for multi-line prose); here we centre the icon with
	   the text and reserve room on the right so the message never runs under the ×. */
	.nb-toast :global(.nb-alert) {
		align-items: center;
		padding-right: 2.5rem;
	}
	.nb-toast :global(.nb-alert__icon) {
		margin-top: 0; /* the 0.1em nudge is only for flex-start alignment */
	}
	@keyframes nb-toast-in {
		from {
			opacity: 0;
			transform: translateX(0.75rem);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}
	/* Vertically centred on the toast, in the reserved right padding — aligned with
	   the (now centred) icon and message. */
	.nb-toast__close {
		position: absolute;
		top: 50%;
		right: 0.5rem;
		transform: translateY(-50%);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.5rem;
		height: 1.5rem;
		padding: 0;
		background: transparent;
		border: none;
		color: var(--nb-ink);
		cursor: pointer;
	}
	/* Extend the click target to 40×40 without enlarging the visible button. */
	.nb-toast__close::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 40px;
		height: 40px;
		transform: translate(-50%, -50%);
	}
	.nb-toast__close svg {
		width: 14px;
		height: 14px;
	}
	.nb-toast__close:hover {
		background: var(--nb-muted);
	}

	@media (prefers-reduced-motion: reduce) {
		.nb-toast {
			animation: none;
		}
	}
</style>
