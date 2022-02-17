const fs = require('fs');
const path = require('path');
const { createFolderIfNotExists, createFileReplacingExistent } = require('../utils/fs-utils');
const { logsFolderPath } = require('../utils/consts');
const { getTodayString } = require('../utils/other');

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
            this._currentDateFolderPath = path.join(logsFolderPath, getTodayString());
            this._requesterLogFilePath = path.join(this._currentDateFolderPath, this.requester + '.txt');

            createFolderIfNotExists(logsFolderPath);
            createFolderIfNotExists(this._currentDateFolderPath);
            createFileReplacingExistent(this._requesterLogFilePath);
        }
    }

    /**
     * Writes data into log (file or console).
     * @param {string} data - text to append to log.
     * @param {string} prefix - prefix of log's line which describes type of message.
     * @returns {Promise<void>}
     */
    async writeToLog(data, prefix = 'info') {
        const logLine = `[${new Date().toLocaleTimeString()}][${prefix.toUpperCase()}]: ${data}`;

        if (!this.isSaveLogs) {
            return console.log(`[${this.requester}]${logLine.trim()}`);
        }

        await fs.promises.appendFile(this._requesterLogFilePath, logLine, { encoding: 'utf-8' });
    }
}

module.exports = Logger;
