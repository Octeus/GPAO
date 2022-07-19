/**
 * This is a namespace that contains documentation elements belonging to the Logger
 * domain.
 *
 * @namespace Logger
 */

const { cypher } = require('./volumes'),
    fs = require('fs'),
    path = require("path"),
    remote = require('electron').remote
    ipc = require('electron').ipcMain;

let win;

/**
 * Set win variable with current window value
 * @typedef {function}
 * @memberOf Logger
 * @param {string} win - The current Window
 * @returns {void}
 */

exports.setWindow = (current) => {
    win = current;
}

/**
 * Create Logs
 * @typedef {function}
 * @memberOf Logger
 * @param {string} mess - The message to insert in log
 * @param {string} error - Optional. Explicits trace if error occurred
 * @example
 * try {
        fs.writeFile(cypher.decrypted.db + sep + table + '.json', json, (err) => {
            if (err) {
                logger('An error occurred creating the file ' + err.message);
            }
            logger('The file ' + table + '.json has been successfully saved');
            return obj;
        });
    } catch (e) {
        logger('Parsing error:', e);
    }
 * @returns {void}
 */

exports.logger = (mess, error = false) => {

    let d = new Date(),
        year = d.getFullYear(),
        month = ('0' + (parseInt(d.getMonth()) + 1)).slice(-2),
        date = ('0' + d.getDate()).slice(-2),
        hour = ('0' + d.getHours()).slice(-2),
        min = ('0' + d.getMinutes()).slice(-2),
        seconds = ('0' + d.getSeconds()).slice(-2),
        full = '[' + date + '/' + month + '/' + year + ' at ' + hour + 'h ' + min + 'min ' + seconds + 's] - ',
        concat = full + mess,
        stackTrace = (error === false)
            ? ''
            : '\n\t#Trace : \n\t' + error,
        final = concat + stackTrace;

    CreateDir(final);
};

/**
 * Creating a Logs directory in the root project if not exists
 * @typedef {function}
 * @memberOf Logger
 * @param {string} log - The message to insert in log
 * @returns {void}
 */

function CreateDir(log) {

    if (fs.existsSync(cypher.decrypted.logs)) {
        CreatedLogFile(log);
    } else {
        fs.mkdir(cypher.decrypted.logs, function(err) {
            if (err) {
                console.log(err);
            } else {
                CreatedLogFile(log);
            }
        })
    }
}

/**
 * Write logs in the timestamped file
 * @typedef {function}
 * @memberOf Logger
 * @param {string} log - The message to insert in log
 * @returns {void}
 */

function CreatedLogFile(log) {

    let d = new Date(),
        year = d.getFullYear(),
        month = ('0' + (parseInt(d.getMonth())+1)).slice(-2),
        date = ('0' + d.getDate()).slice(-2),
        file = year + '-' + month + '-' + date + '_archive-logs.log',
        pathFinder = path.join(cypher.decrypted.logs, file);

    if (fs.existsSync(pathFinder)) {

        try {

            const data = fs.readFileSync(pathFinder, 'utf8');
            fs.writeFileSync(pathFinder, data + "\r" + log);

        } catch (err) {

            console.error(err)
        }
    } else {

        fs.writeFileSync(pathFinder, log);

    }

    let newData = fs.readFileSync(pathFinder, 'utf8'),
        split = newData.split('['),
        lines = [];

    for (let i = 0; i < split.length; i++) {
        if (i > 0) {
            let newLine = '[' + split[i];
            let type = (newLine.indexOf('Error') > -1) ? 'error' : 'good';
            lines.push({type: type, line: newLine});
        }
    }

    if (win) {
        win.webContents.send('logsList', lines);
    }
    console.log(log);
}