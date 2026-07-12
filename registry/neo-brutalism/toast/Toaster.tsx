// Neo-Brutalism — Toaster (React, Layer 3). Mount this ONCE at your app root; it
// renders whatever `toast()` has pushed, bottom-right, each reusing the Alert skin.
// Reads the store via useSyncExternalStore. See DESIGN.md, Entries 31–33.
import { useSyncExternalStore } from 'react';
import { Alert } from './Alert';
import { subscribe, getToasts, dismiss } from './toast';
import './tokens.css';
import './toast.css';

export function Toaster() {
	const toasts = useSyncExternalStore(subscribe, getToasts, getToasts);

	return (
		<div className="nb-toaster" role="region" aria-label="Notifications">
			{toasts.map((t) => (
				<div key={t.id} className="nb-toast">
					<Alert variant={t.variant} size="sm">
						{t.message}
					</Alert>
					<button
						type="button"
						className="nb-toast__close"
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
