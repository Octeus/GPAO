const { cypher } = require('./volumes');

/**
 * Create CLI commands.
 * @typedef {function}
 * @memberOf MainProcess
 * @param {string} type - Determines which service the CLI is for.
 * @param {string} arg - Optional. Set arguments to CLI
 * @example
 * execCLI('someTypeString')
 * @returns {void}
 */

exports.execCLI = (type, arg = false) => {

    let route = cypher.decrypted.viewers,
        sep = (process.platform !== 'darwin') ? '\\' : '/';

    if (type === 'dicom') {

        // CLI
        if (process.platform === 'darwin') {

            run_script("open", ["-a", '"' + route + '/osirix/OsiriX.app" "' + arg + '"'], null);

            if (win && !win.isDestroyed()) {
                win.webContents.send('modalActionReply', true);
            }
            if (splash && !splash.isDestroyed()) {
                splash.webContents.send('modalActionReply', true);
            }
            if (login && !login.isDestroyed()) {
                login.webContents.send('modalActionReply', true);
            }
            if (terms && !terms.isDestroyed()) {
                terms.webContents.send('modalActionReply', true);
            }
            if (popup && !popup.isDestroyed()) {
                popup.webContents.send('modalActionReply', true);
            }

        } else if (process.platform === 'win32') {

            run_script('"' + route + '\\radiant\\RadiAntViewer.exe"', ['"' + arg + '"'], null);

            if (win && !win.isDestroyed()) {
                win.webContents.send('modalActionReply', true);
            }
            if (splash && !splash.isDestroyed()) {
                splash.webContents.send('modalActionReply', true);
            }
            if (login && !login.isDestroyed()) {
                login.webContents.send('modalActionReply', true);
            }
            if (terms && !terms.isDestroyed()) {
                terms.webContents.send('modalActionReply', true);
            }
            if (popup && !popup.isDestroyed()) {
                popup.webContents.send('modalActionReply', true);
            }

        }
    }

    if (type === 'avi') {

        // CLI
        if (process.platform === 'darwin') {

            run_script("open", ["-a", '"' + route + '/VLC-MAC/VLC.app" "' + arg + '"'], function () {

                if (win && !win.isDestroyed()) {
                    win.webContents.send('modalActionReply', true);
                }
                if (splash && !splash.isDestroyed()) {
                    splash.webContents.send('modalActionReply', true);
                }
                if (login && !login.isDestroyed()) {
                    login.webContents.send('modalActionReply', true);
                }
                if (terms && !terms.isDestroyed()) {
                    terms.webContents.send('modalActionReply', true);
                }
                if (popup && !popup.isDestroyed()) {
                    popup.webContents.send('modalActionReply', true);
                }
            });

        } else if (process.platform === 'win32') {

            run_script('"' + route + '\\VLC\\vlc.exe"', ['"' + arg + '"'], function () {

                if (win && !win.isDestroyed()) {
                    win.webContents.send('modalActionReply', true);
                }
                if (splash && !splash.isDestroyed()) {
                    splash.webContents.send('modalActionReply', true);
                }
                if (login && !login.isDestroyed()) {
                    login.webContents.send('modalActionReply', true);
                }
                if (terms && !terms.isDestroyed()) {
                    terms.webContents.send('modalActionReply', true);
                }
                if (popup && !popup.isDestroyed()) {
                    popup.webContents.send('modalActionReply', true);
                }
            });

        }
    }
}

/**
 * Run scripts in CLI.
 * @typedef {function}
 * @memberOf MainProcess
 * @param {string} command - Set the main command.
 * @param {array} args - Set some arguments.
 * @param {function} arg - Set callback if is a function type.
 * @example
 * run_script("open", ["-a", "TexEdit"], null)
 * @returns {void}
 */

exports.run_script = (command, args, callback) => {

    var child = spawn(command, args, {
        encoding: 'utf8',
        shell: true
    });
    //console.log(child);

    child.on('error', (error) => {
        dialog.showMessageBox({
            title: 'Title',
            type: 'warning',
            message: 'Error occured.\r\n' + error
        });
    });

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (data) => {

        data = data.toString();
        //console.log(data);
    });

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (data) => {

        //console.log(data);
    });

    child.on('close', (code) => {

        /*switch (code) {
            case 0:
                dialog.showMessageBox({
                    title: 'Title',
                    type: 'info',
                    message: 'End process.\r\n'
                });
                break;
        }*/
    });
    if (typeof callback === 'function')
        callback();
}