# OpenCore Group — Marketing Website

Corporate/marketing site for OpenCore Group, built from the `OCG v2` Figma file.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router), TypeScript
- Tailwind CSS v4 (design tokens live in `src/app/globals.css`)
- Content (blog, resources, team, FAQs, client logos and testimonials) is read from the OpenCore
  Group Sanity project, server-side and tokenless, via `@sanity/client`; the rest is hardcoded
  in constants
- The Sanity Studio lives in [`studio/`](studio) as its own npm package. It is not part of the
  Next.js build and is hosted by Sanity at https://opencoregroup.sanity.studio
- Deploy target: Vercel

## Getting started

This repo uses **pnpm** (pinned via `packageManager` in `package.json`) and the
Node version in `.nvmrc`:

```bash
corepack enable pnpm   # one-time; or: npm i -g pnpm@10.32.1
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command             | Description                       |
| ------------------- | --------------------------------- |
| `pnpm dev`          | Start the dev server (Turbopack)  |
| `pnpm build`        | Production build                  |
| `pnpm start`        | Serve the production build        |
| `pnpm lint`         | Run ESLint                        |
| `pnpm exec oxlint`  | Run oxlint (Tailwind token rules) |
| `pnpm format`       | Format the codebase with Prettier |
| `pnpm format:check` | Check formatting without writing  |

## Environment variables

Copy `.env.example` to `.env` and fill in the values. Client-side variables are validated in
`src/lib/env/client.ts`, server-only secrets in `src/lib/env/server.ts`. The Sanity variables
(`SANITY_*`) point at the read-only production dataset and are only used on the server.

## Fonts

- **Switzer** (Medium/Regular) — self-hosted via `next/font/local`, files in
  `src/fonts/`. Licensed for free commercial use via [Fontshare](https://www.fontshare.com/fonts/switzer).
- **Inter** (Medium) — loaded via `next/font/google`, used only for the
  desktop "Book a call" nav pill per the Figma spec.

## Project structure

```
src/
  app/            # App Router pages, layout, global styles/tokens
  components/
    icons/        # Inline SVG icons (see note below)
    layout/       # Nav, (future) Footer
    sections/     # Page sections, grouped by page (Hero, ...)
    ui/           # Generic building blocks (Button, DottedRule, GridGuides)
  fonts/          # Self-hosted Switzer woff2 files
  lib/            # Shared utilities (font setup)
```

## Known placeholders / open items

The Home page hero was built from a written design spec while Figma edit
access was blocked (view-only seat). A few things are placeholders pending
the real assets/decisions from Figma or the client:

- **Logo assets** (`OpenCoreWordmark`, `OpenCoreMark` in `src/components/icons/`)
  are stand-ins — swap for the real exported SVGs once available.
- **Link destinations** — all CTAs/nav links currently point to `#`.
- **Mobile menu** — the drawer content (nav links + Book a call) was built
  from a reasonable default; the Figma file only shows the closed state, so
  confirm the intended pattern (drawer vs. sheet vs. full-screen) with design.
- **Showcase reel** — built as an empty placeholder panel sized for a future
  video/animation embed; confirm what that embed actually is.
- **Button corner radius** — not specified in the design-token handoff, used
  a reasonable default (`rounded-lg`).

## Deploy

Vercel's Git integration builds and deploys the site on every push to `main`; there is no deploy
job in this repo. Set the variables from `.env.example` in the Vercel project (with real Resend and
Turnstile keys).

Vercel auto-detects pnpm from `pnpm-lock.yaml` and honours the `packageManager`
pin, so no dashboard change is needed — just make sure a root `package-lock.json` never
comes back, or lockfile detection becomes ambiguous. (`studio/package-lock.json` is fine: the
Studio is excluded from Vercel by `.vercelignore`.)

## Sanity Studio

The Studio in [`studio/`](studio) is a separate npm package (Sanity v3, React 18) that the site's
TypeScript, ESLint and Prettier configs ignore.

```bash
cd studio
npm ci
npm run dev      # http://localhost:3333
```

Pushing a change under `studio/` to `main` runs `.github/workflows/deploy-studio.yml`, which
deploys the Studio and its schema to https://opencoregroup.sanity.studio. It needs a
`SANITY_AUTH_TOKEN` repository secret holding a Sanity token with the "Deploy Studio" role.
