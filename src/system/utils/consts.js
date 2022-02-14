const path = require('path');

module.exports = {
    cleanScriptsFolderPath: path.join(__dirname, '..', '..', 'autotests', 'clean-scripts'),
    rawScriptsFolderPath: path.join(__dirname, '..', '..', 'autotests', 'raw-scripts'),
    logsFolderPath: process.env.LOGS_FOLDER_PATH || path.join(__dirname, '..', '..', 'autotests', 'logs'),
};
