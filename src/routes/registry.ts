import type { Component } from 'svelte';
import { neoBrutalism, glassmorphism, swiss } from '$lib/index.js';
import type { AlertVariant } from '$lib/neo-brutalism/options.js';

// Maps manifest ids → the actual Svelte components. Kept OUT of the manifest so
// the manifest module stays Svelte-free / portable (it can be imported by plain
// Node, serialized to JSON, etc.). Importing every component here also means
// renaming or removing one breaks the build — a free structural guard.
export const registry: Record<string, Record<string, Component<any>>> = {
	'neo-brutalism': {
		button: neoBrutalism.Button,
		link: neoBrutalism.Link,
		card: neoBrutalism.Card,
		badge: neoBrutalism.Badge,
		input: neoBrutalism.Input,
		textarea: neoBrutalism.Textarea,
		toggle: neoBrutalism.Toggle,
		checkbox: neoBrutalism.Checkbox,
		'radio-group': neoBrutalism.RadioGroup,
		select: neoBrutalism.Select,
		field: neoBrutalism.Field,
		modal: neoBrutalism.Modal,
		alert: neoBrutalism.Alert,
		tabs: neoBrutalism.Tabs,
		accordion: neoBrutalism.Accordion,
		spinner: neoBrutalism.Spinner,
		progress: neoBrutalism.Progress,
		skeleton: neoBrutalism.Skeleton,
		'dropdown-menu': neoBrutalism.DropdownMenu,
		// The Toaster host stands in for `toast` — the docs never render it inline
		// (Preview skips the instance for action-triggers); the app root mounts it.
		toast: neoBrutalism.Toaster
	},
	glassmorphism: {
		button: glassmorphism.Button,
		link: glassmorphism.Link,
		card: glassmorphism.Card,
		badge: glassmorphism.Badge,
		input: glassmorphism.Input,
		alert: glassmorphism.Alert,
		textarea: glassmorphism.Textarea,
		toggle: glassmorphism.Toggle,
		checkbox: glassmorphism.Checkbox,
		select: glassmorphism.Select,
		field: glassmorphism.Field,
		modal: glassmorphism.Modal,
		tabs: glassmorphism.Tabs,
		accordion: glassmorphism.Accordion,
		spinner: glassmorphism.Spinner,
		progress: glassmorphism.Progress,
		skeleton: glassmorphism.Skeleton,
		'radio-group': glassmorphism.RadioGroup,
		'dropdown-menu': glassmorphism.DropdownMenu,
		// Toaster host stands in for `toast` (imperative — Preview skips the inline
		// instance and fires the action instead; the app root mounts it).
		toast: glassmorphism.Toaster
	},
	// Swiss family — vertical slice so far (Button + Link).
	swiss: {
		button: swiss.Button,
		link: swiss.Link
	}
};

// Some components aren't rendered with props but fired imperatively (Toast). Their
// stage trigger runs an action instead of toggling an `open` prop; the action lives
// here (style-specific), keyed the same way as the component registry.
export const triggerActions: Record<
	string,
	Record<string, (a: { message?: string; variant?: string; duration?: number }) => void>
> = {
	'neo-brutalism': {
		toast: (a) =>
			neoBrutalism.toast(a.message || 'Notification', {
				variant: a.variant as AlertVariant,
				duration:
					typeof a.duration === 'number' && Number.isFinite(a.duration) ? a.duration : undefined
			})
	},
	glassmorphism: {
		toast: (a) =>
			glassmorphism.toast(a.message || 'Notification', {
				variant: a.variant as AlertVariant,
				duration:
					typeof a.duration === 'number' && Number.isFinite(a.duration) ? a.duration : undefined
			})
	}
};
