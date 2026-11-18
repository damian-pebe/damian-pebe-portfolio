# Architecture

## Routes and rendering

- `src/app/page.tsx` exports Spanish at `/`; `src/app/en/page.tsx` exports English at `/en/`.
- The app has one locally served variable font (Geist). Next downloads it at build time; visitors do not contact a font provider.
- `Portfolio.tsx` composes domain components under Framer Motion's LazyMotion and MotionConfig. Content is present in static HTML before hydration.
- `src/i18n/locales/` contains interface copy. Locale is encoded in the URL, so direct links and reloads preserve the selected language.
- `scripts/finalize-static.mjs` fixes the English document's static language attribute and generates hashes for inline hydration scripts. The generated CSP permits these exact scripts, not arbitrary inline JavaScript.
- Native links provide navigation and contact. There is no contact form, analytics, tracking or invented client/revenue metrics.

## Visuals and behavior

- Background Paths adapts Kokonut UI's MIT ribbon geometry, discoverable on 21st.dev. Its canvas renderer is local, caps pixel density at 1.5 and runs at 30 frames per second. It stops outside the viewport, in hidden tabs, for reduced motion and when data-saving is enabled. Resize, pointer and visibility observers are cleaned up.
- Framer handles the text entrance, language-change entrance and section reveals. CSS handles hover perspective and glass details. Reduced motion is respected live.
- The project collection initially shows six selected products. Filters expose all matching projects, and expansion exposes all 23. No employment-history section is included.
- A lazy-loaded native dialog provides project details, two captures where available, arrow-key navigation, Escape, focus containment, focus restoration and scroll locking.
- Clipboard feedback distinguishes success from rejection and retains the mailto fallback.

## Content and assets

The 23 projects, EN/ES descriptions and permanently redacted captures come from `clyra-dev/clyra`, revision `1d44066ceb3d96c6abf98bdd8f5798caa58addd5`. Only its published portfolio catalog and public captures were copied. Prototype and in-development labels remain explicit; concept artwork is labeled in the project dialog.

`features/portfolio/data/projects.json` is the bilingual catalog and source provenance. `data/projects.ts` provides typed contracts and local asset paths. The source capture paths in JSON are provenance; the site serves its own optimized WebP files.

`public/projects/` includes 640px mobile previews, 960px desktop previews and 1600px gallery images. Native picture selection and lazy loading reduce transfers. Gallery images retain their full proportions. Original personal portrait was optimized to 132px. Obsolete fonts and 83 MB of older portfolio images were removed from the working tree; originals remain in Git history.

## Hosting and security

`wrangler.jsonc` pins personal Cloudflare account `ad8dddf36a3fc53dca424e763e4a153e`.

- Production Worker: `damian-pebe-portfolio`, custom domains `damianperez.dev` and `www.damianperez.dev`.
- Staging Worker: `damian-pebe-portfolio-staging`, isolated workers.dev URL and no production domain routes.
- Output: `out/`, static assets only, native 404 page and trailing slash handling.
- `public/_redirects`: permanent www-to-apex redirect.
- `public/_headers`: TLS policy, frame denial, MIME-sniffing protection, bounded browser permissions and cache policy.
- Hashed framework assets are immutable for one year. Project images are cached for a day with stale-while-revalidate. HTML revalidates.
- No secrets, cookies, customer data, server processes or runtime dependencies are hosted.
