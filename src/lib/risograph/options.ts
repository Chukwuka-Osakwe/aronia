// Single source of truth for every enumerated prop in the Risograph family
// (PREVIEW slice — Button/Link/Card/Badge). Values declared once as `as const`;
// TS unions derive from them; components + manifest both import here so enum
// drift is structurally impossible. Same pattern as the other families.

export const BUTTON_VARIANTS = ['primary', 'secondary', 'muted', 'ghost', 'quiet'] as const;
export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];

export const BUTTON_SIZES = ['xs', 'sm', 'md', 'lg'] as const;
export type ButtonSize = (typeof BUTTON_SIZES)[number];

export const BUTTON_SHAPES = ['square', 'pill'] as const;
export type ButtonShape = (typeof BUTTON_SHAPES)[number];

// `inline` — a text link inside prose. `nav` — a compact sidebar/menu item.
export const LINK_VARIANTS = ['inline', 'nav'] as const;
export type LinkVariant = (typeof LINK_VARIANTS)[number];

// Card: `paper` (default) / `muted` (deeper paper section) / `ink` (inverted panel).
export const CARD_VARIANTS = ['paper', 'muted', 'ink'] as const;
export type CardVariant = (typeof CARD_VARIANTS)[number];

// Badge: `neutral` (outline) / `solid` (ink fill) / `muted` / `accent` (fluoro).
export const BADGE_VARIANTS = ['neutral', 'solid', 'muted', 'accent'] as const;
export type BadgeVariant = (typeof BADGE_VARIANTS)[number];

export const BADGE_SHAPES = ['square', 'pill'] as const;
export type BadgeShape = (typeof BADGE_SHAPES)[number];
