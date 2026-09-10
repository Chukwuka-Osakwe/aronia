// Neo-Brutalism — Textarea (React skin, Layer 3). The multiline sibling of Input;
// native props pass through (controlled or uncontrolled). See DESIGN.md, Entries 31–33.
import type { TextareaHTMLAttributes } from 'react';
import './tokens.css';
import './textarea.css';
import { useFieldContext } from './field-context';

export type InputSize = 'sm' | 'md' | 'lg';

type Props = { size?: InputSize; rows?: number } & Omit<
	TextareaHTMLAttributes<HTMLTextAreaElement>,
	'size'
>;

export function Textarea({ size, rows = 4, ...rest }: Props) {
	// Inside a Field: inherit its size + wire the error a11y (same contract as Input).
	const field = useFieldContext();
	return (
		<textarea
			className="nb-textarea"
			data-size={size ?? field?.size ?? 'md'}
			rows={rows}
			aria-invalid={field?.invalid || undefined}
			aria-describedby={field?.describedById}
			{...rest}
		/>
	);
}

export default Textarea;
