// Swiss — Field (React skin, Layer 3). A <label> wrapper: label (+ optional
// required mark) above a control (children), help or error line below. Clicking the
// label focuses the wrapped control natively. Styling lives in the co-located CSS.
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
		<label className="swiss-field" data-error={!!error} data-shape={shape}>
			{label ? (
				<span className="swiss-field__label">
					{label}
					{required ? <span className="swiss-field__req"> *</span> : null}
				</span>
			) : null}
			{children}
			{error ? (
				<span className="swiss-field__msg swiss-field__msg--error">{error}</span>
			) : help ? (
				<span className="swiss-field__msg">{help}</span>
			) : null}
		</label>
	);
}

export default Field;
