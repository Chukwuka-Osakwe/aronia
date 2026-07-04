<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import type { InputSize } from './options.js';
	import '../styles/neo-brutalism.css';

	// The multiline sibling of Input: same NB field language (border, hard shadow,
	// accent focus ring, shared size scale), a bindable value, and a `rows` height.
	// `size` is our own scale (not a native textarea attribute), so nothing to rename.
	type Props = {
		value?: string;
		size?: InputSize;
		rows?: number;
	} & Omit<HTMLTextareaAttributes, 'size'>;

	let { value = $bindable(''), size = 'md', rows = 4, ...rest }: Props = $props();
</script>

<textarea class="nb-textarea" data-size={size} {rows} bind:value {...rest}></textarea>

<style>
	.nb-textarea {
		display: block;
		width: 100%;
		font-family: var(--nb-font);
		font-weight: var(--nb-font-weight-medium);
		line-height: 1.5;
		color: var(--nb-ink);
		background: var(--nb-paper);
		border: var(--nb-border);
		border-radius: var(--nb-radius);
		box-shadow: var(--nb-shadow);
		transition: var(--nb-transition);
		/* Only vertical resize: horizontal resize would break the hard-shadow box. */
		resize: vertical;
	}
	.nb-textarea::placeholder {
		color: var(--nb-ink);
		opacity: 0.4;
	}

	/* Focus keeps the box still (no shove) but pops an accent shadow, exactly like
	   Input. Mirrored by [data-state='focus'] so the docs can force it. */
	.nb-textarea:focus,
	.nb-textarea[data-state='focus'] {
		outline: none;
		box-shadow: var(--nb-shadow), 0 0 0 3px var(--nb-accent);
	}

	/* Disabled — inert greyed field (matches Input). */
	.nb-textarea:disabled {
		background: var(--nb-muted);
		opacity: 0.6;
		cursor: not-allowed;
	}

	.nb-textarea[data-size='sm'] {
		font-size: var(--nb-size-sm-text);
		padding: var(--nb-size-sm-pad);
	}
	.nb-textarea[data-size='md'] {
		font-size: var(--nb-size-md-text);
		padding: var(--nb-size-md-pad);
	}
	.nb-textarea[data-size='lg'] {
		font-size: var(--nb-size-lg-text);
		padding: var(--nb-size-lg-pad);
	}
</style>
