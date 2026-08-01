// Risograph — Field (React skin, Layer 3). A <label> wrapper: a mono print-label
// (+ optional required mark) above a control (children), help or error line below.
// Clicking the label focuses the wrapped control natively. Styling lives in the
// co-located CSS (field.css + tokens.css).
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
		<label className="riso-field" data-error={!!error} data-shape={shape}>
			{label ? (
				<span className="riso-field__label">
					{label}
					{required ? <span className="riso-field__req"> *</span> : null}
				</span>
			) : null}
			{children}
			{error ? (
				<span className="riso-field__msg riso-field__msg--error">{error}</span>
			) : help ? (
				<span className="riso-field__msg">{help}</span>
			) : null}
		</label>
	);
}

export default Field;
