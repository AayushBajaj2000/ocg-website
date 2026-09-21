# OpenCore Group — Website

The website for OpenCore Group, live at **https://www.opencoregroup.com**, and the Sanity Studio that
manages its content. Built from the `OCG v2` Figma file.

This is the second version of the site. It took over the domain on September 21, 2026; v1 is
archived, read-only, at
[`OpenCoreGroup/archived-opencore-website-v1`](https://github.com/OpenCoreGroup/archived-opencore-website-v1).

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
| `pnpm typecheck`    | Generate route types, then `tsc`  |
| `pnpm format`       | Format the codebase with Prettier |
| `pnpm format:check` | Check formatting without writing  |
| `pnpm lighthouse`   | Build and run Lighthouse locally  |

CI (`.github/workflows/ci.yml`) runs lint, format check, oxlint, typecheck and a production build
on every push and pull request.

## Environment variables

Copy `.env.example` to `.env.local` and fill in the values (or `vercel env pull .env.local` once
the repo is linked to the Vercel project). Client-side variables are validated in
`src/lib/env/client.ts`, server-only secrets in `src/lib/env/server.ts`. The Sanity variables
(`SANITY_*`) point at the read-only production dataset and are only used on the server.

## Fonts

- **Switzer** (Light/Regular/Medium) — self-hosted via `next/font/local`, files in `src/fonts/`.
  Licensed for free commercial use via [Fontshare](https://www.fontshare.com/fonts/switzer). The
  two `.ttf` copies exist only for the generated share images, which cannot read woff2.
- **Google fonts** via `next/font/google` (`src/lib/fonts.ts`): Inter (the "Book a call" nav pill),
  JetBrains Mono (eyebrows, dates, code), and Dancing Script, Allura and Caveat (the founder book).

## Project structure

```
src/
  app/            # App Router pages, plus sitemap, robots, manifest, icons, /og and /llms.txt
  components/
    analytics/    # Consent banner and the consent-gated Google Analytics loader
    layout/       # Header, footer and the sections shared between pages
    legal/        # Layout for the privacy policy and terms of use
    seo/          # JSON-LD
    shaders/      # WebGL pieces (banner, building, founder book)
    ui/           # Building blocks: buttons, cards, carousels, forms, animations
  fonts/          # Self-hosted Switzer files
  lib/
    constants/    # Hardcoded copy and config
    sanity/       # Client, GROQ queries and image loaders
    blog/ faq/ team/ testimonials/ trustedBy/ resources/   # One server fetcher per Sanity type
    seo/          # Per-page titles, descriptions and share images; structured data
    legal/        # Text of the privacy policy and terms of use
    analytics/    # Consent store and gtag helpers
studio/           # Sanity Studio (separate npm package)
```

## SEO, analytics and legal

- Every static page's title, description, canonical and share image comes from one registry,
  `src/lib/seo/pages.ts`. Add a page there and it also appears in `/sitemap.xml`.
- URLs from v1 of the site are redirected in `next.config.ts`: permanently where the destination is
  the real successor, temporarily where it is a stand-in for a page that isn't built yet.
- Google Analytics (GA4) loads only after the visitor accepts the cookie banner, and only on the
  production domain. Vercel Speed Insights is cookieless and always on.
- The privacy policy and terms of use are hardcoded in `src/lib/legal/`. Keep the privacy policy in
  step with what the site actually collects and which services it uses.

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
