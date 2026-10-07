# Atlantic Media — website

Static site for Atlantic Media (Hyderabad): design concepts, the chosen "Atlantic Way" page, its contact page and the
Atlantic Globe (PRIOR creators). Plain HTML, CSS and JavaScript — no build step.

## Pages

- `index.html` — hub listing the design previews
- `concept-a-atlantic-way.html` — the Atlantic Way page (chosen direction) · `contact-a.html` — its contact page
- `concept-b-editorial.html`, `concept-c-signal.html` and their contact pages — the other two concepts
- `atlantic-globe/` — the Atlantic Globe app (built output), embedded on the Atlantic Way page and served at `/atlantic-globe/`

Shared pieces: `brands.js` + `brands.css` (brand wall / brand ring), `contact.js` (enquiry form), `assets/` (images, logos),
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
