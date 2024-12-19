import { test, expect, Page } from "@playwright/test";

const BASE_URL = "https://magento.softwaretestingboard.com";

test.beforeEach(async ({ page }) => {
  await page.goto(BASE_URL);
});

const doSearch = async (page: Page, term: string) => {
  const searchField = page.getByPlaceholder("Search entire store here...");
  const searchButton = page.getByTitle("Search");
  await searchField.fill(term);
  await searchButton.click();
};

test.describe("Search functionality", () => {
  const searchKeywords = ["t-shirt", "pants", "women"];

  test.describe("Search results navigation", () => {
    searchKeywords.forEach((term) => {
      test(`Should navigate to results page for term: ${term}`, async ({
        page,
      }) => {
        await doSearch(page, term);

        await expect(page).toHaveURL(
          `${BASE_URL}/catalogsearch/result/?q=${term}`
        );
      });
    });
  });

  test("Search results page should contain the search term", async ({
    page,
  }) => {
    const searchTerm = "hat";
    await doSearch(page, searchTerm);

    const pageTitle = page.locator(".base");
    await expect(pageTitle).toHaveText(`Search results for: '${searchTerm}'`);
  });
});
