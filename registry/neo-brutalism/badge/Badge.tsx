// Neo-Brutalism — Badge (React skin, Layer 3). Prop → data-attribute mapper; all
// styling lives in the co-located CSS. See DESIGN.md, Entries 31–33.
import type { HTMLAttributes, ReactNode } from 'react';
import './tokens.css';
import './badge.css';

export type BadgeVariant = 'primary' | 'secondary' | 'muted' | 'accent';

type Props = { variant?: BadgeVariant; children?: ReactNode } & HTMLAttributes<HTMLSpanElement>;

export function Badge({ variant = 'primary', children, ...rest }: Props) {
	return (
		<span className="nb-badge" data-variant={variant} {...rest}>
			{children}
		</span>
	);
}

export default Badge;
