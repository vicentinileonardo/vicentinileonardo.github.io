"""Cross-browser end-to-end tests for the PS2 menu and the plain site.

Runs Chromium, Firefox and WebKit (Safari's engine) on desktop, phones and a tablet against a built
site, and exits non-zero if any check fails. See tests/README.md for setup.

    python tests/browser_test.py --base http://127.0.0.1:8080          # all configurations
    python tests/browser_test.py --base http://127.0.0.1:8080 --only iphone
    python tests/browser_test.py --base https://leonardovicentini.com --perf

Design rules, to keep this suite deterministic:
  * no fixed sleeps for state: every check polls for the state it needs (until / wait_scene), with
    generous timeouts, so a slow CI machine passes as reliably as a fast laptop;
  * known platform behaviour is SKIPPED with a reason, never left as a permanent failure;
  * performance numbers are informational (--perf), never pass/fail, because they depend on the machine;
  * a configuration that fails is retried once; a pass on retry is reported as FLAKY so it gets fixed.
"""
import argparse, json, os, sys, time
from playwright.sync_api import sync_playwright

T_SCENE = 8.0       # seconds to wait for a scene change (fades are 0.45 s; slow CI gets lots of slack)
T_STATE = 6.0       # seconds to wait for any other UI state
NOT_FOUND = '/no/such/page/'


class Run:
    def __init__(self, base, out):
        self.base, self.out, self.results = base.rstrip('/'), out, []

    def rec(self, cfg, name, ok, info=''):
        status = 'SKIP' if ok is None else ('PASS' if ok else 'FAIL')
        self.results.append({'cfg': cfg, 'check': name, 'status': status, 'info': str(info)})
        print(f'{status}  {cfg:<16} {name:<36} {info}', flush=True)
        return ok

    def path(self, p):
        return p.url.replace(self.base, '')


# ---------- polling helpers ----------
def until(fn, timeout=T_STATE, step=0.05):
    end = time.time() + timeout
    while True:
        try:
            v = fn()
            if v: return v
        except Exception:
            pass
        if time.time() > end: return False
        time.sleep(step)

def scene(p):
    return p.evaluate("() => { const s = document.getElementById('stage'); return s ? (s.dataset.scene || null) : null }")

def wait_scene(p, want, timeout=T_SCENE):
    return until(lambda: scene(p) == want, timeout)

def visible(p, sel):
    return p.evaluate("""s => { const e = document.querySelector(s); if (!e) return false;
        const r = e.getBoundingClientRect(), cs = getComputedStyle(e);
        return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && !e.closest('[hidden]') }""", sel)

def ps2_on(p):
    return p.evaluate("() => document.documentElement.classList.contains('ps2')")

def plain_page_shown(p):
    return visible(p, 'body > .container') and not ps2_on(p)

def header_menu_shown(p):
    return visible(p, '.menu__inner a') or visible(p, '.menu-trigger')

def grid_loaded(p):
    return p.evaluate("() => { const g = document.getElementById('grid'); return !!g && !g.classList.contains('loading') }")


