import { expect, test } from "@playwright/test";

test("theme reveals from the control and language animates the mounted hero", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const canvas = page.locator('[data-effect="shader-metal"]');
  await expect(canvas).toHaveAttribute("data-renderer", "webgl");
  const mountedCanvas = await canvas.elementHandle();
  await page.getByRole("button", { name: "Cambiar a tema oscuro" }).click();
  await expect
    .poll(() =>
      page.evaluate(() =>
        document.getAnimations().some((animation) => {
          const effect = animation.effect as KeyframeEffect | null;
          return (
            effect?.pseudoElement === "::view-transition-new(root)" &&
            effect
              .getKeyframes()
              .some((frame) => String(frame.clipPath).startsWith("circle("))
          );
        }),
      ),
    )
    .toBe(true);
  await expect(page.locator("html")).not.toHaveAttribute(
    "data-theme-transition",
    "reveal",
  );
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("link", { name: /Switch to English/ }).click();
  await expect
    .poll(() =>
      page
        .locator("[data-language-wordmark]")
        .evaluate((node) => Number(getComputedStyle(node).opacity) < 0.9),
    )
    .toBe(true);
  await expect(page.locator("html")).not.toHaveAttribute(
    "data-language-transition",
    "running",
  );
  await expect(page.locator(".hero-description")).toHaveText(
    "Good ideas deserve exceptional software.",
  );
  expect(await mountedCanvas?.evaluate((node) => node.isConnected)).toBe(true);
  await expect
    .poll(() =>
      page
        .locator("[data-language-wordmark]")
        .evaluate((node) =>
          Math.abs(new DOMMatrixReadOnly(getComputedStyle(node).transform).m42),
        ),
    )
    .toBeLessThan(0.001);
});

test("theme choice still works when browser storage is denied", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(Storage.prototype, "setItem", {
      value: () => {
        throw new Error("denied");
      },
    });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Cambiar a tema oscuro" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("link", { name: /Switch to English/ }).click();
  await expect(
    page.getByRole("button", { name: "Switch to light theme" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("one shared background survives route and language navigation", async ({
  page,
}) => {
  await page.goto("/");
  const canvas = page.locator('[data-effect="shader-metal"]');
  await expect(canvas).toHaveAttribute("data-thread", "worker");
  await expect(canvas).toHaveAttribute("data-painted-theme", "light");
  const original = await canvas.elementHandle();
  await expect.poll(() => page.workers().length).toBe(1);
  await page.getByRole("link", { name: "Ver portafolio", exact: true }).click();
  await expect(canvas).toHaveAttribute("data-thread", "worker");
  await expect.poll(() => page.workers().length).toBe(1);
  await page
    .locator("header")
    .getByRole("link", { name: "damian pérez — Inicio", exact: true })
    .click();
  await expect(canvas).toHaveAttribute("data-thread", "worker");
  await expect.poll(() => page.workers().length).toBe(1);
  await page.getByRole("button", { name: "Cambiar a tema oscuro" }).click();
  await expect(canvas).toHaveAttribute("data-painted-theme", "dark");
  expect(await original?.evaluate((node) => node.isConnected)).toBe(true);
});

test("the background retains its static fallback without worker support", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(window, "Worker", { value: undefined }),
  );
  await page.goto("/");
  const canvas = page.locator('[data-effect="shader-metal"]');
  await expect(canvas).toHaveAttribute("data-renderer", "webgl");
  await expect(canvas).toHaveAttribute("data-thread", "main");
  await expect(canvas).toHaveAttribute("data-running", "false");
  await page.getByRole("button", { name: "Cambiar a tema oscuro" }).click();
  await expect(canvas).toHaveAttribute("data-painted-theme", "dark");
});

test("theme circle keeps the previous canvas palette outside its reveal", async ({
  page,
}) => {
  const { default: sharp } = await import("sharp");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator("[data-theme-surface]")).toHaveAttribute(
    "data-painted-theme",
    "light",
  );
  // Hold the metal still while exercising the native theme animation. This
  // isolates palette leakage from legitimate movement of its reflective bands.
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  const sample = async () => {
    const { data, info } = await sharp(await page.screenshot({ scale: "css" }))
      .raw()
      .toBuffer({ resolveWithObject: true });
    return [
      data[(Math.floor(info.height * 0.45) * info.width + 15) * info.channels],
      data[(120 * info.width + info.width - 20) * info.channels],
    ];
  };
  for (const target of ["dark", "light"] as const) {
    const before = await sample();
    await page
      .getByRole("button", {
        name:
          target === "dark" ? "Cambiar a tema oscuro" : "Cambiar a tema claro",
      })
      .click();
    await page.waitForFunction(() =>
      document
        .getAnimations()
        .some(
          (a) =>
            (a.effect as KeyframeEffect | null)?.pseudoElement ===
            "::view-transition-new(root)",
        ),
    );
    await page.evaluate(() => {
      const animation = document
        .getAnimations()
        .find(
          (a) =>
            (a.effect as KeyframeEffect | null)?.pseudoElement ===
            "::view-transition-new(root)",
        )!;
      animation.pause();
      animation.currentTime = 420;
    });
    const during = await sample();
    await page.evaluate(() =>
      document
        .getAnimations()
        .filter(
          (a) =>
            (a.effect as KeyframeEffect | null)?.pseudoElement ===
            "::view-transition-new(root)",
        )
        .forEach((a) => a.finish()),
    );
    await expect(page.locator("html")).not.toHaveAttribute(
      "data-theme-transition",
      "reveal",
    );
    await expect(page.locator("[data-theme-snapshot]")).toHaveCount(0);
    const after = await sample();
    expect(Math.abs(before[0] - after[0])).toBeGreaterThan(40);
    expect(Math.abs(before[1] - after[1])).toBeGreaterThan(40);
    expect(Math.abs(during[0] - before[0])).toBeLessThan(10);
    expect(Math.abs(during[1] - after[1])).toBeLessThan(10);
  }
});
