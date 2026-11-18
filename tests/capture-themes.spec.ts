import { expect, test, type Locator } from "@playwright/test";
import { projects } from "../src/features/portfolio/data/projects";

async function decoded(images: Locator) {
  for (const image of await images.all()) {
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        image.evaluate(
          (node: HTMLImageElement) => node.complete && node.naturalWidth > 0,
        ),
      )
      .toBe(true);
  }
}

test("the animated reveal waits for visible capture decoding and recovers from a stalled decode", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const images = page.locator(".hero-work .device-capture");
  await expect(images).toHaveCount(2);
  await decoded(images);
  await page.evaluate(() => {
    const decode = HTMLImageElement.prototype.decode;
    HTMLImageElement.prototype.decode = function () {
      if (!this.hasAttribute("data-theme-image")) return decode.call(this);
      this.dataset.decodeReady = "pending";
      return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          decode.call(this).then(() => {
            this.dataset.decodeReady = "ready";
            resolve();
          }, reject);
        }, 350);
      });
    };
  });
  await page.getByRole("button", { name: "Cambiar a tema oscuro" }).click();
  await expect
    .poll(() =>
      page.evaluate(() =>
        document
          .getAnimations()
          .some(
            (animation) =>
              (animation.effect as KeyframeEffect)?.pseudoElement ===
              "::view-transition-new(root)",
          ),
      ),
    )
    .toBe(true);
  const visible = await images.evaluateAll((nodes) =>
    nodes
      .filter((node) => {
        const rect = node.getBoundingClientRect();
        return (
          rect.bottom > 0 &&
          rect.top < innerHeight &&
          rect.right > 0 &&
          rect.left < innerWidth
        );
      })
      .map((node) => ({
        ready: (node as HTMLImageElement).dataset.decodeReady,
        src: (node as HTMLImageElement).src,
      })),
  );
  expect(visible.length).toBeGreaterThan(0);
  for (const image of visible) {
    expect(image.ready).toBe("ready");
    expect(image.src).toContain("-thumb-dark.webp");
  }
  await expect(page.locator("html")).not.toHaveAttribute(
    "data-theme-transition",
    "reveal",
  );
  await page.evaluate(() => {
    HTMLImageElement.prototype.decode = () => new Promise(() => {});
  });
  await page.getByRole("button", { name: "Cambiar a tema claro" }).click();
  await expect(page.locator("html")).not.toHaveAttribute(
    "data-theme-transition",
    "reveal",
  );
  await expect(
    page.getByRole("button", { name: "Cambiar a tema oscuro" }),
  ).toBeEnabled();
  await expect(images.first()).toHaveAttribute("src", /-thumb-light\.webp/);
});

test("landing captures switch real palettes and keep the saved theme through navigation", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const captures = page.locator(".hero-work .device-capture");
  await expect(captures).toHaveCount(2);
  for (const palette of ["light", "dark"] as const) {
    if (palette === "dark")
      await page.getByRole("button", { name: "Cambiar a tema oscuro" }).click();
    for (const image of await captures.all())
      await expect(image).toHaveAttribute(
        "src",
        new RegExp(`-thumb-${palette}\\.webp`),
      );
    await decoded(captures);
  }
  await page.getByRole("link", { name: /Switch to English/ }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(captures.first()).toHaveAttribute("src", /-thumb-dark\.webp/);
  await decoded(captures);
  await page.getByRole("link", { name: "View portfolio", exact: true }).click();
  await expect(page.locator(".showcase .device-capture")).toHaveAttribute(
    "src",
    /omnicube-thumb-dark\.webp/,
  );
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await expect(page.locator(".showcase .device-capture")).toHaveAttribute(
    "src",
    /omnicube-thumb-light\.webp/,
  );
  await decoded(page.locator(".showcase .device-capture"));
  expect(errors).toEqual([]);
});

test("every catalog screen uses its supplied palette including companion displays and fixed-theme projects", async ({
  page,
}) => {
  test.setTimeout(90_000);
  const missing: string[] = [];
  page.on("response", (response) => {
    if (response.url().includes("/projects/") && !response.ok())
      missing.push(response.url());
  });
  await page.goto("/portfolio/");
  await page
    .getByRole("button", { name: "Explorar los 23 proyectos", exact: true })
    .click();
  for (const theme of ["light", "dark"] as const) {
    if (theme === "dark")
      await page.getByRole("button", { name: "Cambiar a tema oscuro" }).click();
    for (const project of projects) {
      const card = page.locator(`.project-${project.id}`);
      await card.scrollIntoViewIfNeeded();
      const images = card.locator(".device-capture, .concept-visual");
      await expect(images.first()).toBeVisible();
      for (const image of await images.all()) {
        const url = (await image.getAttribute("src"))!;
        if (project.captures) {
          const number = url.match(/-(\d{2})-(light|dark)/)?.[1] ?? "01";
          const capture = project.captures[Number(number) - 1];
          const original = capture.sources?.[theme] ?? capture.src;
          const palette = original.match(/-(light|dark)\.webp$/)![1];
          expect(url).toMatch(new RegExp(`-${palette}(?:-preview)?\\.webp`));
        } else {
          expect(url).toContain(`${project.id}-small.webp`);
        }
      }
      await decoded(images);
    }
  }
  expect(missing).toEqual([]);
});

test("dialog mockups and full captures follow the theme without changing gallery slots or original-only fallbacks", async ({
  page,
  context,
}) => {
  test.setTimeout(90_000);
  await page.goto("/portfolio/");
  const preferences = await context.newPage();
  await preferences.goto("/");
  for (const theme of ["light", "dark"] as const) {
    if (theme === "dark") {
      await preferences
        .getByRole("button", { name: "Cambiar a tema oscuro" })
        .click();
      await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    }
    for (const id of ["agentos", "neurocity", "rook"]) {
      const project = projects.find((item) => item.id === id)!;
      await page.locator(`.project-${id}`).click();
      const dialog = page.getByRole("dialog");
      for (let index = 0; index < project.captures!.length; index++) {
        const capture = project.captures![index];
        const original = capture.sources?.[theme] ?? capture.src;
        const filename = `${id}-${original.split("/").at(-1)}`;
        await expect(dialog.getByRole("img")).toHaveAttribute(
          "src",
          new RegExp(filename.replace(".", "\\.")),
        );
        await decoded(dialog.locator(".device-capture"));
        await dialog
          .getByRole("button", { name: "Ver captura completa" })
          .click();
        await expect(dialog.locator(".dialog-gallery > img")).toHaveAttribute(
          "src",
          new RegExp(filename.replace(".", "\\.")),
        );
        await decoded(dialog.locator(".dialog-gallery > img"));
        await dialog
          .getByRole("button", { name: "Ver en dispositivo" })
          .click();
        if (index < project.captures!.length - 1)
          await dialog
            .getByRole("button", { name: "Siguiente imagen" })
            .click();
      }
      await page.keyboard.press("Escape");
    }
  }
  // A real cross-tab preference change must update an already open capture too.
  await page.locator(".project-agentos").click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Ver captura completa" }).click();
  await dialog.getByRole("button", { name: "Siguiente imagen" }).click();
  await preferences
    .getByRole("button", { name: "Cambiar a tema claro" })
    .click();
  await expect(dialog.getByRole("img")).toHaveAttribute(
    "src",
    /agentos-02-light\.webp/,
  );
  await decoded(dialog.getByRole("img"));
  await preferences.close();
});
