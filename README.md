# Dawam

Indonesian, mobile-first morning and evening dzikr reader built with SvelteKit 2, Svelte 5, TypeScript, Tailwind 4, Lucide and shadcn-svelte components built on Bits UI.

## Run

```sh
pnpm install
pnpm run dev
```

## Verify and build

```sh
pnpm run check
pnpm test
pnpm run build
pnpm run preview
pnpm exec playwright test
```

The production output is in `build/`. Serve with HTTPS (localhost is allowed for development). Map `/read/morning/` and `/read/evening/` to their generated index.html files, and use `404.html` as the custom not-found response with HTTP status 404. Do not use a status-200 SPA fallback for unknown paths. Serve `service-worker.js` and HTML with revalidation; hashed `_app/immutable/` files can use long-lived immutable caching. Serve the manifest as `application/manifest+json`.

The service worker caches both collections, the home page, local fonts and app assets on initial successful production load. No API is required. Installation depends on browser support. Updates wait for the home-page update action, then activate and reload. Test offline against the production preview, not Vite development mode.

## Content

Content is separate from UI under `src/lib/content/entries/`. Categories reference shared IDs in configured order. The build validates required fields, duplicates, references, repetition counts and sourced virtues. Preferences persist locally and tolerate unavailable storage. Daily hadith selection uses the user's local calendar date and refreshes while the app is open.

See [content review and provenance](docs/CONTENT-REVIEW.md) and [MIT content license](docs/CONTENT-LICENSE.txt). Religious/editorial sign-off and underlying translation-rights confirmation remain release tasks; the imported dataset is not represented as fully reviewed.

## Code style

Run `pnpm run format` to format source files, or `pnpm run format:check` to verify formatting. Prettier is configured for Svelte, two-space indentation, single quotes, and a 100-character line width. Keep a blank line between import groups, component props, state groups, derived values, and functions. Keep Svelte control blocks on separate lines. Religious datasets and generated output are excluded from formatting.

## UI and theme

UI primitives in `src/lib/components/ui/` are generated from the shadcn-svelte Vega registry. Buttons, cards, badges, dialogs, switches, selects, labels, and separators use the shared theme. `src/app.css` contains the local font faces, shadcn color/radius tokens, and document defaults only. Layout, typography, responsive behavior, and decorative elements use Tailwind utilities in their components. The `morning`, `evening`, `gold`, and `hero` color tokens preserve the original palette. Adjust colors in `:root` (and `.dark`) to update the app consistently.
