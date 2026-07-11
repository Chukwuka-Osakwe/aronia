// Glassmorphism — Checkbox (React skin, Layer 3). A visually-hidden native checkbox
// drives state + a11y; the styled box renders the NB look. The fill is driven by
// `data-checked` (JS state), so this is controlled-with-uncontrolled-fallback: pass
// `checked` to control it, or leave it and it tracks its own state (`defaultChecked`
// sets the initial value). See DESIGN.md, Entries 31–33.
import { useState } from 'react';
import type { ChangeEvent, InputHTMLAttributes } from 'react';
import './tokens.css';
import './checkbox.css';

export type InputSize = 'sm' | 'md' | 'lg';

type Props = {
	checked?: boolean;
	defaultChecked?: boolean;
	disabled?: boolean;
	size?: InputSize;
	/** Optional visible label rendered after the box. */
	label?: string;
	onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
} & Omit<
	InputHTMLAttributes<HTMLInputElement>,
	'type' | 'size' | 'checked' | 'defaultChecked' | 'onChange'
>;

export function Checkbox({
	checked,
	defaultChecked = false,
	disabled = false,
	size = 'md',
	label,
	onChange,
	...rest
}: Props) {
	const isControlled = checked !== undefined;
	const [internal, setInternal] = useState(defaultChecked);
	const value = isControlled ? checked : internal;

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		if (!isControlled) setInternal(e.target.checked);
		onChange?.(e);
	}

	return (
		<label className="glass-checkbox" data-size={size} data-checked={value} data-disabled={disabled}>
			<input
				type="checkbox"
				className="glass-checkbox__input"
				checked={value}
				disabled={disabled}
				onChange={handleChange}
				{...rest}
			/>
			<span className="glass-checkbox__box">
				<svg
					className="glass-checkbox__check"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth={3}
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
				>
					<polyline points="20 6 9 17 4 12" />
				</svg>
			</span>
			{label ? <span className="glass-checkbox__label">{label}</span> : null}
		</label>
	);
}

export default Checkbox;
