import { test, expect } from '@playwright/test';
import { addProductToCart } from './utils';
import { HomePage } from './page/homepage';
import { ProductPage } from './page/productPage';
import { CartPage } from './page/cart';

const CART_URL = '/checkout/cart/';

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

    const productPage = new ProductPage(page);
    const productName = await productPage.title.textContent();

    await page.goto(CART_URL);

    const cartPage = new CartPage(page);
    const table = cartPage.productsTable;
    await expect(table).toBeVisible();

    const content = cartPage.tableContent;
    expect(content).toHaveCount(1);

    const addedItem = content.first();
    const name = addedItem.locator('.product-item-name');
    expect(name).toHaveText(productName as string);
  });

  test('User can empty the cart', async ({ page }) => {
    await addProductToCart(page);

    await page.goto(CART_URL);

    const cartPage = new CartPage(page);
    const removeButton = cartPage.getRemoveButton();
    await removeButton.click();
    await page.waitForLoadState('load');

    const message = page.locator('.cart-empty p').first();

    await expect(message).toBeVisible();
    await expect(message).toHaveText(
      'You have no items in your shopping cart.'
    );
  });
});
