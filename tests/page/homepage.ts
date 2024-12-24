import { Locator, Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  content: Locator;
  readonly searchField: Locator;
  readonly searchButton: Locator;
  readonly counter: Locator;
  readonly counterNumber: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchField = this.page.getByPlaceholder(
      'Search entire store here...'
    );
    this.searchButton = this.page.getByTitle('Search');
    this.counter = this.page.locator('.showcart .counter.qty');
    this.counterNumber = this.page.locator('.counter-number');
  }

  async goto(cls: string, name: string) {
    const button = this.page.locator(cls, { hasText: name });
    await button.click();
    this.content = this.page.locator('.column.main');
  }

  async search(term: string) {
    await this.searchField.fill(term);
    await this.searchButton.click();
  }

  async getProductByIndex(index: number) {
    const productContainer = this.page.locator('.widget-product-grid');
    const product = productContainer.locator('li').nth(index);

    const productLink = product.locator('.product-item-link');
    const productName = await productLink.textContent();
    const productImage = product.locator('.product-image-photo');

    return { productLink, productName, productImage };
  }
}
