/** In-page navigation never writes a fragment or creates a history entry. */
export function scrollToSection(id: string, focus = false) {
  const element = document.getElementById(id);
  if (!element) return;
  if (focus) element.focus({ preventScroll: true });
  element.scrollIntoView({
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth",
    block: "start",
  });
}
