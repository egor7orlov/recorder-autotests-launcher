const fs = require('fs');
const path = require('path');
const { createFolderIfNotExists } = require('../utils/fs-utils');
const { preparerStrings } = require('./consts');
const { autotestsCodeReplacers } = preparerStrings;
const rawScriptsFolderPath = path.join(__dirname, 'raw-scripts');
const cleanScriptsFolderPath = path.join(__dirname, 'clean-scripts');

createFolderIfNotExists(rawScriptsFolderPath);
createFolderIfNotExists(cleanScriptsFolderPath);
writeFormattedScripts(rawScriptsFolderPath, cleanScriptsFolderPath);

/**
 * Copies autotests structure from raw scripts' folder into clean scripts' folder with formatted scripts.
 * @param {string} pathInRawScripts - path to entry in raw scripts' folder.
 * @param {string} pathInCleanScripts - path to entry in clean scripts' folder.
 * @returns {void}
 */
function writeFormattedScripts(pathInRawScripts, pathInCleanScripts) {
    const rawScriptsFolderContent = fs.readdirSync(pathInRawScripts, { withFileTypes: true });

    rawScriptsFolderContent.forEach((directoryEntry) => {
        const entryName = directoryEntry.name;

        if (directoryEntry.isDirectory()) {
            const rawDirPath = path.join(pathInRawScripts, entryName);
            const cleanDirPath = path.join(pathInCleanScripts, entryName);

            if (!fs.existsSync(cleanDirPath)) {
                fs.mkdirSync(cleanDirPath);
            }

            writeFormattedScripts(rawDirPath, cleanDirPath);
        }

        if (directoryEntry.isFile()) {
            const rawScriptPath = path.join(pathInRawScripts, entryName);
            const cleanScriptPath = path.join(pathInCleanScripts, entryName);
            let fileData = fs.readFileSync(rawScriptPath).toString();

            autotestsCodeReplacers.forEach((replacer) => fileData = fileData.replace(replacer.toReplace, replacer.replaceWith));

            if (!fs.existsSync(cleanScriptPath)) {
                fs.writeFileSync(cleanScriptPath, fileData.trim(), { encoding: 'utf-8' });
            }
        }
    });
}
