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
