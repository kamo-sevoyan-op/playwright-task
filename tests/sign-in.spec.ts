import { test, expect } from "@playwright/test";

const email = "serzhtankian@gmail.us";
const password = "SystemOfaDown1994";
const firstName = "Serzh";
const lastName = "Tankian";

test.beforeEach(async ({ page }) => {
  await page.goto("https://magento.softwaretestingboard.com");
});

test.describe("User is able to sign in successfully.", () => {
  test("From homepage", async ({ page }) => {
    const button = page.getByRole("link", { name: "Sign In" });
    await button.click();

    const emailField = page.getByLabel("Email");
    const passwordField = page.getByLabel("Password");
    const signInButton = page.getByRole("button", { name: "Sign In" });

    await emailField.fill(email);
    await passwordField.fill(password);
    await signInButton.click();

    const message = page.locator(".panel.header .greet.welcome .logged-in");

    await expect(message).toHaveText(`Welcome, ${firstName} ${lastName}!`);
  });
});
