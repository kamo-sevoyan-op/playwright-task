import { test, expect, Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

async function addProductToCart(page: Page) {
  const productContainer = page.locator(".widget-product-grid");
  const product = productContainer.locator("li").first();
  const productLink = product.locator(".product-item-link");

  await productLink.click();

  const options = page.getByRole("listbox");
  const sizeOption = options.first().getByRole("option").first();
  const colorOption = options.last().getByRole("option").first();

  await sizeOption.click();
  await colorOption.click();

  const button = page.getByTitle("Add to Cart");
  await button.click();

  const successMessage = page.locator(".message-success");
  await expect(successMessage).toBeVisible();
}

test.describe("Cart tests", () => {
  test("User can add a product to Cart", async ({ page }) => {
    await addProductToCart(page);

    const counter = page.locator(".action.showcart .counter.qty");
    expect(counter).toBeVisible();

    const miniCart = page.locator(".counter-number");
    await expect(miniCart).toHaveText("1");
  });

  test("Should show the item added to the cart", async ({ page }) => {
    await addProductToCart(page);

    const productName = await page.locator(".page-title .base").textContent();
    await page.goto("/checkout/cart/");

    const table = page.locator("#shopping-cart-table");
    await table.waitFor({ state: "visible" });
    expect(table).toBeVisible();

    const content = table.locator(".cart.item");
    expect(content).toHaveCount(1);

    const addedItem = content.first();
    const name = addedItem.locator(".product-item-name > a");
    expect(name).toHaveText(productName as string);
  });

  test("User can empty the cart", async ({ page }) => {
    await addProductToCart(page);

    await page.goto("/checkout/cart/");

    const table = page.locator("#shopping-cart-table");

    const content = table.locator(".cart.item");
    const addedItem = content.first();

    const removeButton = addedItem.getByTitle("Remove item");
    await removeButton.click();

    await page.waitForLoadState("load");
    const message = page.locator(".cart-empty > p").first();

    await expect(message).toBeVisible();
    await expect(message).toHaveText(
      "You have no items in your shopping cart."
    );
  });
});
