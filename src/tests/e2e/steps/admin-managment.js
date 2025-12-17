// import { Given, Then, Before, After, When } from "@cucumber/cucumber";
// import {
//   country,
//   description,
//   genres,
//   movie_duration,
//   new_review_on_rotten_tommatoes,
//   password_guest,
//   poster,
//   realise,
//   review_on_rotten_tommatoes,
//   title,
//   trailer_href,
//   username_guest,
//   view_age,
// } from "../support/mock.js";
// import { expect } from "@playwright/test";

// Before(async function () {
//   await this.init();
// });

// After(async function () {
//   await this.close();
// });

// When(
//   "I add a new movie with valid data",
//   { timeout: 30 * 1000 },
//   async function () {
//     const page = this.page;

//     await page.getByTestId("add-movie").click();
//     await page.waitForURL("**/admin/movie/add");

//     await page.getByTestId("fill-self-action").click();

//     const fields = [
//       ["poster", poster],
//       ["title", title],
//       ["description", description],
//       ["trailerLink", trailer_href],
//       ["releaseDate", realise],
//       ["country", country],
//       ["duration", movie_duration],
//       ["ageRestriction", view_age],
//       ["imdb", 8.0],
//       ["rottenTomatoes", "50"],
//     ];

//     for (const [label, value] of fields) {
//       await page.getByTestId(`${label}-test-id`).fill(String(value));
//     }

//     for (const genre of genres) {
//       await page.getByTestId("genre-field").fill(genre);
//       await page.getByTestId("genre-add-button").click();
//     }

//     await page.getByTestId("submit-action").click();
//     await page.waitForURL("**/admin/panel");
//   }
// );

// Then(
//   "I see the movie in the movie list",
//   { timeout: 30 * 1000 },
//   async function () {
//     await expect(
//       this.page.getByTestId(`movie-title-${title}`)
//     ).toBeVisible();
//   }
// );

// // // ================= EDIT MOVIE =================

// When("I update the movie description", async function () {
//   const page = this.page;

//   await page.goto("http://localhost:5173/admin/panel");
//   await page.getByText(title).click();

//   await page.waitForURL("**/admin/movie/**");

//   await page
//     .getByLabel("ratings.rottenTomatoes")
//     .fill(String(new_review_on_rotten_tommatoes));

//   await page.getByTestId("submit-action").click();
// });

// Then("I see the updated movie details", async function () {
//   await this.page.reload();
//   await expect(
//     this.page.getByText(String(new_review_on_rotten_tommatoes))
//   ).toBeVisible();
// });

// // // ================= DELETE MOVIE =================

// // When("I delete the movie", async function () {
// //   const page = this.page;

// //   await page.goto("http://localhost:5173/admin/panel");
// //   await page.getByText(title).click();

// //   await page.getByTestId("delete-action-button").click();
// //   await page.getByTestId("delete-accept-action").click();
// // });

// // Then("the movie is no longer visible in the movie list", async function () {
// //   await this.page.reload();
// //   await expect(this.page.getByText(title)).toHaveCount(0);
// // });

// // // scenario: Normal user cannot access admin dashboard
// // When("I try to access the admin dashboard", async function () {
// //   await expect(this.page.getByText("Admin panel")).not.toBeVisible();
// // });

// // Then("I see an access denied message", async function () {
// //   await this.page.goto("http://localhost:5173/admin/panel");

// //   await this.page.waitForURL("**/");
// //   // when I try to enter to admin panel I redirect to the home page
// // });

// // // scenario: Admin cannot add a movie with missing required fields
// // When("I add a movie without a title", async function () {
// //   await this.page.getByRole("add-movie").click();
// //   await this.page.waitForURL("**/admin/movie/add", { timeout: 10000 });

// //   await this.page.getByRole("fill-self-action").click();

// //   const fields = [
// //     { field_id: "poster", value: poster },
// //     { field_id: "description", value: description },
// //     { field_id: "trailerLink", value: trailer_href },
// //     { field_id: "releaseDate", value: realise },
// //     { field_id: "country", value: country },
// //     { field_id: "duration", value: movie_duration },
// //     { field_id: "ageRestriction", value: view_age },
// //   ];

// //   for (const field of fields) {
// //     await this.page.getByLabel(field.field_id).fill(field.value);
// //   }

// //   await this.page.getByRole("submit-action").click();
// // });

// // Then("I see a validation error message", async function () {
// //   await expect(this.page.getByText("Title is required")).toBeVisible();
// // });
