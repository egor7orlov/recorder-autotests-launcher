async function run(browser, writeToLog, isExecutedDirectly) {
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
        await targetPage.setViewport({ 'width': 1055, 'height': 721 });
    }
    {
        const targetPage = page;
        const promises = [];
        promises.push(targetPage.waitForNavigation());
        await targetPage.goto('https://ru.wikipedia.org/wiki/%D0%97%D0%B0%D0%B3%D0%BB%D0%B0%D0%B2%D0%BD%D0%B0%D1%8F_%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D0%B0');
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        const promises = [];
        promises.push(targetPage.waitForNavigation());
        const element = await waitForSelectors([ [ 'aria/Указатель А — Я', 'aria/[role="generic"]' ], [ '#n-index > a > span' ] ], targetPage);
        await element.click({ offset: { x: 38.79999923706055, y: 5 } });
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        const promises = [];
        promises.push(targetPage.waitForNavigation());
        const element = await waitForSelectors([ [ 'aria/Бв[role="link"]' ], [ '#toc > tbody > tr:nth-child(3) > td:nth-child(5) > a' ] ], targetPage);
        await element.click({ offset: { x: 7.0625, y: -0.0875244140625 } });
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        const promises = [];
        promises.push(targetPage.waitForNavigation());
        const element = await waitForSelectors([ [ 'aria/Бвака' ], [ '#mw-content-text > div.mw-allpages-body > ul > li:nth-child(2) > a' ] ], targetPage);
        await element.click({ offset: { x: 12.599990844726562, y: 8.8499755859375 } });
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        const promises = [];
        promises.push(targetPage.waitForNavigation());
        const element = await waitForSelectors([ [ 'aria/Центральноафриканской Республики (ЦАР)' ], [ '#mw-content-text > div.mw-parser-output > p:nth-child(4) > a:nth-child(14)' ] ], targetPage);
        await element.click({ offset: { x: 307, y: 13 } });
        await Promise.all(promises);
    }

    isExecutedDirectly ? await browser.close() : await page.close();
}
        
if (require.main === module) {
    (async ()=>{
        const puppeteer = require('puppeteer');
        const browser = await puppeteer.launch({ headless: false });
        const logFunction = (text, prefix) => console.log(`[${prefix.toUpperCase()}]: ${text}`);

        await run(browser, logFunction, true)
    })();
}

module.exports = run;