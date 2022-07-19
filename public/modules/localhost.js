/**
 * This is a namespace that contains documentation elements belonging to the React Localhost
 * domain.
 *
 * @namespace  ReactLocalhost
 */

const path = require('path'),
    isDev = require('electron-is-dev'),
    fs = require('fs'),
    realPath = path.join(__dirname, '../../'),
    reactProdMode = true;

/**
 * Create isElectronOn file content.
 * @typedef {function}
 * @memberOf ReactLocalhost
 * @param {string} stt - Electron mode statement.
 * @returns {void}
 */

exports.electronStt = (stt) => {

    if (isDev && reactProdMode === false) {

        if (stt === 'on') {

            fs.writeFileSync(
                path.join(__dirname, '../isElectronOn'),
                JSON.stringify({
                    'path': realPath.substring(0, realPath.length - 1),
                    'stt': 'online',
                    'name': process.env.APPNAME
                }, null, 2)
            );

        } else if (stt === 'off') {

            fs.writeFileSync(
                path.join(__dirname, '../isElectronOn'),
                JSON.stringify({
                    'path': realPath.substring(0, realPath.length - 1),
                    'stt': 'offline',
                    'name': process.env.APPNAME
                }, null, 2)
            );
        }
    }
}

