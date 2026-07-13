// Swiss — Card (React skin, Layer 3). A flat hairline panel; optional header/footer
// regions are separated from the body by a hairline rule (in the CSS).
import type { HTMLAttributes, ReactNode } from 'react';
import './tokens.css';
import './card.css';

export type CardVariant = 'paper' | 'muted' | 'ink';

type Props = {
	variant?: CardVariant;
	header?: ReactNode;
	footer?: ReactNode;
	children?: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export function Card({ variant = 'paper', header, footer, children, ...rest }: Props) {
	return (
		<div className="swiss-card" data-variant={variant} {...rest}>
			{header ? <div className="swiss-card__header">{header}</div> : null}
			{children ? <div className="swiss-card__body">{children}</div> : null}
			{footer ? <div className="swiss-card__footer">{footer}</div> : null}
		</div>
	);
}

export default Card;
