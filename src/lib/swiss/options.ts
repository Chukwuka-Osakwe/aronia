// Single source of truth for every enumerated prop in the Swiss family.
// Values declared once as `as const` arrays; the TS unions derive from them;
// components and manifest both import here so enum drift is structurally
// impossible. Same pattern as the other families. See DESIGN.md, Entry 4.

export const BUTTON_VARIANTS = ['primary', 'secondary', 'muted', 'ghost', 'quiet'] as const;
export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];

export const BUTTON_SIZES = ['xs', 'sm', 'md', 'lg'] as const;
export type ButtonSize = (typeof BUTTON_SIZES)[number];

export const BUTTON_SHAPES = ['square', 'pill'] as const;
export type ButtonShape = (typeof BUTTON_SHAPES)[number];

// `inline` — a text link inside prose. `nav` — a compact sidebar/menu item
// (active-state aware).
export const LINK_VARIANTS = ['inline', 'nav'] as const;
export type LinkVariant = (typeof LINK_VARIANTS)[number];
