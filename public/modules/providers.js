/**
 * This is a namespace that contains documentation elements belonging to the Providers
 * domain.
 *
 * @namespace  Providers
 */

const { BrowserWindow } = require('electron'),
    path = require('path'),
    fs = require('fs'),
    Menu = require('electron').Menu,
    ipc = require('electron').ipcMain,
    { save, openNative, importXLS, openDialog } = require('./filesManager'),
    { cypher } = require('./volumes'),
    reactProdMode = true,
    isWindows = process.platform === "win32",
    mainIndex = (reactProdMode === false)
        ? `http://localhost:3000`
        : `file://${path.join(__dirname, '../../build/index.html')}`,
    splash = (reactProdMode === false)
        ? `file://${path.join(__dirname, '../views/splash.html')}`
        : `file://${path.join(__dirname, '../../build/views/splash.html')}`,
    connexion = (reactProdMode === false)
        ? `file://${path.join(__dirname, '../views/connexion.html')}`
        : `file://${path.join(__dirname, '../../build/views/connexion.html')}`,
    root = (theme, param) => {
        let final = {},
            rootFile = fs.readFileSync(path.join(__dirname, '../assets/css/root.css'), {encoding:'utf8', flag:'r'}),
            splitRootFile = rootFile.split('\n');

        for (let i = 0; i < splitRootFile.length; i++) {

            let line = splitRootFile[i].trim();
            if (!line.includes(':root') && !line.includes('}') && line.length > 0) {

                let split = line.split(':'),
                    key = split[0].trim().replaceAll('-', '_');
                final[key] = split[1].trim().replaceAll(';', '');
            }
        }
        return final['__' + theme + '_' + param];
    },
    { mainMenu, projectMenu } = require('./menus'),
    { getRole, getOldFiles } = require("./database");
let files;

getOldFiles( (olds) => {
    files = olds;
})

/**
 * Electron Window builder.
 * @typedef {function}
 * @memberOf Providers
 * @param {object} data - Json object for setting new window to build..
 * @param {object} prev - Optional. The previous window that must be closed after new one build.
 * @returns {object} - Returns the new window to show.
 */

exports.buildWindow = (data, prev = false, preload = false) => {

    let win = new BrowserWindow({
        name: data.name,
        titleBarStyle: data.titleBar,
        width: data.width,
        modal: data.modal,
        height: data.height,
        backgroundColor: data.bg,
        show: data.show,
        movable: data.movable,
        resizable: data.resizable,
        minimizable: data.minimizable,
        draggable: data.draggable,
        frame: data.frame,
        transparent: data.transparent,
        minWidth: data.minWidth,
        minHeight: data.minHeight,
        fullscreenable:data.fullscreen,
        webPreferences: {
            devTools: false,
            enableRemoteModule: data.remote,
            nodeIntegration: true,
            worldSafeExecuteJavaScript: true,
            contextIsolation: false,
            webSecurity: false,
            webviewTag: true
        }
    });

    /*if (data.odt === true) {
        win.webContents.openDevTools();
    }*/

    if (data.clickable === false) {
        win.setIgnoreMouseEvents(true);
    }

    if (data.menu === true) {

        const menu = (data.menuType === 'main')
            ? Menu.buildFromTemplate(mainMenu(win))
            : Menu.buildFromTemplate(projectMenu(win));
        Menu.setApplicationMenu(menu);
    }

    /*if (data.name === 'main') {

        win.webContents.on('before-input-event', (event, input) => {

            if (
                (input.control && input.key.toLowerCase() === 'q')
                || (input.command && input.key.toLowerCase() === 'q')
                || (input.control && input.key.toLowerCase() === 'w')
                || (input.command && input.key.toLowerCase() === 'w')
            ) {

                event.preventDefault();
                win.webContents.send('exitApp');
            }

            if (
                (input.control && input.key.toLowerCase() === 'r')
                || (input.command && input.key.toLowerCase() === 'r')
                || (input.control && input.shift && input.key.toLowerCase() === 'r')
                || (input.command && input.shift && input.key.toLowerCase() === 'r')
            ) {

                event.preventDefault();
            }
        })
    }*/

    win.loadURL(data.file);

    win.webContents.on('did-finish-load', () => {

        if (prev !== false) {

            if (!prev.isDestroyed()) {
                prev.close();
            }
        }

        win.show();
    });
    return win;
};

