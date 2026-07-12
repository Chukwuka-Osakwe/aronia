<script lang="ts">
	import '../styles/glassmorphism.css';
	import './css/toast.css';
	import Alert from './Alert.svelte';
	import { toasts, dismiss } from './toast.svelte.js';

	// The single host for the glass toast store. Mount once at the app root; it
	// renders whatever `toast()` has pushed into `toasts`, top-right in a fixed
	// stack. Each toast reuses <Alert> for its skin (frosted tint + icon), and
	// Alert's own role="alert"/"status" is what a screen reader announces on
	// insertion, so the stack itself is a plain region, not a second live area.
</script>

<div class="glass-toaster" role="region" aria-label="Notifications">
	{#each toasts as t (t.id)}
		<div class="glass-toast">
			<Alert variant={t.variant} size="sm">{t.message}</Alert>
			<button
				type="button"
				class="glass-toast__close"
				aria-label="Dismiss"
				onclick={() => dismiss(t.id)}
			>
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
		</div>
	{/each}
</div>
