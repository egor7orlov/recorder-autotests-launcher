const path = require('path');
const cleanScriptsFolderName = 'clean-scripts';
const rawScriptsFolderName = 'raw-scripts';

module.exports = {
    cleanScriptsFolderName,
    rawScriptsFolderName,
    cleanScriptsFolderPath: path.join(__dirname, '..', '..', 'autotests', cleanScriptsFolderName),
    rawScriptsFolderPath: path.join(__dirname, '..', '..', 'autotests', rawScriptsFolderName),
    logsFolderPath: process.env.LOGS_FOLDER_PATH || path.join(__dirname, '..', '..', 'autotests', 'logs'),
};
