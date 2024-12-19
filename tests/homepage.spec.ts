import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://magento.softwaretestingboard.com");
});

test.describe("User is able to navigate to homepage and view products without authentication.", () => {
  const sections = [
    { name: "Women", cls: ".nav-2" },
    { name: "Men", cls: ".nav-3" },
    { name: "Gear", cls: ".nav-4" },
  ];

  sections.forEach(({ name, cls }) => {
    test(`Section: '${name}'`, async ({ page }) => {
      const button = page.locator(cls).getByText(name);
      await button.click();
      const main = page.locator(".column.main");
      await expect(main).toBeVisible();
    });
  });
});
