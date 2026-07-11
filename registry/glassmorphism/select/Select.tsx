// Glassmorphism — Select (React skin, Layer 3). A native <select> restyled with a
// custom chevron; native under the hood so keyboard, typeahead, value/onChange and
// form submission all work — controlled or uncontrolled. See DESIGN.md, Entries 31–33.
import type { SelectHTMLAttributes } from 'react';
import './tokens.css';
import './select.css';

export type InputSize = 'sm' | 'md' | 'lg';

type Props = {
	options?: string[];
	size?: InputSize;
	placeholder?: string;
	disabled?: boolean;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'>;

export function Select({ options = [], size = 'md', placeholder, disabled = false, ...rest }: Props) {
	const visible = options.filter(Boolean);
	return (
		<div className="glass-select" data-disabled={disabled}>
			<select className="glass-select__field" data-size={size} disabled={disabled} {...rest}>
				{placeholder ? (
					<option value="" disabled>
						{placeholder}
					</option>
				) : null}
				{visible.map((opt) => (
					<option key={opt} value={opt}>
						{opt}
					</option>
				))}
			</select>
			<svg
				className="glass-select__chevron"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth={3}
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<polyline points="6 9 12 15 18 9" />
			</svg>
		</div>
	);
}

export default Select;
