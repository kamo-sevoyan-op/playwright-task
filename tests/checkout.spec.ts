import { test, expect, Page } from "@playwright/test";
import { SignInPage } from "./page/sign-in";
import addProductToCart from './utils'

const email = "serzhtankian@gmail.us";
const password = "SystemOfaDown1994";
const firstName = "Serzh";
const lastName = "Tankian";
const streetAddress = "12";
const city = "Yerevan";
const zipCode = "1234";
const phoneNumber = "1234567890";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

async function testCheckout(page: Page) {
  await addProductToCart(page);
  await page.goto("/checkout/cart/");
  await page.waitForLoadState("load");

  const checkoutButton = page.locator(".cart-summary .action.checkout", {
    hasText: "Proceed to Checkout",
  });
  expect(checkoutButton).toBeVisible();

  await checkoutButton.click();
  await page.waitForLoadState("load");
  await page.waitForURL("/checkout/#shipping");

  expect(page).toHaveURL("/checkout/#shipping");
  expect(page).toHaveTitle("Checkout");

  const shippingSection = page.locator("#shipping");
  await expect(shippingSection).toBeVisible();
}

async function fillForm(page: Page) {
  const emailInput = page.locator("#customer-email-fieldset #customer-email");
  const firstNameInput = page.getByLabel(/First Name/);
  const lastNameInput = page.getByLabel(/Last Name/);
  const streetAddressInput = page.getByLabel(/Street Address/).nth(0);
  const cityInput = page.getByLabel("City");
  const zipCodeInput = page.getByLabel(/Zip\/Postal Code/);
  const countryInput = page.getByLabel(/Country/);
  const phoneNumberInput = page.getByLabel(/Phone Number/);
  const shippingMethod = page.locator(
    'input[type="radio"][value="flatrate_flatrate"]'
  );
  const nextButton = page.getByText("Next");

  await emailInput.fill(email);
  await firstNameInput.fill(firstName);
  await lastNameInput.fill(lastName);
  await streetAddressInput.fill(streetAddress);
  await cityInput.fill(city);
  await zipCodeInput.fill(zipCode);
  await countryInput.selectOption("Armenia");
  await phoneNumberInput.fill(phoneNumber);
  await shippingMethod.check();
  await nextButton.click();
}

test.describe("Checkout tests", () => {
  test("Should allow user to proceed to checkout", async ({ page }) => {
    await testCheckout(page);
  });

  test("Should allow user to checkout and place order", async ({ page }) => {
    await testCheckout(page);
    await fillForm(page);
  });

  test("Order is visible in orders history page", async ({ page }) => {
    const buttonSignIn = page.getByRole("link", { name: "Sign In" });
    await buttonSignIn.click();
    const signInPage = new SignInPage(page);
    await signInPage.login(email, password);

    await page.goto("/");
    await testCheckout(page);

    const nextButton = page.getByText("Next");
    await expect(nextButton).toBeVisible();
    await nextButton.click();

    const price = await page.locator(".grand.totals span").textContent();
    expect(price).toBeTruthy();

    const button = page.getByText("Place Order");
    await expect(button).toBeVisible();
    await button.click();

    expect(page).toHaveURL("/checkout/onepage/success/");

    const message = page.locator(".base");
    await expect(message).toHaveText("Thank you for your purchase!");

    const orderInfo = page.locator(".checkout-success > p").first();
    await expect(orderInfo).toHaveText(/Your order number is/);

    const orderNumber = page.locator(".order-number");
    expect(orderNumber).toBeTruthy();

    const orderNumberValue = await orderNumber.textContent();
    expect(orderNumberValue).toMatch(/\d+/);

    await page.goto("sales/order/history/");

    const orderHistory = page.locator(".orders-history");

    await expect(orderHistory).toBeVisible();

    const items = orderHistory.locator("tbody > tr");
    const count = await items.count();
    expect(count).toBeGreaterThanOrEqual(1);

    const item = items.first();

    const historyOrderNumber = item.locator("td.col.id");
    const historyOrderTotal = item.locator("td.col.total");

    await expect(historyOrderNumber).toHaveText(orderNumberValue as string);
    await expect(historyOrderTotal).toHaveText(price as string);
  });
});
