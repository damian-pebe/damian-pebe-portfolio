import { expect, test } from "@playwright/test";

test("brand and page navigation return to the hero without fragment URLs", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.getByRole("link", { name: "Ver portafolio", exact: true }).click();
  await expect(page).toHaveURL(/\/portfolio\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Del código al mundo real.",
  );
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page
    .locator("header")
    .getByRole("link", { name: "damian pérez — Inicio", exact: true })
    .click();
  await expect(page).toHaveURL(/:\d+\/$|\.dev\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeInViewport();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page
    .locator("header")
    .getByRole("link", { name: "damian pérez — Inicio", exact: true })
    .click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  expect(new URL(page.url()).hash).toBe("");
  await expect(page.locator('a[href^="#"]')).toHaveCount(0);
  await page.getByRole("link", { name: /Switch to English/ }).click();
  await page.getByRole("link", { name: "View portfolio", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/portfolio\/$/);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page
    .locator("header")
    .getByRole("link", { name: "damian pérez — Home", exact: true })
    .click();
  await expect(page).toHaveURL(/\/en\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeInViewport();
});

test("legacy fragment links resolve to clean routes", async ({ page }) => {
  await page.goto("/#work");
  await expect(page).toHaveURL(/\/portfolio\/$/);
  await page.goto("/en/#top");
  await expect(page).toHaveURL(/\/en\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeInViewport();
});

test("mobile navigation closes on selection and Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.locator(".menu-toggle");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page
    .locator(".mobile-navigation")
    .getByRole("link", { name: "Portafolio" })
    .click();
  await expect(page).toHaveURL(/\/portfolio\/$/);
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await page
    .locator(".mobile-navigation")
    .getByRole("button", { name: "Hablemos" })
    .click();
  await expect(page.locator("#contact")).toBeInViewport();
  expect(new URL(page.url()).hash).toBe("");
});

test("normal-motion navigation from a direct portfolio entry stays at the hero", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/portfolio/");
  await page
    .locator("header")
    .getByRole("link", { name: "damian pérez — Inicio", exact: true })
    .click();
  await expect(page.locator("[data-theme-surface]")).toHaveAttribute(
    "data-renderer",
    "webgl",
  );
  // Observe after browser smooth scrolling would have finished, not only its first frame.
  await page.waitForTimeout(900);
  expect(await page.evaluate(() => scrollY)).toBe(0);
  await expect(page.getByRole("heading", { level: 1 })).toBeInViewport();
  expect(new URL(page.url()).hash).toBe("");
});
