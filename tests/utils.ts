import { expect, Page } from "@playwright/test";

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

export default addProductToCart;
