import { Given, When, Then } from "@cucumber/cucumber";
import {
  endpoint,
  mock_email_guest,
  mock_password_guest,
  mock_username_guest,
  password_guest,
  username_guest,
} from "../support/mock.js";
import { expect } from "playwright/test";

Given("I am on the sign in page", { timeout: 30 * 1000 }, async function () {
  await this.page.goto(`${endpoint}/signIn`);
});

Given("I am on the sign up page", { timeout: 30 * 1000 }, async function () {
  await this.page.goto(`${endpoint}/signUp`);
});

/* =======================
   SIGN IN
======================= */

When("I fill in the sign in form with valid credentials",  async function () {
  await this.page.getByTestId("username").fill(username_guest);
  await this.page.getByTestId("password").fill(password_guest);
});

When("I click the sign in button", async function () {
  await this.page.getByTestId("sign-in-button").click();
});

Then("I am successfully signed in", async function () {
  await expect(this.page).toHaveURL(/\/home$/);
});

/* =======================
   SIGN UP
======================= */

When("I fill in the sign up form with valid data", async function () {
  await this.page.getByTestId("email").fill(mock_email_guest);
  await this.page.getByTestId("username").fill(mock_username_guest);
  await this.page.getByTestId("password").fill(mock_password_guest);
  await this.page.getByTestId("confirmPassword").fill(mock_password_guest);
});

When("I click the sign up button", async function () {
  await this.page.getByTestId("sign-up-button").click();
});

Then("I am successfully registered", { timeout: 30 * 1000 }, async function () {
  await expect(this.page).toHaveURL(/\/home$/);
});
