# Dawam

Indonesian, mobile-first reader for morning and evening dzikr, daily duas, and selected prayer-related recitations, built with SvelteKit 2, Svelte 5, TypeScript, Tailwind 4, Lucide and shadcn-svelte components built on Bits UI.

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

The production output is in `build/`. Serve with HTTPS (localhost is allowed for development). Map all category routes (`/read/{category}/`) and single-entry routes (`/read/{category}/{slug}/`) to their generated `index.html` files, and use `404.html` as the custom not-found response with HTTP status 404. Do not use a status-200 SPA fallback for unknown paths. Serve `service-worker.js` and HTML with revalidation; hashed `_app/immutable/` files can use long-lived immutable caching. Serve the manifest as `application/manifest+json`.

All category catalogs and single-entry pages are intended to be prerendered and available offline, alongside the home page, local fonts and app assets, after an initial successful production load populates the service-worker cache. No API is required. Installation depends on browser support. Updates wait for the home-page update action, then activate and reload. Test offline against the production preview, not Vite development mode.

## Categories and reading modes

The homepage keeps **Dzikir harian** for `morning` and `evening`, with a separate **Doa & bacaan shalat** section for `daily-duas` and `prayer`. Category cards link to `/read/{category}/` without overriding the default reading mode.

- `daily-duas` has `readingMode: 'single'` and only supports individual readings, opening its catalog by default. `prayer`, `morning`, and `evening` have `readingMode: 'sequence'`, beginning with the introduction and reading the collection in its configured order. `morning` and `evening` have kind `dhikr`; `daily-duas` has kind `dua`; `prayer` has kind `prayer_recitation`.
- Use `/read/{category}/?mode=single` to open the catalog. For sequence categories, `?mode=sequence` opens the sequence after hydration. A category configured with `readingMode: 'single'` ignores `mode=sequence` and `start`: `/read/daily-duas/?mode=sequence&start=doa-bangun-tidur` still opens the full catalog, including in prerendered HTML with JavaScript disabled. These query parameters do not create separate generated pages.
- For categories with `category.readingMode === 'sequence'` (`prayer`, `morning`, and `evening`), catalog links use `/read/{category}/?mode=sequence&start={entry.slug}`. Selecting a reading opens its sequential card at its original collection index, not its index in the filtered search results. Previous and next follow the original collection order.
- For sequence categories, the `start` slug is reapplied on reload, restoring the selected reading even after navigating to another card. Selecting the last reading and advancing opens **Penutup**; an invalid or out-of-category `start` falls back to **Pembuka**. For example, selecting **Tasbih Rukuk** from a filtered prayer catalog starts at **4 dari 13**, with Al-Fatihah before it and Bangkit dari Rukuk after it.
- Standalone routes at `/read/{category}/{slug}/` remain supported for compatibility, unchanged: they show one reading without previous/next sequence controls. The daily-duas catalog links directly to `/read/daily-duas/{slug}/` standalone routes.

The header has a **Pilih bacaan** icon link adjacent to Back, pointing to `/read/{category}/?mode=single`, with `aria-current="page"` in catalog mode. There is no main **Mode membaca** navigation or **Baca berurutan** link. In sequence-category catalogs, **Kembali ke bacaan** returns to `/read/{category}/` at the default sequence introduction. In the daily-duas catalog, Back has the accessible name **Kembali ke beranda** and links to `/`, avoiding a catalog self-loop; its **Pilih bacaan** header link remains `/read/daily-duas/?mode=single`. In sequence mode, **Kembali ke beranda** also returns home. On individual readings, **Kembali ke daftar bacaan** and the **Pilih bacaan** icon both return to the category catalog.

A once-only header tutorial uses `role="note"` and the accessible name **Petunjuk pilih bacaan**: “Ingin langsung ke bacaan tertentu? Tekan tombol daftar ini untuk memilih bacaan.” Dismiss it with **Mengerti**, Escape, or the list icon. The localStorage key `dawam-reading-list-hint-seen` is set to `'true'` when the hint is first shown, not when acknowledged, so reloads and other categories do not repeat it. If storage is unavailable, the hint and reading navigation remain usable, though persistence across reloads cannot be guaranteed. The hint must fit a 320px-wide viewport without horizontal overflow.

