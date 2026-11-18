# Verification — 2026-11-17

## Compact Clyra revision

- Reused Clyra’s actual Threads shader, Stack Sans Headline font, glass control treatment, language animations and device-screen projection. The shader pauses for hidden/offscreen/reduced-motion states and caps pixel density and animation rate.
- Reduced the hero, showcase, headings and contact section. The catalog uses four columns on desktop and two on mobile, with eight projects initially and all 23 available. Card controls no longer overlap device artwork.
- 20 local browser checks passed on desktop and mobile. Additional coverage verifies normal-motion language changes, browser back/forward, metadata updates and preservation of the selected product, expanded catalog and mounted shader canvas. Console/hydration errors are asserted absent.
- Both normal and reduced-motion paths were checked. A conditional sheen element originally caused a server/client markup mismatch for reduced-motion visitors; rendering stable markup with a CSS motion preference fixed it.
- New hosted checks and measured performance will be recorded with this revision’s release artifacts.

## Earlier monochrome redesign

- Replaced the initial full-height hero and flat browser cards with a compact personal introduction, six-project showcase and Clyra device compositions. The interface has a white default and persistent black theme; original product captures keep their real colors.
- 18 browser checks passed in desktop Chrome and an iPhone-sized Chromium viewport. New coverage exercises showcase controls and project selection, device/full-capture switching, theme persistence across ES/EN navigation, and both themes' automated WCAG AA checks.
- Fixed a reduced-motion hydration-style mismatch discovered during visual review. The language test now captures console errors as well as runtime exceptions; the reduced-motion path passed after the fix.
- Visual review covered both themes, mobile layout, catalog device fitting and the project dialog. The public source supplies 98 UI captures across 20 projects; galleries load views on demand. All 23 covers decode; prototype and concept labels remain explicit.
- Production export, TypeScript, ESLint, formatting and runtime dependency audit passed. No new runtime dependencies were added.
- The prior Lighthouse measurements below describe the earlier design. New hosted measurements and release IDs are recorded with the redesign artifacts; they are not assumed from the previous score.

## Initial release checks

- Production static build, TypeScript, ESLint and formatting checks.
- 14 Playwright checks on desktop Chrome and an iPhone-sized Chromium viewport. They cover bilingual navigation/reload, 23 decoded project covers, category filters, dialog keyboard/focus behavior, clipboard success and failure, live reduced-motion changes, offscreen animation suspension, 320/375/768px layouts, and automated accessibility.
- The same 14 browser checks passed on the personal-account Cloudflare staging deployment, including the generated Content Security Policy.
- Visual inspection of desktop/mobile layouts, full collection and project detail; capture loading was checked after scrolling rather than relying on an unscrolled full-page screenshot.
- Lighthouse 13.6.0 mobile simulation on the hosted staging URL: performance 94, accessibility 100, best practices 100, SEO 100; LCP 0.9 s, FCP 0.9 s, CLS 0, total blocking time 280 ms. This is a lab measurement, not a guarantee of every visitor's connection.
- The Lighthouse review identified accessible-label mismatches; labels were corrected and 640px image variants added before the final release.
- Runtime dependency audit: zero reported vulnerabilities with `npm audit --omit=dev`.
- The prior parked domain and personal account were verified before configuring production hosting.

## Open tooling finding

The full development audit reports 14 high-severity entries propagated through the same picomatch ReDoS advisory, GHSA-fc5q-39xc-vjpf, in the ESLint dependency graph (`eslint-config-next`, TypeScript ESLint, micromatch and tinyglobby). At verification time npm did not offer a compatible fixed dependency tree. No audit suppression or forced downgrade was applied.

These packages process local repository globs during development; they are not shipped in the assets-only Cloudflare deployment. Avoid untrusted glob input and update the lint toolchain when a fixed version becomes available. A successful build, audit or accessibility scan does not prove absence of every defect.

Evidence, detailed audit JSON, screenshots and Lighthouse output are stored outside the repository at `~/.codex/artifacts/damian-portfolio-20261117/`.
