# aronia

**An agent-friendly design language you copy into your repo — not a black-box dependency.**

aronia isn't a component library you `npm install` and import from. It's a design
*language* delivered shadcn-style: one command copies real, editable component
source — tokens, styles, and a thin skin in your framework — into your repo,
alongside a machine-readable manifest. Your coding agent reads that source as a
worked example and builds the rest of your UI in the same style, unsupervised.

## Quick start

Bring the language in first — this commits to no style yet:

```sh
npx aronia init
```

That writes the onboarding and the full family menu into `aronia/`, with no
component code and no style adopted:

```
aronia/
  START.md               # optional: an agent-run conversation to choose a direction
  AGENTS.md              # how an agent should build with aronia
  aronia.manifest.json   # the family menu — no components, no style adopted yet
```

Then **point your agent at it**:

> Start at `aronia/START.md`. If I already know what I'm building and the style I
> want, skip it and build; otherwise help me choose. Then build with aronia and
> match `aronia/`.

`START.md` is optional — a short conversation for when you're not a designer and
want help settling the scope and picking one of the three families before any UI
gets written. Know what you want already? Tell the agent to skip it.

Once a style is chosen, pull components — the first `add` adopts that style (and
your framework), so later ones need no flag:

```sh
npx aronia add button --style swiss   # adopts swiss
npx aronia add card badge             # same language, no --style needed
```

Each `add` writes the tokens (once per style), the component's styles, and a thin
skin in your framework into `aronia/<style>/`, and records the component in
`aronia/aronia.manifest.json` — its style class, `data-*` attributes, files, and
full prop spec — so the agent works from the exact contract, not a guess.

## Styles

Three design languages, 20 components each. Add `--style <id>` to any command.

- **`neo-brutalism`** — thick black borders, hard offset shadows (no blur), flat
  saturated colour, chunky heavy type, and a tactile "shove" on press. For bold,
  playful, high-contrast interfaces.
- **`glassmorphism`** — frosted translucent surfaces over a backdrop blur, soft
  hairline borders, diffuse shadows, generous rounded corners. For modern,
  layered interfaces over vivid gradients or imagery. *(Needs a non-uniform
  backdrop — glass is invisible on a flat solid fill.)*
- **`swiss`** — clean, grid-driven minimalism: near-monochrome ink on white,
  hairline borders, crisp corners, flat surfaces, and a single hazard-orange
  accent. For precise, content-first, understated interfaces.

All three families ship: Button, Link, Card, Badge, Input, Textarea, Toggle, Checkbox,
RadioGroup, Select, Field, Modal, Alert, Tabs, Accordion, Dropdown Menu, Spinner,
Progress, Skeleton, and Toast.

## CLI

```sh
aronia init                            # bring the language + onboarding in, no style yet
aronia add <component...> [options]    # add components; the first add adopts a style
```

| Option | Description | Default |
| --- | --- | --- |
| `--style <id>` | `neo-brutalism`, `glassmorphism`, or `swiss`. Required for the first `add`; remembered after. | adopted |
| `--framework <fw>` | `react`, `svelte`, or `html`. | detected, else `react` |
| `--cwd <dir>` | Where to write the `aronia/` folder. | current dir |
| `--registry <src>` | Registry URL or local directory. | bundled |

The first `add` adopts its `--style` (and your framework) into the manifest, so
later commands are just `aronia add <component>`. Components pull in their
dependencies automatically (e.g. `toast` also adds `alert`); run `add` again to
grow your set — the manifest is merged, not overwritten.

## For AI agents

aronia is built to be read by agents, not just humans:

- **In a project using aronia**, the contract lives in `aronia/aronia.manifest.json`
  and the real source in `aronia/<style>/`. See [AGENTS.md](./AGENTS.md).
- **The full registry** (every style, component, prop, enum, and behaviour) is
  served as JSON: `/manifest.json` (whole catalog), `/<style>/manifest.json` (one
  family), and `/r/index.json` → `/r/<style>/<component>.json` (per-component
  items embedding spec, tokens, CSS, and framework skins). A machine-readable
  index is at [`/llms.txt`](./static/llms.txt).

## Development

This repo is the registry source **and** the docs site (SvelteKit).

```sh
npm install
npm run dev        # docs site + live registry endpoints
npm run registry   # rebuild static/r/ from the manifest + skins
npm run check      # svelte-check
npm run build      # prerender the docs + registry
```

Design decisions and history live in [DESIGN.md](./DESIGN.md).
