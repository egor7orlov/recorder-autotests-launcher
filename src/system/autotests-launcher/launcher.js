const path = require('path');
const puppeteer = require('puppeteer');
const { launcherStrings } = require('./consts');
const {
    getScriptRunningString,
    getScriptExecutedString,
    getScriptFailedString,
    divider,
} = launcherStrings;
const { getFolderFilesPaths } = require('../utils/fs-utils');
const { cleanScriptsFolderPath } = require('../utils/consts');

/** @typedef {function(string, string): Promise<void>} WriteToLogFunction */
/** @typedef {function(Browser, WriteToLogFunction): Promise<void>} RunAutotestFunction */

/** @typedef {{name: string, path: string, run: RunAutotestFunction}} Autotest */

/** Class representing an autotests launcher */
class Launcher {
    /**
     * Creates instance of Launcher class.
     * @param {boolean} isShowBrowser - describes if autotests will be run implicitly or explicitly.
     * @param {Logger} logger - logger.
     * @returns {Launcher}
     */
    constructor(isShowBrowser, logger) {
        this._isShowBrowser = isShowBrowser;
        this._logger = logger;
        this._autotestsFolderPath = cleanScriptsFolderPath;
    }

    /**
     * @private
     * Returns list of objects containing autotest's filename and function that launches it.
     * @returns {Autotest[]}
     */
    _getAutotests() {
        const autotestsPaths = getFolderFilesPaths(this._autotestsFolderPath);

        return autotestsPaths.map((autotestPath) => ({
            name: path.basename(autotestPath),
            path: autotestPath,
            run: require(autotestPath),
        }));
    }

    /**
     * Method that runs autotests.
     * @returns {Promise<void>}
     */
    async runAutotests() {
        const autotests = this._getAutotests();
        const browser = await this._getBrowser();

        for await (const autotest of autotests) {
            await this._runAutotest(browser, autotest);
        }

        await browser.close();
    }

    /**
     * @private
     * Launches Puppeteer's browser and returns it.
     * @returns {Promise<Browser>}
     */
    async _getBrowser() {
        return puppeteer.launch({
            headless: !this._isShowBrowser, // If true runs autotests without opening browser.
            args: [
                '--start-maximized', // Runs browser in fullscreen. Doesn't affect page's viewport.
            ],
        });
    }

    /**
     * @private
     * Runs autotest and logs messages while its execution.
     * @param {puppeteer.Browser} browser - Browser's instance.
     * @param {Autotest} autotest - autotest's object.
     * @returns {Promise<void>}
     */
    async _runAutotest(browser, autotest) {
        const relativeScriptPath = this._getRelativeScriptPathFrom(autotest);
        const writeToLog = async (text, prefix) => await this._logger.writeToLog(text + '\n', prefix);

        await writeToLog(getScriptRunningString(relativeScriptPath));

        try {
            await autotest.run(browser, writeToLog);
            await writeToLog(`${getScriptExecutedString(relativeScriptPath)}\n${divider}`);
        } catch (err) {
            await writeToLog(`${getScriptFailedString(err)}\n${divider}`, 'err');
            await this._closeNonBlankPages(browser);
        }
    }

    /**
     * @private
     * Returns path to autotest's script starting from clean scripts' folder.
     * @param {Autotest} autotest - autotest's object.
     * @returns {string}
     */
    _getRelativeScriptPathFrom(autotest) {
        const autotestPathSplitByScriptsFolder = autotest.path.split(`clean-scripts${path.sep}`);

        return autotestPathSplitByScriptsFolder.length > 1
            ? autotestPathSplitByScriptsFolder[1]
            : autotest.name;
    }

    /**
     * @private
     * Closes browser's non-blank pages.
     * @param {puppeteer.Browser} browser - Browser's instance.
     * @returns {Promise<void>}
     */
    async _closeNonBlankPages(browser) {
        const pages = await browser.pages();
        const nonBlankPages = pages.filter((page) => page.url() !== 'about:blank');

        for await (const page of nonBlankPages) {
            await page.close();
        }
    }
}

module.exports = Launcher;