# ---------- flows ----------
def flow_keyboard(r, p, cfg, engine):
    """Boot -> menu -> Browser -> card 1-A -> 2nd save -> Details -> back out -> System Configuration -> Contact."""
    until(lambda: scene(p) is not None)
    r.rec(cfg, 'boot shown on first visit', scene(p) == 'boot')
    r.rec(cfg, 'boot -> menu', wait_scene(p, 'menu'))
    p.keyboard.press('Enter'); r.rec(cfg, 'menu -> root (Enter)', wait_scene(p, 'root'))
    p.keyboard.press('Enter'); r.rec(cfg, 'root -> card 1-A', wait_scene(p, 'card'))
    until(lambda: grid_loaded(p), T_SCENE)
    p.keyboard.press('ArrowRight')
    p.keyboard.press('Enter')
    r.rec(cfg, 'card -> save (Thesis)', wait_scene(p, 'save') and until(lambda: p.url.endswith('/career/thesis/')), r.path(p))
    r.rec(cfg, 'title follows save', until(lambda: 'thesis' in p.title().lower()), p.title())
    p.keyboard.press('Enter'); r.rec(cfg, 'Details panel opens', until(lambda: visible(p, '#dov')))
    p.screenshot(path=f'{r.out}/{cfg}-details.png')
    p.keyboard.press('Escape'); r.rec(cfg, 'Esc closes Details', until(lambda: not visible(p, '#dov')))
    p.keyboard.press('Escape'); wait_scene(p, 'card')
    p.keyboard.press('Escape'); wait_scene(p, 'root')
    p.keyboard.press('Escape'); r.rec(cfg, 'Esc back to menu', wait_scene(p, 'menu'), r.path(p))
    p.keyboard.press('ArrowDown'); p.keyboard.press('Enter')
    r.rec(cfg, 'System Configuration', wait_scene(p, 'conf') and until(lambda: p.url.endswith('/about/')), r.path(p))
    p.keyboard.press('Escape'); wait_scene(p, 'menu')
    p.keyboard.press('s'); r.rec(cfg, 'Contact opens (S)', until(lambda: visible(p, '#contact')))
    p.keyboard.press('Escape'); r.rec(cfg, 'Contact closes (Esc)', until(lambda: not visible(p, '#contact')))
    if engine == 'webkit':
        # Safari's default ("Press Tab to highlight each item" off) skips links on Tab; the menu itself is
        # fully keyboard-driven (arrows, Enter, Esc, S), so this is platform behaviour, not a site bug.
        r.rec(cfg, 'Tab moves focus', None, 'skipped: Safari does not tab to links by default')
    else:
        p.keyboard.press('Tab')
        fe = until(lambda: p.evaluate("() => { const a = document.activeElement; return a && a !== document.body ? (a.id || a.className || a.tagName) : '' }"), 2)
        r.rec(cfg, 'Tab moves focus', bool(fe), fe)

def flow_touch(r, p, cfg, engine):
    until(lambda: scene(p) is not None)
    r.rec(cfg, 'boot shown on first visit', scene(p) == 'boot')
    p.tap('#stage'); r.rec(cfg, 'tap skips boot', wait_scene(p, 'menu'))
    p.tap('#mi0'); r.rec(cfg, 'tap Browser -> root', wait_scene(p, 'root'))
    p.locator('.dev').first.tap(); r.rec(cfg, 'tap card 1-A -> card', wait_scene(p, 'card'))
    until(lambda: grid_loaded(p), T_SCENE)
    save = p.locator('.save').nth(1)
    save.tap()                                   # first tap selects
    until(lambda: p.evaluate("() => document.querySelectorAll('.save')[1].classList.contains('on') || document.querySelectorAll('.save')[1].getAttribute('aria-selected') === 'true'"), 2)
    save.tap()                                   # second tap opens
    r.rec(cfg, 'tap tap save -> save', wait_scene(p, 'save') and until(lambda: p.url.endswith('/career/thesis/')), r.path(p))
    p.locator('.opt').first.tap(); r.rec(cfg, 'tap Details opens panel', until(lambda: visible(p, '#dov')))
    p.screenshot(path=f'{r.out}/{cfg}-details.png')
    sh = p.evaluate("() => { const b = document.getElementById('dbody'); return b ? [b.scrollHeight, b.clientHeight] : null }")
    r.rec(cfg, 'Details body present', sh is not None, sh)
    ov = p.evaluate("() => [document.documentElement.scrollWidth, innerWidth]")
    r.rec(cfg, 'no horizontal overflow', ov[0] <= ov[1] + 1, ov)


