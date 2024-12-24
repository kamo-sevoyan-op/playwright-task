import { test, expect } from '@playwright/test';
import { SignInPage } from './page/sign-in';

const { EMAIL, PASSWORD, FIRST_NAME, LAST_NAME } = process.env;

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  const button = page.getByRole('link', { name: 'Sign In' });
  await button.click();
});

test.describe(() => {
  test('Should allow user to sign in successfully with valid credentials.', async ({
    page,
  }) => {
    expect(page).toHaveTitle('Customer Login');
    const signInPage = new SignInPage(page);
    await signInPage.login(EMAIL ?? '', PASSWORD ?? '');

    await expect(signInPage.greetingMessage).toHaveText(
      `Welcome, ${FIRST_NAME} ${LAST_NAME}!`
    );

    // Save logged in state for further tests.
    await page.context().storageState({ path: './auth.json' });
  });
});
