// Risograph — Badge (React skin, Layer 3). Prop → data-attribute mapper; all
// styling lives in the co-located CSS. A small uppercase Space Mono print label.
import type { HTMLAttributes, ReactNode } from 'react';
import './tokens.css';
import './badge.css';

export type BadgeVariant = 'neutral' | 'solid' | 'muted' | 'accent';
export type BadgeShape = 'square' | 'pill';

type Props = { variant?: BadgeVariant; shape?: BadgeShape; children?: ReactNode } & HTMLAttributes<HTMLSpanElement>;

export function Badge({ variant = 'neutral', shape = 'square', children, ...rest }: Props) {
	return (
		<span className="riso-badge" data-variant={variant} data-shape={shape} {...rest}>
			{children}
		</span>
	);
}

export default Badge;
