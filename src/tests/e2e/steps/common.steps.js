// import { Given, When } from "@cucumber/cucumber";
// import {
//   password_admin,
//   password_guest,
//   username_admin,
//   username_guest,
// } from "../support/mock.js";

// Given("I am logged in as an admin", { timeout: 30 * 1000 }, async function () {
//   const page = this.page;
//   await page.goto("http://localhost:5173/signin");
  
//   await page.fill("#usernameOrEmail", username_admin);
//   await page.fill('input[name="password"]', password_admin);
//   await page.getByRole("button", { name: "Sign in" }).click();

//   await page.waitForURL("**/", { timeout: 10000 });
// });

// Given("I am logged in as a normal user", async function () {
//   const page = this.page;

//   await page.goto("http://localhost:5173/signin");

//   await page.fill("#usernameOrEmail", username_guest);
//   await page.fill('input[name="password"]', password_guest);
//   await page.getByRole("button", { name: "Sign in" }).click();

//   await page.waitForURL("**/", { timeout: 10000 });
// });

// When("I am on the admin dashboard", async function () {
//   const page = this.page;

//   await page.goto("http://localhost:5173/admin/panel");
//   await page.waitForURL("**/admin/panel", { timeout: 10000 });
// });
