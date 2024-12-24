import { test, expect, Page } from '@playwright/test';
import addProductToCart from './utils';
import {HomePage} from './page/homepage'

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('Cart tests', () => {
  test('User can add a product to Cart', async ({ page }) => {
    await addProductToCart(page);
    
    const homePage = new HomePage(page);
    expect(homePage.counter).toBeVisible();
    await expect(homePage.counterNumber).toHaveText('1');
  });

  test('Should show the item added to the cart', async ({ page }) => {
    await addProductToCart(page);

    const productName = await page.locator('.page-title .base').textContent();
    await page.goto('/checkout/cart/');

    const table = page.locator('#shopping-cart-table');
    await table.waitFor({ state: 'visible' });
    expect(table).toBeVisible();

    const content = table.locator('.cart.item');
    expect(content).toHaveCount(1);

    const addedItem = content.first();
    const name = addedItem.locator('.product-item-name > a');
    expect(name).toHaveText(productName as string);
  });

  test('User can empty the cart', async ({ page }) => {
    await addProductToCart(page);

    await page.goto('/checkout/cart/');

    const table = page.locator('#shopping-cart-table');

    const content = table.locator('.cart.item');
    const addedItem = content.first();

    const removeButton = addedItem.getByTitle('Remove item');
    await removeButton.click();

    await page.waitForLoadState('load');
    const message = page.locator('.cart-empty > p').first();

    await expect(message).toBeVisible();
    await expect(message).toHaveText(
      'You have no items in your shopping cart.'
    );
  });
});
