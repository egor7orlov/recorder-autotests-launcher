const workersManager = require('../../workers-manager');

/**
 * Returns list of params names that are required but were not passed in actual params.
 * @param {string[]} currentParamsNames - actual params names.
 * @param {string[]} requiredParamsNames - required params names
 * @returns {string[]}
 */
function getAbsentRequiredParams(currentParamsNames, requiredParamsNames) {
    return requiredParamsNames.filter((paramName) => !currentParamsNames.includes(paramName));
}

/**
 * Runs autotest and send response on execution completion.
 * @param {{statusCode: number, end: Function}} res - Express Response instance.
 * @param {LaunchParams} parameters - autotests launch parameters.
 * @returns {Promise<void>}
 */
async function runAutotestsAndSendResponse(res, parameters) {
    try {
        const autotestsResult = await workersManager.runAutotestsWorker(parameters);
        res.statusCode = 200;

        res.end(autotestsResult);
    } catch (err) {
        res.statusCode = 500;

        res.end(err.message);
    }
}

module.exports = {
    getAbsentRequiredParams,
    runAutotestsAndSendResponse,
};
