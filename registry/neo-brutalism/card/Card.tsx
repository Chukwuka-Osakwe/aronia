// Neo-Brutalism — Card (React skin, Layer 3). Optional header/footer regions are
// separated from the body by a hard rule (in the CSS). See DESIGN.md, Entries 31–33.
import type { HTMLAttributes, ReactNode } from 'react';
import './tokens.css';
import './card.css';

export type CardVariant = 'paper' | 'primary' | 'secondary' | 'muted';
export type CardFooterAlign = 'end' | 'center' | 'start' | 'between';

type Props = {
	variant?: CardVariant;
	header?: ReactNode;
	footer?: ReactNode;
	/** How footer actions are arranged along the row. */
	footerAlign?: CardFooterAlign;
	children?: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export function Card({
	variant = 'paper',
	header,
	footer,
	footerAlign = 'end',
	children,
	...rest
}: Props) {
	return (
		<div className="nb-card" data-variant={variant} {...rest}>
			{header ? <div className="nb-card__header">{header}</div> : null}
			{children ? <div className="nb-card__body">{children}</div> : null}
			{footer ? (
				<div className="nb-card__footer" data-footer-align={footerAlign}>
					{footer}
				</div>
			) : null}
		</div>
	);
}

export default Card;
