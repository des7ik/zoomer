// scripts/copy-reown.mjs
import { createRequire } from 'module';
import { mkdirSync, copyFileSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);

function safeResolve(spec) {
  try { return require.resolve(spec); }
  catch (e) {
    console.error('Cannot resolve', spec, e.message);
    process.exitCode = 1;
    return null;
  }
}

const targets = [
  ['@reown/appkit', 'assets/js/reown/appkit.js'],
  ['@reown/appkit/networks', 'assets/js/reown/networks.js'],
  ['@reown/appkit-adapter-wagmi', 'assets/js/reown/adapter-wagmi.js'],
];

for (const [spec, out] of targets) {
  const src = safeResolve(spec);
  if (!src) continue;
  mkdirSync(dirname(out), { recursive: true });
  copyFileSync(src, out);
  console.log('Copied', spec, '->', out);
}
