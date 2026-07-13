// Swiss — Progress (React skin, Layer 3). Determinate: an accent fill in a flat
// bordered track; `value` is 0–100.
import './tokens.css';
import './progress.css';

export type ProgressSize = 'sm' | 'md' | 'lg';

type Props = {
	value?: number;
	size?: ProgressSize;
	/** Show the rounded percentage after the bar. */
	showValue?: boolean;
	label?: string;
};

export function Progress({ value = 60, size = 'md', showValue = false, label = 'Progress' }: Props) {
	const pct = Math.max(0, Math.min(100, value));
	return (
		<div className="swiss-progress" data-size={size} data-show={showValue}>
			<div
				className="swiss-progress__track"
				role="progressbar"
				aria-label={label}
				aria-valuenow={Math.round(pct)}
				aria-valuemin={0}
				aria-valuemax={100}
			>
				<div className="swiss-progress__fill" style={{ width: `${pct}%` }} />
			</div>
			{/* Decorative: the progressbar role already conveys the number to AT. */}
			<span className="swiss-progress__value" aria-hidden="true">
				{Math.round(pct)}%
			</span>
		</div>
	);
}

export default Progress;
