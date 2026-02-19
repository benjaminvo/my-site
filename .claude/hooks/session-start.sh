#!/bin/bash
set -euo pipefail

# Only run in remote Claude Code sessions
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Set git identity so commits are attributed to the repo owner
git config user.name "Benjamin Ottensten"
git config user.email "benjamin.ottensten@gmail.com"
