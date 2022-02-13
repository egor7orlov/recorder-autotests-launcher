# Recorder Autotests Launcher
Template project to help you organize [Puppeteer](https://pptr.dev/) scripts exported from [Google Chrome Recorder](https://developer.chrome.com/docs/devtools/recorder/?utm_source=devtools) and launch them locally or on remote server.

***Preparation steps to use it:***
1. Create GitHub repo from this template (`Use this template` button).
2. Clone repository for local development (preferably via SSH).
3. Run `npm install`.
4. Save your [Puppeteer](https://pptr.dev/) scripts from [Google Chrome Recorder](https://developer.chrome.com/docs/devtools/recorder/?utm_source=devtools) tool into `src/autotests-launcher/raw-scripts` folder.
5. ***[ Important! ]*** If such folder is absent create it or run `npm prepare-scripts` — empty `raw-scripts` and `clean-scripts` folders will be created in `autotests-launcher` folder.
6. Run `npm launch-tests` to just run your [Puppeteer](https://pptr.dev/) scripts or `npm start-server` to be able to launch autotest via HTTP requests. 
7. ***[ Optional ]*** If you add `SAVE_LOGS=1` to your `.env` file you'll be able to check logs in `src/logger/logs` folder (logs files are rewritten after every execution).
