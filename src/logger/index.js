const fs = require('fs');
const path = require('path');
const { createFolderIfNotExists } = require('../utils/fs-utils');

/** Class representing logger */
class Logger {
    /**
     * Creates Logger instance.
     * @param {string} requester - identifier of user that requests logging.
     * @param {boolean} isSaveLogs - defines if logs will be stored in filesystem or just printed in console.
     * @returns {Logger}
     */
    constructor(requester, isSaveLogs) {
        this.id = requester;
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
        const logsFolderPath = path.join(__dirname, 'logs');
        const currentDateFolderPath = path.join(logsFolderPath, this._getTodayString());
        const idFolderPath = path.join(currentDateFolderPath, this.id);

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
     * @param {string} fileName - log file name.
     * @param {string} text - data to write into log.
     * @param {string} prefix - prefix of log's line which describes type of message.
     * @returns {Promise<void>}
     */
    async writeToLog(fileName, text, prefix = 'info') {
        const data = `[${this.id}][${prefix.toUpperCase()}][${new Date().toLocaleTimeString()}]${text}`;

        if (!this.isSaveLogs) {
            return console.log(data.trim());
        }

        const fileNameTxtExtension = `${fileName.split('.')[0]}.txt`;
        const filePath = path.join(this._idFolderPath, fileNameTxtExtension);
        const options = { encoding: 'utf-8' };

        if (!fs.existsSync(filePath)) {
            await fs.promises.writeFile(filePath, data, options);
        } else {
            await fs.promises.appendFile(filePath, data, options);
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
