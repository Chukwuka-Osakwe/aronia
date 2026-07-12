// Neo-Brutalism — RadioGroup (React skin, Layer 3). Native <input type="radio">
// (visually hidden) per option, styled square dots. The selected dot is driven by
// `data-checked` (JS state), so it's controlled-with-uncontrolled-fallback: pass
// `value` + `onValueChange` to control it, or leave it and it tracks its own state.
// See DESIGN.md, Entries 31–33.
import { useId, useState } from 'react';
import type { HTMLAttributes } from 'react';
import './tokens.css';
import './radio-group.css';

type Props = {
	value?: string;
	defaultValue?: string;
	options?: string[];
	/** Shared form field name; auto-generated if omitted. */
	name?: string;
	disabled?: boolean;
	onValueChange?: (value: string) => void;
} & Omit<HTMLAttributes<HTMLDivElement>, 'role' | 'onChange' | 'defaultValue'>;

export function RadioGroup({
	value,
	defaultValue = '',
	options = [],
	name,
	disabled = false,
	onValueChange,
	...rest
}: Props) {
	const isControlled = value !== undefined;
	const [internal, setInternal] = useState(defaultValue);
	const selected = isControlled ? value : internal;
	const autoName = useId();
	const groupName = name || autoName;

	function choose(opt: string) {
		if (!isControlled) setInternal(opt);
		onValueChange?.(opt);
	}

	return (
		<div className="nb-radio" role="radiogroup" data-disabled={disabled} {...rest}>
			{options.filter(Boolean).map((opt) => (
				<label key={opt} className="nb-radio__option" data-checked={selected === opt}>
					<input
						type="radio"
						className="nb-radio__input"
						name={groupName}
						value={opt}
						checked={selected === opt}
						disabled={disabled}
						onChange={() => choose(opt)}
					/>
					<span className="nb-radio__dot" />
					<span className="nb-radio__label">{opt}</span>
				</label>
			))}
		</div>
	);
}

export default RadioGroup;
