#!/bin/bash

# ==============================================================================
# rename.sh
# Renames the project in package.json and layout.tsx only.
# Use this when you don't need the full automated setup.
# ==============================================================================

set -e

read -rp "New project name (e.g., my-app): " NAME

if [ -z "$NAME" ]; then
  echo "Error: Name is required."
  exit 1
fi

if ! echo "$NAME" | grep -qE '^[a-z0-9][a-z0-9-]*[a-z0-9]$'; then
  echo "Error: Name must be lowercase alphanumeric with hyphens (e.g., my-app)."
  exit 1
fi

sed -i "s/\"name\": \"template-app\"/\"name\": \"$NAME\"/" package.json
sed -i "s/default: \"App\"/default: \"$NAME\"/" src/app/layout.tsx
sed -i "s/template: \"%s | App\"/template: \"%s | $NAME\"/" src/app/layout.tsx

echo "Renamed to '$NAME'."
echo "Next steps:"
echo "  1. npm install"
echo "  2. cp .env.local.example .env.local  (then fill in your keys)"
echo "  3. npm run dev"
