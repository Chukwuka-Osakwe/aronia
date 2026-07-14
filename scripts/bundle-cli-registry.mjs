// Publish-time bundling for the `aronia` CLI.
//
// The published CLI must ship the registry AND the onboarding docs with it (its
// package.json declares `files: ["index.js", "r", "START.md", "AGENTS.md"]`), so
// at pack/publish time we (re)build the registry and copy it into `cli/r`, and
// copy the repo-root START.md / AGENTS.md into `cli/` so `aronia init` can write
// them into a consumer's repo. Run automatically via the CLI's `prepack` script;
// `static/r`, `cli/r`, and the copied `cli/*.md` are gitignored build outputs.
import { execSync } from 'node:child_process';
import { cpSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

execSync('npm run registry', { cwd: root, stdio: 'inherit' });

const src = join(root, 'static', 'r');
const dest = join(root, 'cli', 'r');
rmSync(dest, { recursive: true, force: true });
cpSync(src, dest, { recursive: true });

for (const doc of ['START.md', 'AGENTS.md']) {
	cpSync(join(root, doc), join(root, 'cli', doc));
}

console.log('bundled registry → cli/r, docs → cli/START.md, cli/AGENTS.md');
