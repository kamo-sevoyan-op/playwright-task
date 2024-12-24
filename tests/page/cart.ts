import { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly productsTable: Locator;
  readonly tableContent: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productsTable = this.page.locator('#shopping-cart-table');
    this.tableContent = this.productsTable.locator('.item-info');
  }

  getRemoveButton() {
    return this.productsTable.getByTitle('Remove item');
  }
}
