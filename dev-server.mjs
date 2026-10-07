// Local preview server for this static Netlify deploy. Mimics the three Netlify
// behaviours the site relies on: pretty URLs (/contact-a -> contact-a.html),
// the rewrites in _redirects, and case-insensitive file paths.
import { createServer } from 'node:http';
import { readFile, readdir, stat } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { extname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const PORT = Number(process.env.PORT) || 3000;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

// "/from  /to  status" lines; a trailing /* on `from` matches any sub-path.
const redirectsFile = join(ROOT, '_redirects');
const rules = !existsSync(redirectsFile) ? [] : readFileSync(redirectsFile, 'utf8')
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith('#'))
  .map((line) => {
    const [from, to, status = '301'] = line.split(/\s+/);
    return { from, to, status: parseInt(status, 10) };
  });

function matchRule(pathname) {
  for (const rule of rules) {
    if (rule.from.endsWith('/*')) {
      const prefix = rule.from.slice(0, -1);
      if (pathname.startsWith(prefix) || pathname === prefix.slice(0, -1)) {
        return { ...rule, to: rule.to.replace(':splat', pathname.slice(prefix.length)) };
      }
    } else if (pathname === rule.from) {
      return rule;
    }
  }
  return null;
}

async function listFiles(dir = ROOT) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await listFiles(full)));
    else out.push(full);
  }
  return out;
}

async function isFile(path) {
  try { return (await stat(path)).isFile(); } catch { return false; }
}

// Exact match first, then case-insensitive (Netlify lowercases every path, so
// the bundles reference index-DoQt9udI.js while the file is index-doqt9udi.js).
async function findFile(rel) {
  const exact = join(ROOT, rel);
  if (!exact.startsWith(ROOT)) return null;
  if (await isFile(exact)) return exact;
  const wanted = relative(ROOT, exact).split(sep).join('/').toLowerCase();
  for (const file of await listFiles()) {
    if (relative(ROOT, file).split(sep).join('/').toLowerCase() === wanted) return file;
  }
  return null;
}

async function resolve(pathname) {
  const rel = pathname.replace(/^\/+/, '');
  const candidates = pathname.endsWith('/') || rel === ''
    ? [rel + 'index.html']
    : [rel, rel + '.html', rel + '/index.html'];
  for (const candidate of candidates) {
    const file = await findFile(candidate);
    if (file) return file;
  }
  return null;
}

createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let file = await resolve(pathname);
    if (!file) {
      const rule = matchRule(pathname);
      if (rule && rule.status === 200) file = await resolve(rule.to);
      else if (rule) {
        res.writeHead(rule.status, { Location: rule.to }).end();
        return;
      }
    }
    if (!file) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('404 Not found: ' + pathname);
      console.log(404, pathname);
      return;
    }
    res.writeHead(200, {
      'Content-Type': TYPES[extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    }).end(req.method === 'HEAD' ? undefined : await readFile(file));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' }).end('500 ' + err.message);
    console.error(err);
  }
}).listen(PORT, () => {
  console.log(`Atlantic Media previews running at http://localhost:${PORT}`);
});
