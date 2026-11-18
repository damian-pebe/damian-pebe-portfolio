# Architecture

## Routes and rendering

- `src/app/page.tsx` exports Spanish at `/`; `src/app/en/page.tsx` exports English at `/en/`.
- The app has one locally served variable font (Stack Sans Headline, also used by Clyra). Next downloads it at build time; visitors do not contact a font provider.
- `Portfolio.tsx` composes domain components under Framer Motion's LazyMotion and MotionConfig. Content is present in static HTML before hydration.
- `src/i18n/locales/` contains interface copy. Locale is encoded in the URL, so direct links and reloads preserve the selected language. Native History API navigation keeps controls and artwork mounted; `LanguageText` and its motion variants animate the copy in place. Browser back/forward, canonical metadata and document language follow the current locale.
- `scripts/finalize-static.mjs` fixes the English document's static language attribute and generates hashes for inline hydration scripts. The generated CSP permits these exact scripts, not arbitrary inline JavaScript.
- Native links provide navigation and contact. There is no contact form, analytics, tracking or invented client/revenue metrics.

## Visuals and behavior

- The default presentation is white and black, with a persistent inverted dark theme. `hooks/useTheme.ts` owns the preference; a fixed, CSP-hashed bootstrap applies it before paint. Language navigation and reload retain the choice.
- The hero reuses Clyra’s actual React Bits Threads shader through a small native WebGL renderer, at 30 fps with pixel density capped at 1. It stops outside the viewport, in hidden tabs, for reduced motion and data-saving. Theme changes redraw even when animation is paused. Shader compilation uses `KHR_parallel_shader_compile` where available to avoid waiting synchronously on the GPU; pending setup is abortable. All observers and listeners are disposed.
- Framer handles the magnetic name, language transitions, manually controlled featured-project transitions, pointer tilt and section reveals. The same glass filter and edge treatment as Clyra appear in the primary controls. CSS handles hover motion. Static and hydrated styles match for reduced-motion visitors.
- `FeaturedProjects` presents six products through a keyboard-accessible carousel. There is no autoplay. The project collection starts with eight cards in four columns on desktop and two on mobile; filters expose all matching products and expansion exposes all 23. No employment-history section is included.
- `DeviceMockup` uses the same published device frames and screen corner geometry as Clyra. `utils/screenProjection.ts` maps real captures to the photographed displays; `ResizeObserver` maintains proportions. Concept art remains distinct from interface captures. Decorative mockups do not duplicate card names for screen readers; product stages remain in accessible captions.
- A lazy-loaded native dialog presents device scenes, full screenshot galleries (up to six views per product), project details, arrow navigation, Escape, focus containment/restoration and scroll locking. The visitor can switch between the mockup and full screenshot.
- Clipboard feedback distinguishes success from rejection and retains the mailto fallback.

## Content and assets

The 23 projects, EN/ES descriptions and permanently redacted captures originate from `clyra-dev/clyra`, revision `1d44066ceb3d96c6abf98bdd8f5798caa58addd5`. The redesign also reuses its published device mockups, projection geometry and first product views, one font family, language motion and glass treatment. Only public portfolio assets and presentation code were copied. Prototype and in-development labels remain explicit; concept artwork is labeled in the project dialog.

`features/portfolio/data/projects.json` is the bilingual catalog and source provenance. `data/projects.ts` provides typed contracts and local asset paths. The source capture paths in JSON are provenance; the site serves its own optimized WebP files.

`public/projects/` includes 640px mobile previews, 960px desktop previews and 1600px gallery images. The small catalog uses 640px previews; companion devices use dedicated 640px gallery previews. Full captures are requested when a detail opens. Lazy loading reduces transfers. Optimized device frames live in `public/mockups/` (about 30–43 KB each); their original coordinate system is preserved when resizing the frame assets. Gallery images retain their full proportions. The catalog lists each public capture as provenance. Versioned capture URLs prevent browsers from reusing the previous redesign’s thumbnails after deployment. Original personal portrait was optimized to 132px. Obsolete fonts and 83 MB of older portfolio images were removed from the working tree; originals remain in Git history.

## Hosting and security

`wrangler.jsonc` pins personal Cloudflare account `ad8dddf36a3fc53dca424e763e4a153e`.

- Production Worker: `damian-pebe-portfolio`, custom domain `damianperez.dev`.
- Staging Worker: `damian-pebe-portfolio-staging`, isolated workers.dev URL and no production domain routes.
- Output: `out/`, static assets only, native 404 page and trailing slash handling.
- `src/workers/canonicalRedirect.ts` with `wrangler.redirect.jsonc`: separate `damian-portfolio-redirect` Worker, 308 www-to-apex redirect preserving path and query. Workers Static Assets does not support hostname conditions in `_redirects`; canonical requests remain assets-only.
- `public/_headers`: TLS policy, frame denial, MIME-sniffing protection, bounded browser permissions and cache policy.
- Hashed framework assets are immutable for one year. Project images use versioned URLs and are immutable for one year; bump `assetVersion` when replacing them. Device frames use a one-day cache with stale-while-revalidate. HTML revalidates.
- No secrets, cookies, customer data, server processes or runtime dependencies are hosted.
- The two HTML routes send `Cache-Control: public, max-age=0, must-revalidate, no-transform`. This prevents Cloudflare's automatic analytics injection from altering the static document or conflicting with its hashed CSP. Other asset routes retain their compression and caching policies. See [Cloudflare Web Analytics automatic injection](https://developers.cloudflare.com/web-analytics/get-started/).