/**
 * Windows settings provider
 * @typedef {function}
 * @memberOf Providers
 * @param {string} module - Json object for setting new window to build..
 * @param {object} modal - Optional. Determine modal type settings.
 * @example
 * windowDataProvider('splash');
 * @returns {object} - Returns window settings.
 */

exports.windowDataProvider = (module, preload = false, modal = false) => {

    let mainScreen = require('electron').screen.getPrimaryDisplay();
    let dimensions = mainScreen.size;

    let startClasses = preload.theme;
    if (preload.accessibility === true) {
        startClasses += ' accessMode';
    }

    if (module === 'splash') {

        let json = JSON.stringify({view: module, modal: null, pathToMedia: cypher, start: startClasses});

        return {
            'name': 'splash',
            'file': splash + `?data=${json}`,
            'height': 400,
            'width': 600,
            'minWidth': 600,
            'minHeight': 400,
            'modal': false,
            'show': false,
            'frame': false,
            'movable': false,
            'bg': '#fff',
            'resizable': false,
            'minimizable': false,
            'draggable': false,
            'transparent': true,
            'fullscreen': false,
            'odt': false,
            'remote': true,
            'titleBar': (process.platform === 'darwin') ? 'visible' : 'hidden',
            'menu': false,
            'clickable': true
        };

    } else if (module === 'connexion') {

        let json = JSON.stringify({view: module, modal: null, pathToMedia: cypher, start: startClasses});

        return {
            'name': 'connexion',
            'file': connexion + `?data=${json}`,
            'height': 300,
            'width': 500,
            'minWidth': 500,
            'minHeight': 300,
            'modal': false,
            'show': false,
            'frame': false,
            'movable': false,
            'bg': root(preload.theme, 'theme_bg_primary'),
            'resizable': false,
            'minimizable': false,
            'draggable': false,
            'transparent': true,
            'fullscreen': false,
            'odt': false,
            'remote': true,
            'titleBar': (process.platform === 'darwin') ? 'visible' : 'hidden',
            'menu': false,
            'clickable': true
        };

    } else if (module === 'newProject') {

        let json = JSON.stringify({view: module, modal: null, pathToMedia: cypher, start: startClasses, action: 'none'});

        return {
            'name': 'newProject',
            'file': mainIndex + `?data=${json}`,
            /*'height': (getRole(['octeus']) === true && files.length > 0) ? 500 : 250,*/
            'height': 250,
            'width': 800,
            'minWidth': 800,
            /*'minHeight': (getRole(['octeus']) === true && files.length > 0) ? 500 : 250,*/
            'minHeight': 250,
            'modal': false,
            'show': false,
            'movable': false,
            'bg': root(preload.theme, 'theme_bg_primary'),
            'frame': (!isWindows),
            'resizable': false,
            'minimizable': false,
            'draggable': false,
            'transparent': (isWindows),
            'fullscreen': false,
            'odt': false,
            'remote': true,
            'titleBar': 'visible',
            'menu': true,
            'clickable': true,
            'menuType': module
        };

    } else if (module === 'main') {

        let json = JSON.stringify({view: module, modal: null, pathToMedia: cypher, start: startClasses, action: preload.action});

        return {
            'name': 'main',
            'file': mainIndex + `?data=${json}`,
            'height': dimensions.height,
            'width': dimensions.width,
            'minWidth': 800,
            'minHeight': 600,
            'modal': false,
            'show': false,
            'movable': true,
            'bg': root(preload.theme, 'theme_bg_primary'),
            'frame': (!isWindows),
            'resizable': true,
            'minimizable': true,
            'draggable': true,
            'transparent': (isWindows),
            'fullscreen': true,
            'odt': false,
            'remote': true,
            'titleBar': 'visible',
            'menu': true,
            'clickable': true,
            'menuType': module
        };
    }
};