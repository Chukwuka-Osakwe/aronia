// Glassmorphism — Textarea (React skin, Layer 3). The multiline sibling of Input;
// native props pass through (controlled or uncontrolled). See DESIGN.md, Entries 31–33.
import type { TextareaHTMLAttributes } from 'react';
import './tokens.css';
import './textarea.css';

export type InputSize = 'sm' | 'md' | 'lg';

type Props = { size?: InputSize; rows?: number } & Omit<
	TextareaHTMLAttributes<HTMLTextAreaElement>,
	'size'
>;

export function Textarea({ size = 'md', rows = 4, ...rest }: Props) {
	return <textarea className="glass-textarea" data-size={size} rows={rows} {...rest} />;
}

export default Textarea;
