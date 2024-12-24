import { test, expect, Page, Locator } from '@playwright/test';
import { ProductPage } from './page/productPage';
import { toSnakeCase } from './utils';
import { HomePage } from './page/homepage';

const NUM_PRODUCTS = 4;

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

async function testProduct(
  page: Page,
  index: number,
  linkType: 'image' | 'anchor'
) {
  const homePage = new HomePage(page);
  const { productLink, productName, productImage } =
    await homePage.getProductByIndex(index);

  // Assertion for the product image and name to be visible
  expect(productName).toBeTruthy();
  await expect(productLink).toBeVisible();
  await expect(productImage).toBeVisible();

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

  // Check page title and url
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
