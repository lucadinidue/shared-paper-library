# shared-paper-library

Shared Hugo Module for a reusable `paper-library` section across multiple Hugo sites.

## What it contains

- `content/paper-library/**`
- `data/paper-library/**`
- `layouts/paper-library/**`
- `layouts/partials/paper-library/**`
- `assets/js/paper-library.js`
- `assets/js/paper-statistics.js`
- `assets/js/paper-graph.js`
- `assets/css/paper-library.css`
- `layouts/_partials/hooks/head-end/paper-library-styles.html`
- `archetypes/paper-library.md`
- `scripts/generate_paper_library_citations.py`

The shared repository is the single source of truth for:

- paper content and metadata
- citation aliases
- derived citation JSON data
- statistics templates and assets

## Host site integration

Import this module from a Hugo site and mount:

- `content/paper-library` to `content/paper-library`
- `data/paper-library` to `data/paper-library`
- `layouts/paper-library` to `layouts/paper-library`
- `layouts/partials/paper-library` to `layouts/partials/paper-library`
- `layouts/partials/paper-library-card.html` to `layouts/partials/paper-library-card.html`
- `layouts/partials/paper-library-filters.html` to `layouts/partials/paper-library-filters.html`
- `layouts/_partials/hooks/head-end` to `layouts/_partials/hooks/head-end`
- `assets/js` to `assets/js`
- `assets/css` to `assets/css`
- `archetypes` to `archetypes`

## Updating derived citation data

Run:

```bash
python3 scripts/generate_paper_library_citations.py
```

This updates the JSON files under `data/paper-library/`.

## Rebuilding dependent sites

This repository can dispatch `repository_dispatch` events to dependent site repositories after updates. See `.github/workflows/sync-paper-library.yml`.