def run_config(pw, r, cfg, engine, ctx_args, mode):
    br = getattr(pw, engine).launch()
    errs = []
    try:
        ctx = br.new_context(**ctx_args)
        p = ctx.new_page()
        p.on('pageerror', lambda e: errs.append('pageerror: ' + str(e)))
        p.on('console', lambda m: m.type == 'error' and 'Failed to load resource' not in m.text and errs.append('console: ' + m.text))
        p.on('response', lambda resp: resp.status >= 400 and NOT_FOUND not in resp.url and errs.append(f'http {resp.status}: {resp.url}'))
        p.on('requestfailed', lambda q: errs.append(f'requestfailed: {q.url} {q.failure or ""}'))

        p.goto(r.base + '/', wait_until='load')
        r.rec(cfg, 'PS2 mode starts', until(lambda: p.evaluate('() => !!window.__ps2ready') and ps2_on(p)))
        (flow_touch if mode == 'touch' else flow_keyboard)(r, p, cfg, engine)

        # deep links: same session, so no boot
        for path, want in [('/career/krateo/', 'save'), ('/projects/dc/', 'save'), ('/about/', 'conf'),
                           ('/projects/', 'card'), ('/projects/#university', 'card')]:
            p.goto(r.base + path, wait_until='load')
            ok = wait_scene(p, want) and until(lambda: r.path(p) == path, 2)
            r.rec(cfg, f'deep link {path}', ok, f'{scene(p)} {r.path(p)}')

        # classic view and back
        p.goto(r.base + '/projects/?classic=1', wait_until='load')
        r.rec(cfg, 'classic: plain page shown', until(lambda: plain_page_shown(p)))
        r.rec(cfg, 'classic: header menu shown', until(lambda: header_menu_shown(p)))
        p.goto(r.base + '/?classic=0', wait_until='load')
        r.rec(cfg, 'back to PS2 (?classic=0)', until(lambda: ps2_on(p) and scene(p) in ('menu', 'boot')))

        # console-style 404
        resp = p.goto(r.base + NOT_FOUND, wait_until='load')
        r.rec(cfg, '404 status + No data.', resp.status == 404 and until(lambda: 'No data.' in p.inner_text('h1')), resp.status)
        ctx.close()

        # menu data cannot load -> plain page comes back
        ctx = br.new_context(**ctx_args); q = ctx.new_page()
        q.route('**/ps2.json', lambda rt: rt.abort())
        q.goto(r.base + '/career/', wait_until='load')
        r.rec(cfg, 'data failure: plain page back', until(lambda: plain_page_shown(q), 10))
        r.rec(cfg, 'data failure: header menu shown', until(lambda: header_menu_shown(q)))
        ctx.close()

        # menu script crashes on start -> plain page comes back immediately (not the 8 s safety timeout)
        ctx = br.new_context(**ctx_args); q = ctx.new_page()
        def broken(rt):
            resp = rt.fetch(); rt.fulfill(response=resp, body=resp.text().replace('const PROJECTS =', 'null.crash; const PROJECTS =', 1))
        q.route('**/ps2/ps2.js', broken)
        t0 = time.time(); q.goto(r.base + '/career/', wait_until='load')
        ok = until(lambda: plain_page_shown(q), 5)
        r.rec(cfg, 'crash: plain page back (<5 s)', ok, f'{time.time() - t0:.1f}s')
        r.rec(cfg, 'crash: header menu shown', until(lambda: header_menu_shown(q)))
        ctx.close()

        if mode == 'keys':   # reduced motion: no boot, no animation loop, instant navigation
            ctx = br.new_context(viewport={'width': 1280, 'height': 800}, reduced_motion='reduce')
            ctx.add_init_script("window.__raf = 0; const _r = window.requestAnimationFrame; window.requestAnimationFrame = f => { window.__raf++; return _r.call(window, f) }")
            q = ctx.new_page(); q.goto(r.base + '/', wait_until='load')
            r.rec(cfg, 'reduced motion: straight to menu', wait_scene(q, 'menu'))
            a = q.evaluate('window.__raf'); time.sleep(2); b = q.evaluate('window.__raf')
            r.rec(cfg, 'reduced motion: animation idle', b - a < 5, f'{b - a} frames in 2 s')
            q.keyboard.press('Enter'); r.rec(cfg, 'reduced motion: navigation', wait_scene(q, 'root', 2))
            ctx.close()

        noise = [e for e in errs if 'favicon' not in e and 'fonts.g' not in e]
        r.rec(cfg, 'no JS/console/network errors', not noise, ' | '.join(noise[:4]))
    except Exception as e:
        r.rec(cfg, 'crashed', False, repr(e)[:300])
    finally:
        br.close()


