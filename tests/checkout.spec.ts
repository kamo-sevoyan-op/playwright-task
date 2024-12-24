import { test, expect, Page } from '@playwright/test';
import { SignInPage } from './page/sign-in';
import { PaymentPage, ShippingPage } from './page/checkout';
import addProductToCart from './utils';
import { OrderHistoryPage } from './page/orders';

const {
  EMAIL,
  PASSWORD,
  FIRST_NAME,
  LAST_NAME,
  STREET_ADDRESS,
  CITY,
  COUNTRY,
  ZIP_CODE,
  PHONE_NUMBER,
} = process.env;

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

  expect(page).toHaveURL('/checkout/#shipping');
  expect(page).toHaveTitle('Checkout');

  const shippingSection = page.locator('#shipping');
  await expect(shippingSection).toBeVisible();
}

test.describe('Checkout tests', () => {
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

  test('Order is visible in orders history page', async ({ page }) => {
    const buttonSignIn = page.getByRole('link', { name: 'Sign In' });
    await buttonSignIn.click();
    const signInPage = new SignInPage(page);
    await signInPage.login(EMAIL ?? '', PASSWORD ?? '');

    await page.goto('/');
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

    await expect(page).toHaveURL('/checkout/onepage/success/');

    const message = page.locator('.base');
    await expect(message).toHaveText('Thank you for your purchase!');

    const orderInfo = page.locator('.checkout-success p').first();
    await expect(orderInfo).toHaveText(/Your order number is/);

    const orderNumber = page.locator('.order-number');
    expect(orderNumber).toBeTruthy();

    const orderNumberValue = await orderNumber.textContent();
    expect(orderNumberValue).toMatch(/\d+/);

    await page.goto('sales/order/history/');

    const orderHistoryPage = new OrderHistoryPage(page);
    const history = orderHistoryPage.history;

    await expect(history).toBeVisible();

    const items = orderHistoryPage.items;
    const count = await items.count();
    expect(count).toBeGreaterThanOrEqual(1);

    const { number, total } = orderHistoryPage.getLastItemInfo();
    await expect(number).toHaveText(orderNumberValue as string);
    await expect(total).toHaveText(price as string);
  });
});
