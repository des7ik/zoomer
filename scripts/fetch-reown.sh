#!/usr/bin/env bash
set -euo pipefail
mkdir -p assets/js/reown
echo "Downloading Reown AppKit modules (no npm)..."
curl -L --fail "https://unpkg.com/@reown/appkit/+esm"                -o assets/js/reown/appkit.js
curl -L --fail "https://unpkg.com/@reown/appkit/networks/+esm"       -o assets/js/reown/networks.js
curl -L --fail "https://unpkg.com/@reown/appkit-adapter-wagmi/+esm"  -o assets/js/reown/adapter-wagmi.js
echo "Done."
