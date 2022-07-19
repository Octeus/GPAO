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
    fs = require('fs');

// Custom Modules
const { buildWindow, windowDataProvider } = require('./modules/providers'),
    { ipcBeforeLoad, ipcAfterLoad } = require('./modules/ipcCalls'),
    { cypher } = require('./modules/volumes'),
    { logsCleaner } = require('./modules/filesManager'),
    { setWindow } = require('./modules/logger');

//===========================================================================
//===========================================================================

// Ignites
let win, splash, conn, newP;
ipcBeforeLoad();

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

     /*-----Splash Screen-----*/
    splash = buildWindow(
        windowDataProvider('splash')
    );
    setWindow(splash);

    ipc.on('invokeConnexionBox', function (event, from) {

        let preload = JSON.parse(fs.readFileSync(cypher.decrypted.preload, {encoding: 'utf8', flag: 'r'}));

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

    ipc.on('invokeNewProject', function (event, data) {

        let preload = JSON.parse(fs.readFileSync(cypher.decrypted.preload, {encoding: 'utf8', flag: 'r'}));

        /*-----New project Screen-----*/
        if (data === 'conn') {
            newP = buildWindow(
                windowDataProvider('newProject', preload), conn
            );
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

    ipc.on('invokeActionToMain', function (event, data) {

        logsCleaner();
        let preload = JSON.parse(fs.readFileSync(cypher.decrypted.preload, {encoding: 'utf8', flag: 'r'}));
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
    }
}