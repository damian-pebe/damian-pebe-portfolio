import { expect, test } from "@playwright/test";

test("the landing work preview stays translated and opens the portfolio by keyboard", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".hero-work-note")).toContainText(
    "Diseño la experiencia y construyo lo que hay detrás",
  );
  await expect(page.locator(".hero-work-caption")).toHaveCount(2);
  await expect(page.locator(".hero-work .device-capture")).toHaveCount(2);
  for (const image of await page.locator(".hero-work .device-capture").all()) {
    await expect
      .poll(() =>
        image.evaluate(
          (element: HTMLImageElement) =>
            element.complete && element.naturalWidth > 0,
        ),
      )
      .toBe(true);
  }

  await page.getByRole("link", { name: /Switch to English/ }).click();
  await expect(page.locator(".hero-work-note")).toContainText(
    "I design the experience and build what powers it",
  );
  const preview = page.getByRole("link", {
    name: /Explore the full portfolio/,
  });
  await expect(preview).toHaveAttribute("href", "/en/portfolio/");
  await preview.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/en\/portfolio\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "From code to the real world.",
  );
  expect(new URL(page.url()).hash).toBe("");
});
