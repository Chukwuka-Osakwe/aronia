// Swiss — DropdownMenu (React skin, Layer 3). Two modern platform primitives
// instead of a JS positioning lib:
//   • the native `popover` attribute → top-layer render, light-dismiss, Esc;
//   • CSS Anchor Positioning → the menu tracks the trigger and flips up when cramped.
// We add role=menu + arrow-key roving on top. The menu is a true overlay, so it
// carries the reserved soft shadow. NOTE: CSS Anchor Positioning is Chromium-mostly
// today; `popover`/anchor CSS are applied via refs since React 18's DOM types predate them.
import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import './tokens.css';
import './dropdown-menu.css';

export type InputSize = 'sm' | 'md' | 'lg';
export type DropdownShape = 'square' | 'pill';

type Props = {
	size?: InputSize;
	shape?: DropdownShape;
	label?: string;
	items?: string[];
};

export function DropdownMenu({ size = 'md', shape = 'square', label = 'Menu', items = [] }: Props) {
	// useId contains characters invalid in a CSS ident; strip to a CSS/id-safe token.
	const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
	const menuId = `swiss-menu-${uid}`;
	const anchorName = `--${menuId}`;
	const visible = items.filter(Boolean);

	const triggerRef = useRef<HTMLButtonElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);
	const [open, setOpen] = useState(false);

	// Wire the anchor-positioning CSS props (not in React's CSSProperties type yet).
	useEffect(() => {
		triggerRef.current?.style.setProperty('anchor-name', anchorName);
		menuRef.current?.style.setProperty('position-anchor', anchorName);
	}, [anchorName]);

	function menuItems(): HTMLButtonElement[] {
		return Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? []);
	}

	// The popover's `toggle` event isn't in React 18's <div> types, so listen natively.
	useEffect(() => {
		const el = menuRef.current;
		if (!el) return;
		const handler = () => {
			const isOpen = el.matches(':popover-open');
			setOpen(isOpen);
			// preventScroll: the menu is a top-layer popover; without it, .focus()
			// scrolls the nearest scrollable ancestor (the document, when the menu
			// overflows the viewport) to reveal the item — which shoves a fixed-height
			// page layout and reads as a jitter. We never need to scroll to a top-layer
			// element, so suppress it.
			if (isOpen) menuItems()[0]?.focus({ preventScroll: true }); // move focus into the menu on open
		};
		el.addEventListener('toggle', handler);
		return () => el.removeEventListener('toggle', handler);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	function onKeydown(e: KeyboardEvent<HTMLDivElement>) {
		const buttons = menuItems();
		if (!buttons.length) return;
		const i = buttons.indexOf(document.activeElement as HTMLButtonElement);
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			buttons[(i + 1) % buttons.length]?.focus();
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			buttons[(i - 1 + buttons.length) % buttons.length]?.focus();
		} else if (e.key === 'Home') {
			e.preventDefault();
			buttons[0]?.focus();
		} else if (e.key === 'End') {
			e.preventDefault();
			buttons[buttons.length - 1]?.focus();
		}
	}

	return (
		<div className="swiss-dropdown" data-size={size} data-shape={shape}>
			<button
				ref={triggerRef}
				type="button"
				className="swiss-dropdown__trigger"
				aria-haspopup="menu"
				aria-expanded={open}
				// `popovertarget` isn't in React 18's DOM types yet.
				{...({ popovertarget: menuId } as object)}
			>
				{label}
				<svg
					className="swiss-dropdown__chevron"
					data-open={open}
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
			</button>

			<div
				ref={menuRef}
				id={menuId}
				className="swiss-dropdown__menu"
				role="menu"
				tabIndex={-1}
				onKeyDown={onKeydown}
				// `popover` isn't in React 18's DOM types yet.
				{...({ popover: 'auto' } as object)}
			>
				{visible.map((item) => (
					<button
						key={item}
						type="button"
						role="menuitem"
						className="swiss-dropdown__item"
						onClick={() => menuRef.current?.hidePopover()}
					>
						{item}
					</button>
				))}
			</div>
		</div>
	);
}

export default DropdownMenu;
