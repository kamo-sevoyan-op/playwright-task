import { test, expect, Page, Locator } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

function toSnakeCase(productName: string) {
  let parts = productName.trim().split(" ");
  parts = parts.map((part) => part.toLowerCase());
  const result = parts.join("-");
  return result;
}

function getProductByIndex(page: Page, index: number) {
  const productContainer = page.locator(".widget-product-grid");
  const product = productContainer.locator("li").nth(index);
  return product;
}

async function testProduct(
  page: Page,
  index: number,
  linkType: "image" | "anchor"
) {
  const product = getProductByIndex(page, index);
  const productLink = product.locator(".product-item-link");
  const productName = await productLink.textContent();
  const productImage = product.locator(".product-image-photo");

  expect(productName).toBeTruthy();

  let link: Locator | null = null;
  if (linkType === "image") {
    link = productImage;
  } else {
    link = productLink;
  }

  await link.click();
  await page.waitForLoadState("load");

  const pageTitle = page.locator(".page-title .base");
  await expect(pageTitle).toHaveText(productName as string);
  const path = toSnakeCase(productName as string);
  await expect(page).toHaveURL(`/${path}.html`);
  await expect(page).toHaveTitle(productName as string);
}

test.describe("Product page tests", () => {
  for (let index = 0; index < 4; index++) {
    test(`Should allow user to navigate to product page by product name, case ${index}`, async ({
      page,
    }) => {
      await testProduct(page, index, "anchor");
    });
  }

  for (let index = 0; index < 4; index++) {
    test(`Should allow user to navigate to product page by product image, case ${index}`, async ({
      page,
    }) => {
      await testProduct(page, index, "image");
    });
  }
});
