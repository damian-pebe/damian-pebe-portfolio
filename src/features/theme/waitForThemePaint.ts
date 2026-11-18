/** A view-transition snapshot must include the canvas's new palette too. */
export function waitForThemePaint() {
  const theme = document.documentElement.dataset.theme;
  return Promise.allSettled(
    Array.from(
      document.querySelectorAll<HTMLCanvasElement>(
        "canvas[data-theme-surface]",
      ),
    ).map((canvas) => {
      const visible = canvas.getBoundingClientRect();
      if (
        canvas.dataset.renderer !== "webgl" ||
        canvas.dataset.paintedTheme === theme ||
        visible.bottom <= 0 ||
        visible.top >= innerHeight
      )
        return Promise.resolve();
      return new Promise<void>((resolve) => {
        const finish = () => {
          observer.disconnect();
          clearTimeout(timeout);
          resolve();
        };
        const observer = new MutationObserver(() => {
          if (
            canvas.dataset.paintedTheme === theme ||
            canvas.dataset.renderer !== "webgl"
          )
            finish();
        });
        const timeout = setTimeout(finish, 400);
        observer.observe(canvas, {
          attributes: true,
          attributeFilter: ["data-painted-theme", "data-renderer"],
        });
      });
    }),
  );
}
