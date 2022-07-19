/**
 * This is a namespace that contains documentation elements belonging to the Electron Ipc Calls
 * domain.
 *
 * @namespace IpcCalls
 */

//===========================================================================
//===========================================================================

// Node Modules
const { app, dialog  } = require('electron'),
    ipc = require('electron').ipcMain,
    axios = require('axios')

// Custom Modules
const { database } = require('./database'),
    { buildWindow, windowDataProvider } = require('./providers'),
    { notificate } = require('./notifications'),
    { fileDrag, save, openNative, importXLS, getMarkdownFiles, getCustomerModels, templates } = require('./filesManager'),
    cloudToken = process.env.CLOUD_TOKEN,
    { ptyWrite, ptyKill, ptyEvent } = require('./pty-xterm'),
    { getDevices, getDicomDevices } = require('./mounted_devices'),
    { getRole, getOldFiles } = require('./database'),
    { prepareFaces } = require('./cardPrinter'),
    { createCard, setStopPropagator, manageCardsToUpdate, importDataFromDevice } = require('./filesManager'),
    { logger } = require('./logger');

// Igniters.
let isConnected = false;

//===========================================================================
//===========================================================================

/**
 * Load IPC Emitters on App ready.
 * @typedef {function}
 * @memberOf IpcCalls
 * @returns {void}
 */

exports.ipcsBeforeLoad = () => {

// On DB call
    ipc.on('invokeActionDB', function (event, array) {
        database(array, function (mess) {
            event.sender.send('actionReply', mess);
        });
    });

// On App close
    ipc.on('invokeActionCloseApp', function (event) {
        app.quit();
    });

// On App Restart
    ipc.on('invokeActionRestartApp', function (event) {
        app.relaunch();
        app.exit(0);
    });

//  Connexion Statement
    ipc.on('online-status', function (event, status) {

        event.sender.send('actionReplyOnline', status);
    });

//  Notifications
    ipc.on('notifications', function (event, data) {

        notificate(data, function (response) {

            event.sender.send('replyNotifications', response);
        });
    });

    ipc.on('accessCloud', function (event, data) {
        const options = {
            method: 'post',
            url: 'https://api.octeus.fr',
            data: {
                'module': data.module,
                'lang': 'fr',
                'api': 'OcteusApis',
                'token': cloudToken,
                'data': JSON.stringify(data.data)
            },
            transformRequest: [(data, headers) => {
                const serializedData = []
                for (const k in data) {
                    if (data[k]) {
                        serializedData.push(`${k}=${encodeURIComponent(data[k])}`)
                    }
                }
                return serializedData.join('&')
            }]
        };
        axios(options).then(function (response) {
            event.sender.send('actionReplyAccessCloud', {'response': response.data, 'status': 'success'});
        }).catch(function (error) {
            event.sender.send('actionReplyAccessCloud', {'response': error, 'status': 'failed'});
        });
    });

    // Resize Terminal
    ipc.on('terminal.resize', function (event, size) {
        event.sender.send('terminal.resize.reply', size);
    });

    ipc.on('update-user', function (event, pack) {

        const options = {
            method: 'post',
            url: 'https://api.octeus.fr',
            data: {
                'module': 'update-user',
                'lang': 'fr',
                'api': 'OcteusApis',
                'token': cloudToken,
                'data': JSON.stringify(pack.user)
            },
            transformRequest: [(data, headers) => {
                const serializedData = []
                for (const k in data) {
                    if (data[k]) {
                        serializedData.push(`${k}=${encodeURIComponent(data[k])}`)
                    }
                }
                return serializedData.join('&')
            }]
        };
        axios(options).then(function (response) {
            database(['user-update', pack], function (mess) {
                //console.log(mess)
                event.sender.send('update-user.reply', response.data);
            });
        }).catch(function (error) {
            event.sender.send('update-user.reply', {error: true, mess: 'Something went wrong....'});
        });
    });
};

/**
 * Load IPC Emitters on Main content ready to show.
 * @typedef {function}
 * @memberOf IpcCalls
 * @returns {void}
 */

