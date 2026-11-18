/** Commit immediately; LanguageText animates the two mounted React text layers. */
export async function transitionLanguage(update: () => void) {
  if (
    matchMedia("(prefers-reduced-motion: reduce)").matches ||
    document.visibilityState !== "visible"
  ) {
    update();
    return;
  }

  const anchor =
    scrollY > 80
      ? Array.from(
          document.querySelectorAll<HTMLElement>("[data-language-surface]"),
        ).find((node) => {
          const rect = node.getBoundingClientRect();
          return (
            !node.closest("header") &&
            rect.top >= 100 &&
            rect.bottom < innerHeight
          );
        })
      : undefined;
  const top = anchor?.getBoundingClientRect().top;
  document.documentElement.dataset.languageTransition = "running";
  try {
    update();
    if (anchor?.isConnected && top !== undefined) {
      window.scrollBy({
        top: anchor.getBoundingClientRect().top - top,
        behavior: "instant",
      });
    }
    await new Promise<void>((resolve) => window.setTimeout(resolve, 760));
  } finally {
    delete document.documentElement.dataset.languageTransition;
  }
}
