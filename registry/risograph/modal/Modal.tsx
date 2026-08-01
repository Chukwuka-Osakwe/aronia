// Risograph — Modal (React skin, Layer 3). Native <dialog> + showModal():
// top-layer render (no z-index/portal), real focus trap, Esc-to-close, focus
// restored to the trigger, ::backdrop — all for free. We drive it from a
// controlled `open` prop (a ref effect calls showModal()/close()) and add
// scroll-lock + backdrop-click dismissal + `onClose`. Zero elevation, even
// here — separation comes from the plum backdrop dim + the printed masthead.
import { useEffect, useId, useRef } from 'react';
import type { MouseEvent, ReactNode, SyntheticEvent } from 'react';
import './tokens.css';
import './modal.css';

type Props = {
	open?: boolean;
	/** Fires when the user dismisses (Esc, backdrop, or the × button). */
	onClose?: () => void;
	/** Whether Esc / backdrop-click dismiss the modal. */
	dismissible?: boolean;
	header?: ReactNode;
	children?: ReactNode;
	footer?: ReactNode;
};

export function Modal({ open = false, onClose, dismissible = true, header, children, footer }: Props) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const headerId = useId();

	// Drive the native modal state from `open`.
	useEffect(() => {
		const el = dialogRef.current;
		if (!el) return;
		if (open && !el.open) el.showModal();
		else if (!open && el.open) el.close();
	}, [open]);

	// Lock background scroll while open; restore on close/teardown.
	useEffect(() => {
		if (!open) return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = prev;
		};
	}, [open]);

	// Native Esc fires `cancel`; drive the close ourselves so onClose fires, and block
	// it entirely when not dismissible.
	function onCancel(e: SyntheticEvent<HTMLDialogElement>) {
		e.preventDefault();
		if (dismissible) onClose?.();
	}
	// A click whose target is the <dialog> itself (not its contents) is the backdrop.
	function onDialogClick(e: MouseEvent<HTMLDialogElement>) {
		if (dismissible && e.target === dialogRef.current) onClose?.();
	}

	return (
		<dialog
			ref={dialogRef}
			className="riso-modal"
			data-has-header={!!header}
			aria-labelledby={header ? headerId : undefined}
			onCancel={onCancel}
			onClick={onDialogClick}
		>
			<button type="button" className="riso-modal__close" aria-label="Close" onClick={() => onClose?.()}>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth={3}
					strokeLinecap="round"
					aria-hidden="true"
				>
					<line x1="6" y1="6" x2="18" y2="18" />
					<line x1="18" y1="6" x2="6" y2="18" />
				</svg>
			</button>
			{header ? (
				<div className="riso-modal__header" id={headerId}>
					{header}
				</div>
			) : null}
			<div className="riso-modal__body">{children}</div>
			{footer ? <div className="riso-modal__footer">{footer}</div> : null}
		</dialog>
	);
}

export default Modal;
