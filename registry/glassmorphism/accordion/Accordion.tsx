// Glassmorphism — Accordion (React skin, Layer 3). Native <details>/<summary>:
// open/close, keyboard, and a11y for free. `exclusive` uses the native `name`
// attribute so only one section is open at a time — no JS state. The panel body is
// a render prop receiving the section label. See DESIGN.md, Entries 31–33.
import { useId } from 'react';
import type { ReactNode } from 'react';
import './tokens.css';
import './accordion.css';

type Props = {
	items?: string[];
	/** Only one section open at a time (native `name` grouping). */
	exclusive?: boolean;
	/** Renders a section's panel content; receives the section label. */
	children?: (item: string) => ReactNode;
};

export function Accordion({ items = [], exclusive = true, children }: Props) {
	const group = useId();
	const visible = items.filter(Boolean);
	return (
		<div className="glass-accordion">
			{visible.map((item) => (
				<details
					key={item}
					className="glass-accordion__item"
					// `name` groups <details> for native single-open; not yet in React 18 DOM types.
					{...(exclusive ? ({ name: group } as object) : {})}
				>
					<summary className="glass-accordion__summary">
						<span>{item}</span>
						<svg
							className="glass-accordion__chevron"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth={3}
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<polyline points="6 9 12 15 18 9" />
						</svg>
					</summary>
					<div className="glass-accordion__panel">{children?.(item)}</div>
				</details>
			))}
		</div>
	);
}

export default Accordion;
