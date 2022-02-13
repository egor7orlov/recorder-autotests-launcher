/**
 * Returns autotests' launching script arguments.
 * @typedef {{
 *     requester: string,
 *     isSaveLogs: number,
 *     isShowBrowser: number
 * }} LaunchParams - autotest's launching params.
 * @param {LaunchParams} launchParams - autotest's launching params.
 * @return {string[]}
 */
function getAutotestsLaunchArgs(launchParams) {
    const args = [];

    if (launchParams.requester) {
        args.push(launchParams.requester);
    }

    if (+launchParams.isSaveLogs) {
        args.push('--save-logs');
    }

    if (+launchParams.isShowBrowser) {
        args.push('--show-browser');
    }

    return args;
}

module.exports = {
    getAutotestsLaunchArgs,
};
