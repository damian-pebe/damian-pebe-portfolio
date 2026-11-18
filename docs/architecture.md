# Architecture

## Routes and rendering

- Four static entry points: `/` and `/en/` render the landing page; `/portfolio/` and `/en/portfolio/` render the project catalog. Each has its own title, canonical URL and bilingual alternatives. Native Next links handle navigation between pages.
- `features/site/SiteShell.tsx` composes the persistent header, contact, context and Framer Motion providers in the root layout. `features/landing/Landing.tsx` and `features/portfolio/Portfolio.tsx` only compose their own page content. Translation, theme, navigation and product presentation have separate domain boundaries.
- The brand links to the hero in the current language. Same-page section controls scroll without creating hash URLs. `features/navigation/` centralizes route generation and section scrolling; existing `#top`, `#work` and contact bookmarks are migrated to clean paths.
- `features/language/useLocale.ts` synchronizes URL, document language and metadata. Native History API language changes preserve the mounted page, selected project, catalog filters and shader. Browser back/forward and direct reloads retain the correct language and page.
- The app has one locally served variable font (Stack Sans Headline, also used by Clyra). Next downloads it at build time; visitors do not contact a font provider. All content is exported to HTML before hydration.
- `scripts/finalize-static.mjs` fixes both English documents' static language attributes and generates hashes for inline hydration scripts. The generated CSP permits those exact scripts, not arbitrary inline JavaScript.
- There is no contact form, analytics, tracking, employment-history section or invented client/revenue metric.

## Visuals and behavior

- The full-height landing uses Clyra's actual `ShaderLines` radial effect, adapted to monochrome with negative space behind the name. The previous Threads implementation is removed. A local native WebGL renderer avoids Clyra's external Three.js runtime. Async shader compilation, a 30 fps limit, pixel density capped at 1, offscreen/hidden/reduced-motion/data-saving suspension and complete resource disposal bound its work. `landing/hooks/` owns the renderer lifecycle and magnetic/scroll motion; components render the scene.
- The transparent fixed header gains a fading backdrop blur after scrolling. It offers separate home and portfolio links, theme/language controls and contact. Mobile navigation closes on selection or Escape and restores keyboard focus.
- `features/theme/` owns the stored monochrome preference and Clyra's circular View Transition, originating at the clicked control. A CSP-hashed bootstrap applies the saved palette before paint. Unsupported browsers, reduced motion and hidden tabs commit immediately. Pending transitions are cancellable on route changes; denied storage still permits a session theme change.
- `features/language/` contains Clyra's text roll, wipe and 3D turn effects. The hero name performs Clyra's 3D orbit when language changes; existing controls and artwork remain mounted. Reduced motion commits readable content immediately.
- `FeaturedProjects` presents six products through a keyboard-accessible carousel without autoplay. The catalog starts with eight cards in four desktop columns and two mobile columns; filters expose matching products and expansion exposes all 23.
- `DeviceMockup` uses Clyra's published frames and screen geometry. `utils/screenProjection.ts` maps real captures to photographed displays; `ResizeObserver` maintains proportions. Concept art and product stages remain explicitly identified. Decorative mockups do not duplicate accessible card names.
- A lazy-loaded native dialog presents mockups, full screenshots (up to six views per product), project details, arrow navigation, Escape, focus containment/restoration and scroll locking.
- Contact copying distinguishes success from rejection and retains the mailto fallback.

## Content and assets

The 23 projects, EN/ES descriptions and permanently redacted captures originate from `clyra-dev/clyra`, revision `1d44066ceb3d96c6abf98bdd8f5798caa58addd5`. The redesign also reuses its published device mockups, projection geometry and first product views, one font family, landing radial shader, magnetic name, circular theme reveal, language motion and glass treatment. Only public portfolio assets and presentation code were copied. Prototype and in-development labels remain explicit; concept artwork is labeled in the project dialog.

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
- All four HTML routes send `Cache-Control: public, max-age=0, must-revalidate, no-transform`. This prevents Cloudflare's automatic analytics injection from altering the static document or conflicting with its hashed CSP. Other asset routes retain their compression and caching policies. See [Cloudflare Web Analytics automatic injection](https://developers.cloudflare.com/web-analytics/get-started/).
