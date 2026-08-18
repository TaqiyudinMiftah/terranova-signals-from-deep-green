import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT) || 8123;
const host = '127.0.0.1';

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
};

createServer(async (req, res) => {
  try {
    const rawPath = new URL(req.url ?? '/', `http://${req.headers.host ?? `${host}:${port}`}`).pathname;
    const decoded = decodeURIComponent(rawPath === '/' ? '/index.html' : rawPath);
    const relative = normalize(decoded).replace(/^[/\\]+/, '');
    const filePath = join(root, relative);

    if (!filePath.startsWith(root)) {
      throw new Error('invalid path');
    }

    const body = await readFile(filePath);
    res.writeHead(200, {
      'Content-Type': mime[extname(filePath).toLowerCase()] ?? 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(body);
  } catch {
    res.writeHead(404, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    });
    res.end('not found');
  }
}).listen(port, host, () => {
  console.log(`http://${host}:${port}`);
});
