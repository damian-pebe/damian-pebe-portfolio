import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("Spanish and English stay coherent through navigation and reload", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "damian pérez",
  );
  await page.getByRole("link", { name: /Switch to English/ }).click();
  await expect(page).toHaveURL(/\/en\//);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "damian pérez",
  );
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator(".hero-description")).toContainText(
    "Good ideas deserve exceptional software.",
  );
  await page.reload();
  await expect(
    page.getByRole("link", { name: "View portfolio", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "View portfolio", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/portfolio\/$/);
  await expect(
    page.getByRole("button", { name: /Explore project: AgentOS/ }),
  ).toBeVisible();
  await page.getByRole("link", { name: /Cambiar a español/ }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(
    page.getByRole("button", {
      name: "Explorar proyecto: AgentOS",
      exact: false,
    }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("catalog filters expose real projects and every cover decodes", async ({
  page,
}) => {
  await page.goto("/portfolio/");
  await expect(page.locator(".project-card")).toHaveCount(8);
  await page
    .getByRole("button", { name: "Explorar los 23 proyectos", exact: true })
    .click();
  await expect(page.locator(".project-card")).toHaveCount(23);
  for (const image of await page.locator(".project-card img").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        image.evaluate(
          (element: HTMLImageElement) =>
            element.complete && element.naturalWidth > 0,
        ),
      )
      .toBe(true);
  }
  await page
    .getByRole("button", { name: "Inteligencia artificial", exact: true })
    .click();
  await expect(page.locator(".project-card")).toHaveCount(3);
  await expect(
    page.getByRole("button", {
      name: "Explorar proyecto: AgentOS",
      exact: false,
    }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("animated language changes preserve the selected product and browser history", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/portfolio/");
  await page
    .getByRole("group", { name: "Elegir proyecto destacado" })
    .getByRole("button", { name: /Neurocity/ })
    .click();
  await page
    .getByRole("button", { name: "Explorar los 23 proyectos", exact: true })
    .click();
  await page.getByRole("link", { name: /Switch to English/ }).click();
  await expect(page).toHaveURL(/\/en\//);
  await expect(page.locator(".showcase h3")).toHaveText("Neurocity");
  await expect(page.locator(".project-card")).toHaveCount(23);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://damianperez.dev/en/portfolio/",
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    "Damian Pérez — Selected work",
  );
  await page.goBack();
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.locator(".showcase h3")).toHaveText("Neurocity");
  await expect(page.locator(".project-card")).toHaveCount(23);
  await page.goForward();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.evaluate(() => scrollTo(0, 0));
  await expect(page.locator("html")).not.toHaveAttribute(
    "data-language-transition",
    "running",
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "From code to the real world.",
  );
  expect(errors).toEqual([]);
});
test("project dialog contains focus, switches captures and restores the trigger", async ({
  page,
}) => {
  await page.goto("/portfolio/");
  const trigger = page.getByRole("button", {
    name: "Explorar proyecto: AgentOS",
    exact: false,
  });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("heading", { name: "AgentOS", exact: true }),
  ).toBeVisible();
  await expect(dialog.getByRole("img")).toHaveAttribute(
    "src",
    /agentos-01.webp/,
  );
  await dialog.getByRole("button", { name: "Siguiente imagen" }).click();
  await expect(dialog.getByRole("img")).toHaveAttribute(
    "src",
    /agentos-02.webp/,
  );
  await page.keyboard.press("ArrowLeft");
  await expect(dialog.getByRole("img")).toHaveAttribute(
    "src",
    /agentos-01.webp/,
  );
  for (let i = 0; i < 7; i++) await page.keyboard.press("Tab");
  expect(
    await dialog.evaluate((element) =>
      element.contains(document.activeElement),
    ),
  ).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe(
    "hidden",
  );
});
test("contact copy has working success and failure feedback", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await page
    .getByRole("button", { name: "Copiar correo", exact: true })
    .click();
  await expect(page.getByRole("status")).toHaveText("Correo copiado");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "damian.pebe@gmail.com",
  );
  await page.reload();
  await page.evaluate(() => {
    Object.defineProperty(navigator.clipboard, "writeText", {
      value: () => Promise.reject(new Error("denied")),
    });
  });
  await page
    .getByRole("button", { name: "Copiar correo", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("No se pudo copiar");
  await expect(
    page.getByRole("link", { name: /damian.pebe@gmail.com/ }),
  ).toHaveAttribute("href", "mailto:damian.pebe@gmail.com");
});
test("shared background respects live motion preferences and tab visibility", async ({
  page,
}) => {
  await page.setViewportSize({
    width: page.viewportSize()?.width ?? 1440,
    height: 480,
  });
  await page.goto("/");
  const canvas = page.locator('[data-effect="shader-metal"]');
  await expect(canvas).toHaveAttribute("data-running", "false");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(canvas).toHaveAttribute("data-running", "true");
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(canvas).toHaveAttribute("data-running", "false");
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: false,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(canvas).toHaveAttribute("data-running", "true");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(canvas).toHaveAttribute("data-running", "false");
});
test("page and project dialog have no automated WCAG AA violations", async ({
  page,
}) => {
  await page.goto("/");
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.goto("/portfolio/");
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page
    .getByRole("button", { name: "Explorar proyecto: AgentOS", exact: false })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});
test("small screens have no horizontal overflow in either language", async ({
  page,
}) => {
  for (const width of [320, 375, 768]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/", "/en/", "/portfolio/", "/en/portfolio/"]) {
      await page.goto(path);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await expect(page.getByRole("heading", { level: 1 })).toBeInViewport();
    }
  }
});

test("featured products respond to controls and open the matching project", async ({
  page,
}) => {
  await page.goto("/portfolio/");
  const showcase = page.getByRole("region", { name: "En primer plano" });
  await expect(showcase.getByRole("heading", { level: 3 })).toHaveText(
    "OmniCube",
  );
  await page
    .getByRole("button", { name: "Siguiente proyecto destacado" })
    .click();
  await expect(showcase.getByRole("heading", { level: 3 })).toHaveText(
    "AgentOS",
  );
  await page
    .getByRole("button", { name: "Proyecto destacado anterior" })
    .click();
  await expect(showcase.getByRole("heading", { level: 3 })).toHaveText(
    "OmniCube",
  );
  await page
    .getByRole("group", { name: "Elegir proyecto destacado" })
    .getByRole("button", { name: /Neurocity/ })
    .click();
  await expect(showcase.getByRole("heading", { level: 3 })).toHaveText(
    "Neurocity",
  );
  await showcase.getByRole("button", { name: "Ver proyecto" }).click();
  const dialog = page.getByRole("dialog");
  await expect(
    dialog.getByRole("heading", { name: "Neurocity", exact: true }),
  ).toBeVisible();
  await expect(dialog.locator('[data-mockup="city-command"]')).toBeVisible();
  await dialog.getByRole("button", { name: "Ver captura completa" }).click();
  await expect(dialog.locator(".dialog-gallery > img")).toHaveAttribute(
    "src",
    /neurocity-01.webp/,
  );
  await dialog.getByRole("button", { name: "Siguiente imagen" }).click();
  await expect(dialog.locator(".dialog-gallery > img")).toHaveAttribute(
    "src",
    /neurocity-02.webp/,
  );
  await page.keyboard.press("Escape");
  await expect(
    showcase.getByRole("button", { name: "Ver proyecto" }),
  ).toBeFocused();
});

test("monochrome themes persist across language navigation and reload", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "Cambiar a tema oscuro" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("link", { name: /Switch to English/ }).click();
  await expect(page).toHaveURL(/\/en\//);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(
    page.getByRole("button", { name: "Switch to light theme" }),
  ).toBeVisible();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});
