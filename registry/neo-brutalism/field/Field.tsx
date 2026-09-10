// Neo-Brutalism — Field (React skin, Layer 3). A <label> wrapper: label (+ optional
// required mark) above a control (children), help or error line below. Clicking the
// label focuses the wrapped control natively. See DESIGN.md, Entries 31–33.
//
// Field can't reach the control through `children`, so it PROVIDES context
// (invalid + the message id + size); the control reads it to wire its own
// aria-invalid / aria-describedby and inherit the field size (see field-context.ts).
import type { ReactNode } from 'react';
import { useId } from 'react';
import './tokens.css';
import './field.css';
import { FieldContext, type FieldSize } from './field-context';

export type FieldShape = 'square' | 'pill';

type Props = {
	label?: string;
	help?: string;
	error?: string;
	required?: boolean;
	size?: FieldSize;
	shape?: FieldShape;
	children?: ReactNode;
};

export function Field({
	label,
	help,
	error,
	required = false,
	size = 'md',
	shape = 'square',
	children
}: Props) {
	// SSR-stable ids so the wrapped control can point aria-describedby at whichever
	// line is showing, and a screen reader announces the error (role="alert").
	const uid = useId();
	const errorId = `${uid}-error`;
	const helpId = `${uid}-help`;
	const describedById = error ? errorId : help ? helpId : undefined;
	return (
		<label className="nb-field" data-shape={shape} data-size={size}>
			{label ? (
				<span className="nb-field__label">
					{label}
					{required ? <span className="nb-field__req"> *</span> : null}
				</span>
			) : null}
			<FieldContext.Provider value={{ invalid: !!error, describedById, size }}>
				{children}
			</FieldContext.Provider>
			{error ? (
				<span id={errorId} className="nb-field__msg nb-field__msg--error" role="alert">
					{error}
				</span>
			) : help ? (
				<span id={helpId} className="nb-field__msg">
					{help}
				</span>
			) : null}
		</label>
	);
}

export default Field;
