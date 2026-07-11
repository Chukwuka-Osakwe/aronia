// Glassmorphism — Card (React skin, Layer 3). Optional header/footer regions are
// separated from the body by a hard rule (in the CSS). See DESIGN.md, Entries 31–33.
import type { HTMLAttributes, ReactNode } from 'react';
import './tokens.css';
import './card.css';

export type CardVariant = 'surface' | 'strong' | 'primary' | 'secondary';

type Props = {
	variant?: CardVariant;
	header?: ReactNode;
	footer?: ReactNode;
	children?: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export function Card({ variant = 'surface', header, footer, children, ...rest }: Props) {
	return (
		<div className="glass-card" data-variant={variant} {...rest}>
			{header ? <div className="glass-card__header">{header}</div> : null}
			{children ? <div className="glass-card__body">{children}</div> : null}
			{footer ? <div className="glass-card__footer">{footer}</div> : null}
		</div>
	);
}

export default Card;
