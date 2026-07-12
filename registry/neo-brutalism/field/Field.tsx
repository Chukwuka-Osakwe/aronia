// Neo-Brutalism — Field (React skin, Layer 3). A <label> wrapper: label (+ optional
// required mark) above a control (children), help or error line below. Clicking the
// label focuses the wrapped control natively. See DESIGN.md, Entries 31–33.
import type { ReactNode } from 'react';
import './tokens.css';
import './field.css';

export type FieldShape = 'square' | 'pill';

type Props = {
	label?: string;
	help?: string;
	error?: string;
	required?: boolean;
	shape?: FieldShape;
	children?: ReactNode;
};

export function Field({ label, help, error, required = false, shape = 'square', children }: Props) {
	return (
		<label className="nb-field" data-error={!!error} data-shape={shape}>
			{label ? (
				<span className="nb-field__label">
					{label}
					{required ? <span className="nb-field__req"> *</span> : null}
				</span>
			) : null}
			{children}
			{error ? (
				<span className="nb-field__msg nb-field__msg--error">{error}</span>
			) : help ? (
				<span className="nb-field__msg">{help}</span>
			) : null}
		</label>
	);
}

export default Field;
