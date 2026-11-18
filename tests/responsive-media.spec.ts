import { expect, test, type Locator } from "@playwright/test";

async function renderedSources(images: Locator) {
  await expect
    .poll(() =>
      images.evaluateAll((nodes) =>
        nodes.every(
          (node) =>
            (node as HTMLImageElement).complete &&
            (node as HTMLImageElement).naturalWidth > 0,
        ),
      ),
    )
    .toBe(true);
  return images.evaluateAll((nodes) =>
    nodes.map((node) => (node as HTMLImageElement).currentSrc),
  );
}

test("compact previews download smaller media and a dialog upgrades to full captures", async ({
  page,
}) => {
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.goto("/");
  const frames = page.locator(".hero-work .device-frame");
  const captures = page.locator(".hero-work .device-capture");
  await expect(captures).toHaveCount(2);
  for (const url of await renderedSources(frames))
    expect(url).toMatch(/-(small|medium)\.webp$/);
  for (const url of await renderedSources(captures))
    expect(url).toMatch(/(?:-light-tiny|-small-light)\.webp/);
  expect(
    requests.filter((url) =>
      /\/mockups\/(macbook-frame|intelligence-laptop)\.webp$/.test(url),
    ),
  ).toEqual([]);

  await page.getByRole("link", { name: "Ver portafolio", exact: true }).click();
  await page
    .locator(".showcase")
    .getByRole("button", { name: "Ver proyecto" })
    .click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  const full = dialog.locator(".device-capture");
  await expect(full).toHaveCount(1);
  expect((await renderedSources(full))[0]).toMatch(
    /omnicube-01-light(?:-preview)?\.webp/,
  );
  await dialog.getByRole("button", { name: "Ver captura completa" }).click();
  expect((await renderedSources(dialog.getByRole("img")))[0]).toMatch(
    /omnicube-01-light\.webp/,
  );
});

test("data saving skips speculative palettes and still loads the selected theme", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "connection", {
      configurable: true,
      value: { saveData: true },
    });
  });
  const requested: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/projects/")) requested.push(request.url());
  });
  await page.goto("/");
  const captures = page.locator(".hero-work .device-capture");
  await expect(captures).toHaveCount(2);
  await renderedSources(captures);
  await page.waitForLoadState("networkidle");
  expect(requested.some((url) => url.includes("-dark"))).toBe(false);
  await page.getByRole("button", { name: "Cambiar a tema oscuro" }).click();
  for (const url of await renderedSources(captures))
    expect(url).toMatch(/(?:-dark-tiny|-small-dark)\.webp/);
  expect(requested.some((url) => url.includes("-dark"))).toBe(true);
});
