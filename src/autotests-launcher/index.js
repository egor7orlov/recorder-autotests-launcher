const Launcher = require('./launcher');
const Logger = require('../logger');
const requester = process.argv[2] || process.env.REQUESTER || 'LOCAL';
const isSaveLogs = !!(+(process.argv.includes('--save-logs') || process.env.SAVE_LOGS || 0));
const isShowBrowser = !!(+(process.argv.includes('--show-browser') || process.env.SHOW_BROWSER || 1));
const logger = new Logger(requester, isSaveLogs);
const launcher = new Launcher(isShowBrowser, logger);

launcher.runAutotests();
