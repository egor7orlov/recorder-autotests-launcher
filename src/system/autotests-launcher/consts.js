const preparerStrings = {
    autotestsCodeReplacers: [
        {
            toReplace: 'const puppeteer = require(\'puppeteer\');\n',
            replaceWith: '',
        },
        {
            toReplace: '(async () => {',
            replaceWith: 'async function run(browser, writeToLog, isExecutedDirectly = false) {',
        },
        {
            toReplace: 'console.error(err);',
            replaceWith: 'await writeToLog(err.message, \'err\');',
        },
        {
            toReplace: 'const browser = await puppeteer.launch();\n',
            replaceWith: '',
        },
        {
            toReplace: 'await browser.close();\n',
            replaceWith: 'isExecutedDirectly ? await browser.close() : await page.close();\n',
        },
        {
            toReplace: '})();',
            replaceWith: `}
        
if (require.main === module) {
    (async () => {
        const puppeteer = require('puppeteer');
        const browser = await puppeteer.launch({ headless: false });
        const logFunction = (text, prefix) => console.log(\`[\${prefix.toUpperCase()}]: \${text}\`);

        await run(browser, logFunction, true)
    })();
}

module.exports = run;
`,
        },
    ],
};
const launcherStrings = {
    divider: '-------------------------------------------------',
    getScriptRunningString: (scriptName) => `Running: ${scriptName}`,
    getScriptExecutedString: (scriptName) => `Script ${scriptName} finished its execution`,
    getScriptFailedString: (err) => `Autotests stopped execution because of next error: ${err}`,
};

module.exports = {
    preparerStrings,
    launcherStrings,
};
