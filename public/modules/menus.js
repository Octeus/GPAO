/**
 * This is a namespace that contains documentation elements belonging to the Providers
 * domain.
 *
 * @namespace  Menus
 */

const isMac = process.platform === 'darwin',
    { app, BrowserWindow, dialog, shell} = require('electron'),
    ipc = require('electron').ipcMain,
    { getRole } = require('./database'),
    { openDialog } = require('./filesManager');

/**
 * Create Application Menu
 * @constant
 * @param {string} win - Main window
 * @memberOf Menus
 * @returns {object}
 */

exports.mainMenu = (win) => {

    return [

        // { role: 'appMenu' }
        ...(isMac ? [{
            label: app.name,
            submenu: [
                {role: 'about'},
                /*{
                    label: 'Check for updates',
                    accelerator: 'CommandOrControl+Alt+U',
                    click: () => {
                        win.webContents.send('invokeSettings.reply', 'settings');
                    }
                },*/
                {type: 'separator'},
                {
                    label: 'Settings',
                    accelerator: 'CommandOrControl+Shift+P',
                    click: () => {
                        win.webContents.send('checkForUpdates.reply');
                    }
                },
                {type: 'separator'},
                {role: 'services'},
                {type: 'separator'},
                {role: 'hide'},
                {role: 'hideothers'},
                {role: 'unhide'},
                {type: 'separator'},
                {role: 'quit'}
            ]
        }] : []),
        // { role: 'fileMenu' }
        {
            label: 'File',
            submenu: [
                /*{
                    label: 'Open',
                    accelerator: 'CommandOrControl+O',
                    click: () => {
                        openDialog(win);
                    },
                    enabled: getRole(['octeus'])
                },
                {
                    label: 'Save',
                    accelerator: 'CommandOrControl+S',
                    click: () => {
                        win.webContents.send('fileOperations', 'save');
                        win.webContents.send('SaveFileReact');
                    },
                    enabled: getRole(['octeus'])
                },
                {
                    label: 'Save as...',
                    accelerator: 'CommandOrControl+Shift+S',
                    click: () => {
                        win.webContents.send('fileOperations', 'saveAs');
                    },
                    enabled: getRole(['octeus'])
                },*/
                {
                    label: 'New project',
                    accelerator: 'CommandOrControl+N',
                    click: () => {
                        win.webContents.send('newProject');
                    },
                    enabled: getRole(['octeus', 'operator'])
                },
                {type: 'separator'},
                {
                    label: 'Settings',
                    accelerator: 'CommandOrControl+Shift+P',
                    click: () => {
                        win.webContents.send('invokeSettings.reply', 'settings');
                    },
                },
                {type: 'separator'},
                {
                    label: 'Logout',
                    accelerator: 'CommandOrControl+L',
                    click: () => {
                        win.webContents.send('invokeConnexionBox.fromMain');
                    }
                },
                {
                    label: 'Exit',
                    accelerator: 'CommandOrControl+Q',
                    click: () => {
                        app.quit()
                    }
                },
                /*{
                    label: 'Check for updates',
                    accelerator: 'CommandOrControl+Alt+U',
                    click: () => {
                        win.webContents.send('checkForUpdates.reply');
                    }
                }*/
            ]
        },
        // { role: 'editMenu' }
        {
            label: 'Edit',
            submenu: [
                {role: 'undo'},
                {role: 'redo'},
                {type: 'separator'},
                {role: 'cut'},
                {role: 'copy'},
                {role: 'paste'},
                ...(isMac ? [
                    {role: 'selectAll'},
                    {type: 'separator'},
                    {
                        label: 'Speech',
                        submenu: [
                            {role: 'startSpeaking'},
                            {role: 'stopSpeaking'}
                        ]
                    }
                ] : [
                    {role: 'selectAll'}
                ]),
                /*{role: 'reload'},
                {role: 'forceReload'},
                {role: 'toggleDevTools'},*/
            ]
        },
        {
            label: 'Card',
            submenu: [
                {
                    label: 'Devices',
                    accelerator: 'CommandOrControl+Alt+D',
                    click: () => {
                        win.webContents.send('interactWithFront', 'Mounted devices')
                    },
                },
                {
                    label: 'TODO List',
                    accelerator: 'CommandOrControl+Alt+T',
                    click: () => {
                        win.webContents.send('interactWithFront', 'TODO List')
                    },
                    enabled: getRole(['octeus', 'operator']),
                },
                {type: 'separator'},
                {
                    label: 'Models',
                    accelerator: 'CommandOrControl+Alt+P',
                    click: () => {
                        win.webContents.send('interactWithFront', 'Data models')
                    },
                    enabled: getRole(['octeus', 'operator']),
                },
                {
                    label: 'Customer',
                    accelerator: 'CommandOrControl+Alt+C',
                    click: () => {
                        win.webContents.send('interactWithFront', 'Customer informations')
                    },
                    enabled: getRole(['octeus', 'operator']),
                },
            ]
        },
        {
            label: 'Design',
            submenu: [
                {
                    label: 'New print',
                    accelerator: 'CommandOrControl+Alt+Shift+D',
                    click: () => {
                        win.webContents.send('interactWithFront', 'NewPrint')
                    }
                },
                {
                    label: 'Templates',
                    accelerator: 'CommandOrControl+Alt+Shift+B',
                    click: () => {
                        win.webContents.send('interactWithFront', 'Design patterns and files')
                    },
                    enabled: getRole(['octeus']),
                },
                {type: 'separator'},
                {
                    label: 'Printers...',
                    accelerator: 'CommandOrControl+Alt+Shift+P',
                    click: () => {
                        win.webContents.send('interactWithFront', 'Printers')
                    }
                }
            ], enabled: getRole(['octeus', 'design'])
        },
        {
            label: 'Production',
            submenu: [
                {
                    label: 'Implement data...',
                    accelerator: 'CommandOrControl+L',
                    click: () => {
                        win.webContents.send('interactWithFront', 'ImplementData')
                    }
                },
                {
                    label: 'Delivery',
                    accelerator: 'CommandOrControl+M',
                    click: () => {
                        win.webContents.send('interactWithFront', 'Delivery process')
                    },
                },
            ], enabled: getRole(['octeus', 'operator'])
        },
        {
            label: 'Data',
            submenu: [
                {
                    label: 'Refresh',
                    accelerator: 'CommandOrControl+Shift+G',
                    click: () => {
                        win.webContents.send('interactWithFront', 'Refresh')
                    }
                },
                {
                    label: 'Remote',
                    accelerator: 'CommandOrControl+Alt+R',
                    click: () => {
                        win.webContents.send('interactWithFront', 'Browse remote hosts')
                    },
                },
                {
                    label: 'DataBases',
                    accelerator: 'CommandOrControl+Alt+I',
                    click: () => {
                        win.webContents.send('interactWithFront', 'Browse database from project')
                    },
                },
                {type: 'separator'},
                {
                    label: 'Access to CRM',
                    accelerator: 'CommandOrControl+Alt+Y',
                    click: async () => {
                        const {shell} = require('electron')
                        await shell.openExternal('https://octeus.fr/admin')
                    }
                },

            ], enabled: getRole(['octeus'])
        },
        {
            label: 'Tools',
            submenu: [
                {
                    label: 'User account',
                    accelerator: 'CommandOrControl+Shift+R',
                    click: () => {
                        win.webContents.send('interactWithFront', 'User')
                    },
                },
                {type: 'separator'},
                {
                    label: 'Send mails',
                    accelerator: 'CommandOrControl+Shift+E',
                    click: () => {
                        win.webContents.send('interactWithFront', 'Emails')
                    },
                },
                {
                    label: 'Phone numbers',
                    accelerator: 'CommandOrControl+Shift+P',
                    click: () => {
                        win.webContents.send('interactWithFront', 'PhoneNumbers')
                    },
                },
                {
                    label: 'Statistics',
                    accelerator: 'CommandOrControl+Shift+Alt+J',
                    click: () => {
                        win.webContents.send('interactWithFront', 'Statistics')
                    },
                },
                {type: 'separator'},
                {
                    label: 'Search',
                    accelerator: 'CommandOrControl+Alt+Shift+O',
                    click: () => {
                        win.webContents.send('interactWithFront', 'Search')
                    },
                },
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'Logs...',
                    accelerator: 'CommandOrControl+Alt+Shift+U',
                    click: () => {
                        win.webContents.send('interactWithFront', 'Error logs list')
                    },
                },
                {
                    label: 'Wiki',
                    accelerator: 'CommandOrControl+Alt+Shift+1',
                    click: async () => {
                        const {shell} = require('electron')
                        await shell.openExternal('https://octeus.fr/datacommander/wiki')
                    }
                },
                {type: 'separator'},
                {
                    label: 'About Octeus',
                    click: async () => {
                        const {shell} = require('electron')
                        await shell.openExternal('https://octeus.fr')
                    }
                },
            ]
        }
    ];
}

