/**
 * This is a namespace that contains documentation elements belonging to the SplashUtils
 * domain.
 *
 * @namespace  SplashUtils
 */

const ipc = require('electron').ipcRenderer;
const dns2 = require("dns2");
let splashConnectedTimeOut, splashLoopCheckOnline = 1000;
let connected = false;
const version = '1.0.0';
const author = 'Octeus';
const security = 'active';


let get = JSON.parse(decodeURI(window.location.search.replace('?data=', '')));
document.body.dataset.view = get.view;
document.body.dataset.modal = get.modal;
document.body.dataset.path = encodeURI(JSON.stringify(get.pathToMedia));
document.querySelector('#version').innerHTML = 'v ' + version;
document.querySelector('#author').innerHTML = '&copy; ' + author;

setInterval(function() {
    isOnlineSplash();
}, splashLoopCheckOnline);

/**
 * Check if the application is web connected.
 * @typedef {function}
 * @memberOf SplashUtils
 * @returns {void}
 */

function isOnlineSplash() {

    splashConnectedTimeOut = setTimeout(function(){ splashConnectionStt('off', []); }, splashLoopCheckOnline);
    (async () => {
        const dns = new dns2({recursive: 'boolean'});
        const result = await dns.resolveA('google.com');
        splashConnectionStt('on', result.answers);
        clearTimeout(splashConnectedTimeOut);
    })();
}

/**
 * Tell to Main process to load data from API and update locals if connected. Or use locals as reference if not
 * connected.
 * @typedef {function}
 * @memberOf SplashUtils
 * @param {string} mode - If online or not.
 * @param {array} details - Array of connection states
 * @returns {void}
 */

function splashConnectionStt(mode, details) {

    ipc.once('actionReplyOnline', function (event, status) {

        let synchro = document.querySelector('#synchro-bar > div');

        if (synchro) {

            if (status.mode === 'on' && connected === false) {

                connected = true;
                synchro.style.width = 0 + '%';
                document.querySelector('#statement > span').innerHTML = 'Connected';
                document.querySelector('#statement > span').classList.remove('warning');
                document.querySelector('#statement > span').classList.add('info');

                ipc.once('actionReplyAccessCloud', function (event, data) {
                    synchro.style.width = 50 + '%';
                    updateDatabase(data.response, synchro);
                });
                ipc.send('accessCloud', {'module': 'access_cloud', 'data': {}});

            } else if (status.mode !== 'on') {

                if (connected === true) {

                    connected = false;
                }

                synchro.style.width = 50 + '%';

                getDataBase([], synchro);

                document.querySelector('#statement > span').innerHTML = 'Disconnected';
                document.querySelector('#statement > span').classList.remove('warning');
                document.querySelector('#statement > span').classList.add('danger');
            }
        }
    });
    ipc.send('online-status', { 'mode': mode, 'details': details });
}

/**
 * Verify all Database integrity before lauching the application.
 * @typedef {function}
 * @memberOf SplashUtils
 * @param {array} data - Array of tables.
 * @param {object} bar - HTML element progress bar
 * @returns {void}
 */

function getDataBase(data, bar) {

    let db = {
        'settings': 'settings',
        'admins': 'admins',
        'operational_centers': 'operational_centers',
        'prints': 'prints',
        'patients': 'patients'
    };

    ipc.once('actionReply', function (event, mess) {
        bar.style.width = 100 + '%';

        setTimeout(function(){
            document.querySelector('#statement > span').innerHTML = 'Check complete';
            document.querySelector('#statement > span').className = 'good';
        }, 1000);
        setTimeout(function(){
            if (security !== 'active') {
                ipc.send('invokeActionToMain');
            } else {
                ipc.send('invokeConnexionBox', 'splash');
            }
        }, 2000);
    });
    ipc.send('invokeActionDB', ['read', db]);
}

/**
 * Update all the database before lauching the application.
 * @typedef {function}
 * @memberOf SplashUtils
 * @param {array} data - Array of tables.
 * @param {object} bar - HTML element progress bar
 * @returns {void}
 */

function updateDatabase(data, bar) {

    ipc.once('actionReply', function (event, mess) {
        bar.style.width = 100 + '%';

        setTimeout(function(){
            document.querySelector('#statement > span').innerHTML = 'Update complete';
            document.querySelector('#statement > span').className = 'good';
        }, 1000);
        setTimeout(function(){
            if (security !== 'active') {
                ipc.send('invokeActionToMain');
            } else {
                ipc.send('invokeConnexionBox', 'splash');
            }
        }, 2000);
    });
    ipc.send('invokeActionDB', ['updateAll', data]);
}