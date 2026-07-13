// Glassmorphism — Link (React skin, Layer 3). The navigate counterpart to Button.
// `inline` = text link in prose; `nav` = compact menu item that knows its active
// state; `external` adds a new-tab + ↗ affordance. See DESIGN.md, Entries 31–33.
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import './tokens.css';
import './link.css';

export type LinkVariant = 'inline' | 'nav';

type Props = {
	variant?: LinkVariant;
	/** For `nav`: marks the current page (colour + underline + aria-current). */
	active?: boolean;
	external?: boolean;
	href?: string;
	children?: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

export function Link({
	variant = 'inline',
	active = false,
	external = false,
	href,
	children,
	...rest
}: Props) {
	return (
		<a
			className="glass-link"
			data-variant={variant}
			data-active={active ? 'true' : undefined}
			aria-current={variant === 'nav' && active ? 'page' : undefined}
			href={href}
			target={external ? '_blank' : undefined}
			rel={external ? 'noopener noreferrer' : undefined}
			{...rest}
		>
			{children}
			{external ? (
				<span className="glass-link__ext" aria-hidden="true">
					↗
				</span>
			) : null}
		</a>
	);
}

export default Link;
