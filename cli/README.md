# aronia

**Copy an agent-friendly design language into your repo — not a black-box dependency.**

`aronia` copies real, editable component source — tokens, styles, and a thin skin
in your framework — into your repo, alongside a machine-readable manifest your
coding agent can read as a worked example.

Start by bringing the language in — no style chosen yet:

```sh
npx aronia init
```

That writes `aronia/START.md` (an optional, agent-run conversation to help you
choose a direction), `aronia/AGENTS.md` (how an agent should build with aronia),
and `aronia/aronia.manifest.json` (the full family menu — no components, no style
adopted yet). Then tell your agent:

> Start at aronia/START.md. If I already know what I'm building and the style I
> want, skip it and build; otherwise help me choose. Then match `aronia/`.

Once a style is chosen, pull components — the first `add` adopts that style, and
later ones need no flag:

```sh
npx aronia add button --style swiss   # adopts swiss + your framework
npx aronia add card badge             # same language, no --style needed
```

Each `add` writes into `aronia/<style>/`:

```
aronia/
  swiss/
    tokens.css     # design tokens (written once per style)
    button.css     # the component's styles — the actual "language"
    Button.tsx     # a thin skin in your framework
  aronia.manifest.json
```

## Usage

```sh
aronia init                            # bring the language + onboarding in
aronia add <component...> [options]    # add components; the first add adopts a style
```

| Option | Description | Default |
| --- | --- | --- |
| `--style <id>` | `neo-brutalism`, `glassmorphism`, or `swiss`. Required for the first `add`; remembered after. | adopted |
| `--framework <fw>` | `react`, `svelte`, or `html`. | detected, else `react` |
| `--cwd <dir>` | Where to write the `aronia/` folder. | current dir |
| `--registry <src>` | Registry URL or local directory. | bundled |

Three design languages, 20 components each; dependencies are pulled in
automatically (e.g. `toast` also adds `alert`).

Full docs and source: https://github.com/Chukwuka-Osakwe/aronia
