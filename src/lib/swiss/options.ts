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

// Form-control size scale (Input/Textarea/Checkbox). Shares the token rhythm
// with Button but omits `xs` — text fields read too cramped at that step.
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

// The DropdownMenu trigger is button-like, so it shares the square|pill
// vocabulary; `pill` rounds the trigger only (the menu panel keeps its radius).
export const DROPDOWN_SHAPES = ['square', 'pill'] as const;
export type DropdownShape = (typeof DROPDOWN_SHAPES)[number];

// Card: `paper` (default white) / `muted` (subtle grey section) / `ink` (a bold
// inverted editorial panel). Swiss-natural set — variants diverge per family.
export const CARD_VARIANTS = ['paper', 'muted', 'ink'] as const;
export type CardVariant = (typeof CARD_VARIANTS)[number];

// Badge: `neutral` (outline, default) / `solid` (ink fill) / `muted` (grey) /
// `accent` (the one orange). Uppercase tracked labels.
export const BADGE_VARIANTS = ['neutral', 'solid', 'muted', 'accent'] as const;
export type BadgeVariant = (typeof BADGE_VARIANTS)[number];

export const BADGE_SHAPES = ['square', 'pill'] as const;
export type BadgeShape = (typeof BADGE_SHAPES)[number];

// Alert severity — picks both the status colour and the aria role.
export const ALERT_VARIANTS = ['info', 'success', 'warning', 'error'] as const;
export type AlertVariant = (typeof ALERT_VARIANTS)[number];

// Spinner rotation speed presets.
export const SPINNER_SPEEDS = ['slow', 'normal', 'fast'] as const;
export type SpinnerSpeed = (typeof SPINNER_SPEEDS)[number];

// `text` = N stacked lines (last one short); `rect`/`circle` = a single block.
export const SKELETON_SHAPES = ['text', 'rect', 'circle'] as const;
export type SkeletonShape = (typeof SKELETON_SHAPES)[number];
