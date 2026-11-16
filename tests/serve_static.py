"""Serve a built site (hugo -d DIR) the way GitHub Pages does: unknown paths get /404.html with status 404.

    python tests/serve_static.py DIR [PORT]      # default port 8080
"""
import functools, http.server, os, sys


class Handler(http.server.SimpleHTTPRequestHandler):
    def send_error(self, code, message=None, explain=None):
        page = os.path.join(self.directory, '404.html')
        if code == 404 and os.path.exists(page):
            body = open(page, 'rb').read()
            self.send_response(404)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        else:
            super().send_error(code, message, explain)

    def log_message(self, *args):
        pass


if __name__ == '__main__':
    root = os.path.abspath(sys.argv[1])
    port = int(sys.argv[2]) if len(sys.argv) > 2 else 8080
    print(f'serving {root} at http://127.0.0.1:{port}/', flush=True)
    http.server.ThreadingHTTPServer(('127.0.0.1', port), functools.partial(Handler, directory=root)).serve_forever()
