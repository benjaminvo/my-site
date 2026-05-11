#!/bin/bash
set -euo pipefail

# Only run in Codex-managed shells.
if [ -z "${CODEX_SHELL:-}" ] && [ -z "${CODEX_CI:-}" ]; then
  exit 0
fi

# Set the repo-local git identity so Codex commits are attributed to the repo owner.
# Some Codex sandboxes block writes to .git/config, so keep session start non-fatal.
git config --local user.name "Benjamin Ottensten" 2>/dev/null || true
git config --local user.email "benjamin.ottensten@gmail.com" 2>/dev/null || true
