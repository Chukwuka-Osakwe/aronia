// Publish-time bundling for the `aronia` CLI.
//
// The published CLI must ship the registry with it (its package.json declares
// `files: ["index.js", "r"]`), so at pack/publish time we (re)build the registry
// and copy it into `cli/r`. Run automatically via the CLI's `prepack` script;
// both `static/r` and `cli/r` are gitignored build outputs.
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

console.log('bundled registry → cli/r');
