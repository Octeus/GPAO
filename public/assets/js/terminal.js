/*
========================================================
========================= Xterm ========================
========================================================
 */

const { Terminal } = require('xterm');
const { WebLinksAddon } = require('xterm-addon-web-links');
const { SearchAddon } = require('xterm-addon-search');

const ipcTerm = require('electron').ipcRenderer;
const isWindows = process.platform === "win32";

let termColWidth = 7.2,
    termRowHeight = 14,
    finalCols,
    finalRows;

ipcTerm.on('renderTerminal', function(event){
    xTermBuilder(1);
});

/**
 * Terminals initialisation.
 * @typedef {function}
 * @memberOf MainUtils
 * @param {number} id - Last numeric character from HTMLElement.
 * @returns {void}
 */

function xTermBuilder(id) {

    let parent = document.querySelector('.terminals-container'),
        xterm = document.querySelector('#terminal-' + id +' .xterm-container'),
        cols = Math.floor(parent.offsetWidth / termColWidth) - 5,
        rows = Math.floor(parent.offsetHeight / termRowHeight) - 1;

    ipcTerm.send('resizePTY', {'rows': rows, 'cols': cols});

    if (xterm.innerHTML.length === 0) {

        let term = new Terminal({
            fontFamily: `'Fira Mono', monospace`,
            fontSize: 12,
            fontWeight: 100,
            rendererType: 'dom',
            allowTransparency: true,
            cols: cols,
            rows: rows,
            scrollOnKeypress: true
        });

        term.setOption('theme', {
            foreground: '#ccc',
            cursor: 'darkgoldenrod'
        });

        const webLinksAddon = new WebLinksAddon();
        term.loadAddon(webLinksAddon);
        const searchAddon = new SearchAddon();
        term.loadAddon(searchAddon);

        term.open(xterm, true);

        if (term._initialized) {
            return;
        }

        term._initialized = true;

        ipcTerm.on('terminal.resize.reply', function (event, size) {

            finalCols = size.cols;
            finalRows = size.rows;
            term.resize(finalCols, finalRows);
            ipcTerm.send('resizePTY', size);
        });

        ipcTerm.send('terminal.keystroke', '');

        ipcTerm.on("terminal.incomingData", (event, data) => {
            term.write(data);
        });

        term.onData(e => {
            ipcTerm.send("terminal.keystroke", e);
        });
    }
}