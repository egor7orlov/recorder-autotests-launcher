const { createFolderIfNotExists } = require('../utils/fs-utils');
const { rawScriptsFolderPath, cleanScriptsFolderPath } = require('../utils/consts');
const ScriptsPreparer = require('./scripts-preparer');

createFolderIfNotExists(rawScriptsFolderPath);
createFolderIfNotExists(cleanScriptsFolderPath);
ScriptsPreparer.writeFormattedScripts(rawScriptsFolderPath, cleanScriptsFolderPath);
