// Swiss — Badge (React skin, Layer 3). Prop → data-attribute mapper; all styling
// lives in the co-located CSS. A small uppercase, letter-spaced label.
import type { HTMLAttributes, ReactNode } from 'react';
import './tokens.css';
import './badge.css';

export type BadgeVariant = 'neutral' | 'solid' | 'muted' | 'accent';

type Props = { variant?: BadgeVariant; children?: ReactNode } & HTMLAttributes<HTMLSpanElement>;

export function Badge({ variant = 'neutral', children, ...rest }: Props) {
	return (
		<span className="swiss-badge" data-variant={variant} {...rest}>
			{children}
		</span>
	);
}

export default Badge;
