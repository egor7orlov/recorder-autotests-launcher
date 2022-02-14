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
     * @returns {{name: string, path: string, run: VoidFunction}[]}
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

        const browser = await puppeteer.launch({
            headless: !this._isShowBrowser, // If true runs autotests without opening browser.
            args: [
                '--start-maximized', // Runs browser in fullscreen. Doesn't affect page's viewport.
            ],
        });

        for await (const autotest of autotests) {
            const logsDivider = !this._logger.isSaveLogs ? `\n${divider}` : '';
            const writeToLog = async (text, prefix) => {
                const autotestPathSplitByScriptsFolder = path
                    .dirname(autotest.path)
                    .split('clean-scripts' + path.sep);
                const logFilePlaceInLogs = autotestPathSplitByScriptsFolder.length > 1
                    ? autotestPathSplitByScriptsFolder[1]
                    : '';

                await this._logger.writeToLog({
                    dirname: logFilePlaceInLogs,
                    filenameWithoutExt: path.basename(autotest.path, '.js'),
                    text: `${text}\n`,
                    prefix,
                });
            };

            await writeToLog(getScriptRunningString(autotest.name));

            try {
                await autotest.run(browser, writeToLog);
                await writeToLog(getScriptExecutedString(autotest.name) + logsDivider);
            } catch (err) {
                await writeToLog(getScriptFailedString(err) + logsDivider, 'err');
            }
        }

        await browser.close();
    }
}

module.exports = Launcher;
