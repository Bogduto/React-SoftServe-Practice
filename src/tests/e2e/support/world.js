import { setWorldConstructor, BeforeAll, AfterAll, Before, After, setDefaultTimeout } from "@cucumber/cucumber";
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

setDefaultTimeout(60 * 1000);

setWorldConstructor(CustomWorld);

BeforeAll(async () => {
  browser = await chromium.launch({ headless: true });
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
