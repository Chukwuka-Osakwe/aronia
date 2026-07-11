// Glassmorphism — Spinner (React skin, Layer 3). A rotating hard-edged square ring.
// See DESIGN.md, Entries 31–33.
import './tokens.css';
import './spinner.css';

export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerSpeed = 'slow' | 'normal' | 'fast';

type Props = {
	size?: SpinnerSize;
	speed?: SpinnerSpeed;
	/** Announced to assistive tech while loading. */
	label?: string;
};

export function Spinner({ size = 'md', speed = 'normal', label = 'Loading' }: Props) {
	return (
		<span className="glass-spinner" data-size={size} data-speed={speed} role="status" aria-label={label}>
			<span className="glass-spinner__ring" aria-hidden="true" />
		</span>
	);
}

export default Spinner;