/**
 * Create New project Menu
 * @constant
 * @param {string} win - New project window
 * @memberOf Menus
 * @returns {object}
 */

exports.projectMenu = (win) => {

    return [

        // { role: 'appMenu' }
        ...(isMac ? [{
            label: app.name,
            submenu: [
                {role: 'about'},
                {
                    label: 'Check for updates',
                    accelerator: 'CommandOrControl+Alt+U',
                    click: () => {
                        win.webContents.send('invokeSettings.reply', 'settings');
                    }
                },
                {type: 'separator'},
                {
                    label: 'Settings',
                    accelerator: 'CommandOrControl+Shift+P',
                    click: () => {
                        win.webContents.send('checkForUpdates.reply');
                    }
                },
                {type: 'separator'},
                {role: 'services'},
                {type: 'separator'},
                {role: 'hide'},
                {role: 'hideothers'},
                {role: 'unhide'},
                {type: 'separator'},
                {role: 'quit'}
            ]
        }] : []),
        // { role: 'fileMenu' }
        {
            label: 'File',
            submenu: [
                {
                    label: 'Open',
                    accelerator: 'CommandOrControl+O',
                    click: () => {
                        openDialog(win);
                    },
                    enabled: getRole(['octeus'])
                },
                {
                    label: 'New project',
                    accelerator: 'CommandOrControl+N',
                    click: () => {
                        win.webContents.send('newProject');
                    },
                    enabled: getRole(['octeus', 'operator'])
                },
                {
                    label: 'New print',
                    accelerator: 'CommandOrControl+Alt+Shift+D',
                    click: () => {
                        win.webContents.send('interactWithFront', 'NewPrint')
                    },
                    enabled: getRole(['octeus', 'design'])
                },
                {type: 'separator'},
                {
                    label: 'Exit',
                    accelerator: 'CommandOrControl+Q',
                    click: () => {
                        app.quit()
                    }
                },
                {
                    label: 'Logout',
                    accelerator: 'CommandOrControl+L',
                    click: () => {
                        win.webContents.send('invokeConnexionBox.fromNew');
                    }
                },
                {
                    label: 'Check for updates',
                    accelerator: 'CommandOrControl+Alt+U',
                    click: () => {
                        win.webContents.send('checkForUpdates.reply');
                    }
                },
                /*{role: 'reload'},
                {role: 'forceReload'},
                {role: 'toggleDevTools'},*/
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'Access to CRM',
                    accelerator: 'CommandOrControl+Alt+Y',
                    click: async () => {
                        const {shell} = require('electron')
                        await shell.openExternal('https://octeus.fr/admin')
                    },
                    enabled: getRole(['octeus'])
                },
                {
                    label: 'Wiki',
                    accelerator: 'CommandOrControl+Alt+Shift+1',
                    click: () => {
                        win.webContents.send('interactWithFront', 'Wiki')
                    }
                },
                {type: 'separator'},
                {
                    label: 'About Octeus',
                    click: async () => {
                        const {shell} = require('electron')
                        await shell.openExternal('https://octeus.fr')
                    }
                },
            ]
        }
    ];
}