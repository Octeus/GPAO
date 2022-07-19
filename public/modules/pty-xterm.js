/**
 * This is a namespace that contains documentation elements belonging to the Electron Pty-Xterm
 * domain.
 *
 * @namespace  PtyXterm
 */


const isWindows = process.platform === "win32",
    pty = require("node-pty"),
    ipc = require('electron').ipcMain,
    shell = isWindows ? "cmd.exe" : "bash",
    isDev = require('electron-is-dev'),
    path = require('path'),
    ptyProcess = pty.spawn(shell, [], {
        name: "xterm-256color",
        cols: 100,
        rows: 20,
        cwd: (isDev) ? path.join(__dirname, '../../../') : __dirname,
        env: (isWindows) ? process.env : { PS1: '\\u@\\h $(pwd) % ' }
    }),
    win = require('electron').BrowserWindow;

let firstCommand = false,
    cols,
    rows;

ipc.on('resizePTY', function(event, data){
    cols = data.cols;
    rows = data.rows;
});

/**
 * Write data in Pty terminal.
 * @typedef {function}
 * @memberOf PtyXterm
 * @param {object} data - Data from Xterm.js.
 * @returns {void}
 */

exports.ptyWrite = (data) => {

    ptyProcess.resize(cols, rows);
    ptyProcess.write(data);
}

/**
 * Kill Pty process.
 * @typedef {function}
 * @memberOf PtyXterm
 * @returns {void}
 */

exports.ptyKill = () => {

    ptyProcess.kill();
    firstCommand = false;
}

/**
 * Listen Pty events.
 * @typedef {function}
 * @memberOf PtyXterm
 * @param {string} mode - Event type.
 * @returns {void}
 */

exports.ptyEvent = (mode) => {

    ptyProcess.on(mode, function (data) {

        win.getFocusedWindow().webContents.send("terminal.incomingData", data);
    });
}