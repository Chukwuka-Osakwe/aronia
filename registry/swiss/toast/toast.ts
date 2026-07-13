// Swiss — toast store (React, Layer 3). A tiny framework-agnostic pub/sub:
// `toast()` (importable anywhere, even outside React) pushes items with auto-dismiss;
// <Toaster/> subscribes via useSyncExternalStore. Mirrors the Svelte module-level
// store — same imperative API.
import type { AlertVariant } from './Alert';

export interface ToastItem {
	id: number;
	message: string;
	variant: AlertVariant;
	duration: number;
}

let items: ToastItem[] = [];
const listeners = new Set<() => void>();
let nextId = 0;
const timers = new Map<number, ReturnType<typeof setTimeout>>();

// New array reference on every change so useSyncExternalStore sees an update.
function emit() {
	items = items.slice();
	listeners.forEach((l) => l());
}

export function subscribe(listener: () => void): () => void {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}

export function getToasts(): ToastItem[] {
	return items;
}

export function dismiss(id: number): void {
	const i = items.findIndex((t) => t.id === id);
	if (i !== -1) items.splice(i, 1);
	const timer = timers.get(id);
	if (timer !== undefined) {
		clearTimeout(timer);
		timers.delete(id);
	}
	emit();
}

type ToastOptions = { variant?: AlertVariant; duration?: number };

interface ToastFn {
	(message: string, opts?: ToastOptions): number;
	success(message: string, opts?: { duration?: number }): number;
	error(message: string, opts?: { duration?: number }): number;
	warning(message: string, opts?: { duration?: number }): number;
	info(message: string, opts?: { duration?: number }): number;
}

function push(message: string, opts: ToastOptions = {}): number {
	const id = nextId++;
	const duration = opts.duration ?? 2500;
	items.push({ id, message, variant: opts.variant ?? 'info', duration });
	// duration 0 = sticky (no auto-dismiss).
	if (duration > 0) timers.set(id, setTimeout(() => dismiss(id), duration));
	emit();
	return id;
}

export const toast: ToastFn = Object.assign(push, {
	success: (m: string, o: { duration?: number } = {}) => push(m, { ...o, variant: 'success' }),
	error: (m: string, o: { duration?: number } = {}) => push(m, { ...o, variant: 'error' }),
	warning: (m: string, o: { duration?: number } = {}) => push(m, { ...o, variant: 'warning' }),
	info: (m: string, o: { duration?: number } = {}) => push(m, { ...o, variant: 'info' })
});
