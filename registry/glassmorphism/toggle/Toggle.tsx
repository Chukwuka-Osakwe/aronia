// Glassmorphism — Toggle (React skin, Layer 3). A real <button role="switch"> with
// aria-checked. The track/thumb are driven by `data-checked` (JS state), so it's
// controlled-with-uncontrolled-fallback: pass `checked` + `onCheckedChange` to
// control it, or leave it and it tracks its own state. See DESIGN.md, Entries 31–33.
import { useState } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import './tokens.css';
import './toggle.css';

export type InputSize = 'sm' | 'md' | 'lg';
export type ToggleShape = 'square' | 'pill';

type Props = {
	checked?: boolean;
	defaultChecked?: boolean;
	disabled?: boolean;
	size?: InputSize;
	shape?: ToggleShape;
	/** Optional visible label rendered after the switch. */
	label?: string;
	onCheckedChange?: (checked: boolean) => void;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onChange' | 'onClick'>;

export function Toggle({
	checked,
	defaultChecked = false,
	disabled = false,
	size = 'md',
	shape = 'pill',
	label,
	onCheckedChange,
	...rest
}: Props) {
	const isControlled = checked !== undefined;
	const [internal, setInternal] = useState(defaultChecked);
	const value = isControlled ? checked : internal;

	function toggle() {
		const next = !value;
		if (!isControlled) setInternal(next);
		onCheckedChange?.(next);
	}

	return (
		<button
			{...rest}
			type="button"
			role="switch"
			className="glass-toggle"
			data-size={size}
			data-shape={shape}
			aria-checked={value}
			data-checked={value}
			disabled={disabled}
			onClick={toggle}
		>
			<span className="glass-toggle__track">
				<span className="glass-toggle__thumb" />
			</span>
			{label ? <span className="glass-toggle__label">{label}</span> : null}
		</button>
	);
}

export default Toggle;
