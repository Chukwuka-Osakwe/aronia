// Glassmorphism — Tabs (React skin, Layer 3). WAI-ARIA roving-tabindex: only the
// active tab is in the tab order; Arrow/Home/End move focus + selection. The panel
// content is a render prop receiving the active label. Controlled (`value` +
// `onValueChange`) or uncontrolled (`defaultValue`). See DESIGN.md, Entries 31–33.
import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import './tokens.css';
import './tabs.css';

type Props = {
	tabs?: string[];
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	/** Renders the active panel content; receives the active tab label. */
	children?: (active: string) => ReactNode;
};

export function Tabs({ tabs = [], value, defaultValue, onValueChange, children }: Props) {
	const base = useId();
	const visibleTabs = tabs.filter(Boolean);
	const isControlled = value !== undefined;
	const [internal, setInternal] = useState(defaultValue ?? visibleTabs[0] ?? '');
	const active = isControlled ? value : internal;
	const listRef = useRef<HTMLDivElement>(null);

	// Keep a valid active tab (default to the first) — uncontrolled only.
	useEffect(() => {
		if (!isControlled && visibleTabs.length && !visibleTabs.includes(internal)) {
			setInternal(visibleTabs[0]);
		}
	}, [isControlled, visibleTabs, internal]);

	function select(tab: string) {
		if (!isControlled) setInternal(tab);
		onValueChange?.(tab);
	}

	function onKeydown(e: KeyboardEvent<HTMLButtonElement>, i: number) {
		const n = visibleTabs.length;
		let next = i;
		if (e.key === 'ArrowRight') next = (i + 1) % n;
		else if (e.key === 'ArrowLeft') next = (i - 1 + n) % n;
		else if (e.key === 'Home') next = 0;
		else if (e.key === 'End') next = n - 1;
		else return;
		e.preventDefault();
		select(visibleTabs[next]);
		listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
	}

	return (
		<div className="glass-tabs">
			<div className="glass-tabs__list" role="tablist" ref={listRef}>
				{visibleTabs.map((tab, i) => (
					<button
						key={tab}
						type="button"
						role="tab"
						id={`${base}-tab-${i}`}
						className="glass-tabs__tab"
						data-active={active === tab}
						aria-selected={active === tab}
						aria-controls={`${base}-panel`}
						tabIndex={active === tab ? 0 : -1}
						onClick={() => select(tab)}
						onKeyDown={(e) => onKeydown(e, i)}
					>
						{tab}
					</button>
				))}
			</div>
			<div
				className="glass-tabs__panel"
				role="tabpanel"
				id={`${base}-panel`}
				aria-labelledby={`${base}-tab-${visibleTabs.indexOf(active)}`}
			>
				{children?.(active)}
			</div>
		</div>
	);
}

export default Tabs;
