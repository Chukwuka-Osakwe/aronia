// Neo-Brutalism — Card (React skin, Layer 3). Optional header/footer regions are
// separated from the body by a hard rule (in the CSS). See DESIGN.md, Entries 31–33.
import type { HTMLAttributes, ReactNode } from 'react';
import './tokens.css';
import './card.css';

export type CardVariant = 'paper' | 'primary' | 'secondary' | 'muted';

type Props = {
	variant?: CardVariant;
	header?: ReactNode;
	footer?: ReactNode;
	children?: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export function Card({ variant = 'paper', header, footer, children, ...rest }: Props) {
	return (
		<div className="nb-card" data-variant={variant} {...rest}>
			{header ? <div className="nb-card__header">{header}</div> : null}
			{children ? <div className="nb-card__body">{children}</div> : null}
			{footer ? <div className="nb-card__footer">{footer}</div> : null}
		</div>
	);
}

export default Card;
