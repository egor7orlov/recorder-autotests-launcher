const fs = require('fs');
const path = require('path');

/**
 * Creates folder if it doesn't exist.
 * @param {string} folderPath - folder's path.
 * @returns {void}
 */
function createFolderIfNotExists(folderPath) {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }
}

/**
 * Recursively gets files paths from folder.
 * @param {string} folderPath - folder's path from which files' paths are received.
 * @returns {string[]}
 */
function getFolderFilesPaths(folderPath) {
    const folderContent = fs.readdirSync(folderPath, { withFileTypes: true });
    const filesPaths = folderContent
        .filter((entry) => entry.isFile())
        .map((entry) => path.join(folderPath, entry.name));
    const directoriesPaths = folderContent
        .filter((entry) => entry.isDirectory())
        .map((entry) => path.join(folderPath, entry.name));

    directoriesPaths.forEach((directoryPath) => filesPaths.push(...getFolderFilesPaths(directoryPath)));

    return filesPaths;
}

module.exports = {
    createFolderIfNotExists,
    getFolderFilesPaths,
};
