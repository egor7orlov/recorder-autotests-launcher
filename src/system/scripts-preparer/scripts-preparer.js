const fs = require('fs');
const path = require('path');
const { autotestsCodeReplacers } = require('./consts');

/** Class representing scripts preparer entity. */
class ScriptsPreparer {
    /**
     * @static
     * Copies autotests structure from raw scripts' folder into clean scripts' folder with formatted scripts.
     * @param {string} pathInRawScripts - path to entry in raw scripts' folder.
     * @param {string} pathInCleanScripts - path to entry in clean scripts' folder.
     * @returns {void}
     */
    static writeFormattedScripts(pathInRawScripts, pathInCleanScripts) {
        const rawScriptsFolderContent = fs.readdirSync(pathInRawScripts, { withFileTypes: true });

        rawScriptsFolderContent.forEach((directoryEntry) => {
            const entryName = directoryEntry.name;

            if (directoryEntry.isDirectory()) {
                const rawDirPath = path.join(pathInRawScripts, entryName);
                const cleanDirPath = path.join(pathInCleanScripts, entryName);

                if (!fs.existsSync(cleanDirPath)) {
                    fs.mkdirSync(cleanDirPath);
                }

                this.writeFormattedScripts(rawDirPath, cleanDirPath);
            }

            if (directoryEntry.isFile()) {
                const rawScriptPath = path.join(pathInRawScripts, entryName);
                const cleanScriptPath = path.join(pathInCleanScripts, entryName);

                if (!fs.existsSync(cleanScriptPath)) {
                    fs.writeFileSync(cleanScriptPath, this._getCleanScripText(rawScriptPath), { encoding: 'utf-8' });
                }
            }
        });
    }

    /**
     * @private
     * @static
     * Formats raw script and returns its clean version.
     * @param {string} rawScriptPath - path to raw script.
     * @returns {string}
     */
    static _getCleanScripText(rawScriptPath) {
        let fileData = fs.readFileSync(rawScriptPath).toString();

        autotestsCodeReplacers.forEach((replacer) => {
            fileData = fileData.replace(replacer.toReplace, replacer.replaceWith);
        });

        return fileData.trim();
    }
}

module.exports = ScriptsPreparer;
