// Neo-Brutalism — Alert (React skin, Layer 3). Inline status message with a
// per-variant icon; severity picks the aria role (error/warning = assertive
// `alert`, info/success = polite `status`). See DESIGN.md, Entries 31–33.
import type { ReactNode, SVGProps } from 'react';
import './tokens.css';
import './alert.css';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';
export type AlertSize = 'sm' | 'md' | 'lg';

type Props = {
	variant?: AlertVariant;
	size?: AlertSize;
	/** Optional bold heading above the message. */
	title?: string;
	children?: ReactNode;
};

function AlertIcon({ variant }: { variant: AlertVariant }) {
	const common: SVGProps<SVGSVGElement> = {
		viewBox: '0 0 24 24',
		fill: 'none',
		stroke: 'currentColor',
		strokeWidth: 2.25,
		strokeLinecap: 'round',
		strokeLinejoin: 'round',
		'aria-hidden': true
	};
	if (variant === 'success') {
		return (
			<svg {...common}>
				<circle cx="12" cy="12" r="10" />
				<polyline points="8 12 11 15 16 9" />
			</svg>
		);
	}
	if (variant === 'warning') {
		return (
			<svg {...common}>
				<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
				<line x1="12" y1="9" x2="12" y2="13" />
				<line x1="12" y1="17" x2="12.01" y2="17" />
			</svg>
		);
	}
	if (variant === 'error') {
		return (
			<svg {...common}>
				<circle cx="12" cy="12" r="10" />
				<line x1="15" y1="9" x2="9" y2="15" />
				<line x1="9" y1="9" x2="15" y2="15" />
			</svg>
		);
	}
	return (
		<svg {...common}>
			<circle cx="12" cy="12" r="10" />
			<line x1="12" y1="16" x2="12" y2="12" />
			<line x1="12" y1="8" x2="12.01" y2="8" />
		</svg>
	);
}

export function Alert({ variant = 'info', size = 'md', title, children }: Props) {
	const role = variant === 'error' || variant === 'warning' ? 'alert' : 'status';
	return (
		<div className="nb-alert" data-variant={variant} data-size={size} role={role}>
			<span className="nb-alert__icon">
				<AlertIcon variant={variant} />
			</span>
			<div className="nb-alert__content">
				{title ? <p className="nb-alert__title">{title}</p> : null}
				<div className="nb-alert__message">{children}</div>
			</div>
		</div>
	);
}

export default Alert;
