// Risograph — Card (React skin, Layer 3). A print panel with a faint grain tooth;
// optional header/footer regions. The `ink` variant is an inverted plum-indigo
// panel; the header can read as a printed spot-ink masthead (see card.css).
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
		<div className="riso-card" data-variant={variant} {...rest}>
			{header ? <div className="riso-card__header">{header}</div> : null}
			{children ? <div className="riso-card__body">{children}</div> : null}
			{footer ? <div className="riso-card__footer">{footer}</div> : null}
		</div>
	);
}

export default Card;
