const {logOneTwoThree} = require('../my-file');

async function run(browser, writeToLog, isExecutedDirectly = false) {
    logOneTwoThree()
        const page = await browser.newPage();

    async function waitForSelectors(selectors, frame) {
      for (const selector of selectors) {
        try {
          return await waitForSelector(selector, frame);
        } catch (err) {
          await writeToLog(err.message, 'err');
        }
      }
      throw new Error('Could not find element for selectors: ' + JSON.stringify(selectors));
    }

    async function waitForSelector(selector, frame) {
      if (selector instanceof Array) {
        let element = null;
        for (const part of selector) {
          if (!element) {
            element = await frame.waitForSelector(part);
          } else {
            element = await element.$(part);
          }
          if (!element) {
            throw new Error('Could not find element: ' + part);
          }
          element = (await element.evaluateHandle(el => el.shadowRoot ? el.shadowRoot : el)).asElement();
        }
        if (!element) {
          throw new Error('Could not find element: ' + selector.join('|'));
        }
        return element;
      }
      const element = await frame.waitForSelector(selector);
      if (!element) {
        throw new Error('Could not find element: ' + selector);
      }
      return element;
    }

    async function waitForElement(step, frame) {
      const count = step.count || 1;
      const operator = step.operator || '>=';
      const comp = {
        '==': (a, b) => a === b,
        '>=': (a, b) => a >= b,
        '<=': (a, b) => a <= b,
      };
      const compFn = comp[operator];
      await waitForFunction(async () => {
        const elements = await querySelectorsAll(step.selectors, frame);
        return compFn(elements.length, count);
      });
    }

    async function querySelectorsAll(selectors, frame) {
      for (const selector of selectors) {
        const result = await querySelectorAll(selector, frame);
        if (result.length) {
          return result;
        }
      }
      return [];
    }

    async function querySelectorAll(selector, frame) {
      if (selector instanceof Array) {
        let elements = [];
        let i = 0;
        for (const part of selector) {
          if (i === 0) {
            elements = await frame.$$(part);
          } else {
            const tmpElements = elements;
            elements = [];
            for (const el of tmpElements) {
              elements.push(...(await el.$$(part)));
            }
          }
          if (elements.length === 0) {
            return [];
          }
          const tmpElements = [];
          for (const el of elements) {
            const newEl = (await el.evaluateHandle(el => el.shadowRoot ? el.shadowRoot : el)).asElement();
            if (newEl) {
              tmpElements.push(newEl);
            }
          }
          elements = tmpElements;
          i++;
        }
        return elements;
      }
      const element = await frame.$$(selector);
      if (!element) {
        throw new Error('Could not find element: ' + selector);
      }
      return element;
    }

    async function waitForFunction(fn) {
      let isActive = true;
      setTimeout(() => {
        isActive = false;
      }, 5000);
      while (isActive) {
        const result = await fn();
        if (result) {
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      throw new Error('Timed out');
    }
    {
        const targetPage = page;
        await targetPage.setViewport({"width":1113,"height":721})
    }
    {
        const targetPage = page;
        const promises = [];
        promises.push(targetPage.waitForNavigation());
        await targetPage.goto('https://nodejs.org/docs/latest/api/modules.html');
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        const promises = [];
        promises.push(targetPage.waitForNavigation());
        const element = await waitForSelectors([["aria/C++ addons"],["#column2 > ul:nth-child(4) > li:nth-child(5) > a"]], targetPage);
        await element.click({ offset: { x: 102, y: 11.600006103515625} });
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/Hello world"],["#toc > ul > li > ul > li:nth-child(1) > a"]], targetPage);
        await element.click({ offset: { x: 52, y: 10.550003051757812} });
    }
    {
        const targetPage = page;
        await targetPage.evaluate((x, y) => { window.scroll(x, y); }, 0, 5124.7998046875)
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/History"],["#apicontent > section:nth-child(7) > div > details > summary"]], targetPage);
        await element.click({ offset: { x: 66, y: 13.54998779296875} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/Cleanup hooks may now be asynchronous."],["#apicontent > section:nth-child(7) > div > details > table > tbody > tr:nth-child(2) > td:nth-child(2)"]], targetPage);
        await element.click({ offset: { x: 269.5375061035156, y: 39.449981689453125} });
    }
    {
        const targetPage = page;
        await targetPage.keyboard.down("Control");
    }
    {
        const targetPage = page;
        await targetPage.keyboard.down("Control");
    }
    {
        const targetPage = page;
        await targetPage.keyboard.down("Control");
    }
    {
        const targetPage = page;
        await targetPage.keyboard.down("Control");
    }
    {
        const targetPage = page;
        await targetPage.keyboard.down("Control");
    }
    {
        const targetPage = page;
        await targetPage.keyboard.down("Control");
    }
    {
        const targetPage = page;
        await targetPage.keyboard.down("Control");
    }
    {
        const targetPage = page;
        await targetPage.keyboard.down("Control");
    }
    {
        const targetPage = page;
        await targetPage.keyboard.down("Control");
    }
    {
        const targetPage = page;
        await targetPage.keyboard.down("c");
    }
    {
        const targetPage = page;
        await targetPage.keyboard.up("c");
    }
    {
        const targetPage = page;
        await targetPage.keyboard.up("Control");
    }

    isExecutedDirectly ? await browser.close() : await page.close();
}

if (require.main === module) {
    (async () => {
        const puppeteer = require('puppeteer');
        const browser = await puppeteer.launch({ headless: false });
        const logFunction = (text, prefix) => console.log(`[${prefix.toUpperCase()}]: ${text}`);

        await run(browser, logFunction, true)
    })();
}

module.exports = run;
