/**
 * This is a namespace that contains documentation elements belonging to the MainProcess
 * domain.
 *
 * @namespace  MainProcess
 */

//===========================================================================
//===========================================================================

// Requires
require('dotenv').config();

// Node Modules
const { app } = require('electron'),
    ipc = require('electron').ipcMain,
    fs = require('fs'),
    isDev = require('electron-is-dev');

// Custom Modules
const { buildWindow, windowDataProvider } = require('./modules/providers'),
    //{ createSVGIndexHTML, createReactSVGComponent } = require('./modules/svgLister'),
    { electronStt } = require('./modules/localhost'),
    { ipcsBeforeLoad, ipcAfterLoad } = require('./modules/ipcCalls'),
    //{ qrCode, buildCard } = require('./modules/cardPrinter'),
    //{ ptyKill } = require('./modules/pty-xterm'),
    { cypher } = require('./modules/volumes'),
    { logsCleaner } = require('./modules/filesManager'),
    { setWindow } = require('./modules/logger');

//===========================================================================
//===========================================================================

// this should be placed at top of main.js to handle setup events quickly
if (handleSquirrelEvent(app)) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
}

// Igniters
let win, splash, conn, newP;
ipcsBeforeLoad();

// Preprocesses
app.commandLine.appendSwitch('--ignore-gpu-blacklist');
app.setAsDefaultProtocolClient("datacommander");

//===========================================================================
//===========================================================================

// Launch App
createApp();

/**
 * Create Electron Windows.
 * @typedef {function}
 * @memberOf MainProcess
 * @returns {void}
 */

function createWindow () {

    if (process.env.DECRYPT_ONCE === 'false' && process.env.ENCRYPT_ONCE === 'false') {

        /*-----Splash Screen-----*/
        splash = buildWindow(
            windowDataProvider('splash')
        );
        setWindow(splash);
        if (isDev) {
            electronStt('on');
        }

        // On create window
        ipc.on('invokeConnexionBox', function (event, from) {

            let preload = JSON.parse(fs.readFileSync( cypher.decrypted.preload, {encoding: 'utf8', flag: 'r'}));

            /*-----Connexion Screen-----*/
            if (from === 'splash') {
                conn = buildWindow(
                    windowDataProvider('connexion', preload), splash
                );
            } else if (from === 'main') {
                conn = buildWindow(
                    windowDataProvider('connexion', preload), win
                );
            } else if (from === 'new') {
                conn = buildWindow(
                    windowDataProvider('connexion', preload), newP
                );
            }

            if (process.platform === 'darwin') {
                app.dock.show();
            }

            setWindow(conn);
        });

        // On new project
        ipc.on('invokeNewProject', function (event, data) {

            let preload = JSON.parse(fs.readFileSync( cypher.decrypted.preload, {encoding: 'utf8', flag: 'r'}));

            /*-----New project Screen-----*/
            if (data === 'conn') {
                if (process.env.SECURITY === 'active') {
                    newP = buildWindow(
                        windowDataProvider('newProject', preload), conn
                    );
                } else {
                    newP = buildWindow(
                        windowDataProvider('newProject', preload), splash
                    );
                }
            } else {
                newP = buildWindow(
                    windowDataProvider('newProject', preload), win
                );
            }

            if (process.platform === 'darwin') {
                app.dock.show();
            }

            setWindow(newP);
            ipcAfterLoad();
        });

        // On create window
        ipc.on('invokeActionToMain', function (event, data) {

            logsCleaner();
            let preload = JSON.parse(fs.readFileSync( cypher.decrypted.preload, {encoding: 'utf8', flag: 'r'}));
            preload.action = data;

            /*-----Main Screen-----*/
            win = buildWindow(
                windowDataProvider('main', preload), newP
            );
            win.maximize();

            if (process.platform === 'darwin') {
                app.dock.show();
            }

            win.on('focus', () => {
                win.webContents.send('focus', true);
            });

            win.on('blur', () => {
                win.webContents.send('focus', false);
            });

            setWindow(win);
            ipcAfterLoad();
        });
    }
}

/**
 * Create Electron Window.
 * @typedef {function}
 * @memberOf MainProcess
 * @returns {void}
 */

function createApp() {

    if (app) {

        app.on('window-all-closed', () => {
            if (process.platform === 'darwin') {
                app.dock.hide();
            }
            app.quit();
        });

        app.on('activate', () => {
            if (win === null) {
                createWindow();
                if (process.platform === 'darwin') {
                    app.dock.hide();
                }
            }
        });

        app.on('ready', () => {
            createWindow();
            if (process.platform === 'darwin') {
                app.dock.hide();
            }
        });

        app.on('before-quit', () => {
            //ptyKill();
            if (isDev) {
                electronStt('off');
            }
        });
    }
}

function handleSquirrelEvent(application) {
    if (process.argv.length === 1) {
        return false;
    }

    const ChildProcess = require('child_process');
    const path = require('path');

    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = function(command, args) {
        let spawnedProcess, error;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, {
                detached: true
            });
        } catch (error) {}

        return spawnedProcess;
    };

    const spawnUpdate = function(args) {
        return spawn(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            // Optionally do things such as:
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            //   explorer context menus

            // Install desktop and start menu shortcuts
            spawnUpdate(['--createShortcut', exeName]);

            setTimeout(application.quit, 1000);
            return true;

        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers

            // Remove desktop and start menu shortcuts
            spawnUpdate(['--removeShortcut', exeName]);

            setTimeout(application.quit, 1000);
            return true;

        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated

            application.quit();
            return true;
    }
};