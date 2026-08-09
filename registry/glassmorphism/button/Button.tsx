// Glassmorphism — Button (React skin, Layer 3)
//
// A thin mapper: props → `data-*` attributes on `.glass-btn`. All the styling
// lives in the co-located CSS (button.css + tokens.css) — this file only wires
// props to attributes, so it reads as the worked example an agent imitates when
// generating new components in the same language. See DESIGN.md, Entries 31–32.
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import './tokens.css';
import './button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'muted' | 'ghost';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';
export type ButtonShape = 'square' | 'pill';

type BaseProps = {
	variant?: ButtonVariant;
	size?: ButtonSize;
	shape?: ButtonShape;
	disabled?: boolean;
	/** Pass an href to render an <a>, otherwise a <button>. */
	href?: string;
	/** Optional leading icon. */
	icon?: ReactNode;
	children?: ReactNode;
};

// Rest props are forwarded to whichever element we render.
type Props = BaseProps &
	Omit<ButtonHTMLAttributes<HTMLButtonElement> & AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

export function Button({
	variant = 'primary',
	size = 'md',
	shape = 'square',
	disabled = false,
	href,
	icon,
	children,
	...rest
}: Props) {
	const content = (
		<>
			{icon ? <span className="glass-btn__icon">{icon}</span> : null}
			{children ? <span className="glass-btn__label">{children}</span> : null}
		</>
	);

	// Polymorphic: an href (when not disabled) renders a link, else a button.
	const asLink = href !== undefined && !disabled;

	if (asLink) {
		return (
			<a
				className="glass-btn"
				data-variant={variant}
				data-size={size}
				data-shape={shape}
				href={href}
				{...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
			>
				{content}
			</a>
		);
	}

	return (
		<button
			className="glass-btn"
			data-variant={variant}
			data-size={size}
			data-shape={shape}
			disabled={disabled}
			{...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
		>
			{content}
		</button>
	);
}

export default Button;