exports.ipcAfterLoad = () => {

    //ptyEvent('data');

    /*ipc.on("terminal.keystroke", (event, data) => {
        ptyWrite(data);
    });*/

    //  Activate terminal
    ipc.on('activeTerminal', function (event) {
        event.sender.send('renderTerminal', true);
    });

    // On droping files
    ipc.on('fileDrag', function (event, files) {

        let resume = fileDrag(files),
            goods = [];
        if (resume.length > 0) {
            event.sender.send('fileDrag.reply', resume);
            for (let i = 0; i < resume.length; i++) {
                let file = resume[i];
                if (file.path !== null) {
                    goods.push(file.path);
                }
            }
        }

        openGoods(goods);
        function openGoods(files) {

            if (files.length > 0) {

                openNative(files[0], function(data){

                    const remoteWin = require('electron').BrowserWindow.getFocusedWindow()
                    remoteWin.webContents.send('openFile', { 'path': files[0], 'data': data });
                    files.shift();
                    openGoods(files);
                });

            } else {

                setTimeout(function(){
                    const remoteWin = require('electron').BrowserWindow.getFocusedWindow()
                    remoteWin.webContents.send('LoadedFile');
                }, 2000);
            }
        }
    });

    ipc.on('invokeSettings', function (event, data) {
        const remoteWin = require('electron').BrowserWindow.getFocusedWindow()
        remoteWin.webContents.send('invokeSettings.reply', data);
    });

    ipc.on('checkForUpdates', function (event) {
        const remoteWin = require('electron').BrowserWindow.getFocusedWindow()
        remoteWin.webContents.send('checkForUpdates.reply');
    });

    ipc.on('devices', function(event){
        getDevices((devices) => {
            const remoteWin = require('electron').BrowserWindow.getFocusedWindow()
            remoteWin.webContents.send('devices.reply', devices);
        });
    });

    ipc.on('getRole', function (event, data) {
        const remoteWin = require('electron').BrowserWindow.getFocusedWindow()
        remoteWin.webContents.send('getRole.reply', getRole(data));
    });

    ipc.on('invokeActionDBWrite', function (event, array) {
        database(array, function (mess) {
            event.sender.send('actionReplyDBWrite', mess);
        });
    });

    ipc.on('getMardownFiles', function (event) {
        event.sender.send('getMardownFiles.reply', getMarkdownFiles());
    });

    ipc.on('send-mail', function (event, data) {
        const options = {
            method: 'post',
            url: 'https://api.octeus.fr',
            data: {
                'module': 'mail-sender',
                'lang': 'fr',
                'api': 'OcteusApis',
                'token': cloudToken,
                'data': JSON.stringify(data)
            },
            transformRequest: [(data, headers) => {
                const serializedData = []
                for (const k in data) {
                    if (data[k]) {
                        serializedData.push(`${k}=${encodeURIComponent(data[k])}`)
                    }
                }
                return serializedData.join('&')
            }]
        };
        axios(options).then(function (response) {
            event.sender.send('send-mail.reply', response.data);
        }).catch(function (error) {
            event.sender.send('send-mail.reply', {error: true, mess: 'Something went wrong...'});
        });
    });

    ipc.on('getSFTPContent', function (event, data) {
        const options = {
            method: 'post',
            url: 'https://api.octeus.fr',
            data: {
                'module': 'ftp',
                'lang': 'fr',
                'api': 'OcteusApis',
                'token': cloudToken,
                'data': JSON.stringify(data)
            },
            transformRequest: [(data, headers) => {
                const serializedData = []
                for (const k in data) {
                    if (data[k]) {
                        serializedData.push(`${k}=${encodeURIComponent(data[k])}`)
                    }
                }
                return serializedData.join('&')
            }]
        };
        axios(options).then(function (response) {
            if (data.mode === 'get') {
                event.sender.send('getSFTPContent.reply', response.data);
            } else if (data.mode === 'sel') {
                const remoteWin = require('electron').BrowserWindow.getFocusedWindow()
                remoteWin.webContents.send('setNewWindow', {type: 'file', data: response.data.data});
            }
        }).catch(function (error) {
            logger(error, true)
        });
    });

    ipc.on('getTable', function (event, data) {
        const options = {
            method: 'post',
            url: 'https://api.octeus.fr',
            data: {
                'module': 'all-tables',
                'lang': 'fr',
                'api': 'OcteusApis',
                'token': cloudToken,
                'data': JSON.stringify(data)
            },
            transformRequest: [(data, headers) => {
                const serializedData = []
                for (const k in data) {
                    if (data[k]) {
                        serializedData.push(`${k}=${encodeURIComponent(data[k])}`)
                    }
                }
                return serializedData.join('&')
            }]
        };
        axios(options).then(function (response) {
            if (data === 'all') {
                event.sender.send('getAllTables.reply', response.data);
            } else {
                const remoteWin = require('electron').BrowserWindow.getFocusedWindow()
                remoteWin.webContents.send('setNewWindow', {type: 'db', data: response.data.data});
            }
        }).catch(function (error) {
            logger(error, true)
        });
    });

    ipc.on('getCustomerModels', function (event) {
        event.sender.send('getCustomerModels.reply', getCustomerModels());
    });

    ipc.on('setPacking', function (event, data) {
        const remoteWin = require('electron').BrowserWindow.getFocusedWindow()
        remoteWin.webContents.send('setNewWindow', {type: 'pack', data: data});
    });

    ipc.on('getOldFiles', function (event) {
        getOldFiles((files) => {
            event.sender.send('getOldFiles.reply', files);
        });
    });

    ipc.on('getFormFileContent', function (event, data) {
        const remoteWin = require('electron').BrowserWindow.getFocusedWindow()
        remoteWin.webContents.send('setNewWindow', {type: 'form', data: data});
    });

    ipc.on('getPrintFileContent', function (event, data) {
        const remoteWin = require('electron').BrowserWindow.getFocusedWindow()
        remoteWin.webContents.send('setNewWindow', {type: 'print', data: data});
    });

    ipc.on('saveTemplateFace', function (event, data) {
        prepareFaces(data.fullname, data.face, data.svg, data.pathTo);
    });

    ipc.on('checkDICOM', function (event, path) {
        getDicomDevices(path, (device) => {
            const remoteWin = require('electron').BrowserWindow.getFocusedWindow()
            remoteWin.webContents.send('checkDICOM.reply', device);
        });
    });

    ipc.on('createCard', function(event, data){
        createCard(data)
    })

    ipc.on('stop.propagator', function(event){
        setStopPropagator()
    })

    ipc.on('new.project', function(event){
        const remoteWin = require('electron').BrowserWindow.getFocusedWindow()
        remoteWin.webContents.send('checkDICOM.reply');
    })

    ipc.on('checkDevicesToUpdate', function(event){
        manageCardsToUpdate()
    })

    ipc.on('importDataFromDevice', function(event, device){
        importDataFromDevice(device)
    })
}