import { test, expect } from "@playwright/test";
import { SignInPage } from "./page/sign-in";

const email = process.env.EMAIL ?? "";
const password = process.env.PASSWORD ?? "";
const firstName = process.env.FIRST_NAME ?? "";
const lastName = process.env.LAST_NAME ?? "";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  const button = page.getByRole("link", { name: "Sign In" });
  await button.click();
});

test.describe(() => {
  test("Should allow user to sign in successfully with valid credentials.", async ({ page }) => {
    expect(page).toHaveTitle("Customer Login");
    const signInPage = new SignInPage(page);
    await signInPage.login(email, password);

    await expect(signInPage.greetingMessage).toHaveText(
      `Welcome, ${firstName} ${lastName}!`
    );
  });
});
