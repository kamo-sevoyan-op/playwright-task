import { Locator, Page } from "@playwright/test";

export class SignInPage {
  readonly page: Page;
  private emailField: Locator;
  private passwordField: Locator;
  private signInButton: Locator;
  greetingMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailField = this.page.getByLabel("Email");
    this.passwordField = this.page.getByLabel("Password");
    this.signInButton = this.page.getByRole("button", { name: "Sign In" });
  }

  async login(email: string, password: string) {
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
    await this.signInButton.click();

    this.greetingMessage = this.page.locator(
      ".panel.header .greet.welcome .logged-in"
    );
  }
}
