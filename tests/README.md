# Tests

| File | What it does |
|---|---|
| `browser_test.py` | ~200 end-to-end checks on Chromium, Firefox and WebKit (desktop, iPhone SE/13, Pixel 7, iPad): menu navigation by keys and touch, deep links, classic view, 404, fallbacks when the menu data or script fails, reduced motion, console/network errors, horizontal overflow. Exits 1 on any failure. |
| `serve_static.py` | Serves a built site like GitHub Pages does (unknown paths → `404.html` with status 404). |
| `visual_compare.py` | Before/after screenshots with time frozen; proves a refactor did not change what visitors see. |

They run automatically on every pull request (`.github/workflows/test.yml`).

## Run locally

```bash
python3 -m venv .venv && .venv/bin/pip install -r tests/requirements.txt
.venv/bin/python -m playwright install chromium firefox webkit

hugo --minify --baseURL http://127.0.0.1:8080/ -d /tmp/site      # build like production
python3 tests/serve_static.py /tmp/site 8080 &                   # serve like GitHub Pages
.venv/bin/python tests/browser_test.py --base http://127.0.0.1:8080
```

Useful options: `--only iphone` (one configuration), `--perf` (informational CPU/fps numbers),
`--retries 0` (no retry, to hunt flakiness). Screenshots and `results.json` go to `tests/output/`.

The live site can be tested too: `--base https://leonardovicentini.com`.

## Keeping the suite deterministic

* Never sleep for a fixed time to wait for UI state: poll with `until(...)` / `wait_scene(...)`.
* Known platform behaviour is a `SKIP` with a reason (e.g. Safari not tabbing to links), never a standing failure.
* Performance numbers are informational only.
* A configuration that fails is retried once; a pass on retry is reported as **FLAKY**: fix the cause, don't ignore it.
* Playwright is pinned to 1.49.1: the newest release that runs on macOS 13. Upgrade it in `requirements.txt` (CI uses the same file).
