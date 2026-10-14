// Minimal static server for the tests (the site has no build step). Usage: node tests/serve.js [port]
const http = require("http"), fs = require("fs"), path = require("path");
const root = path.join(__dirname, ".."), port = +process.argv[2] || 4173;
const types = { html: "text/html", js: "text/javascript", css: "text/css", svg: "image/svg+xml", png: "image/png", webp: "image/webp", woff2: "font/woff2", webmanifest: "application/manifest+json", json: "application/json" };
http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(new URL(req.url, "http://x").pathname));
  const f = p.endsWith(path.sep) ? path.join(p, "index.html") : p;
  if (!f.startsWith(root)) return res.writeHead(403).end();
  fs.readFile(f, (e, d) => e ? res.writeHead(404).end() : res.writeHead(200, { "content-type": types[path.extname(f).slice(1)] || "application/octet-stream", "content-length": d.length, "cache-control": "no-store" }).end(d));
}).listen(port, "127.0.0.1");
