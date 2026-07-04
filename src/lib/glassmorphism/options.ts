// Single source of truth for every enumerated prop in the Glassmorphism family.
// Same pattern as the Neo-Brutalism options: values declared once as `as const`
// arrays; the TS unions derive from them; components and manifest both import
// here so enum drift is structurally impossible. See DESIGN.md, Entry 4.

export const BUTTON_VARIANTS = ['primary', 'secondary', 'muted', 'ghost', 'quiet'] as const;
export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];

export const BUTTON_SIZES = ['xs', 'sm', 'md', 'lg'] as const;
export type ButtonSize = (typeof BUTTON_SIZES)[number];

export const BUTTON_SHAPES = ['square', 'pill'] as const;
export type ButtonShape = (typeof BUTTON_SHAPES)[number];

export const CARD_VARIANTS = ['surface', 'strong', 'primary', 'secondary'] as const;
export type CardVariant = (typeof CARD_VARIANTS)[number];

export const BADGE_VARIANTS = ['primary', 'secondary', 'muted', 'accent'] as const;
export type BadgeVariant = (typeof BADGE_VARIANTS)[number];

// `inline` — a text link inside prose. `nav` — a compact sidebar/menu item
// (active-state aware).
export const LINK_VARIANTS = ['inline', 'nav'] as const;
export type LinkVariant = (typeof LINK_VARIANTS)[number];

export const INPUT_SIZES = ['sm', 'md', 'lg'] as const;
export type InputSize = (typeof INPUT_SIZES)[number];

export const ALERT_VARIANTS = ['info', 'success', 'warning', 'error'] as const;
export type AlertVariant = (typeof ALERT_VARIANTS)[number];

export const SPINNER_SPEEDS = ['slow', 'normal', 'fast'] as const;
export type SpinnerSpeed = (typeof SPINNER_SPEEDS)[number];

// `text` = N stacked lines (last one short); `rect`/`circle` = a single block.
export const SKELETON_SHAPES = ['text', 'rect', 'circle'] as const;
export type SkeletonShape = (typeof SKELETON_SHAPES)[number];
