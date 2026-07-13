// Swiss — Spinner (React skin, Layer 3). A rotating circular ring with one ink arc.
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
		<span className="swiss-spinner" data-size={size} data-speed={speed} role="status" aria-label={label}>
			<span className="swiss-spinner__box" aria-hidden="true" />
		</span>
	);
}

export default Spinner;
