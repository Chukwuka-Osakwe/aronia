// Neo-Brutalism — Input (React skin, Layer 3). A native <input> restyled; all
// native props (value/onChange/defaultValue/placeholder/disabled…) pass straight
// through, so it works controlled or uncontrolled. See DESIGN.md, Entries 31–33.
import type { InputHTMLAttributes } from 'react';
import './tokens.css';
import './input.css';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputShape = 'square' | 'pill';

// `size` is renamed off the native input attribute (a number) for our own scale.
type Props = { size?: InputSize; shape?: InputShape } & Omit<
	InputHTMLAttributes<HTMLInputElement>,
	'size'
>;

export function Input({ size = 'md', shape = 'square', ...rest }: Props) {
	return <input className="nb-input" data-size={size} data-shape={shape} {...rest} />;
}

export default Input;
