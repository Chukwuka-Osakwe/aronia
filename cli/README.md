# aronia

**Copy an agent-friendly design language into your repo — not a black-box dependency.**

`aronia` copies real, editable component source — tokens, styles, and a thin skin
in your framework — into your repo, alongside a machine-readable manifest your
coding agent can read as a worked example.

```sh
npx aronia add button --style neo-brutalism
```

That writes into `aronia/`:

```
aronia/
  neo-brutalism/
    tokens.css     # design tokens (written once per style)
    button.css     # the component's styles — the actual "language"
    Button.tsx     # a thin skin in your framework
  aronia.manifest.json
```

Then tell your agent:

> Use aronia for all UI — read `aronia/aronia.manifest.json` and match the
> components in `aronia/`.

## Usage

```sh
aronia add <component> --style <style> [options]
```

| Option | Description | Default |
| --- | --- | --- |
| `--style <id>` | Design-language family (`neo-brutalism`, `glassmorphism`). **Required.** | — |
| `--framework <fw>` | `react`, `svelte`, or `html`. | `react` |
| `--cwd <dir>` | Where to write the `aronia/` folder. | current dir |
| `--registry <src>` | Registry URL or local directory. | bundled |

Two design languages, 20 components each; dependencies are pulled in
automatically (e.g. `toast` also adds `alert`).

Full docs and source: https://github.com/Chukwuka-Osakwe/aronia
