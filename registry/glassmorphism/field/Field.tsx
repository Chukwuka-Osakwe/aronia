// Glassmorphism — Field (React skin, Layer 3). A <label> wrapper: label (+ optional
// required mark) above a control (children), help or error line below. Clicking the
// label focuses the wrapped control natively. See DESIGN.md, Entries 31–33.
import type { ReactNode } from 'react';
import './tokens.css';
import './field.css';

type Props = {
	label?: string;
	help?: string;
	error?: string;
	required?: boolean;
	children?: ReactNode;
};

export function Field({ label, help, error, required = false, children }: Props) {
	return (
		<label className="glass-field" data-error={!!error}>
			{label ? (
				<span className="glass-field__label">
					{label}
					{required ? <span className="glass-field__req"> *</span> : null}
				</span>
			) : null}
			{children}
			{error ? (
				<span className="glass-field__msg glass-field__msg--error">{error}</span>
			) : help ? (
				<span className="glass-field__msg">{help}</span>
			) : null}
		</label>
	);
}

export default Field;
