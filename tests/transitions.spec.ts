import { expect, test } from "@playwright/test";

test("theme reveals from the control and language animates the mounted hero", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const canvas = page.locator('[data-effect="clyra-radial"]');
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
        .evaluate(
          (node) =>
            Math.abs(
              new DOMMatrixReadOnly(getComputedStyle(node).transform).m13,
            ) > 0.15,
        ),
    )
    .toBe(true);
  await expect(page.locator("html")).not.toHaveAttribute(
    "data-language-transition",
    "running",
  );
  await expect(page.locator(".hero-description")).toHaveText(
    "From the first idea to a real product.",
  );
  expect(await mountedCanvas?.evaluate((node) => node.isConnected)).toBe(true);
  await expect
    .poll(() =>
      page
        .locator("[data-language-wordmark]")
        .evaluate((node) =>
          Math.abs(new DOMMatrixReadOnly(getComputedStyle(node).transform).m13),
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
