import { Locator, Page } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  content: Locator;
  readonly searchField: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchField = this.page.getByPlaceholder(
      "Search entire store here..."
    );
    this.searchButton = this.page.getByTitle("Search");
  }

  async goto(cls: string, name: string) {
    const button = this.page.locator(cls, { hasText: name });
    await button.click();
    this.content = this.page.locator(".column.main");
  }

  async search(term: string) {
    await this.searchField.fill(term);
    await this.searchButton.click();
  };
}
