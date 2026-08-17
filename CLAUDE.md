# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

The marketing site for Glosc AI (gloscai.com), built with Vue 3, Vite, TypeScript, Tailwind CSS v4, and shadcn-vue components. Chinese-language content throughout.

## Commands

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check (`vue-tsc --build`) then build for production; both steps must pass
- `npm run preview` — preview the production build locally
- `npm run format` — format `src/` with Prettier (no semicolons, single quotes, 100 char width — see `.prettierrc.json`)

There is no test suite or linter configured in this project.

## Architecture

- **Routing**: `src/router/index.ts` defines routes with lazy-loaded views from `src/views/`. Currently `/` (`HomeView.vue`) and `/about` (`AboutView.vue`).
- **State**: Pinia is installed (`src/stores/`) but the home page currently manages its own state locally rather than via a store.
- **UI components**: shadcn-vue, configured via `components.json` (style: "new-york", base color: neutral, no tailwind prefix). Components live under `src/components/ui/<name>/` and are auto-imported by `unplugin-vue-components` (configured in `vite.config.ts`) — no manual import needed for anything under `src/components/ui`. Add new shadcn-vue components through the shadcn-vue CLI rather than hand-rolling them, to stay consistent with the existing `Button` component's structure (`index.ts` re-export + `cva`-based variants).
- **Icons**: `lucide-vue-next`. The `Components` resolver in `vite.config.ts` auto-imports any component named `Icon*` from lucide (e.g. `<IconArrowRight />`), but existing code (e.g. `HomeView.vue`) imports icons directly from `lucide-vue-next` by their real names (`ArrowRight`, `Github`, etc.) — follow that existing pattern for new icons rather than the `Icon*` auto-import.
- **Styling**: Tailwind v4 via `@tailwindcss/vite` (no separate `tailwind.config` file — theme tokens are defined inline in `src/style.css` using `@theme inline` and CSS custom properties for light/dark colors). `cn()` in `src/lib/utils.ts` (clsx + tailwind-merge) is the standard way to merge conditional classes.
- **Path alias**: `@/*` maps to `src/*` (set in both `tsconfig.app.json` and `vite.config.ts`).
- **App shell**: `src/App.vue` renders `<router-view />` plus a shared footer that fetches a "friend links" list at runtime from `https://api.aoe.top/api/friendly/links` and renders it with loading/error states. `HomeView.vue` has its own separate footer with company info/ICP registration links — these are two different footers serving different purposes, not a duplication bug.
- **External product links**: `HomeView.vue` hardcodes a `products` array linking out to other Glosc AI subdomains (copilot, nutri, cat, 2fa). Each card's favicon is fetched from `<product-href>/favicon.ico`.
