import { Locator, Page } from '@playwright/test';

export class OrderHistoryPage {
  readonly page: Page;
  readonly history: Locator;
  readonly items: Locator;

  constructor(page: Page) {
    this.page = page;
    this.history = this.page.locator('.orders-history');
    this.items = this.page.locator('tbody > tr');
  }

  getLastItemInfo() {
    const item = this.items.first();
    const number = item.locator('.id');
    const total = item.locator('.total');

    return { number, total };
  }
}
