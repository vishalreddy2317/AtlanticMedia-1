# Atlantic Media — website

Static site for Atlantic Media (Hyderabad): the home page, the contact page and the Atlantic Globe (PRIOR creators).
Plain HTML, CSS and JavaScript — no build step.

## Pages

- `atlantic-media.html` — the home page, served at `/` (and `/atlantic-media`)
- `contact.html` — the contact page, at `/contact`
- `atlantic-globe/` — the Atlantic Globe app (built output), embedded on the home page and served at `/atlantic-globe/`

Shared pieces: `brands.js` + `brands.css` (brand ring), `contact.js` (enquiry form), `assets/` (images, logos),
`_redirects` and `_headers` (Netlify routing and caching).

## Preview locally

```
npm run dev
```

Serves the site at http://localhost:3000 with Netlify-style pretty URLs, the `_redirects` rules and case-insensitive
file paths (`dev-server.mjs`, no dependencies).

## Deploy

Netlify, drag-and-drop. Zip the folder without the local preview files and drop it on the deploy area:

```
zip -r atlantic-media.zip . -x package.json dev-server.mjs '*.zip' '.git/*' '.gitignore' README.md
```
