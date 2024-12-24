import { Locator, Page } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = this.page.locator('span[data-ui-id="page-title-wrapper"]');
  }
}
