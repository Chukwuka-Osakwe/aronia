import type { AlertVariant } from './options.js';

// Toast is the batch's architectural outlier: not a component you render with
// props, but a tiny reactive store + an imperative API. `<Toaster />` (mounted
// once at the app root) renders whatever is in `toasts`; `toast()` and its
// variant helpers push into it, with auto-dismiss. The state is a module-level
// `$state` array mutated in place (push/splice), so its reference stays stable
// and importers stay reactive.

export interface ToastItem {
	id: number;
	message: string;
	variant: AlertVariant;
	duration: number;
}

export const toasts = $state<ToastItem[]>([]);

let nextId = 0;
const timers = new Map<number, ReturnType<typeof setTimeout>>();

export function dismiss(id: number): void {
	const i = toasts.findIndex((t) => t.id === id);
	if (i !== -1) toasts.splice(i, 1);
	const timer = timers.get(id);
	if (timer !== undefined) {
		clearTimeout(timer);
		timers.delete(id);
	}
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
	toasts.push({ id, message, variant: opts.variant ?? 'info', duration });
	// duration 0 = sticky (no auto-dismiss).
	if (duration > 0) timers.set(id, setTimeout(() => dismiss(id), duration));
	return id;
}

export const toast: ToastFn = Object.assign(push, {
	success: (m: string, o: { duration?: number } = {}) => push(m, { ...o, variant: 'success' }),
	error: (m: string, o: { duration?: number } = {}) => push(m, { ...o, variant: 'error' }),
	warning: (m: string, o: { duration?: number } = {}) => push(m, { ...o, variant: 'warning' }),
	info: (m: string, o: { duration?: number } = {}) => push(m, { ...o, variant: 'info' })
});
