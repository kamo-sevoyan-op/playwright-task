import { test, expect } from "@playwright/test";
import { HomePage } from "./page/homepage";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("User is able to navigate to homepage and view products without authentication", () => {
  const sections = [
    { name: "Women", cls: ".nav-2" },
    { name: "Men", cls: ".nav-3" },
    { name: "Gear", cls: ".nav-4" },
  ];

  sections.forEach(({ name, cls }) => {
    test(`Section: '${name}'`, async ({ page }) => {
      await expect(page).toHaveTitle("Home Page");
      const homePage = new HomePage(page);
      await homePage.goto(cls, name);
      await expect(homePage.content).toBeVisible();
    });
  });
});
