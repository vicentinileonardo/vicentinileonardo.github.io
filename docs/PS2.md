# The PS2 menu: how this site fits together

The site is a normal Hugo site (theme `hello-friend-ng`) with a PS2-style menu layered on top of it.
Visitors with JavaScript get the menu; everyone else (no JavaScript, crawlers, the "Classic view"
choice, or any failure to start the menu) gets the plain pages.

## Where things live

| What | Where | Notes |
|---|---|---|
| All text: experience, education, projects | `content/career/*.md`, `content/projects/*.md` | One page = one plain page **and** one PS2 "save" |
| About page / Projects list | `content/about.md`, `content/projects.md` | Plain site only |
| The CV | `content/cv_leonardo_vicentini.pdf` | Replace the file, keep the name |
| Menu data | `layouts/index.ps2.json` → served at `/ps2.json` | Built by Hugo from the pages above; never edit by hand |
| Menu code: scenes, 3D models, renderer, input | `static/ps2/ps2.js` | **Source file**, edit directly |
| Menu styles | `static/ps2/ps2.css` | **Source file**, edit directly |
| Menu markup | `layouts/partials/ps2-screen.html` | **Source file**, edit directly |
| Switch into PS2 mode, fallback to plain page | `layouts/partials/ps2-head.html` | Runs first in `<head>` |
| Plain-page rendering of a save | `layouts/partials/ps2-item.html`, `layouts/_default/single.html` | |
| Console-style 404, old-CV redirect | `layouts/404.html` | Standalone page |

Text that is hard-coded in `ps2.js` rather than in Markdown: the System Configuration panels
(`CONF`, `CONF_FULL`) and Quick View (`#qv`, `QV_WORK`). Everything else comes from `/ps2.json`.

## A save's front matter

```yaml
title: "Krateo"                  # page title
description: "…"                 # lead sentence (plain page + meta description)
weight: 1
ps2:
  card: "career"                 # career | pro | uni  (Memory Card /1-A, /1-B, /1-C)
  order: 1                       # position on the card
  model: "KR"                    # 3D model id in ps2.js MODELS (missing id = flat icon)
  hue: 220                       # background tint of the save screen
  save: "Krateo"                 # label under the model in the grid
  short: "Krateo"                # title on the save screen
  subtitle: "Software Engineer · 2025–2026"
  summary: "…"                   # text on the save screen
  tags: ["Go", "Kubernetes"]     # one-line tech list on the save screen (keep it a subset of stack)
  meta: "May 2025 – Jun 2026 · Verona, Italy (remote)"
stack: ["Go", "Kubernetes"]      # "Tech stack" chips in Details and on the plain page
links:
  - {label: "Open Repository", url: "https://github.com/…"}   # buttons; [] for none
```

The body is Markdown `## Sections` with bullet points; it becomes the Details panel.

## Content rules

* Every claim must be grounded: the CV (`platform.pdf`) is the first source, the old site second; the CV wins.
* No phone number and no Twitter/X anywhere on the site.
* One spelling per technology (Node.js, Express, web3.js, Kubernetes Operators, …).

## Safety nets

* `ps2-head.html` returns the plain page if `/ps2.json` fails to load, if `ps2.js` throws while starting
  (immediately, via `error` / `unhandledrejection`), or if the menu is not ready within 8 s.
* `window.__ps2ready` is set only on the last line of `ps2.js` startup. Keep it there.
* Code in `ps2.js` must cope with optional data (e.g. a project with no `links`). A crash on missing
  data once blanked the whole menu; the browser tests now catch that class of bug.

## Making changes safely

1. Edit the Markdown (text) or `ps2.js` / `ps2.css` / `ps2-screen.html` (look and behaviour).
2. Preview: `hugo server`, then open http://localhost:1313/.
3. Run the browser tests (see `tests/README.md`). For refactors that should not change the look,
   also run `tests/visual_compare.py` before and after.
4. Open a pull request. The **Browser tests** workflow runs the full suite on it; merge only when it is green.
5. Merging to `main` deploys via `.github/workflows/hugo.yml`. Roll back by reverting the merge commit.

## History

The menu began as a single-file prototype (`ps2-portfolio.html`) that a converter script turned into
the three source files above. Since 2026-11-16 those files are the source and the converter is
retired. A copy of the prototype from the design phase is still viewable as a claude.ai artifact;
it is a reference only and is older than the live code.
