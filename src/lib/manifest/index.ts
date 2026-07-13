// Aggregated manifest across all style families. This is the single artifact an
// agent or the docs site reads. Each family contributes its own StyleSpec
// (co-located with its components); this file just combines them.

import type { Manifest } from './schema.js';
import { neoBrutalism } from '../neo-brutalism/manifest.js';
import { glassmorphism } from '../glassmorphism/manifest.js';
import { swiss } from '../swiss/manifest.js';

export * from './schema.js';

export const manifest: Manifest = {
	version: '0.3.0',
	styles: [neoBrutalism, glassmorphism, swiss]
};
