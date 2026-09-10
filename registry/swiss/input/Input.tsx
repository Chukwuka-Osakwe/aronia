// Swiss — Input (React skin, Layer 3). A native <input> restyled; all native
// props (value/onChange/defaultValue/placeholder/disabled…) pass straight
// through, so it works controlled or uncontrolled. The styling lives in the
// co-located CSS (input.css + tokens.css) — this file only maps props → attrs.
import type { InputHTMLAttributes } from 'react';
import './tokens.css';
import './input.css';
import { useFieldContext } from './field-context';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputShape = 'square' | 'pill';

// `size` is renamed off the native input attribute (a number) for our own scale.
type Props = { size?: InputSize; shape?: InputShape } & Omit<
	InputHTMLAttributes<HTMLInputElement>,
	'size'
>;

export function Input({ size, shape = 'square', ...rest }: Props) {
	// Inside a Field: inherit its size (unless one is set here) and wire the error
	// a11y — aria-invalid drives the danger border (CSS), aria-describedby links the
	// message. `{...rest}` last so an explicit prop wins. Standalone → own default.
	const field = useFieldContext();
	return (
		<input
			className="swiss-input"
			data-size={size ?? field?.size ?? 'md'}
			data-shape={shape}
			aria-invalid={field?.invalid || undefined}
			aria-describedby={field?.describedById}
			{...rest}
		/>
	);
}

export default Input;
