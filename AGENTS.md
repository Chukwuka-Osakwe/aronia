# AGENTS.md

Guidance for AI agents working in a project that **uses aronia**.

> Contributing to aronia itself? This file isn't for that — see [DESIGN.md](./DESIGN.md).

aronia is a design language copied into the repo via `npx aronia add`. When you
build or edit UI:

1. **Read `aronia/aronia.manifest.json` first.** It's the authoritative contract
   for every component that's been added — its style class, `data-*` attributes,
   files, and full prop spec. Match it exactly; do not invent props, values, or
   class names.
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

The full hosted reference (whole catalog and per-component items with tokens,
CSS, and framework skins) is `/manifest.json` and `/r/<style>/<component>.json`;
see [`static/llms.txt`](./static/llms.txt) for the machine-readable index.
