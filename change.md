# Atlantic Media website — change log

Everything that changed on the site from the day the project folder was created (5 October 2026) to today (2 November 2026), newest first. Dates are the days the work was done; the site deploys from the `atlantic-media-website` branch on Netlify (`https://atlantic-media-2.netlify.app`).

## Unreleased (in the working tree, not yet committed)

- Home page: the page can no longer be scrolled sideways on desktop widths between about 1200 and 1700 px (the hidden globe hover card used to widen the page). The services card stack still sticks as before.
- Globe page: canonical link, Open Graph and Twitter share tags added, with a share image made from the globe's first frame (`assets/brand/og-globe.jpg`).

## 2 November 2026

- Full pre-launch check of the live site on desktop and phone: every page, console errors, broken links and images, meta and share tags, security headers, form markup, 404 page, sitemap and robots. No broken links or images, no console errors; the two fixes above came out of it.
- Still open for go-live: final domain in the canonical links, share tags, sitemap and robots (marked `SITE_URL` in six files), custom domain with HTTPS and the DNS switch from Wix, a test enquiry and the notification email in Netlify Forms, and optionally compressing the three reel videos (6 to 7 MB each).

## 30 October 2026

- Services ("One Brand. Six Ways to Make It Louder."): all six cards given the client's new images, named per card; card images now show whole instead of cropped, with a slightly wider image column on desktop.
- Services cards now show their images on phones and tablets too (they had been hidden below 1100 px).
- Cards 05 (CaaS) and 06 (Production) had their images swapped at the client's request.

## 29 October 2026

- Pre-launch audit and fixes: `contact.js` restored; `noindex` removed; meta descriptions, canonical links and share tags on every page; sitemap and robots; mobile menu; Netlify Forms wired to the contact form with a honeypot; Privacy and Terms pages; custom 404 page with links back to the home page and the contact form; security headers; globe footer and badges updated.
- Globe page: the globe, the India map and the hover card now stay clear of the sticky header on every screen size; the map is framed on the whole country; loading poster recaptured.
- Map: "Hyderabad" sits in the middle of the creator ring with the pin above it, the creator count is gone, every creator sits on the ring.
- Roster: random order replaced with the client's fixed order in rows of ten (rows 1 to 4), the same on every visit and on every return to the roster; follower counts removed from the fallback roster.
- 13 creators added (rows 2 to 4), taking the roster to 40, with names, categories and handles from their public Instagram pages; portraits researched, cropped 4:5 and replaced through several client review rounds; atlas and poster rebuilt.
- Map: the creator ring split into concentric rings (row one inside, the rest outward), then rebalanced so the outer rings fill evenly.
- Favicon changed to the white AM mark and wordmark on the navy tile; icon links versioned so browsers drop their cached copy of the old icon.
- Work log workbook started (`/home/sajan/test/Atlantic-Media-Work-Log.xlsx`, outside the repo).

## 28 October 2026

- Favicon set made from the Atlantic Media logo including the wordmark, matched to the live Wix site's icon.

## 27 October 2026

- Roster order shuffled for every visitor and again on every return to the roster (replaced on 29 October by the fixed order).

## 26 October 2026

- Globe: follower counts removed; the hover card shows the Instagram handle; clicking a photo opens that creator's Instagram (desktop and touch); on the home page the card is drawn in the free space to the right of the embedded globe.

## 22 October 2026

- Hero: the video wall rebuilt as three people-only clips that change on every visit and reload when the hero comes back into view; kicker dashes removed.
- Brands: all 42 logos re-cut from the client's poster; the poster file removed.
- GitHub branch protection ruleset; Netlify project set up on the client's team (blocked by their credits); deploy zip updated.

## 21 October 2026

- Pre-launch QA review of the live site at four screen widths, with a findings document and go-live checklist (fixes applied on 29 October).

## 19 October 2026

- Services: the sixth card stacks like the first five and the next section follows with the same gap.

## 16 October 2026

- Globe site recoloured to the PRIOR palette; Metrics page retired; PRIOR logo; buttons point to the globe; Instagram handle corrected; full-page glass finish.
- Brand wall rebuilt from the 42-brand poster; the three reels placed in iPhone frames with a sound toggle; section-by-section scroll effects.
- Globe: the 36 placeholder creators replaced by the real PRIOR roster of 27, with Instagram handles, follower counts and portraits; simpler cards with an "Open profile" link; the Roster page retired.
- Three rounds of portrait replacements (all 27, then the 11 requested, then client-supplied photos for Shivani, Jogipet Ratnam and Shivani Raj); loading poster refreshed on the PRIOR orange stage.
- Netlify: production branch corrected to `atlantic-media-website`, site made public, cache rules so updated photos never serve stale.
- Hero: muted video wall behind the hero text with an overlay that keeps the headline readable.

## 13 October 2026

- Hero: new intro copy under the headline.

## 9 October 2026

- Hero India map removed; the six services reordered; "Who's actually cooking?" removed; "Bring the rizz. We'll bring the briefs." enlarged as a serif line; team section removed.

## 8 October 2026

- Home page rewritten with the client's launch-page copy (first layout reverted, second accepted) with the brand ring kept under the hero and the 01 story after it.
- Hero map: bare India outline with the Hyderabad hub and routes, state names, label collisions fixed; copy updates (South India, CaaS, founders, "the job").

## 7 October 2026

- Repository initialised and pushed to the client's GitHub; `atlantic-media-website` branch; the chosen concept served at `/` and the contact page at `/contact`; `netlify.toml` for Git-based deploys with no build step.
- A multi-page prototype with service cards built at the client's request, then reverted to the single page.
- Brand ring follows the cursor direction and the hand hint removed; the globe fixed on phones in the PRIOR section.

## 6 October 2026

- Client feedback round: shared image removed, map recoloured, brand highlights merged into one block, PRIOR container changed to translucent orange, button colours matched.
- Orbiting brand badges no longer hide behind the globe; original globe size restored with the tilted orbit kept.
- "Drag to explore" and swiping-hand hints on the brand ring; updated deploy zip.

## 5 October 2026

- Project folder created from the Netlify site export; local preview server (`dev-server.mjs`) so `npm run dev` serves the site with pretty URLs and the redirect rules.
- First restyle of the concept page: Brand Partnership Highlights moved above the stats, hero logo made clickable, first deploy zip built.
