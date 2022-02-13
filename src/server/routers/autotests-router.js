const path = require('path');
const express = require('express');
const autotestsRouter = express.Router({ caseSensitive: true });
const {
    getAbsentRequiredParams,
    runAutotestsAndSendResponse,
} = require('./utils');
const requiredParamsNames = [ 'requester', 'isSaveLogs' ];
const routes = {
    launch: '/launch',
    logs: '/logs',
};
const logsPath = path.join(__dirname, '..', '..', 'logger', 'logs');

autotestsRouter.get(routes.launch, [
    (req, res, next) => {
        const absentRequiredQueryParams = getAbsentRequiredParams(Object.keys(req.query), requiredParamsNames);

        if (absentRequiredQueryParams.length) {
            res.statusCode = 400;

            return res.end(`Next query parameters need to be set: ${absentRequiredQueryParams.join(', ')}`);
        }

        next();
    },
    async (req, res) => {
        await runAutotestsAndSendResponse(res, req.query);
    },
]);
autotestsRouter.post(routes.launch, [
    (req, res, next) => {
        const absentRequiredQueryParams = getAbsentRequiredParams(Object.keys(req.body), requiredParamsNames);

        if (absentRequiredQueryParams.length) {
            res.statusCode = 400;

            return res.end(`Next parameters need to be provided in request's body: ${absentRequiredQueryParams.join(', ')}`);
        }

        next();
    },
    async (req, res) => {
        await runAutotestsAndSendResponse(res, req.body);
    },
]);
autotestsRouter.use(routes.logs, express.static(logsPath));

module.exports = autotestsRouter;
