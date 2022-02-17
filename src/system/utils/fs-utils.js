const fs = require('fs');
const path = require('path');

/**
 * Creates empty file replacing existent.
 * @param {string} filePath - file's path.
 * @returns {void}
 */
function createFileReplacingExistent(filePath) {
    fs.writeFileSync(filePath, '', { encoding: 'utf-8' });
}

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
 * Creates in base directory folders' structure defined in path.
 * @param {String} baseDirPath - path to folder in which structure will be created. Must exist when calling this function.
 * @param {String} foldersPath - path which contains folders to build names.
 * @returns {String} Path to the deepest folder in created structure.
 */
function createFoldersStructure(baseDirPath, foldersPath) {
    if (!fs.existsSync(baseDirPath)) {
        throw new Error(`Base folder (${baseDirPath}) doesn't exist.`);
    }

    const foldersToCreate = foldersPath.split(path.sep);

    return foldersToCreate.reduce((parentFolderPath, folderName) => {
        const folderToCreatePath = path.join(parentFolderPath, folderName);

        createFolderIfNotExists(folderToCreatePath);

        return folderToCreatePath;
    }, baseDirPath);
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
    createFileReplacingExistent,
    getFolderFilesPaths,
};
