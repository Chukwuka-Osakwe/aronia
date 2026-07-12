// Glassmorphism — Skeleton (React skin, Layer 3). Loading placeholder: `text` renders
// N lines (last one short); `rect`/`circle` are single sized blocks. See DESIGN.md,
// Entries 31–33.
import type { CSSProperties } from 'react';
import './tokens.css';
import './skeleton.css';

export type SkeletonShape = 'text' | 'rect' | 'circle';

type Props = {
	shape?: SkeletonShape;
	/** For `text`: how many lines. */
	lines?: number;
	/** CSS width (e.g. '100%', '20rem'); for `circle` this is the diameter. */
	width?: string;
	/** CSS height — `rect` only. */
	height?: string;
};

export function Skeleton({ shape = 'text', lines = 5, width, height }: Props) {
	if (shape === 'text') {
		const lineWidths = Array.from({ length: Math.max(1, lines) }, (_, i) =>
			i === lines - 1 && lines > 1 ? '60%' : '100%'
		);
		return (
			<div className="glass-skeleton glass-skeleton--text" role="status" aria-label="Loading" style={{ width }}>
				{lineWidths.map((w, i) => (
					<span key={i} className="glass-skeleton__bar" style={{ width: w }} />
				))}
			</div>
		);
	}
	const style: CSSProperties = { width };
	if (shape === 'rect') style.height = height;
	return (
		<span className={`glass-skeleton glass-skeleton--${shape}`} role="status" aria-label="Loading" style={style} />
	);
}

export default Skeleton;
