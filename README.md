# OpenCore Group — Marketing Website

Corporate/marketing site for OpenCore Group, built from the `OCG v2` Figma file.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router), TypeScript
- Tailwind CSS v4 (design tokens live in `src/app/globals.css`)
- Blog posts are read from the official OpenCore Group Sanity project (read-only, no embedded
  Studio) via `@sanity/client` + TanStack Query; other content is hardcoded in constants
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

Push to a GitHub repo connected to Vercel, or run `vercel` from this
directory. No environment variables are required for the current build.

Vercel auto-detects pnpm from `pnpm-lock.yaml` and honours the `packageManager`
pin, so no dashboard change is needed — just make sure `package-lock.json` never
comes back, or lockfile detection becomes ambiguous.
