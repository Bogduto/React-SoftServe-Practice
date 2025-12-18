import { setWorldConstructor, BeforeAll, AfterAll, Before, After } from "@cucumber/cucumber";
import { chromium } from "playwright";

let browser;

class CustomWorld {
  async init() {
    // НЕ запускаємо тут chromium.launch()
    // Page буде створюватися в Before
  }

  async close() {
    // НЕ закриваємо браузер тут
  }
}

setWorldConstructor(CustomWorld);

BeforeAll(async () => {
  browser = await chromium.launch({ headless: true, slowMo: 250 });
});

AfterAll(async () => {
  await browser.close();
});

Before(async function () {
  this.context = await browser.newContext(); 
  this.page = await this.context.newPage();
});

After(async function () {
  await this.context.close(); 
});
