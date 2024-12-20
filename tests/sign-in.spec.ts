import { test, expect } from "@playwright/test";
import { SignInPage } from "./page/sign-in";

const email = "serzhtankian@gmail.us";
const password = "SystemOfaDown1994";
const firstName = "Serzh";
const lastName = "Tankian";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  const button = page.getByRole("link", { name: "Sign In" });
  await button.click();
});

test.describe("User is able to sign in successfully", () => {
  test("From homepage", async ({ page }) => {
    const signInPage = new SignInPage(page);
    await signInPage.login(email, password);
    
    await expect(signInPage.greetingMessage).toHaveText(
      `Welcome, ${firstName} ${lastName}!`
    );
  });
});
