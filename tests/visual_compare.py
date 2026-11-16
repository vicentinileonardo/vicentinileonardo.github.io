"""Before/after screenshot comparison for refactors of the PS2 menu (ps2.js / ps2.css / ps2-screen.html).

Time is frozen (Playwright fake clock) and motion reduced, so two captures of the same site are
pixel-identical apart from faint film grain. Use it to prove a change did not alter what visitors see:

    python tests/visual_compare.py capture --base http://127.0.0.1:8080 --out /tmp/before
    ... make the change, rebuild, serve again ...
    python tests/visual_compare.py capture --base http://127.0.0.1:8080 --out /tmp/after
    python tests/visual_compare.py compare /tmp/before /tmp/after      # exit 1 if any screen differs

Only compare captures made on the same machine (fonts render differently across operating systems).
"""
import argparse, datetime, os, sys

SHOTS = [('menu', '/', []), ('root', '/', ['Enter']), ('card', '/career/', []), ('save', '/career/thesis/', []),
         ('details', '/career/thesis/', ['Enter']), ('conf', '/about/', []), ('contact', '/', ['s']),
         ('quick', '/', ['t']), ('uni', '/projects/#university', []), ('pro', '/projects/dc/', []), ('404', '/nope/', [])]
PHONE_SHOTS = {'menu', 'save', 'details'}
STRONG = 40   # per-channel difference that counts as a real change (grain noise stays well below)


def capture(base, out):
    from playwright.sync_api import sync_playwright
    os.makedirs(out, exist_ok=True)
    t0 = datetime.datetime(2026, 1, 1, 12, 0, 0)
    with sync_playwright() as pw:
        br = pw.chromium.launch()
        for dev, args in [('desk', {'viewport': {'width': 1280, 'height': 800}}), ('phone', pw.devices['iPhone 13'])]:
            ctx = br.new_context(reduced_motion='reduce', **args)
            for name, path, keys in SHOTS:
                if dev == 'phone' and name not in PHONE_SHOTS: continue
                p = ctx.new_page()
                p.clock.install(time=t0); p.clock.pause_at(t0 + datetime.timedelta(seconds=1))
                p.goto(base.rstrip('/') + path, wait_until='networkidle'); p.clock.run_for(1500)
                for k in keys: p.keyboard.press(k); p.clock.run_for(800)
                p.screenshot(path=f'{out}/{dev}-{name}.png'); p.close()
            ctx.close()
        p = br.new_page(viewport={'width': 1280, 'height': 800})
        p.goto(base.rstrip('/') + '/career/?classic=1', wait_until='networkidle')
        p.add_style_tag(content='*,*::before,*::after{animation:none!important;transition:none!important}')  # the theme's blinking cursor
        p.screenshot(path=f'{out}/desk-classic.png', full_page=True)
    print(f'captured {len(os.listdir(out))} screens into {out}')


def compare(a, b):
    import numpy as np
    from PIL import Image
    worst = 0
    for f in sorted(os.listdir(a)):
        if not f.endswith('.png'): continue
        if not os.path.exists(f'{b}/{f}'): print(f'{f:22} MISSING in {b}'); worst = 10**9; continue
        x = np.asarray(Image.open(f'{a}/{f}').convert('RGB'), dtype=np.int16)
        y = np.asarray(Image.open(f'{b}/{f}').convert('RGB'), dtype=np.int16)
        if x.shape != y.shape: print(f'{f:22} SIZE CHANGED {x.shape} -> {y.shape}'); worst = 10**9; continue
        d = np.abs(x - y).max(2); n = int((d > STRONG).sum()); worst = max(worst, n)
        print(f'{f:22} {"CHANGED" if n else "same   "}  strongly differing pixels: {n}')
    print('RESULT:', 'identical' if worst == 0 else 'screens differ')
    return 0 if worst == 0 else 1


if __name__ == '__main__':
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0]); sub = ap.add_subparsers(dest='cmd', required=True)
    c = sub.add_parser('capture'); c.add_argument('--base', required=True); c.add_argument('--out', required=True)
    m = sub.add_parser('compare'); m.add_argument('a'); m.add_argument('b')
    args = ap.parse_args()
    if args.cmd == 'capture': capture(args.base, args.out)
    else: sys.exit(compare(args.a, args.b))