The curated collections contain **10 daily duas** and **13 prayer-related recitations**, from opening takbir to salam, including Al-Fatihah, tashahhud, salawat Ibrahimiyah, and supplications before salam. They are not a complete prayer or fiqh guide: the sequence does not reproduce rak‘ahs, the second prostration, or all movement instructions, and does not prescribe a particular additional surah after Al-Fatihah. Wording and practice may vary; study with a trusted teacher rather than treating the catalog order as a complete prayer procedure.

## Content

Content is separate from UI under `src/lib/content/entries/`. Categories reference shared IDs in configured order. The build validates required fields, duplicates, references, repetition counts and sourced virtues. Preferences persist locally and tolerate unavailable storage. Daily hadith selection uses the user's local calendar date and refreshes while the app is open.

All entry files follow schema version 1 and use descriptive names such as `surah_al_ikhlas.json`, `ayat_kursi.json`, `doa_sebelum_tidur.json`, `dzikir_takbir.json`, and `shalat_doa_iftitah.json`. Shared recitation text lives in `text`. Every entry contains explicit `variants` with the same fields; categories select `{ entryId, variantId }` in `items`, without overriding content. A variant uses `text: null` to reuse the shared text, and `repetitions: null` when no fixed count is specified. `alternativeIds` explicitly controls which alternative wordings appear in the reading picker, so bedtime context variants do not appear in morning or prayer pickers.

See [the content schema guide](docs/CONTENT-SCHEMA.md) for field definitions and editing examples. IDs remain stable. Entry filenames and canonical URL slugs use matching names of at most four words including the type prefix; filenames use underscores and slugs use hyphens. Historical reading links redirect to their short canonical URLs, and old start bookmarks remain supported. Wording choices persist across sequence and standalone routes; non-default context variants use a separate preference key to avoid mixing contexts.

Variant validation tests are in `tests/reading-variants.test.mjs` (`node --test tests/reading-variants.test.mjs`). Browser coverage in `tests/browser/reading-variants.spec.ts` checks content switching, persistence, storage failures, prerendered defaults, and 320px dropdown layout; after building, run `pnpm exec playwright test tests/browser/reading-variants.spec.ts`.

See [content review and provenance](docs/CONTENT-REVIEW.md) and [MIT content license](docs/CONTENT-LICENSE.txt). Religious/editorial sign-off and underlying translation-rights confirmation remain release tasks; the imported dataset is not represented as fully reviewed.

## Code style

Run `pnpm run format` to format source files, or `pnpm run format:check` to verify formatting. Prettier is configured for Svelte, two-space indentation, single quotes, and a 100-character line width. Keep a blank line between import groups, component props, state groups, derived values, and functions. Keep Svelte control blocks on separate lines. Religious datasets and generated output are excluded from formatting.

## UI and theme

UI primitives in `src/lib/components/ui/` are generated from the shadcn-svelte Vega registry. Buttons, cards, badges, dialogs, switches, selects, labels, and separators use the shared theme. `src/app.css` contains the local font faces, shadcn color/radius tokens, and document defaults only. Layout, typography, responsive behavior, and decorative elements use Tailwind utilities in their components. The `morning`, `evening`, `gold`, and `hero` color tokens preserve the original palette. Adjust colors in `:root` (and `.dark`) to update the app consistently.

## Deploy to Vercel

The checked-in `vercel.json` deploys the existing adapter-static output. It sets the framework preset to Other, runs `pnpm run build`, and serves `build/`. Trailing slashes match the prerendered reading routes. Set the Vercel Root Directory to the folder containing `package.json` and `vercel.json` (the repository root for this project).

Commit and push `vercel.json`, then deploy that commit. Its output-directory setting overrides the dashboard's `public` value. No `public/` folder or Vercel adapter is required for this static app. If configuring the dashboard manually, use Framework Preset **Other**, Build Command **pnpm run build**, and Output Directory **build**.