def perf(pw, r):
    """Informational only: CPU and frame rate depend on the machine, so these never fail the run."""
    br = pw.chromium.launch()
    ctx = br.new_context(viewport={'width': 1280, 'height': 800})
    ctx.add_init_script("window.__raf = 0; const _r = window.requestAnimationFrame; window.requestAnimationFrame = f => { window.__raf++; return _r.call(window, f) }")
    p = ctx.new_page(); cdp = ctx.new_cdp_session(p); cdp.send('Performance.enable')
    for label, path in [('menu', '/'), ('card', '/career/'), ('save', '/career/thesis/')]:
        p.goto(r.base + path, wait_until='load'); time.sleep(3)
        m0 = {m['name']: m['value'] for m in cdp.send('Performance.getMetrics')['metrics']}; f0 = p.evaluate('window.__raf')
        time.sleep(5)
        m1 = {m['name']: m['value'] for m in cdp.send('Performance.getMetrics')['metrics']}; f1 = p.evaluate('window.__raf')
        busy = (m1['TaskDuration'] - m0['TaskDuration']) / 5 * 100
        print(f'INFO  perf             {label:<36} {busy:.1f}% main thread busy, {(f1 - f0) / 5:.0f} fps, heap {m1["JSHeapUsedSize"] / 1e6:.1f} MB', flush=True)
    br.close()


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--base', default=os.environ.get('BASE_URL', 'http://127.0.0.1:8080'), help='site to test')
    ap.add_argument('--only', help='run only configurations whose name contains this text')
    ap.add_argument('--out', default=os.path.join(os.path.dirname(os.path.abspath(__file__)), 'output'), help='screenshots and results.json')
    ap.add_argument('--retries', type=int, default=1, help='re-run a failing configuration this many times')
    ap.add_argument('--perf', action='store_true', help='also print informational performance numbers')
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    final, flaky = [], []
    with sync_playwright() as pw:
        dev = pw.devices
        desk = {'viewport': {'width': 1280, 'height': 800}}
        configs = [
            ('chromium-desk', 'chromium', desk, 'keys'),
            ('firefox-desk', 'firefox', desk, 'keys'),
            ('webkit-desk', 'webkit', desk, 'keys'),
            ('iphone13', 'webkit', dev['iPhone 13'], 'touch'),
            ('iphone13-land', 'webkit', dev['iPhone 13 landscape'], 'touch'),
            ('iphoneSE', 'webkit', dev['iPhone SE'], 'touch'),
            ('pixel7', 'chromium', dev['Pixel 7'], 'touch'),
            ('ipad', 'webkit', dev['iPad (gen 7)'], 'touch'),
        ]
        for name, engine, args, mode in configs:
            if a.only and a.only not in name: continue
            for attempt in range(a.retries + 1):
                r = Run(a.base, a.out)
                if attempt: print(f'RETRY {name} (attempt {attempt + 1})', flush=True)
                run_config(pw, r, name, engine, args, mode)
                if not any(x['status'] == 'FAIL' for x in r.results): break
            if attempt and not any(x['status'] == 'FAIL' for x in r.results): flaky.append(name)
            final += r.results
        if a.perf: perf(pw, Run(a.base, a.out))
    fails = [x for x in final if x['status'] == 'FAIL']
    skips = [x for x in final if x['status'] == 'SKIP']
    json.dump(final, open(f'{a.out}/results.json', 'w'), indent=1)
    print(f'\n{len(final) - len(fails) - len(skips)} passed, {len(fails)} failed, {len(skips)} skipped'
          + (f'; FLAKY (passed on retry): {", ".join(flaky)}' if flaky else ''))
    for x in fails: print(f"  FAILED {x['cfg']}: {x['check']} {x['info']}")
    sys.exit(1 if fails else 0)


if __name__ == '__main__':
    main()
