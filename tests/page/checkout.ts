import { Locator, Page } from '@playwright/test';

export class ShippingPage {
  readonly page: Page;
  readonly productsTable: Locator;
  readonly tableContent: Locator;
  readonly emailInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly streetAddressInput: Locator;
  readonly cityInput: Locator;
  readonly zipCodeInput: Locator;
  readonly countryInput: Locator;
  readonly phoneNumberInput: Locator;
  readonly shippingMethod: Locator;
  readonly nextButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productsTable = this.page.locator('#shopping-cart-table');
    this.tableContent = this.productsTable.locator('.item-info');

    this.emailInput = this.page.locator(
      '#customer-email-fieldset #customer-email'
    );
    this.firstNameInput = this.page.getByLabel(/First Name/);
    this.lastNameInput = this.page.getByLabel(/Last Name/);
    this.streetAddressInput = this.page.getByLabel(/Street Address/).nth(0);
    this.cityInput = this.page.getByLabel('City');
    this.zipCodeInput = this.page.getByLabel(/Zip\/Postal Code/);
    this.countryInput = this.page.getByLabel(/Country/);
    this.phoneNumberInput = this.page.getByLabel(/Phone Number/);
    this.shippingMethod = this.page.locator(
      'input[type="radio"][value="flatrate_flatrate"]'
    );
    this.nextButton = page.getByText('Next');
  }

  async fillFields(
    email: string,
    firstName: string,
    lastName: string,
    streetAddress: string,
    city: string,
    country: string,
    zipCode: string,
    phoneNumber: string
  ) {
    await this.emailInput.fill(email);
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.streetAddressInput.fill(streetAddress);
    await this.cityInput.fill(city);
    await this.zipCodeInput.fill(zipCode);
    await this.countryInput.selectOption(country);
    await this.phoneNumberInput.fill(phoneNumber);
    await this.shippingMethod.check();
    await this.nextButton.click();
  }
}

export class PaymentPage {
  readonly page: Page;
  readonly placeOrderButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.placeOrderButton = this.page.getByText('Place Order');
  }
}
