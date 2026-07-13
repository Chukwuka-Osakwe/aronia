// Single source of truth for every enumerated prop in the Neo-Brutalism family.
//
// Values are declared ONCE here as runtime `as const` arrays; the TypeScript
// unions are DERIVED from them. Both the components (for prop types) and the
// manifest (for its `values` arrays) import from this file — so an enum can
// only ever be changed in one place. This makes enum drift between the
// components and the manifest structurally impossible. See DESIGN.md, Entry 4.

export const BUTTON_VARIANTS = ['primary', 'secondary', 'muted', 'ghost', 'quiet'] as const;
export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];

export const BUTTON_SIZES = ['xs', 'sm', 'md', 'lg'] as const;
export type ButtonSize = (typeof BUTTON_SIZES)[number];

export const BUTTON_SHAPES = ['square', 'pill'] as const;
export type ButtonShape = (typeof BUTTON_SHAPES)[number];

export const CARD_VARIANTS = ['paper', 'primary', 'secondary', 'muted'] as const;
export type CardVariant = (typeof CARD_VARIANTS)[number];

export const BADGE_VARIANTS = ['primary', 'secondary', 'muted', 'accent'] as const;
export type BadgeVariant = (typeof BADGE_VARIANTS)[number];

export const BADGE_SHAPES = ['square', 'pill'] as const;
export type BadgeShape = (typeof BADGE_SHAPES)[number];

// `inline` — a text link inside prose (underlined). `nav` — a compact sidebar/menu
// item (no underline, active-state aware).
export const LINK_VARIANTS = ['inline', 'nav'] as const;
export type LinkVariant = (typeof LINK_VARIANTS)[number];

export const INPUT_SIZES = ['sm', 'md', 'lg'] as const;
export type InputSize = (typeof INPUT_SIZES)[number];

export const INPUT_SHAPES = ['square', 'pill'] as const;
export type InputShape = (typeof INPUT_SHAPES)[number];

export const FIELD_SHAPES = ['square', 'pill'] as const;
export type FieldShape = (typeof FIELD_SHAPES)[number];

// Checkbox/Toggle share the square|pill vocabulary of the other controls; on
// these two, `pill` reads as fully round (a circular box / a pill track).
export const CHECKBOX_SHAPES = ['square', 'pill'] as const;
export type CheckboxShape = (typeof CHECKBOX_SHAPES)[number];

export const TOGGLE_SHAPES = ['square', 'pill'] as const;
export type ToggleShape = (typeof TOGGLE_SHAPES)[number];

export const ALERT_VARIANTS = ['info', 'success', 'warning', 'error'] as const;
export type AlertVariant = (typeof ALERT_VARIANTS)[number];

export const SPINNER_SPEEDS = ['slow', 'normal', 'fast'] as const;
export type SpinnerSpeed = (typeof SPINNER_SPEEDS)[number];

// `text` = N stacked lines (last one short); `rect`/`circle` = a single block.
export const SKELETON_SHAPES = ['text', 'rect', 'circle'] as const;
export type SkeletonShape = (typeof SKELETON_SHAPES)[number];
