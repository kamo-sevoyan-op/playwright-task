import { test, expect } from "@playwright/test";
import { HomePage } from "./page/homepage";

const SEARCH_KEYWORDS = ["t-shirt", "pants", "women"];

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("Search functionality", () => {
  SEARCH_KEYWORDS.forEach((term) => {
    test(`Should navigate to results page for term: ${term}`, async ({
      page,
    }) => {
      const homePage = new HomePage(page);
      homePage.search(term);
      await expect(page).toHaveURL(`/catalogsearch/result/?q=${term}`);
    });
  });

  test("Should contain the search term", async ({ page }) => {
    const searchTerm = "backpack";
    const homePage = new HomePage(page);
    homePage.search(searchTerm);

    const pageTitle = page.locator(".base");

    const text = `Search results for: '${searchTerm}'`;
    await expect(pageTitle).toHaveText(text);
    await expect(page).toHaveTitle(text);
  });
});
