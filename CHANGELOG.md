# Changelog

All notable changes to aronia are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/), and the project follows
semantic versioning.

## [0.5.0] — 2026-09-10

Adds the **Risograph** family — aronia's fourth design language — an opt-in
**dark theme** across all four families, a shared **spacing scale**, and new CLI
**lifecycle commands** (`diff`, `rebuild`) backed by self-describing manifests.

### Added

- **Risograph design language.** A warm risograph-print aesthetic: a soft paper
  ground, plum-indigo ink, spot red/blue with a fluoro-pink accent, grain and
  overprint texture, and sharp corners with no shadows. All 20 components at full
  parity with the other families across React, Svelte, and HTML. Ships
  self-hosted Space Grotesk / Space Mono fonts and a texture-expression range
  (ground, grain intensity, overprint) baked into its guidance.
- **Dark mode, every family.** Set `data-theme="dark"` — or `"auto"` to follow
  the OS — on any subtree; light stays the default and aronia never flips a page
  on the end-user's OS. Each family inverts in its own idiom rather than dimming
  (Neo's hard offset reflects to off-white, Glassmorphism takes a faint light
  film, and so on). 83 colour pairs are verified against WCAG AA on both grounds.
- **Shared spacing scale.** Spacing is now materialized as `--<family>-space-*`
  tokens on a single canonical ramp, identical across families; component CSS
  references the tokens instead of scattered literals.
- **`aronia diff`.** Preview exactly which registry files a re-add would change,
  before anything is overwritten.
- **`aronia rebuild [--check]`.** Regenerate a drifted `aronia.manifest.json`
  from the registry. `--check` reports drift and exits non-zero for CI.
- **Self-describing manifests.** Each installed component, and the manifest as a
  whole, now records the registry `version` and source, plus a `_generated`
  marker warning agents not to hand-edit or merge it.
- **Font-swap guidance.** Every family's manifest documents how to swap its
  typeface without dissolving its character.
- **DropdownMenu** gains a `pill` shape option, matching the other
  shape-bearing components.

### Changed

- **Field** now propagates validation and size to the control it wraps: the
  wrapped input gets a real error border plus `aria-invalid`,
  `aria-describedby`, and `role="alert"` — in a Field or standalone.
- **Card** adopts Modal's considered layout: consistent rhythm, a flex footer
  with a `footerAlign` prop, and a `--<family>-card-max-width` cap.
- **Textarea** gets a thin, always-visible themed scrollbar per family, so an
  overflowing field no longer reads as a hard cut where the macOS overlay bar
  auto-hides.
- **Field / Input / Select** size sensibly instead of clipping long values or
  collapsing to roughly 20 characters.
- Public docs are honest about hosting (there is no public registry host yet;
  self-host over HTTP with `aronia add --registry <url>`) and current for the
  four-family lineup.

### Removed

- The orphaned `quiet` button variant. `ghost` is now the single borderless
  bare-text rung across all families; `muted` remains the bordered de-emphasis
  rung.

### Fixed

- Ghost buttons stay legible on inverted and vivid surfaces.
- Themed scrollbars flip correctly on dark stock.
- The Alert icon is vertically centered in its box across all families.
- Glassmorphism's skeleton shimmer stays in sync across lines added after mount.
- The CLI's `add` command validates its inputs, no longer leaks cache paths in
  errors, and routes results to stdout with diagnostics on stderr.

## [0.4.0]

First public release — the Neo-Brutalism, Glassmorphism, and Swiss families, 20
components each across React, Svelte, and HTML, installable with `npx aronia`.
