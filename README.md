# aronia

**An agent-friendly design language you copy into your repo — not a black-box dependency.**

aronia isn't a component library you `npm install` and import from. It's a design
*language* delivered shadcn-style: one command copies real, editable component
source — tokens, styles, and a thin skin in your framework — into your repo,
alongside a machine-readable manifest. Your coding agent reads that source as a
worked example and builds the rest of your UI in the same style, unsupervised.

## Quick start

```sh
npx aronia add button --style neo-brutalism
```

That writes the tokens, the component's styles, and a thin skin in your framework
into `aronia/`, and records the component in a manifest:

```
aronia/
  neo-brutalism/
    tokens.css     # design tokens (written once per style)
    button.css     # the component's styles — the actual "language"
    Button.tsx     # a thin skin in your framework
  aronia.manifest.json
```

Then **point your agent at it**:

> Use aronia for all UI — read `aronia/aronia.manifest.json` and match the
> components in `aronia/`.

`aronia/aronia.manifest.json` records every component you've added — its style
class, `data-*` attributes, files, and full prop spec — so the agent works from
the exact contract, not a guess.

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
aronia add <component> --style <style> [options]
```

| Option | Description | Default |
| --- | --- | --- |
| `--style <id>` | Design-language family (`neo-brutalism`, `glassmorphism`). **Required.** | — |
| `--framework <fw>` | `react`, `svelte`, or `html`. | `react` |
| `--cwd <dir>` | Where to write the `aronia/` folder. | current dir |
| `--registry <src>` | Registry URL or local directory. | bundled |

Components pull in their dependencies automatically (e.g. `toast` also adds
`alert`). Run `aronia add` again with a different `--component`/`--style` to grow
your set; the manifest is merged, not overwritten.

## For AI agents

aronia is built to be read by agents, not just humans:

- **In a project using aronia**, the contract lives in `aronia/aronia.manifest.json`
  and the real source in `aronia/<style>/`. See [AGENTS.md](./AGENTS.md).
- **The full registry** (every style, component, prop, enum, and behaviour) is
  served as JSON: `/manifest.json` (whole catalog), `/<style>/manifest.json` (one
  family), and `/r/index.json` → `/r/<style>/<component>.json` (per-component
  items embedding spec, tokens, CSS, and framework skins). A machine-readable
  index is at [`/llms.txt`](./static/llms.txt).

## Using the Svelte components directly (optional)

The copy-into-repo flow is the point, but the Svelte components are also
importable as a package if you'd rather depend on them:

```sh
npm i github:Chukwuka-Osakwe/aronia
```

```js
import { neoBrutalism } from '@aronia/svelte';
```

Svelte 5 + Vite/SvelteKit consumers only.

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
