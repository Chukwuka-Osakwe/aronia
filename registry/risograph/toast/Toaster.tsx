// Risograph — Toaster (React, Layer 3). Mount this ONCE at your app root; it
// renders whatever `toast()` has pushed, top-right, each reusing the Alert skin
// (the printed spot-ink wash — no shadow; toasts print into place). Reads the
// store via useSyncExternalStore.
import { useSyncExternalStore } from 'react';
import { Alert } from './Alert';
import { subscribe, getToasts, dismiss } from './toast';
import './tokens.css';
import './toast.css';

export function Toaster() {
	const toasts = useSyncExternalStore(subscribe, getToasts, getToasts);

	return (
		<div className="riso-toaster" role="region" aria-label="Notifications">
			{toasts.map((t) => (
				<div key={t.id} className="riso-toast">
					<Alert variant={t.variant} size="sm">
						{t.message}
					</Alert>
					<button
						type="button"
						className="riso-toast__close"
						aria-label="Dismiss"
						onClick={() => dismiss(t.id)}
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth={3}
							strokeLinecap="round"
							aria-hidden="true"
						>
							<line x1="6" y1="6" x2="18" y2="18" />
							<line x1="18" y1="6" x2="6" y2="18" />
						</svg>
					</button>
				</div>
			))}
		</div>
	);
}

export default Toaster;
