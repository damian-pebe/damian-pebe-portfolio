/** Prepare visible screenshots without locking the theme control on a stalled request. */
export async function waitForThemeCaptures() {
  const captures = Array.from(
    document.querySelectorAll<HTMLImageElement>("img[data-theme-image]"),
  ).filter((image) => {
    const rect = image.getBoundingClientRect();
    return (
      rect.bottom > 0 &&
      rect.top < innerHeight &&
      rect.right > 0 &&
      rect.left < innerWidth
    );
  });
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      Promise.allSettled(captures.map((image) => image.decode())),
      new Promise<void>((resolve) => {
        timeout = setTimeout(resolve, 1200);
      }),
    ]);
  } finally {
    clearTimeout(timeout);
  }
}
