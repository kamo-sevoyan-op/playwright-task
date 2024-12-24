import { test, expect, Page, Locator } from '@playwright/test';
import { ProductPage } from './page/productPage';
import { toSnakeCase } from './utils';

const NUM_PRODUCTS = 4;

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

function getProductByIndex(page: Page, index: number) {
  const productContainer = page.locator('.widget-product-grid');
  const product = productContainer.locator('li').nth(index);
  return product;
}

async function testProduct(
  page: Page,
  index: number,
  linkType: 'image' | 'anchor'
) {
  const product = getProductByIndex(page, index);
  const productLink = product.locator('.product-item-link');
  const productName = await productLink.textContent();
  const productImage = product.locator('.product-image-photo');

  expect(productName).toBeTruthy();

  let link: Locator | null = null;
  if (linkType === 'image') {
    link = productImage;
  } else {
    link = productLink;
  }

  await link.click();
  await page.waitForLoadState('load');

  const productPage = new ProductPage(page);
  
  await expect(productPage.title).toHaveText(productName as string);
  const path = toSnakeCase(productName as string);
  await expect(page).toHaveURL(`/${path}.html`);
  await expect(page).toHaveTitle(productName as string);
}

test.describe('Product page tests', () => {
  for (let index = 0; index < NUM_PRODUCTS; index++) {
    test(`Should allow user to navigate to product page by product name, case ${index}`, async ({
      page,
    }) => {
      await testProduct(page, index, 'anchor');
    });
  }

  for (let index = 0; index < NUM_PRODUCTS; index++) {
    test(`Should allow user to navigate to product page by product image, case ${index}`, async ({
      page,
    }) => {
      await testProduct(page, index, 'image');
    });
  }
});
