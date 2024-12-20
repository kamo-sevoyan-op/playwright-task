import { Locator, Page } from "@playwright/test";

export class HomePage {

    readonly page: Page;
    public content: Locator;

    constructor(page: Page) {
        this.page = page;
    }

    async goto(cls: string, name: string) {
      const button = this.page.locator(cls, {hasText: name});
      await button.click();
      this.content = this.page.locator(".column.main");
    }

}