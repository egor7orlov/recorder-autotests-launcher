const fs = require('fs');
const path = require('path');
const { createFolderIfNotExists, createFoldersStructure } = require('../utils/fs-utils');
const { logsFolderPath } = require('../utils/consts');

/** Class representing logger */
class Logger {
    /**
     * Creates Logger instance.
     * @param {string} requester - identifier of user that requests logging.
     * @param {boolean} isSaveLogs - defines if logs will be stored in filesystem or just printed in console.
     * @returns {Logger}
     */
    constructor(requester, isSaveLogs) {
        this.requester = requester;
        this.isSaveLogs = isSaveLogs;

        if (this.isSaveLogs) {
            this._rewriteRequesterFolderForToday();
        }
    }

    /**
     * @private
     * Replaces existing folder with logs for requester.
     * @returns {void}
     */
    _rewriteRequesterFolderForToday() {
        const currentDateFolderPath = path.join(logsFolderPath, this._getTodayString());
        const idFolderPath = path.join(currentDateFolderPath, this.requester);

        createFolderIfNotExists(logsFolderPath);
        createFolderIfNotExists(currentDateFolderPath);

        if (fs.existsSync(idFolderPath)) {
            fs.rmdirSync(idFolderPath, { recursive: true });
        }

        createFolderIfNotExists(idFolderPath);

        this._idFolderPath = idFolderPath;
    }

    /**
     * Writes data into log (file or console).
     * @param {string} dirname - where log file will be stored in logs folder structure.
     * @param {string} filenameWithoutExt - name of a log file.
     * @param {string} text - text to append to log.
     * @param {string} prefix - prefix of log's line which describes type of message.
     * @returns {Promise<void>}
     */
    async writeToLog({ dirname, filenameWithoutExt, text, prefix = 'info' }) {
        const data = `[${this.requester}][${prefix.toUpperCase()}][${new Date().toLocaleTimeString()}]${text}`;

        if (!this.isSaveLogs) {
            return console.log(data.trim());
        }

        const folderOfLogFile = createFoldersStructure(this._idFolderPath, dirname);
        const logFilePath = path.join(folderOfLogFile, filenameWithoutExt + '.txt');
        const options = { encoding: 'utf-8' };

        if (!fs.existsSync(logFilePath)) {
            await fs.promises.writeFile(logFilePath, data, options);
        } else {
            await fs.promises.appendFile(logFilePath, data, options);
        }
    }

    /**
     * @private
     * Returns string representing today's date.
     * @returns {string}
     */
    _getTodayString() {
        return new Date().toLocaleDateString();
    }
}

module.exports = Logger;
