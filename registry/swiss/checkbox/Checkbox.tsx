// Swiss — Checkbox (React skin, Layer 3). A visually-hidden native checkbox drives
// state + a11y; the styled box renders the Swiss look (flat ink fill + white tick).
// The fill is driven by `data-checked` (JS state), so this is controlled-with-
// uncontrolled-fallback: pass `checked` to control it, or leave it and it tracks its
// own state (`defaultChecked` sets the initial value).
import { useState } from 'react';
import type { ChangeEvent, InputHTMLAttributes } from 'react';
import './tokens.css';
import './checkbox.css';

export type InputSize = 'sm' | 'md' | 'lg';
export type CheckboxShape = 'square' | 'pill';

type Props = {
	checked?: boolean;
	defaultChecked?: boolean;
	disabled?: boolean;
	size?: InputSize;
	shape?: CheckboxShape;
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
	shape = 'square',
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
		<label
			className="swiss-checkbox"
			data-size={size}
			data-shape={shape}
			data-checked={value}
			data-disabled={disabled}
		>
			<input
				type="checkbox"
				className="swiss-checkbox__input"
				checked={value}
				disabled={disabled}
				onChange={handleChange}
				{...rest}
			/>
			<span className="swiss-checkbox__box">
				<svg
					className="swiss-checkbox__check"
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
			{label ? <span className="swiss-checkbox__label">{label}</span> : null}
		</label>
	);
}

export default Checkbox;
