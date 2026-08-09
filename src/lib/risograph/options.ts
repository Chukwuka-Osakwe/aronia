// Single source of truth for every enumerated prop in the Risograph family
// (PREVIEW slice — Button/Link/Card/Badge). Values declared once as `as const`;
// TS unions derive from them; components + manifest both import here so enum
// drift is structurally impossible. Same pattern as the other families.

export const BUTTON_VARIANTS = ['primary', 'secondary', 'muted', 'ghost'] as const;
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

// Form-control size scale (Input/Textarea). Shares the token rhythm with Button
// but drops `xs` — text-entry fields never go that small.
export const INPUT_SIZES = ['sm', 'md', 'lg'] as const;
export type InputSize = (typeof INPUT_SIZES)[number];

export const INPUT_SHAPES = ['square', 'pill'] as const;
export type InputShape = (typeof INPUT_SHAPES)[number];

export const FIELD_SHAPES = ['square', 'pill'] as const;
export type FieldShape = (typeof FIELD_SHAPES)[number];

// Checkbox/Toggle share the square|pill vocabulary of the other controls; on
// Checkbox `pill` = a circular box, on Toggle `pill` = a rounded track + round thumb.
export const CHECKBOX_SHAPES = ['square', 'pill'] as const;
export type CheckboxShape = (typeof CHECKBOX_SHAPES)[number];

export const TOGGLE_SHAPES = ['square', 'pill'] as const;
export type ToggleShape = (typeof TOGGLE_SHAPES)[number];

// The DropdownMenu trigger is button-like, so it shares the square|pill
// vocabulary; `pill` rounds the trigger only (the menu panel keeps its radius).
export const DROPDOWN_SHAPES = ['square', 'pill'] as const;
export type DropdownShape = (typeof DROPDOWN_SHAPES)[number];

export const ALERT_VARIANTS = ['info', 'success', 'warning', 'error'] as const;
export type AlertVariant = (typeof ALERT_VARIANTS)[number];

export const SPINNER_SPEEDS = ['slow', 'normal', 'fast'] as const;
export type SpinnerSpeed = (typeof SPINNER_SPEEDS)[number];

export const SKELETON_SHAPES = ['text', 'rect', 'circle'] as const;
export type SkeletonShape = (typeof SKELETON_SHAPES)[number];
