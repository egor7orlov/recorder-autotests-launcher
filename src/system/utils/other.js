/**
 * Returns string representing today's date.
 * @returns {string}
 */
function getTodayString() {
    return new Date().toLocaleDateString();
}

module.exports = {
    getTodayString,
};
