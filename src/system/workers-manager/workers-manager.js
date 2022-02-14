const { cpus } = require('os');
const { fork } = require('child_process');
const path = require('path');
const { workersStrings, workersTypes } = require('./consts');
const { getAutotestsLaunchArgs } = require('./utils');

/** Class representing workers manager */
class WorkersManager {
    /** Creates instance of workers manager */
    constructor() {
        this._allowedWorkersAmount = Math.ceil(cpus().length / 1.5);
        this._workers = {
            autoTesters: new Map(),
        };
        this._requesters = new Set();
        this._workersConfigs = {
            autotestsWorker: {
                path: path.join(__dirname, '..', 'autotests-launcher', 'index.js'),
            },
        };
    }

    /**
     * Creates and activates worker that runs autotests.
     * @param {LaunchParams} launchParams - autotest's launching params.
     * @return {Promise<string>}
     */
    async runAutotestsWorker(launchParams) {
        const { requester } = launchParams;
        return new Promise((resolve) => {
            if (!requester) {
                return resolve(workersStrings.identifierRequired);
            }

            if (this._requesters.has(requester)) {
                return resolve(workersStrings.requesterNameInUse);
            }

            if (!this._isThereSpaceForAnotherWorker()) {
                return resolve(workersStrings.workersAreBusy);
            }

            this._requesters.add(requester);

            const autoTestersType = workersTypes.autoTesters;
            const autotestsWorkerConfig = this._workersConfigs.autotestsWorker;
            const autotestsWorker = fork(autotestsWorkerConfig.path, getAutotestsLaunchArgs(launchParams));

            this._addWorker(autoTestersType, autotestsWorker);
            autotestsWorker.on('exit', () => {
                this._cancelWorkForRequester(requester, autoTestersType, autotestsWorker);

                return resolve(workersStrings.autotestsExecuted);
            });
            autotestsWorker.on('error', (err) => {
                this._cancelWorkForRequester(requester, autoTestersType, autotestsWorker);

                throw new Error(`${workersStrings.autotestsFailed} Error: ${err}`);
            });
        });
    }

    /**
     * @private
     * Checks if there's space for worker to run.
     * @returns {boolean}
     */
    _isThereSpaceForAnotherWorker() {
        let workersAmount = 0;

        for (const workersKey in this._workers) {
            workersAmount += this._workers[workersKey].size;
        }

        return workersAmount < this._allowedWorkersAmount;
    }

    /**
     * @private
     * Cancels worker's execution and removes it from workers map.
     * @param {string} requester - identifier of user that requested worker's execution.
     * @param {string} workersType - type of the worker to execute.
     * @param {ChildProcess} worker - started worker.
     * @returns {void}
     */
    _cancelWorkForRequester(requester, workersType, worker) {
        this._removeWorker(workersType, worker);
        this._requesters.delete(requester);
    }

    _addWorker(workersType, worker) {
        this._workers[workersType].set(worker.pid, worker);
    }

    _removeWorker(workersType, worker) {
        this._workers[workersType].delete(worker.pid);
    }
}

module.exports = WorkersManager;
