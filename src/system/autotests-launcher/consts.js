module.exports = {
    divider: '-------------------------------------------------',
    getScriptRunningString: (scriptName) => `Running: ${scriptName}`,
    getScriptExecutedString: (scriptName) => `Script ${scriptName} finished its execution`,
    getScriptFailedString: (err) => `Autotests stopped execution because of next error: ${err}`,
};
