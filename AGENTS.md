# AGENTS.md

Notes for coding agents working on the Dira GeoSystems website. Read `README.md`
first for hosting and the general editing workflow. This file is excluded from
the Jekyll build (`_config.yml`), so it is never published.

## Build and preview

- Static Jekyll site, published by GitHub Pages. **Every push to `main` deploys
  to https://www.dirageosystems.ch within minutes.**
- Local preview: `docker-compose up`, then http://localhost:4000. Ruby/bundle are
  not installed on the host, so run Jekyll only through Docker.
- The dev server rebuilds on file changes but reads `_config.yml` only at
  startup. To check a config change without restarting it, run a one-off build:
  `docker compose run --rm -T jekyll jekyll build -d /tmp/out`.
- `404.html` is a standalone page and does not use the layout.

## Page structure

- `_layouts/default.html` holds the only `<head>` (stylesheets, favicons, meta
  tags, canonical link). On this site it is minified onto a single line.
- `_includes/header.html` contains only the `<header>` nav element. Don't add
  `<head>` content there; it is included inside `<body>`.
- The canonical link is built per page: `https://www.dirageosystems.ch{{ page.url }}`.
- All visible text exists twice, as `.lang-de` and `.lang-en` elements.
  `dist/js/language-switcher.js` toggles them.

## CSS

- Edit `scss/custom.scss`, then keep `dist/css/custom.min.css` in sync. There is
  no build step for this: compile it with a SCSS processor, or for small changes
  apply the same edit to the minified file by hand.
- `custom.min.css` is a single line, so it conflicts on every merge that touches
  CSS.

## Images

- Export raster images at about 2x their display size. Oversized bitmaps make
  scrolling and the logo carousel stutter.
- Partner logos: originals are in `source-assets/partner-logos/` (not deployed,
  see its README). Site copies in `dist/img/partner-logos/` are 120px tall,
  because `.partner-logo` is displayed at max 60px (40px at <=768px).
- `NSWGov_SpatialServices_limspace.png` is a compact variant, swapped in with a
  `<picture>` element at `max-width: 768px`. That breakpoint must match the one
  in `custom.scss`. It is exported at 80px tall.
- The carousel (`dist/js/logo-container.js`) clones the logo elements and
  measures their width once, after the images have loaded. It measures the
  original elements, not the clones: on a cache-bypassing reload Firefox
  re-downloads the clones, so they have no width yet. It does not re-measure on
  window resize, so a logo shown per language (`.lang-de`/`.lang-en`) must have
  the same width in both languages. Scrolling starts only once the carousel is
  in view, so visitors see the first logo first.

## Git workflow

- Only push when asked, because a push to `main` deploys.

## Australian site (`DiraGeoSystems/websiteAU`)

- A fork of this repo, published at https://www.dirageosystems.com.au. Its
  AU-specific changes must stay when syncing:
  - `CNAME`, canonical links and email addresses use `.com.au`
  - AU footer (ABN, Acknowledgement of Country)
  - no language switcher: the switcher script and nav links are removed, and
    `.lang-de` elements are hidden
  - Team Australia / Team Europe on the About page, AU contact block
  - Sydney and coastline photos instead of Zurich and Spiez
- Syncing changes from this site to AU:
  1. Fetch AU `main` and create a branch `updates-from-ch-N` from it.
  2. Merge this repo's `main` into it.
  3. On conflicts, keep the AU version and re-apply only the change coming
     from CH. For `custom.min.css`, take AU's compiled file and apply the SCSS
     diff from CH to it.
  4. Push the branch to `websiteAU` and open a PR against its `main`.
- AU-only fixes also go through a PR on `websiteAU`. Don't push to its `main`
  directly, because that deploys the AU site.
