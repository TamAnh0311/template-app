# template-app

A reusable Next.js 14 starter template. Clone, run the setup script, and have a fully deployed app in minutes.

## Stack

| Layer | Package |
|---|---|
| Framework | Next.js 14 (App Router) + React 18 + TypeScript |
| Styling | Tailwind CSS 3 with `--app-*` design tokens |
| Auth + DB | Supabase (`@supabase/ssr`) |
| Animations | Framer Motion |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |

## Quick Start

### Option A — Full automated setup (recommended)

Clones the repo, installs deps, creates GitHub repo, Supabase project, and Vercel deployment:

```bash
git clone https://github.com/TamAnh0311/template-app my-app
cd my-app
npm run setup
```

The script will prompt for:
- Project name
- Project description (optional)
- Supabase region (default: `ap-northeast-1`)
- GitHub account (default: `TamAnh0311`)
- Supabase org ID

### Option B — Manual setup

```bash
git clone https://github.com/TamAnh0311/template-app my-app
cd my-app
bash scripts/rename.sh          # rename package.json + layout title
cp .env.local.example .env.local
# fill in your Supabase keys in .env.local
npm install
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server only) |

Copy `.env.local.example` to `.env.local` and fill in your values.

## Directory Structure

```
src/
  app/
    (auth)/
      login/          # Login page
      signup/         # Sign-up page
    (dashboard)/
      dashboard/      # Dashboard home placeholder
      layout.tsx      # Sidebar shell
    auth/callback/    # OAuth callback route
    globals.css       # Design tokens + base styles
    layout.tsx        # Root layout + AuthProvider
    page.tsx          # Landing page placeholder
  components/
    auth/
      LoginForm.tsx
      SignupForm.tsx
      SocialLoginButtons.tsx
  context/
    AuthContext.tsx   # Auth state + signIn/signUp/signOut/OAuth
  lib/
    supabase/
      client.ts       # Browser singleton client
      server.ts       # Server + service role clients
      middleware.ts   # Session refresh helper
      storage.ts      # Upload/delete/getPublicUrl helpers
  middleware.ts       # Edge auth guard
scripts/
  setup.sh            # Full automated setup
  rename.sh           # Rename only
supabase/
  migrations/         # Add .sql migration files here
```

## Design Tokens

All tokens use the `--app-*` CSS variable prefix so they are easy to override per project. Defaults are a warm neutral palette.

```css
/* In src/app/globals.css — override these per project */
:root {
  --app-cream: 250 248 245;
  --app-card: 255 255 255;
  --app-text: 32 30 26;
  --app-accent: 59 130 246;   /* change to your brand colour */
  /* ... */
}
```

Tailwind classes: `bg-app-cream`, `text-app-text`, `border-app-border`, `bg-app-accent`, etc.

## Auth Routes

| Route | Description |
|---|---|
| `/login` | Email/password + Google/Apple OAuth |
| `/signup` | New account creation |
| `/auth/callback` | OAuth redirect handler |
| `/dashboard` | Protected — redirects to `/login` if unauthenticated |
