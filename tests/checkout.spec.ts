import { expect, Page, test } from '@playwright/test';
import { PaymentPage, ShippingPage } from './page/checkout';
import { OrderHistoryPage } from './page/orders';
import { addProductToCart } from './utils';
const fs = require('fs');

const {
  EMAIL,
  FIRST_NAME,
  LAST_NAME,
  STREET_ADDRESS,
  CITY,
  COUNTRY,
  ZIP_CODE,
  PHONE_NUMBER,
} = process.env;

const ORDER_HISTORY_URL = 'sales/order/history/';
const PAYMENT_SUCCESS_URL = '/checkout/onepage/success/';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

async function testCheckout(page: Page) {
  await addProductToCart(page);
  await page.goto('/checkout/cart/');

  const checkoutButton = page.getByTitle('Proceed to Checkout').last();
  await expect(checkoutButton).toBeVisible();

  await checkoutButton.click();
  await page.waitForURL('/checkout/#shipping');

  expect(page).toHaveTitle('Checkout');

  const shippingSection = page.locator('#shipping');
  await expect(shippingSection).toBeVisible();
}

test.describe('Checkout tests without auth', () => {
  test('Should allow user to proceed to checkout', async ({ page }) => {
    await testCheckout(page);
  });

  test('Should allow user to checkout and place order', async ({ page }) => {
    await testCheckout(page);

    const shippingPage = new ShippingPage(page);
    await shippingPage.fillFields(
      EMAIL ?? '',
      FIRST_NAME ?? '',
      LAST_NAME ?? '',
      STREET_ADDRESS ?? '',
      CITY ?? '',
      COUNTRY ?? '',
      ZIP_CODE ?? '',
      PHONE_NUMBER ?? ''
    );
  });

  test.describe('Checkout tests with auth', () => {
    // Use logged in state for tests in this group
    if (fs.existsSync(STORAGE_STATE_PATH)) {
      test.use({ storageState: './auth.json' });
    } else {
      console.warn(
        `The provided storage state file ${STORAGE_STATE_PATH} does not exist.`
      );
      test.skip();
    }
    test('Order is visible in orders history page', async ({ page }) => {
      await testCheckout(page);

      const shippingPage = new ShippingPage(page);
      const nextButton = shippingPage.nextButton;
      await nextButton.click();

      const price = await page.locator('[data-th="Order Total"]').textContent();
      expect(price).toBeTruthy();

      const paymentPage = new PaymentPage(page);
      const button = paymentPage.placeOrderButton;
      await expect(button).toBeVisible();
      await button.click();

      await expect(page).toHaveURL(PAYMENT_SUCCESS_URL);

      const message = page.locator('.base');
      await expect(message).toHaveText('Thank you for your purchase!');

      const orderInfo = page.locator('.checkout-success p').first();
      await expect(orderInfo).toHaveText(/Your order number is/);

      // Check for order number to be non empty
      const orderNumber = page.locator('.order-number');
      expect(orderNumber).toBeTruthy();
      
      // Check for order number value to contain only numbers
      const orderNumberValue = await orderNumber.textContent();
      expect(orderNumberValue).toMatch(/\d+/);

      await page.goto(ORDER_HISTORY_URL);

      const orderHistoryPage = new OrderHistoryPage(page);
      const history = orderHistoryPage.history;

      await expect(history).toBeVisible();

      const items = orderHistoryPage.items;
      const count = await items.count();
      expect(count).toBeGreaterThanOrEqual(1);
      
      // Assert for order number and total price to be the same as in the previous page
      const { number, total } = orderHistoryPage.getLastItemInfo();
      await expect(number).toHaveText(orderNumberValue as string);
      await expect(total).toHaveText(price as string);
    });
  });
});
