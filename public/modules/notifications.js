/**
 * This is a namespace that contains documentation elements belonging to the Notifications
 * domain.
 *
 * @namespace  Notifications
 */

const nn = require('node-notifier'),
    path = require('path'),
    isWindows = process.platform === "win32",
    { logger } = require('./logger');

/**
 * Prepare notifications that will be send to system.
 * @typedef {function}
 * @memberOf Notifications
 * @param {object} data - data to fill notification fields.
 * @returns {void}
 */

exports.notificate = (data, callback) => {

    let notifier = {
        withFallback: true
    }

    let options = {
        title: (process.platform === 'darwin') ? 'OCTEUS DataCommander' : data.title,
        subtitle: (data.subtitle) ? data.subtitle : data.title,
        message: data.message,
        appID: 'OCTEUS DataCommander',
        sound: isWindows, // Case Sensitive string for location of sound file, or use one of macOS' native sounds
        // (see below)
        icon: path.join(__dirname, '../assets/media/img/logo.png'), // Absolute Path to Triggering Icon
        contentImage: (isWindows) ? '' : path.join(__dirname, '../assets/media/img/favicon.png'), // Absolute Path to Attached Image (Content Image)
        //open: undefined, // URL to open on Click
        wait: true, // Wait for User Action against Notification or times out. Same as timeout = 5 seconds

        // New in latest version. See `example/macInput.js` for usage
        timeout: 8, // Takes precedence over wait if both are defined.
        //closeLabel: 'CLOSE', // String. Label for cancel button
        //actions: ['OK', 'CANCEL'], // String | Array<String>. Action label or list of labels in case of dropdown
        //dropdownLabel: undefined, // String. Label to be used if multiple actions
        //reply: true // Boolean. If notification should take input. Value passed as third argument in callback
        // and event emitter.
    };

    if (isWindows) {

        new nn.WindowsToaster(notifier).notify(options,
            function (err, response, metadata) {
                callback(
                    parseResponse(data.func, err, response, metadata)
                );
            }
        );

    } else if (process.platform === 'linux') {

        new nn.NotifySend(notifier).notify(options,
            function (err, response, metadata) {
                callback(
                    parseResponse(data.func, err, response, metadata)
                );
            }
        );

    } else {

        new nn.NotificationCenter(notifier).notify(options,
            function (err, response, metadata) {
                callback(
                    parseResponse(data.func, err, response, metadata)
                );
            }
        );
    }
};

function parseResponse(func, err, response, metadata) {

    if (err === null) {

        if (response === 'activate') {

            logger('Notification "' + func + '" has been sent and activated.');

            return {
                'stt': true,
                'motif': func,
                'err': null,
                'validate': metadata.activationAt
            }

        } else {

            logger('Notification "' + func + '" has been sent but not activated.');

            return {
                'stt': false,
                'motif': func,
                'err': null,
                'validate': null
            }
        }

    } else {

        logger('notification "' + func + '" cannot be sent...', err);

        return {
            'stt': null,
            'motif': func,
            'err': err,
            'validate': null
        };
    }
}