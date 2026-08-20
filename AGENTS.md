# AGENTS.md

Guidance for AI agents working in a project that **uses aronia**.

> Contributing to aronia itself? This file isn't for that — see [DESIGN.md](./DESIGN.md).

> **First, check the gate in [START.md](./START.md).** Before you write, add, or
> edit any UI, see whether the scope and design direction are settled — what's
> being built, a style chosen, the brand set, someone driving who knows what they
> want. If they are, you've cleared the gate — continue below. If they aren't,
> **offer** the short conversation in START.md (it's optional and the human's
> call): ask once whether they'd like to talk the direction through — style,
> scope, how widely aronia applies — or just get building, and honour the answer.
> Don't impose it; don't silently skip it either.

aronia is a design language copied into the repo via `npx aronia add`. When you
build or edit UI:

1. **Read `aronia/aronia.manifest.json` first.** It's the authoritative contract
   for every component that's been added — its style class, `data-*` attributes,
   files, and full prop spec. Match it exactly; do not invent props, values, or
   class names. It also carries each style's `principles` (how to compose in the
   design language), `avoid` (anti-patterns), `composition` (page-level type
   scale, spacing ramp, breakpoints, container, and media treatment), and
   `fontGuidance` (how to swap the family's typeface without dissolving its
   character) under `styles.<style>` — **follow them when laying out whole pages**, so the UI reads
   as the style, not just as a pile of its components.
   **It's a generated file — never hand-edit or merge it** (e.g. when consolidating
   repos); to change what it records, re-run `npx aronia add`, which regenerates
   it. The `_generated` marker at its top says the same.
2. **Read the real source in `aronia/<style>/`** as a worked example, and build
   new UI in the same design language — the same tokens, the same `data-*`
   conventions, the same structure. Consistency with the existing components is
   the goal.
3. **Need a component that isn't there yet?** Add it rather than hand-rolling one:
   `npx aronia add <component> --style <style> --framework <the project's framework>`.
   Components pull their dependencies in automatically.
4. **Re-theme by overriding CSS custom properties** in `aronia/<style>/tokens.css`
   — never by hand-editing a component's internals. The palette is meant to be
   overridden; the structural tokens change the style's identity.
5. **Dark mode is opt-in, via a `data-theme` attribute.** Every family ships a dark
   theme inside the same `aronia/<style>/tokens.css` — no separate file, nothing to
   wire; it arrives on install. Set `data-theme` on the subtree you want themed:
   `"dark"` forces dark, `"light"` forces light, and `"auto"` follows the reader's OS
   (`prefers-color-scheme`). With **no attribute the components stay light** — aronia
   never flips your page on the end-user's OS setting, so going dark is always your
   explicit choice, on the scope you pick. Under the hood it re-values the one palette
   (`light-dark()` + `color-scheme`), so components adapt for free — don't hand-write
   per-component dark overrides. How each family's dark mode *looks* (and what it
   deliberately avoids) is in its `principles`/`avoid` (see item 1).
   **The one gotcha — give a surface YOU style a theme-aware ink.** aronia's bare-text
   rungs (a `ghost` button, an inline link) follow their surface via `color: inherit`
   by design, so they read on an inverted card. If you place them on a surface you've
   styled yourself, set that surface's `color: var(--<style>-ink)` — otherwise they
   inherit whatever ambient text colour is there and can vanish against a dark ground.
   aronia's own cards and panels already handle this; it only bites on surfaces you
   author.

Everything you need is local — the manifest and the real source under `aronia/`
are the authoritative reference, and no network access is required. (The registry
can also be self-hosted over HTTP and pulled with `aronia add --registry <url>`,
but there's no public host today.)

## Recommended companion skills

aronia's `composition` guidance covers only what's specific to each style — its
type scale, spacing, breakpoints, container, and media treatment. It deliberately
does **not** restate universal design hygiene (line-height by role, capping the
measure, neutral image outlines, concentric radius, and the like). For that layer,
install and apply Jakub Krehel's design skills — they're the authoritative source,
and pairing them with aronia is the intended setup:

- **[jakubkrehel/skills](https://github.com/jakubkrehel/skills)** — `better-typography`,
  `better-ui`, `better-colors`. Install: `npx skills add jakubkrehel/skills`.

Use aronia for the per-style vocabulary and those skills for the universal polish;
the two are complementary, not overlapping.
