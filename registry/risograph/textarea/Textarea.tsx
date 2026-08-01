// Risograph — Textarea (React skin, Layer 3). The multiline sibling of Input;
// native props pass through (controlled or uncontrolled). Styling lives in the
// co-located CSS (textarea.css + tokens.css) — this file only maps props → attrs.
import type { TextareaHTMLAttributes } from 'react';
import './tokens.css';
import './textarea.css';

export type InputSize = 'sm' | 'md' | 'lg';

type Props = { size?: InputSize; rows?: number } & Omit<
	TextareaHTMLAttributes<HTMLTextAreaElement>,
	'size'
>;

export function Textarea({ size = 'md', rows = 4, ...rest }: Props) {
	return <textarea className="riso-textarea" data-size={size} rows={rows} {...rest} />;
}

export default Textarea;
