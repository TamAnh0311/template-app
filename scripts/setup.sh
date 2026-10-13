#!/bin/bash

# ==============================================================================
# Project Setup Script
# Bootstraps a new project from this template:
#   1. Renames the project
#   2. Installs dependencies
#   3. Verifies the build
#   4. Creates a GitHub repo (on TamAnh0311)
#   5. Creates a Supabase project + pushes migrations
#   6. Creates a Vercel project + sets env vars + deploys
# ==============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log()  { echo -e "${GREEN}[+]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
error() { echo -e "${RED}[x]${NC} $1"; exit 1; }
step() { echo -e "\n${BLUE}==>${NC} $1"; }

# ---------------------
# Precondition checks
# ---------------------
step "Checking prerequisites"

command -v node >/dev/null 2>&1  || error "Node.js is required but not installed."
command -v npm  >/dev/null 2>&1  || error "npm is required but not installed."
command -v git  >/dev/null 2>&1  || error "git is required but not installed."
command -v gh   >/dev/null 2>&1  || error "GitHub CLI (gh) is required. Install: https://cli.github.com"
command -v npx  >/dev/null 2>&1  || error "npx is required but not found."
command -v openssl >/dev/null 2>&1 || error "openssl is required for password generation."

log "All prerequisites satisfied"

# ---------------------
# 1. Collect project info
# ---------------------
step "Project Configuration"

read -rp "Project name (e.g., my-app): " PROJECT_NAME
if [ -z "$PROJECT_NAME" ]; then error "Project name is required."; fi

# Validate: lowercase, hyphens only
if ! echo "$PROJECT_NAME" | grep -qE '^[a-z0-9][a-z0-9-]*[a-z0-9]$'; then
  error "Project name must be lowercase alphanumeric with hyphens (e.g., my-app)."
fi

read -rp "Project description (optional): " PROJECT_DESC

read -rp "Supabase region [ap-northeast-1]: " SUPABASE_REGION
SUPABASE_REGION=${SUPABASE_REGION:-ap-northeast-1}

read -rp "GitHub account [TamAnh0311]: " GITHUB_ACCOUNT
GITHUB_ACCOUNT=${GITHUB_ACCOUNT:-TamAnh0311}

read -rp "Supabase org ID [dsuffmmfasiwqxwmfmdc]: " SUPABASE_ORG
SUPABASE_ORG=${SUPABASE_ORG:-dsuffmmfasiwqxwmfmdc}

echo ""
echo "  Project:        $PROJECT_NAME"
echo "  Description:    ${PROJECT_DESC:-<none>}"
echo "  Supabase region: $SUPABASE_REGION"
echo "  GitHub account: $GITHUB_ACCOUNT"
echo "  Supabase org:   $SUPABASE_ORG"
echo ""
read -rp "Proceed? [y/N]: " CONFIRM
if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
  echo "Aborted."
  exit 0
fi

# ---------------------
# 2. Rename project
# ---------------------
step "Renaming project to '$PROJECT_NAME'"

# package.json
sed -i "s/\"name\": \"template-app\"/\"name\": \"$PROJECT_NAME\"/" package.json

# layout.tsx title
sed -i "s/default: \"App\"/default: \"$PROJECT_NAME\"/" src/app/layout.tsx
sed -i "s/template: \"%s | App\"/template: \"%s | $PROJECT_NAME\"/" src/app/layout.tsx

# Optionally set description
if [ -n "$PROJECT_DESC" ]; then
  # Escape special characters for sed
  ESCAPED_DESC=$(printf '%s\n' "$PROJECT_DESC" | sed 's/[\/&]/\\&/g')
  sed -i "s/description: \"\"/description: \"$ESCAPED_DESC\"/" src/app/layout.tsx
fi

log "Project renamed"

# ---------------------
# 3. Install dependencies
# ---------------------
step "Installing dependencies"
npm install
log "Dependencies installed"

# ---------------------
# 4. Verify build
# ---------------------
step "Verifying build"
if ! npm run build > /tmp/build_output.log 2>&1; then
  cat /tmp/build_output.log
  error "Build failed — fix errors above before proceeding."
fi
log "Build passed"

# ---------------------
# 5. Git init + first commit
# ---------------------
step "Initializing git"
if [ ! -d ".git" ]; then
  git init
  git branch -M main
fi
git add -A
git commit -m "feat: initialize $PROJECT_NAME from template" 2>/dev/null || log "Nothing new to commit"
log "Git initialized"

# ---------------------
# 6. Create GitHub repo
# ---------------------
step "Creating GitHub repo"

