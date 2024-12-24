import { test, expect } from '@playwright/test';
import { HomePage } from './page/homepage';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('User is able to navigate to homepage and view products without authentication', () => {
  const sections = [{ name: 'Women' }, { name: 'Men' }, { name: 'Gear' }];

  sections.forEach(({ name }) => {
    test(`Section: '${name}'`, async ({ page }) => {
      await expect(page).toHaveTitle('Home Page');
      const homePage = new HomePage(page);
      await homePage.goto(name);
      await expect(homePage.content).toBeVisible();
    });
  });
});
