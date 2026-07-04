# Design Decisions

A running log of the important design and architecture decisions for this project — a Svelte component library where each component family embodies a distinct, recognizable visual design style (Neo-Brutalism, Glassmorphism, Bento Box, Memphis, etc.). Inspired by the "50 Design Styles for Better AI Prompting" taxonomy and the [Dimsum](https://dimsum.systems/) component-library + docs-site pattern.

Entries are appended chronologically. Newest decisions go at the bottom.

---

## Entry 1 — Foundations (2026-07-01)

### Project goal
Build a Svelte component library where each "family" of components embodies a specific design style from the design-styles taxonomy. Pair it with a Dimsum-style docs site (sidebar navigation + a live playground / prop table per component) to showcase and document each component.

### Framework
- **SvelteKit** (Svelte 5, SvelteKit 2), scaffolded with the **`library` template** via `sv create`.
  - Rationale: the library template gives us `src/lib/` (the publishable component package) **and** `src/routes/` (a showcase app) in one project — exactly the shape we want (library + Dimsum-style docs site).
  - TypeScript enabled. No add-ons at scaffold time.

### Styling approach
- **Primary: Svelte scoped `<style>` + CSS custom properties (vanilla CSS).** No Tailwind.
  - Rationale: we are building many radically different visual languages (hard shadows, blur/transparency, gradients, pseudo-elements). Utility-class frameworks fight this and devolve into walls of arbitrary values. Scoped CSS stays legible and doubles as a teaching artifact / reference.
  - Svelte's `<style>` is scoped by default → no BEM, no CSS-module naming overhead, no collisions.
  - **Design tokens** live as CSS custom properties, one set per style (e.g. `neo-brutalism.css`, `glassmorphism.css`). Makes theming and dark-mode trivial.
- **Docs-site chrome** (sidebar, grid, spacing): vanilla CSS as well, to keep the dependency count at zero. (Tailwind was considered and rejected for components; remains a defensible option only for the docs shell if speed is ever prioritized.)

### Component API pattern (modeled on Dimsum)
- Prop-driven with: **variants**, **sizes**, **shape** (square/pill), optional **leading icon**, **disabled** state.
- **Polymorphic rendering** where sensible (e.g. render a button as `<a>` or `<button>`).

### Rollout plan
- Build **one style end-to-end first** to prove the architecture. Starting with **Neo-Brutalism** — the most visually distinct style, so it validates the token + scoped-CSS approach fastest.

### Housekeeping
- Repo initialized with `git init` on branch **`main`**.
- Design log lives at repo root as `DESIGN.md` (the names `design.md` / `notes.md` / `kickoff.md` are intercepted by a global user-level Claude hook that reserves them for `/Users/apple/kickoff-notes/`).

---

## Entry 2 — Typography & self-hosted fonts (2026-07-01)

### Decision
Neo-Brutalism uses **Archivo** (blocky, condensed grotesque) as its display face, **self-hosted** via the `@fontsource-variable/archivo` package (variable font — all weights in one file). No Google Fonts CDN.

- **Why self-hosted:** no external CDN request, no privacy/GDPR concern, no runtime network dependency — the font is bundled with the library. Good default for a distributable component library.
- **The token `--nb-font`** now references `'Archivo Variable'` (the family name the package registers), with `'Helvetica Neue', Arial, sans-serif` as fallbacks so it degrades gracefully if the font ever fails to load.

### How it's loaded (and why it matters)
The font is pulled in via **`@import '@fontsource-variable/archivo';` inside `neo-brutalism.css`**, NOT via a JS/TS `import` in the component script.

- A JS side-effect import (`import '@fontsource-variable/archivo'`) makes TypeScript demand type declarations the package doesn't ship. Because this project's root `tsconfig.json` overrides module resolution to **`NodeNext`**, the package's `exports` map resolves the specifier directly to a `.css` file — so the usual `declare module '...'` ambient-declaration workaround is *ignored* (TS treats the module as resolved-but-untyped).
- Loading it through CSS `@import` keeps it invisible to TypeScript, lets Vite/PostCSS resolve and fingerprint the `.woff2` files into the build, and is architecturally cleaner: **font loading is a styling concern, so it belongs with the tokens.**
- Verified: production build succeeds, `publint` passes, and the Archivo `.woff2` binaries are emitted to the build output.

### Convention going forward
Each style's display font is self-hosted via its `@fontsource(-variable)` package and loaded through that style's token CSS with `@import` — never via a JS import in a component.

---

## Entry 3 — Bundler: pin to Vite 7 (2026-07-01)

### Decision
Pin the build tooling to **Vite 7** (with `@sveltejs/vite-plugin-svelte` v6), downgrading from the Vite 8 / Rolldown stack that `sv create` scaffolded by default.

### Why
- Vite 8 uses the brand-new **Rolldown** (Rust) bundler. On this machine (macOS arm64, Node 25) its native binary silently failed to install during scaffolding and required a full `node_modules` wipe + reinstall to recover — a toolchain hiccup, not a code problem.
- This project's purpose is learning Svelte and building components; time is better spent there than debugging a bleeding-edge bundler. Vite 7 is stable, matches ecosystem docs/tutorials, and has no Rolldown native-binary risk.
- Trade-off accepted: slightly slower cold builds. Upgrading to Vite 8 later is trivial once Rolldown settles.

### Result
- `vite@7.3.6`, `@sveltejs/vite-plugin-svelte@6.2.4` (deduped across the tree). No `rolldown` in `node_modules`.
- Verified: typecheck clean, production build + `publint` pass, dev server boots.

---

## Entry 4 — Product direction: an agent-friendly *aesthetic* library (2026-07-02)

### Decision
This project is an **agent-friendly aesthetic (design-style) component library**: a Svelte library indexed by *named visual styles* (Neo-Brutalism, Glassmorphism, Bento Box, …), built so both humans **and AI coding agents** can consume it correctly from its schema alone.

This is the guiding north star. It resolves what "agentic" means for us and takes precedence when future choices trade off against it.

### Context — where this came from
- Dimsum (https://dimsum.systems) bills itself as "an agentic component library for Ruby on Rails" but **never actually defines "agentic"** on its site. Its components are generic (Button, Card, Modal). So "agentic" there is a *design discipline*, not a runtime feature.
- We evaluated three readings and picked deliberately:
  1. **Components for building AI/agent UIs** (chat threads, tool-call cards) — REJECTED; different product from what we started.
  2. **Just a good multi-style component library** (drop the framing) — REJECTED; leaves the most interesting angle on the table.
  3. **An agent-friendly style catalog** — CHOSEN.
- Roots trace back to the origin article ("50 design styles for better prompting", https://uxplanet.org/50-design-styles-every-designer-should-know-for-better-prompting-56c09d55db62), whose thesis is *"AI understands style names."* Reference: Tim Deschryver, "Using Agentic AI to create your own component library" (https://timdeschryver.dev/blog/using-agentic-ai-to-create-your-own-component-library).

### What "agent-friendly" means in practice (design discipline)
Both a human and a model should be able to use any component correctly from its schema alone:
1. **Closed, enumerated APIs** — `variant: primary|secondary|muted|ghost`, not free-form styling. A model can't hallucinate an invalid value if the valid set is small and explicit. (Already how our components work, via `data-*` attributes.)
2. **Flat, prop-driven surface** — no hidden context or deep composition required to get a correct result.
3. **Machine-readable docs** — prop tables (name / type / default) are the spec.
4. **Low abstraction / transparent** — components an agent can inline and modify without fighting magic.
5. **Small, opinionated set per style** — strong conventions, less surface to get wrong.

### The distinctive angle (ours, not borrowed)
Agent-friendliness at **two** levels:
- **API level** — enumerated props (like Dimsum).
- **Aesthetic level** — an agent selects a *named style* (`neoBrutalism.Button`) from a known catalog of looks, matching the "style names" thesis.

### Concrete implications for the roadmap
- Keep enumerating component APIs strictly (continue the `data-*` / union-type pattern).
- Plan to expose a **machine-readable manifest**: styles → components → props/enums (the artifact an agent actually retrieves as context).
- The **docs shell** is the human-readable face of that same manifest — not a separate concern.

---

## Entry 5 — Manifest architecture & anti-drift strategy (2026-07-02)

### Decision
Ship the machine-readable manifest with a **layered anti-drift design** rather than either a hand-maintained central file (drifts most) or auto-derivation from types via AST tooling (fragile, and can't cover the prose fields anyway).

### The drift problem
The manifest restates facts the components already define (their prop unions). Two copies of one fact can disagree. The dangerous case: rename an enum value in a component but not the manifest → an agent confidently emits the old value → it silently renders **unstyled, with no error**. A subtly-wrong manifest is worse than none, because the agent trusts it.

### The strategy (three layers)
1. **Enums: single source of truth via `as const` arrays.** Each family has an `options.ts` where enum values are declared once as runtime `as const` arrays; the TS unions are *derived* from them (`(typeof ARR)[number]`). Components import the unions for prop types; the manifest imports the arrays for its `values`. An enum can only change in one place → enum drift is **structurally impossible**, no tooling.
2. **Co-locate the hand-authored prose** (`description`, `whenToUse`, `examples`) in each family's `manifest.ts`, next to the components — proximity is the cheapest guard for the parts that must be human-written.
3. **Type-checked usage as a guard.** The showcase page (`src/routes/+page.svelte`) uses every component with real props and is covered by `npm run check`, so a removed/renamed prop fails the build.

### Accepted residual
- Prose can go stale (low stakes — a dated sentence, not broken code).
- "Added a whole component but forgot the manifest" is only caught by the docs failing to list it. A proper presence-test is **deferred to when we stand up the test suite** (vitest), rather than bolting on a brittle script now.

### Shape & format
- Schema in `src/lib/manifest/schema.ts`; tree is `Manifest → StyleSpec → ComponentSpec → PropSpec`, with agent-oriented fields (`whenToUse`, per-component `description`, `import`) beyond a normal prop table. (An `examples` field was added then removed — see Entry 7.)
- Authored as **typed TypeScript** (types for the docs, compile-time safety for us); emitted as **JSON** via a prerendered SvelteKit endpoint (`src/routes/manifest.json/+server.ts`, `prerender = true`) — live at `/manifest.json` in dev, written to static output at build. No separate emit script.
- Each family contributes its own `StyleSpec`; `src/lib/manifest/index.ts` aggregates them. The manifest module graph is Svelte-free (pure TS), so it stays portable.

---

## Entry 6 — Docs shell + module-resolution fix (2026-07-02)

### Docs site — rendered from the manifest
> The UI specifics below were later restructured — see **Entry 7** for the current layout. The manifest-driven principle still holds.

The docs site is generated from the manifest, so human docs and the agent artifact can't drift:
- **Sidebar** (`+layout.svelte`) is built by iterating `manifest.styles`.
- **Component page** (`[style]/[component]/+page.svelte`) renders a live **Playground**, prop table, snippets, and examples entirely from a `ComponentSpec`.
- **Playground** (`Playground.svelte`) generates its controls from `spec.props` (enum→select, boolean→checkbox, string→text), renders the live component, and emits copy-paste code showing only non-default props.
- **Registry** (`routes/registry.ts`) maps manifest ids → real Svelte components. Kept OUT of the manifest so the manifest stays Svelte-free; importing every component here is also a free build-time guard (rename/remove one → build breaks).
- Every page is **prerendered** (`+layout.ts` `prerender = true`); the dynamic route's `entries()` enumerates all style/component pairs from the manifest, so the whole site is static.
- The old showcase moved to `/kitchen-sink` — it stays as the type-checked-usage guard (Entry 5, layer 3). It's **unlinked from the sidebar** (a dev/type-check artifact, not user docs) but still exists as a static route: svelte-check type-checks it and SvelteKit still prerenders it.

### Module resolution: NodeNext → bundler
Removed the scaffold's `module`/`moduleResolution: "NodeNext"` override (and `rewriteRelativeImportExtensions`) from the root `tsconfig.json`, so the app inherits SvelteKit's **`bundler`** resolution from `.svelte-kit/tsconfig.json`.

- **Why:** NodeNext enforces file extensions on relative imports, which breaks SvelteKit's extension-less `./$types` convention (and was the same root cause behind the earlier `@fontsource` type-resolution failure in Entry 2). `bundler` is SvelteKit's intended default; the scaffold's override was the bug.
- **Retro-note:** this means the Entry 2 font workaround (load via CSS `@import`) is no longer *forced* by the resolution mode — but it remains the better design (font loading is a styling concern), so that decision stands unchanged.

---

## Entry 7 — Docs UI: three-pane workbench (2026-07-02)

Restructured the component doc page into a Dimsum-style three-pane workbench (supersedes the UI specifics in Entry 6):

- **Left** — component nav sidebar (from the manifest).
- **Middle** — the header (crumb/title/description) plus the **visual output** and generated code. Fixed (does not scroll). Rendered by `Preview.svelte`.
- **Right** — a single paneled rail (white fill + left dividing line, mirroring the sidebar): one **Props** section (`Controls.svelte`) listing an interactive control per **snippet then prop**, each with a one-line `description` beneath it.
  - **No separate prop table.** We evaluated a Prop/Type/Default reference table and dropped it: it duplicated the controls (which already show names + enum options) and the canonical schema, which lives in `/manifest.json` by design. The table's only unique human value was the description, so that moved onto the controls. `type`/`default`/enum `values`/`required`/`bindable` stay in the manifest + `/manifest.json` for agents, off the human UI. (`PropsTable.svelte` removed.) Each `PropSpec` still carries a required `description`.
  - **No static Snippets section either — snippets are interactive.** `children` is an editable text field (drives the live label/body); `icon`/`header`/`footer` are boolean toggles that render sample content (★, "Header", "Footer") in the preview and add the corresponding `{#snippet …}` to the generated code. Snippet state lives in a `slots` `$state` proxy (parallel to `values` for props), owned by the page and shared with `Preview`/`Controls`. Content slots are listed first (content-first ordering). This removed the dead reference list and folded it into the playground.
  - `Preview.svelte` passes snippets to the dynamic component as props (`icon={…}` / `header={…}` / `footer={…}`, guarded by which snippets the component actually declares) and the default children slot as text.

---

## Entry 9 — Forced interaction states in the preview (2026-07-02)

Hover / active / focus are the states you can't see without physically interacting, so the docs surface them via a **states strip** under the live preview.

- **`data-state` convention.** Each component mirrors its interaction pseudo-classes with an attribute selector — e.g. `.nb-btn:hover, .nb-btn[data-state='hover'] { … }` (and the ghost-variant overrides too). Since components spread `...rest` onto their root element, the docs force a state just by passing `data-state="hover"`. It's a legit docs/testing hook (à la Radix/React-Aria `data-*` state attrs), not public API bloat.
- **Manifest declares the states.** `ComponentSpec.states?: StateName[]` (`'hover' | 'active' | 'focus'`) — Button: all three; Input & Toggle: `focus`; Card/Badge: none (no strip). Also surfaces each component's interaction states in `/manifest.json` for agents.
- **Preview renders it.** The component render is factored into one reusable `{#snippet instance(forced)}`; the stage renders `instance(undefined)` and the strip renders `instance(state)` for `default` + each declared state. Demo instances are `pointer-events: none` so a real hover can't disturb the forced state.
- Prop-driven states (`disabled`, Toggle `checked`) are intentionally *not* in the strip — they're already visible via the controls.

---

## Entry 10 — Docs token layer + typography pass (2026-07-02)

Introduced a **docs-chrome token layer** (`src/routes/docs.css`, imported globally in `+layout.svelte`) — deliberately separate from the component `--nb-*` tokens, and neutral so components stand out against it.

- **Tokens:** colour (`--doc-ink/bg/panel/line/muted/accent`), fonts (`--doc-sans` incl. `-apple-system`; `--doc-mono`), a 6-step type scale (`--doc-h1 … --doc-label`), and a spacing rhythm (`--doc-gap-section/pane`). Base styles (`body`, box-sizing, hidden scrollbars) moved here from the layout's scoped block.
- **Why:** colours, the mono font stack, and the uppercase micro-label treatment were hardcoded and subtly different in every file (labels ranged 0.65–0.8rem with varied tracking). Tokens kill that drift and make the chrome consistent as more styles are added.
- **Applied across** `+layout`, the component page, `Preview`, `Controls`, and the landing page: unified micro-labels, muted secondary text via a real colour (not scattered `opacity`), tightened heading `letter-spacing`/`line-height`, antialiased text, and a consistent section rhythm. (`kitchen-sink` left untouched — dev-only.)
- Two token namespaces now coexist cleanly: **`--nb-*`** = a design style's look; **`--doc-*`** = the documentation site's chrome.
- The former single `Playground.svelte` was split into `Preview.svelte` (middle) + `Controls.svelte` (right); the page owns the shared `values` state (a `$state` proxy passed to both).

**Scroll model:** the whole shell is locked to the viewport (`height: 100vh; overflow: hidden`); each region manages its own overflow. On component pages the content pane is full-bleed; the right rail scrolls, and the middle also scrolls internally (`overflow-y: auto; min-height: 0`) rather than clip when its content (preview + states strip + code) exceeds the viewport. Scrollbars are hidden globally (functional, no visible bar), so both scroll seamlessly with no on-screen bars. (Originally the middle was `overflow: hidden` / fixed, but the states strip made it clip content — see the note in the states work.) Mobile (<900px) falls back to normal document flow — to be redesigned from the ground up later.

**Examples removed:** the `examples` field/section was dropped entirely (schema, manifest data, `/manifest.json`, and UI). Component usage is still covered as a type-check guard by `/kitchen-sink` (Entry 5, layer 3).

---

## Entry 8 — Prop ordering convention (2026-07-02)

Props in a `ComponentSpec` are listed by **functional hierarchy** — not alphabetically, not required-first:

```
appearance  →  binding/behavior  →  state  →  escape hatch
```

- **appearance**: `variant`, `size`, `shape`
- **binding/behavior**: `href`, `value`, `checked`, `placeholder` (what the component *is*/does)
- **state**: `disabled`
- (**content** like `children`/`icon` lives in the separate Snippets section)

**Update (2026-07-02):** originally binding/behavior led. Switched to **appearance-first** because in the playground the appearance props (variant/size/shape) are what people reach for first, and leading with them reads better. Reordered Button (`variant → size → shape → href → disabled`) and Input (`size → value → placeholder → disabled`) to match.

The manifest's `props` array order **is** the order rendered in the docs' Props panel *and* the order agents read from `/manifest.json`, so ordering is controlled in one place. This is the template every future style follows.

---

## Entry 11 — Disabled = deliberate uniform state, not opacity (2026-07-02)

Originally `disabled` was just `opacity: 0.5` on the button. Problem: opacity **desaturates** the variant colour, so every variant collapses toward a washed-out near-`paper` look (worst for `muted`, which becomes ~indistinguishable from the default). It read like the variant was being *reset* — an accident of opacity, fighting Neo-Brutalism's flat/loud/saturated intent.

Fixed by making disabled a **designed, uniform inert state**: force `background: var(--nb-muted)` for all variants (variant colour intentionally dropped), keep the border + resting shadow, no shove, `cursor: not-allowed`, and a slight `opacity: 0.6` as the "off" cue (which also separates it from the *interactive* `muted` variant). One clearly-disabled appearance regardless of variant, rather than five differently-washed ones.

Principle for the family: **state treatments should be intentional, not side effects of a filter.** Every future style's disabled state follows this — collapse to a single inert look, don't just dim the variant.

Applied per component (the principle, not a blind copy):
- **Button** — decorative variants → collapse all to grey.
- **Input** — no colour variants → greyed `--nb-muted` background so a disabled field reads as clearly inert (plain opacity on a white field barely registered).
- **Toggle** — colour *is* state (grey = off, primary = on), so it is **kept**; collapsing to grey would hide on/off. Only the inert cue (`opacity: 0.6`, `not-allowed`) is harmonised. Rule of thumb: collapse *decorative* colour, preserve *stateful* colour.


---

## Entry 12 — Brand-controlled docs type (2026-07-02)

The docs chrome originally rode on a **system-font stack** (`-apple-system…`). That renders a *different* face per OS — San Francisco on macOS, Arial on Windows, Roboto on Android — and the mono stack diverges even harder (Windows drops to generic `monospace`). Fine for "native feel," but the docs then look different for everyone.

Chose **brand-controlled, self-hosted** chrome type instead:
- `--doc-sans` → **IBM Plex Sans Variable** (clean, slightly humanist warmth; frames without competing)
- `--doc-mono` → **Geist Mono Variable** (minimal, even)

Both via `@fontsource-variable/*` (the same self-hosting pattern as Archivo), `@import`ed in `docs.css`, variable + subset-split so only the needed `.woff2` loads. System stacks stay as fallbacks for the load flash.

Note the two-tier type model this cements: **chrome type is the docs' own brand** (`--doc-*`), **component type belongs to each style** (`--nb-font` = Archivo). A new style ships its own face without touching the chrome.

---

## Entry 13 — Shadow system as derived tokens (2026-07-02)

The NB hard-shadow used to be half-tokenised: the *size* was a token (`--nb-shadow-sm/md/lg`) but the shadow **colour** was hardcoded to `--nb-ink`, and the interaction **"shove"** distances were hardcoded in `Button.svelte` (`translate(2px,2px)` hover, `translate(5px,5px)` active) — numerically coupled to the shadow offset but free to silently drift if the offset changed.

Reworked into one derived system on `--nb-*` tokens:
- `--nb-shadow-offset` — the single throw distance (the main dial).
- `--nb-shadow-color` — **decoupled from `--nb-ink`**, so shadows can be retinted without touching borders/text.
- `--nb-shadow` — composed from offset + colour (blur/spread stay `0`, the NB signature).
- **Shove derives from the offset:** `--nb-shove = offset × --nb-shove-ratio` (hover), `--nb-shove-press = offset` (active), and `--nb-shadow-hover = offset − shove` so the element's *movement* and the *shadow shrink* always stay in lockstep. Change the offset and the whole interaction re-tracks.
- The hover press was **decoupled from `--nb-shadow-sm`** (an incidental cross-component coupling) and made a *fraction of the button's own throw*, so it always has a distinct hover step at any size.

Then **consolidated**: after tuning the sm/md/lg scale flat (all `1.5px`), collapsed it to a single `--nb-shadow` shared by every component. The size scale is gone (re-split the offset if a component ever needs a different depth).

Principle reinforced (cf. Entry 11): a style's signature effect should be **fully token-driven and self-consistent** — one dial changes, everything that depends on it follows, no hardcoded magic numbers left in component CSS.

---

## Entry 14 — Docs chrome type + heading-as-specimen (2026-07-02)

Two related type decisions for the docs chrome.

**Chrome is all-mono.** Replaced the earlier IBM Plex *Sans* chrome with an all-monospace treatment: `--doc-font` = **IBM Plex Mono** (nav, headings, descriptions, controls, prop names), giving the docs a deliberate "technical/terminal" brand. `--doc-code` = **Geist Mono** is now reserved for the details card only (import path + code), so the code surface reads as distinct. Plex Mono is static (no variable build on fontsource) and tops out at weight **700** — so the display headings, formerly 800, render at 700 (real face, no faux-bold).

**The component heading is a type specimen.** The `<h1>` (component name) adopts the *current style's* display font rather than the chrome font — land on Button and "Button" is set in Archivo. Rationale: for an *aesthetic* library, the page should start embodying the style immediately; the name is a 1–2 word specimen. Deliberately a **narrow, controlled exception** to the neutral-chrome rule — only the heading is themed; nav/controls/card stay neutral and consistent.

- **Subheading intentionally NOT themed.** It's body text; a display/script face on a full sentence hurts legibility, and this sets a precedent for every future style. Description stays in the neutral chrome font.
- **Mechanism (scales, no drift):** the header carries `data-style={style.id}` and one docs rule maps it to that style's own font token — `header[data-style='neo-brutalism'] h1 { font-family: var(--nb-font); }`. Each new style adds exactly one such line; no duplicated font stacks. Bonus: Archivo has a true 800, so the NB heading regains its chunky weight (vs Plex Mono's 700 ceiling).

---

## Entry 15 — States as a panel control, not a stage strip (2026-07-02, supersedes Entry 9)

Entry 9 showed forced interaction states (`hover`/`active`/`focus`) as a **strip of shrunken demos in the preview stage**. Replaced that: the strip is gone, and state is now a **control in the props panel** — a pseudo-enum (`default · hover · active · focus`) rendered identically to a variant control. Selecting a state forces it on the **full-size hero** component via `data-state`; `default` = live/interactive.

**Why the change:**
- The component now gets the **whole stage** ("component on its own"), which the strip was diluting.
- You inspect each state on the **real, full-size** component rather than a small demo — better for judging the signature "shove."
- A state *is* effectively an enum, so it reuses the existing inline-options control; near-zero new surface.

**Trade-off accepted:** you lose *simultaneous* side-by-side comparison (one state at a time now). Judged worth it — full-size fidelity + a clean hero beats a cramped side-by-side.

**Mechanism:** the page owns `forced` ($state, reset on component change), passes it down to `Preview` (applied as `data-state` on the hero) and to `Controls` (renders the selector + reports changes via an `onForce` callback — controlled, not `bind:`, consistent with the Switch fix). Forced state is **preview-only** — it never leaks into the generated code. The control is placed **first** in the panel so it's visible without scrolling. Still valid from Entry 9: components declare their states in the manifest (`states: [...]`), and each component mirrors the pseudo-classes with `[data-state='…']` selectors so they can be forced.

---

## Entry 16 — Shared control size scale as tokens (2026-07-02)

Button and Input each hardcoded their own size paddings/text (and had drifted — Input was on fractional-px `0.4/0.55/0.7rem` steps while Button used round px). Unified them onto one round-px scale, then lifted it into `--nb-*` tokens so the rhythm is defined once:

```
--nb-size-{xs,sm,md,lg}-pad   6/10 · 8/12 · 10/14 · 12/16px   (uniform +2px steps)
--nb-size-{xs,sm,md,lg}-text  12 · 14 · 16 · 18px
```

`sm`/`md`/`lg` are shared across sized components; `xs` is button-only. Any new sized control now reads `padding: var(--nb-size-md-pad); font-size: var(--nb-size-md-text)` instead of inventing its own numbers — same anti-drift principle as the shadow system (Entry 13): a signature/structural scale lives in tokens, not scattered across component CSS.

## Entry 17 — Sidebar nav is the style's own buttons + a `quiet` variant (2026-07-02)

The left sidebar nav was plain docs-chrome links. Two problems surfaced: (1) the active item was re-approximating a button in chrome CSS (drift risk), and (2) hovering a `display: block` link lit a full-width fill far wider than the active item — the "extends way beyond" report. Resolved by treating nav items as what they **are** — buttons — and rendering the **actual `<Button>` from the registry** (`registry[styleId].button`), never a CSS lookalike. Same truest-source philosophy as the heading specimen (Entry 14). Active = `secondary`, inactive = the new `quiet` variant, both `sm`. A plain-`<a>` fallback remains for any future style that ships no button.

**New `quiet` button variant.** Existing variants (incl. `ghost`) all keep the 3px border, so a full nav of them read as a heavy stack of boxes. `quiet` is `ghost` **plus `border: none`** — a bare, borderless text button (transparent, no shadow, no shove; muted fill on hover) for low-emphasis spots like nav. Added the honest way: appended to `BUTTON_VARIANTS` in `options.ts`, so it flows automatically into the type union, the manifest enum, and the variant control (agents see it). No manual sync.

**Specimen pattern is now a recurring convention, not a one-off.** A style advertises itself in its own display font in **three** quiet places on its page: the h1 (Entry 14), the sidebar **group label** (`.group__title[data-style='…']`), and the nav **buttons** (real components). Everything else stays neutral Plex Mono chrome so the identity reads without shouting. **Extension point for a new style:** one CSS line each in the `h1` and `.group__title` specimen rules (`[data-style='<id>'] { font-family: var(--<id>-font) }`), and a `button` entry in the registry — the nav and its fallback then work with no further wiring.

**Chrome symmetry.** Both panels now open with a matching centered, uppercase, tracked header over a full-bleed 1px rule: "PROPS" (right rail) and the "AESTHETICS / agent-friendly UI" brand block (left sidebar). Full-bleed is done with negative side margins equal to the container's horizontal padding — the shared idiom for every edge-to-edge rule in the chrome (brand, group headers, the nav divider).

## Entry 18 — Forms batch: native elements + the manifest extensions it forced (2026-07-03)

Added the five-component forms batch — **Textarea, Checkbox, RadioGroup, Select, Field** — taking the set to 10. Selection was by *frequency × difficulty-to-get-right*, not frequency alone: for vibecoders leaning on an AI, easy primitives (Badge) add mostly style consistency, while the interactive/a11y ones are where AI-generated code is routinely broken, so that's where the library earns its keep. Forms went first (densest need, mostly low-risk, keeps momentum); the hard-interactive batch (Modal et al.) comes next.

**Native-element philosophy (the load-bearing decision).** Every input is a real, visually-hidden **native** control — `<textarea>`, `<input type="checkbox">`, `<input type="radio">`, `<select>` — restyled via a sibling/overlay for the NB look. This buys real keyboard a11y, focus, typeahead, and *actual form submission* for free, and it's what an agent can wire up reliably. The visible cost (e.g. the native `<select>`'s OS-level dropdown animation) was explicitly judged worth keeping over a custom listbox. Custom listboxes/comboboxes are a **deliberate deferral** — the positioning/focus rabbit hole, for a later "overlays" batch.

**Three manifest/playground extensions the batch forced (all now reusable):**
- **`number` control** — the `number` PropType existed in the schema but had never been rendered; Controls now renders a real number input (Svelte coerces the bound value to a number). First used by Textarea `rows`.
- **`array` PropType** — for choice sets (`options`). Flows end-to-end: schema → a comma-separated editor in Controls → code-gen emits `options={['A','B']}` (shown even at default, since options *are* the usage; empties filtered). Used by RadioGroup **and** Select — solved once, paid off twice.
- **`sample` snippet hint** — `SnippetSpec.sample` names a component id to render as a **live control** inside a wrapper (vs editable text). Field uses `sample: 'input'`, so the docs render a real focusable `<Input>` inside it, the panel drops the meaningless children-text editor, and code-gen prints the true composition `<Field><Input/></Field>`. General mechanism, not a Field special-case — any future wrapper (form rows, input groups) reuses it.

**NB indicator language.** Checkbox = yellow fill + hard black **tick**; RadioGroup = hard **square** dot (NB's `radius: 0`, deliberately not round) that fills yellow + inner black square — the *tick vs solid-block* distinction keeps the two from reading identically while both stay square. Field's required mark + error message use `--nb-accent` (the pink otherwise reserved for focus) as the single "attention" colour.

**Field default = minimal.** `help` ships with **no default** (empty) and the example ("We'll never share it.") demoted to the panel *placeholder* — so Field opens as a clean Label + Input, and the hint reads as opt-in. Principle: a wrapper's most honest default is the barest one.

**Open item — the type ladder (deferred, evidence now piling up).** Type sizes/weights are still only partly systematised (Entry 16 covers control *sizes*; weights are one token `--nb-font-weight: 800` with off-token exceptions). The forms batch added data points that now suggest a clear ladder: **800** display (buttons/badges) · **700** field label · **600** input text (Input/Textarea/Select all landed here) · **500** support text. The one real gap: **Checkbox / RadioGroup / Toggle labels all inherit their size (no explicit `font-size`)** — three components now share it, so they should be fixed together when the ladder is tokenised. Code-gen also has a known limitation: props equal to their default are omitted, which undersells Field's `label` — fixable via an "always show" flag if wanted.

## Entry 19 — Theming: token contract + hardening (2026-07-03)

Audited how easily a consumer can rebrand. Verdict: **colour theming is easy by construction** — every colour a component paints with is a `--nb-*` CSS custom property, so overriding the palette (at `:root`, or scoped to a subtree) re-skins everything, because custom properties cascade *through* Svelte's scoped styles (scoping rewrites selectors, not `var()` resolution). The grep found only two hardcoded leaks, both in Modal; both now tokenised:

- **`--nb-backdrop`** — the overlay dim. Derived from ink: `color-mix(in srgb, var(--nb-ink) 55%, transparent)`, so re-tinting `--nb-ink` carries the backdrop with it.
- **`--nb-shadow-lg`** (offset `4px`) — a second shadow depth for large surfaces (Modal now; Drawer/Sheet later). Resolves the shadow-sprawl debt flagged in Entry 13's spirit: big surfaces read a token instead of hardcoding px. (`--nb-shadow` stays the 1.5px control depth.)

**The token contract (what a consumer overrides).** Split into two layers — the split is the mental model: *structure = the style, palette = the brand.*

- **Brand palette (override freely):** `--nb-ink`, `--nb-paper`, `--nb-primary`, `--nb-secondary`, `--nb-muted`, `--nb-accent`, `--nb-info/success/warning/danger`, `--nb-backdrop`, `--nb-font`, `--nb-font-weight`.
- **Structure (override deliberately — changes NB's identity):** `--nb-border-width`, `--nb-radius`, `--nb-shadow-offset`, `--nb-shadow-lg-offset`.

Two caveats that are documentation, not bugs: overrides must win the cascade (load after the library CSS, or scope them), and `--nb-primary` intentionally paints every primary surface at once (consistent brand, broad reach).

**Surfaced for users, not just this log.** The same contract lives on a new static **`/guide` ("How to use")** page — import example, a pointer to `manifest.json`, and the two token tables — linked from the sidebar next to `manifest.json`. Rationale: the theming story is only real if a consumer can find it; and the token tables double as agent-facing (a model can read the overridable tokens and rebrand correctly). This is the first non-component docs page; future how-to content lands here.

## Entry 20 — Toast: an imperative component, and teaching the playground to show one (2026-07-03)

Toast is the batch's outlier and the first component that is **not a rendered element**. You don't write `<Toast>`; you call `toast('Saved!')` (or `toast.success/error/warning/info`), and a single `<Toaster />` mounted at the app root shows the stack.

**Architecture.** `toast.svelte.ts` holds a module-level `$state<ToastItem[]>` array, mutated in place (`push`/`splice`) so its reference stays stable and importers stay reactive. `toast()` pushes + schedules auto-dismiss (`duration: 0` = sticky); `dismiss()` removes + clears the timer. `Toaster.svelte` renders the array bottom-right in a fixed stack, **reusing `<Alert>`** for each toast's skin (same variant colours + icons, no duplication). a11y: the stack is a plain `role="region"`; announcement rides on Alert's own `role="alert"/"status"` firing on insertion, so there's no second live region double-announcing. The host is mounted once in the root layout — the honest real-world usage.

**Docs playground accommodation.** The generic middle-pane (Preview) assumes "render a component with props." Toast breaks that, so a small, *general* seam was added rather than a toast special-case:
- **`triggerActions`** (in registry.ts, keyed like the component registry): a component can register an imperative action fired by the stage trigger instead of toggling an `open` prop. Toast's runs `toast(message, { variant, duration })` from the current panel values.
- Preview: when a `fireAction` exists, the trigger runs it, **no inline instance is rendered** (the app-root `<Toaster />` is the only host — rendering one in the stage would double-mount the singleton store), and the code-gen prints the imperative call (`import { toast }` + `toast.success('…')`) instead of an element.

This keeps the "every component has a live playground page" invariant intact even for a component that has no element to place on the stage. The seam generalises to any future imperative API (a confirm() dialog, a command palette).

**Also this batch:** tokenised the last hardcoded values into `--nb-backdrop` / `--nb-shadow-lg` (Entry 19); Tabs panel width now shrink-wraps the tab row (`width:0; min-width:100%`) with one-line demo copy for even height.

## Entry 21 — Prop-preset + token-override: component-level theming (2026-07-03)

Extends the theme contract (Entry 19) from global `--nb-*` tokens down to per-component ones. Prompted by: "can a consumer customise Spinner's speed beyond the prop?"

**Principle: a prop supplies presets; a public CSS custom property supplies arbitrary override — and the token wins without a specificity fight.** On Spinner:

```css
animation-duration: var(--nb-spinner-duration, var(--_nb-spinner-speed, 0.9s));
```
- The `speed` prop (slow/normal/fast) sets the **private** `--_nb-spinner-speed`.
- The **public** `--nb-spinner-duration` is first in the `var()` chain, so a consumer setting it anywhere (inline, a class, `:root`) beats the preset **by var() precedence, not cascade specificity**. This is the crux: the earlier version had the preset set the public var directly at attribute specificity (0,2,0), which a plain `.nb-spinner {}` rule (0,1,0) couldn't override. Splitting public-override from private-preset removes the specificity trap.
- **Accessibility outranks both:** the reduced-motion rule sets the `animation-duration` *longhand* at higher specificity, so it overrides any consumer token. Motion accessibility is not customisable away.

Logged into the `/guide` "How to use" page (new **Component tokens** subsection + `--nb-spinner-duration` in a table) so it's discoverable by humans and agents.

**TODO:** apply the same public-override token to the other prop/hardcoded animation values (Accordion open/close, Progress fill + reveal) so motion is uniformly tunable.

**Batch context (this session):** added Spinner, Progress, Accordion, Dropdown Menu (count → 18). Dropdown is built on native `popover` + CSS Anchor Positioning (no JS positioning lib); Accordion animates open/close via `::details-content` + `interpolate-size`; both progressively enhance. Added a `parameterized` snippet flag (Tabs + Accordion share the per-item panel machinery). Fixed the number control to write `values` via an explicit handler (was `bind:value`, wasn't propagating), and learned that a `width:100%` fill collapses in the shrink-to-fit stage → components that fill need a definite width.

## Entry 22 — Glassmorphism: a second style proves the model generalises (2026-07-03)

The whole thesis (Entry 1) was that a token namespace + a co-located `StyleSpec` + a registry entry is *all* a new visual family needs. Glassmorphism is the test — and deliberately the **antithesis of NB**: translucent frosted surfaces over `backdrop-filter: blur()`, soft hairline "rim" borders, diffuse low-opacity shadows (no hard offset), rounded corners, Inter (airy) instead of Archivo (chunky). Even the motion inverts: **glass *floats* up on hover; NB *shoves* into its shadow.** Same manifest schema describes both.

- **What it took to add a whole style:** one token file (`styles/glassmorphism.css`, all `--glass-*`), a component family (`lib/glassmorphism/` — Button + Card to start, plus `options.ts`/`index.ts`), a `manifest.ts` StyleSpec, and **four one-line wiring edits** — namespace export (`lib/index.ts`), styles array (`manifest/index.ts`), the registry, and a specimen-font rule each in the nav + component-page h1. The `[style]` route, prerender `entries`, landing cards, and manifest.json all picked it up **with zero changes** because they iterate `manifest.styles`. That's the generalisation, demonstrated.

- **The glass problem — it needs something to frost.** Glass over a flat light pane (`--doc-bg #f4f4f0`) is nearly invisible; the blur has no content to refract. Fix: a **per-style stage backdrop** — the docs stage gets `data-style` and glass gets a vivid multi-radial-gradient "canvas." Same trick on the landing specimen (a gradient tile behind the translucent card). NB keeps the plain pane. This is a docs-chrome concession the *style itself* drives, not a component hack.

- **Reading on light UIs:** vivid variants (`primary`/`secondary`) use translucent *colour* fills so they read on any background; the frosted `surface`/`ghost`/`quiet` variants lean on the soft shadow + rim for definition. Nav `quiet` items are bare text (fine on the white sidebar), active is `secondary` (reads). So the specimen-button nav still works for glass without a backdrop.

- **Font:** self-hosted `@fontsource-variable/inter` (family `'Inter Variable'`), same self-hosting philosophy as Archivo — the specimen font renders identically across machines.

**Next for glass:** it's 2 components deep (Button, Card) vs NB's 18. Expanding means re-skinning the same manifest entries in the glass idiom — the interesting cases will be the ones whose NB version leans hard on borders (Input, Alert, Tabs) where glass has to find a translucent equivalent.

## Entry 23 — The rule: a library owns its left nav AND its whole middle pane (2026-07-03)

The moment a second style existed, the docs stopped being neutral: on `/glassmorphism/*` the left nav still listed all 18 NB components, and the middle pane's code card wore NB's hard offset shadow. A glass component sat inside an NB frame. The fix is a stated **principle** — *each library defines the presentation of its left nav and everything in its middle pane* — implemented in two halves:

- **Left nav scoped to one library.** The sidebar shows only the active route's style (its header + components, rendered as that style's own buttons); other styles collapse to a single title. On home/guide (no active style) every style shows as a bare index link. So entering a library *replaces* the nav rather than appending to a global list. This completes the "each style is a library you *enter*" model that the landing launcher cards set up.

- **Middle-pane chrome contract (`--doc-card-*`).** The details/code card in `Preview.svelte` reads a token set — `--doc-card-{bg,ink,muted,border,shadow,radius,filter,hover}` — whose **fallbacks are deliberately NEUTRAL, not NB.** Each style remaps them in its own scope: `.workbench__main[data-style='<id>']` (in the component `+page.svelte`) sets the tokens *and* the pane backdrop. NB → hard `6px 6px 0` shadow, square, ink border. Glass → translucent `--glass-surface-strong` + `backdrop-filter: blur()` + soft shadow + 16px radius, over the gradient pane.

**Why neutral defaults matter (the crux):** this is the root fix for the original "glass looks like NB" complaint. If the chrome had *defaulted* to NB, every future style would inherit NB's look until it fought back. With neutral defaults, **no style is privileged** — a library that defines nothing renders neutral, never like some other style. Adding a style = add one `data-style` block; the whole middle pane follows.

**Mechanism:** custom properties inherit, so `--doc-card-*` set on `.workbench__main` cascade *across the component boundary* into the child `Preview`'s `.details` — the contract needs no prop-drilling. **Deliberately out of scope:** the right PROPS rail stays neutral chrome — it's tooling, not showcase, so it doesn't wear any style.

## Entry 24 — Accessibility rule: WCAG AA for text, measured not eyeballed (2026-07-03)

**Standing rule, effective now:** all text meets **WCAG 2.2 AA** against its resolved background — **4.5:1 for normal text, 3:1 for large** (≥24px, or ≥18.66px/14pt bold). Verified with actual ratio math, never by eye.

**The nuance that makes this non-trivial here: contrast is background-dependent, and Glassmorphism's background is the *consumer's*.** So the guarantee is layered:
- **Opaque surfaces** (all of NB; glass's solid/vivid fills) — we own both colours, so we guarantee the ratio outright.
- **Translucent fills carrying white text** — tuned to pass over a **pure-white worst case.** White is the lightest possible backdrop, and a translucent fill over a *lighter* background composites *lighter* (lower contrast with white text). So passing over white **guarantees AA over any backdrop the consumer supplies.** That's the key move.
- **Frosted surfaces whose text sits over the consumer's arbitrary backdrop** — kept legible against the intended (vivid/gradient) backdrops and declared via the style's `requires` (Entry, the `requires` field). We can't promise a fixed ratio over an unknown backdrop, so we're honest about it instead of pretending.

**Audit (composited-contrast script, throwaway in the job tmp):** NB came back clean everywhere (6.2–15.9:1). Glass dark-text-on-tint (Alert) fine (13–15:1). Three real failures, all fixed:
1. **White on glass vivid fills** — `primary` 3.5, `secondary` 2.9, `accent` 2.8 (all FAIL): the base hues were too light for white text even before translucency. Darkened to indigo-600 / pink-700 / blue-700 at α 0.9 → **5.1–5.4:1** (composited over white), still faintly translucent.
2. **Landing caveat note** dimmed with `opacity: 0.8` → 3.4 (FAIL). Removed the opacity; the note is subordinated by **size + a divider, not lowered contrast**. → **Principle: never encode visual hierarchy as reduced contrast** — use size/weight/spacing.
3. **Component-page description** (muted grey) on the glass gradient → 1.9–3.8 across the gradient (FAIL). Darkened to `--glass-ink` on glass routes → **6.5–13:1**.

**Follow-up — the audit above only checked ink-on-*fills*, so it missed *coloured text on backgrounds*.** Later caught **NB Field's error text**: `--nb-accent` (hot pink) at **2.66:1** on the stage — a fail on *error* messaging, the worst kind to be illegible. Fix: a dedicated `--nb-danger-ink` (red-700, 5.9:1 cream / 6.4:1 white) for error *text*, kept separate from the pink focus-ring accent (a non-text ring), and the help line moved off `opacity: 0.7` to a pure size/weight hierarchy. Glass Field shipped with the same split (`--glass-danger-ink`) from the start. **Lesson: audit text colours against their actual backgrounds, not just fills — and error/help text is exactly where low contrast hides.**

**Reusable tooling:** `scripts/contrast.mjs` — a CLI contrast checker (relative luminance + alpha compositing of both fg and a translucent bg over an opaque base, default white). `node scripts/contrast.mjs "<fg>" "<bg>" [base] [--large] [--aaa]`; exits non-zero on fail, so it's CI-friendly. This is the tool of record for the AA rule — every new token pair gets checked with it, not by eye.

## Entry 25 — Glassmorphism reaches full parity (18/18); Toast's per-style store (2026-07-04)

Glass now implements **all 18** NB components. The core thesis held across every one: a `--glass-*` token file + a co-located `StyleSpec` + a registry entry was all each needed; the shared docs machinery (Preview, Controls, roving-tabindex, parameterized snippets, the value-slide animation) was reused untouched. The interesting translations were the border-heavy ones — Alert became a **light frosted tint** of the status colour (vs NB's bold fill), Tabs/Accordion became frosted surfaces with faint dividers, and the round controls (Spinner, RadioGroup dot, Toggle thumb) went circular where NB is square.

**Motion diverged by design, not accident.** Glass floats/eases; NB shoves/snaps — same manifest, different feel. The Dropdown + Modal got a glass-only `@starting-style` + `allow-discrete` open/close (fade + scale, animates *out* too); NB was left snapping because the abrupt cut is on-brand for brutalism. (Noted but not done: the exits are symmetric with the entrances; the interaction skill would have them quicker/subtler.)

**Toast — the one non-skin outlier.** Each style owns its **own** toast store (`toast.svelte.ts`, a module-level `$state` array) **and** Toaster host, fully isolated — glass toasts never touch NB's stack. The root layout previously hardcoded NB's Toaster ("single style for now"); it now mounts the **active route's** host via `registry[activeStyle]?.toast`, so exactly one host is live at a time (none on home/guide). The docs fire it through the existing `triggerActions[styleId][componentId]` seam — one new entry, no Preview changes.

Every colour pair introduced across the whole glass build was checked with `scripts/contrast.mjs` against the AA rule (Entry 24), not by eye — vivid fills tuned to clear 4.5:1 over a white worst-case, `--glass-danger-ink` for error text, hierarchy via size/weight not opacity. Two library-wide side quests along the way: `size` added to Toggle + Checkbox (both styles), and NB Field's pre-existing error-text AA fail fixed.

## Entry 26 — A Link component; the nav becomes links, not buttons (2026-07-04)

The sidebar's 18–19 items overflowed on shorter viewports. The fix doubles as a real component: a **Link** (both styles, the 19th component). Two honest notes framed it:

- **It wasn't a semantics fix.** Nav items were *already* `<a>` — `Button` is polymorphic (`href` → anchor). So the win isn't correctness; it's (1) **compactness** — lighter link styling + a tighter list gap (`0.5rem → 0.15rem`) shrinks per-item height enough that the full list fits without scrolling — and (2) **filling a genuine gap**: navigate (Link) vs act (Button) is a real design-system distinction the library lacked.
- **The "specimen nav" identity survives.** The nav is still built from the system's own component (`registry[style].link`), just the *right* primitive now — so we keep the "docs built from the system" quality we'd debated, without the chunky-button weight.

**API:** `variant` (`inline` for prose | `nav` for sidebar/menu), `active`, `external` (new tab + ↗), `href`. **Active state = weight + colour only** (chosen over a filled pill or an accent bar — it's the most compact, best serving the overflow goal), plus `aria-current="page"` so the deliberately-subtle visual cue is still announced to assistive tech.

**AA gotcha (measured, per Entry 24):** every NB/Glass brand colour (yellow, cyan, pink; the translucent indigo accent) is a *fill* — too light for text (cyan `#4dabf7` is ~2:1 on white). So a link needs a text-safe colour: added `--nb-link-ink #1971c2` (5.0:1) and `--glass-link-ink #4f46e5` (6.3:1), used for both inline links and the active nav item. Pink/yellow/cyan stay decoration-only (underlines, hover highlights, focus rings). NB's inline-link hover flips to the pink highlight with ink text — checked at 6.4:1.

**Follow-up — the Link's interaction language (after two rounds of trimming).** The first cut (persistent underline + an NB pink-highlight hover) was too heavy. Landed on: **coloured text at rest, hover steps up the weight and eases a native underline in; the active nav item is the "stuck hover" — coloured + bold + a persistent underline** (so the current page is the only item that's both coloured *and* underlined — distinct without a pill or fill). Nav *inactive* stays neutral ink (a 19-item all-coloured sidebar would read as more, not less). Briefly built the underline as a `background-size: 0%→100%` gradient "wipe", then **dropped it for native `text-decoration`** eased via `text-decoration-color: transparent → currentColor`: the gradient hack only underlines a single line (breaks on wrapping inline links) and slices through descenders, whereas native wraps correctly and `text-decoration-skip-ink` steps around the tails of g/y/p. Lesson: the clever version was strictly worse — reach for the platform underline, animate its colour.

## Entry 27 — Typography pass: a named weight scale + tokenised sizes (2026-07-04)

The deferred pass over the *type on the components* (not the rendering-details skill). Audit found `font-family` and `font-size` were already ~fully token-driven, but **weight was the unsystematised axis**: only the brand weight was a token; every other weight was a scattered magic number, and the "regular" weight disagreed between components (NB 500 vs 600; glass 450 vs 500).

- **Weight scale (both styles).** Four named steps — `--*-font-weight-{regular,medium,semibold,bold}` — capturing every weight already in use, so **zero visual change**; the numbers just got names. NB `500/600/700/800`, glass `450/500/600/700`. The brand `--*-font-weight` is now an alias to its tier (NB → bold, glass → semibold). The **body-vs-form-control split is intentional and now explicit**: body copy = `regular`, form-control text = `medium` (a deliberate notch heavier for legibility in a field). Rolled through every component via a per-directory replace.

- **Ad-hoc sizes, case-by-case.** Badge `0.75rem` → `--*-size-xs-text` (was identical). Tabs `0.9375rem` (an off-scale 15px) → `--*-size-md-text` (16px — a deliberate 1px bump to land on the scale). Modal title `1.25rem` → a new **per-style** `--*-size-title` token: NB **22px** (chunkier, to carry brand presence), glass **20px** (softer) — so titles now differ by style instead of sharing one value. Alert's `1.05em`/`1em` left as-is: they're variant-relative `em`, which is correct, not ad-hoc.

Only two things moved visually: Tabs 15→16px, and the NB Modal title 20→22px. Everything else is byte-for-byte the same weight/size, now systematised.

## Entry 28 — Nav sheds the library title; a per-library "about" page (2026-07-04)

The active library's name header sat above the component list, eating vertical space in an already-tight nav. Removed it — on a library route the links now own the entire scroll area. The library's identity didn't vanish, it **moved**: a new **"about {library}"** link in the footer's manifest section (shown only when a library is active, alongside "how to use" / "manifest.json ↗").

That link needed a destination, and there was no `/[style]` route — only `/[style]/[component]`. Added one: **`/[style]/+page.{ts,svelte}`**, a library overview generated from the `StyleSpec` — name in the library's own display font (the specimen pattern), `description`, `whenToUse`, the `requires` caveat when present, and a link into the components. So the manifest's prose fields (written for agents) now also back a human-facing page. The home/guide collapsed switch-links are unchanged.

## Entry 29 — Skeleton, the 20th component (2026-07-04)

Rounded the set from 19 → 20 (in both styles, parity held). Skeleton is a loading placeholder: `shape` = `text` (N stacked lines, last one short like a ragged paragraph), `rect`, or `circle`; `lines`/`width`/`height` size it. Decorative but self-describing — `role="status"` + `aria-label="Loading"` on the root (one live region per skeleton, not per line).

It earns its place as a **motion specimen**: the two styles diverge exactly on how they say "loading" — NB a blunt **opacity pulse** on a flat muted square block; glass a **shimmer** (a bright highlight swept across a frosted translucent surface via `background-position`). Both honour `prefers-reduced-motion` (fall back to a static placeholder). Sits with the feedback family (Spinner/Progress) in the manifest; the nav sorts it alphabetically between Select and Spinner.

## Entry 30 — CI, and the WCAG-AA rule made machine-enforced (2026-07-04)

Added `.github/workflows/ci.yml` — on every push to main + every PR, a clean machine runs four gates: `npm ci` (lockfile-exact install) → `npm run check` (svelte-check, 0 errors) → `npm run check:contrast` (the AA gate) → `npm run build` (prerender the docs + `svelte-package`/`publint` the library). Standard hardening: `concurrency` cancels superseded runs, `permissions: contents: read`, Node 22 + npm cache. Verified green locally end-to-end before committing the workflow.

The headline is the **contrast gate**, which turns the AA rule (Entry 24) from a discipline into an invariant. `scripts/contrast.mjs` was refactored from a pure CLI into a **library + CLI**: it now `export`s `parseColor`/`over`/`luminance`/`contrast` + a `ratio(fg, bg, base)` helper, with the CLI body guarded behind an `import.meta.url === argv[1]` check. `scripts/contrast-audit.mjs` (script `check:contrast`) imports `ratio` and asserts **20 AA-critical pairs** — docs chrome (muted greys), NB ink-on-fills + the `-ink` text colours, glass translucent fills carrying white labels + the soft/link/danger inks — each composited over a white worst case, failing non-zero if any drops below 4.5:1. All 20 pass; tightest margins are the ones to watch on any palette change: docs-muted-on-doc-bg **4.59**, glass-ink-soft **4.99**, NB link-ink **5.02**. Maintenance: add a row to `CASES` whenever a new text colour is introduced. (Note: CI is dormant until the repo is pushed to GitHub — currently 0 commits, no remote.)