gh auth switch --user "$GITHUB_ACCOUNT" 2>/dev/null || warn "Could not switch to $GITHUB_ACCOUNT — using current account."

if gh repo create "$PROJECT_NAME" --public --source=. --remote=origin --push; then
  log "GitHub repo created: https://github.com/$GITHUB_ACCOUNT/$PROJECT_NAME"
else
  warn "Repo may already exist — attempting to add remote and push."
  git remote add origin "https://github.com/$GITHUB_ACCOUNT/$PROJECT_NAME.git" 2>/dev/null || true
  git push -u origin main 2>/dev/null || git push -u origin master
  log "Pushed to existing repo"
fi

# ---------------------
# 7. Create Supabase project
# ---------------------
step "Creating Supabase project"

DB_PASSWORD=$(openssl rand -base64 24)
SUPABASE_OUTPUT=$(npx supabase projects create "$PROJECT_NAME" \
  --org-id "$SUPABASE_ORG" \
  --region "$SUPABASE_REGION" \
  --db-password "$DB_PASSWORD" 2>&1)

echo "$SUPABASE_OUTPUT"

PROJECT_REF=$(echo "$SUPABASE_OUTPUT" | grep -o '"ref":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$PROJECT_REF" ]; then
  error "Failed to create Supabase project. See output above."
fi

log "Supabase project created (ref: $PROJECT_REF)"

# Wait for the project to initialise (Supabase needs a few seconds)
echo "Waiting for Supabase project to initialise..."
sleep 10

# ---------------------
# 8. Link + push migrations
# ---------------------
step "Linking Supabase and pushing migrations"

npx supabase link --project-ref "$PROJECT_REF"

if ls supabase/migrations/*.sql 1>/dev/null 2>&1; then
  npx supabase db push
  log "Migrations pushed"
else
  log "No migrations to push (add them to supabase/migrations/)"
fi

if [ -f "supabase/seed.sql" ]; then
  cat supabase/seed.sql | npx supabase db query --linked
  log "Seed data loaded"
fi

# ---------------------
# 9. Get Supabase API keys
# ---------------------
step "Retrieving API keys"

KEYS_OUTPUT=$(npx supabase projects api-keys --project-ref "$PROJECT_REF" 2>&1)
echo "$KEYS_OUTPUT"

ANON_KEY=$(echo "$KEYS_OUTPUT" | grep -o '"api_key":"[^"]*"' | head -1 | cut -d'"' -f4)
SERVICE_KEY=$(echo "$KEYS_OUTPUT" | grep -o '"api_key":"[^"]*"' | sed -n '2p' | cut -d'"' -f4)
SUPABASE_URL="https://${PROJECT_REF}.supabase.co"

if [ -z "$ANON_KEY" ] || [ -z "$SERVICE_KEY" ]; then
  error "Failed to retrieve API keys — check the output above."
fi

log "API keys retrieved"

# ---------------------
# 10. Write .env.local
# ---------------------
step "Writing .env.local"

cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=$SERVICE_KEY
EOF

log ".env.local created"

# ---------------------
# 11. Deploy to Vercel
# ---------------------
step "Setting up Vercel project"

npx vercel link --yes

# Set environment variables
npx vercel env add NEXT_PUBLIC_SUPABASE_URL     production --type plain  <<< "$SUPABASE_URL"
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production --type plain  <<< "$ANON_KEY"
npx vercel env add SUPABASE_SERVICE_ROLE_KEY     production --type secret <<< "$SERVICE_KEY"

log "Vercel env vars set"

step "Deploying to production"
DEPLOY_OUTPUT=$(npx vercel --prod --yes 2>&1)
echo "$DEPLOY_OUTPUT"
PROD_URL=$(echo "$DEPLOY_OUTPUT" | grep -o 'https://[^ ]*\.vercel\.app' | tail -1)

log "Deployed: $PROD_URL"

# ---------------------
# Done
# ---------------------
echo ""
echo -e "${GREEN}============================================================${NC}"
echo -e "${GREEN}  '$PROJECT_NAME' is ready!${NC}"
echo -e "${GREEN}============================================================${NC}"
echo ""
echo -e "  GitHub:    https://github.com/$GITHUB_ACCOUNT/$PROJECT_NAME"
echo -e "  Supabase:  https://supabase.com/dashboard/project/$PROJECT_REF"
echo -e "  Vercel:    ${PROD_URL:-<check Vercel dashboard>}"
echo ""
echo -e "  Local dev:"
echo -e "    cp .env.local.example .env.local  (if you need a fresh copy)"
echo -e "    npm run dev"
echo ""
