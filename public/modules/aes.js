/**
 * This is a namespace that contains documentation elements belonging to the AES
 * domain.
 *
 * @namespace  AES
 */

const folderEncrypt = require('folder-encrypt');
const explorer = require('fs');
const key = '14189dc35ae35e75ff31d7502e245cd9bc7803838fbfd5c773cdcd79b8a28bbd';
const { logger } = require('./logger');

/**
 * Encrypt files and launch callback() if callback != false and remove file.json if remove is true
 * @typedef {function}
 * @memberOf AES
 * @param {string} file - path/to/file.
 * @param {string} enc - path/to/encrypted-file.
 * @param {function} callback - Callback().
 * @param {boolean} remove - Remove original file if set on true
 * @param {boolean} files - Deals with files opréations
 * @example
 * encrypt(file.json, .encryptedFile, functio(){
 *     // Some code...
 * }, true);
 * @returns {void}
 */

exports.encrypt = (file, enc, callback = false, remove = false, files = false) => {

    folderEncrypt.encrypt({
        password: key,
        input: file,
        output: enc
    }).then(() => {
        if (callback !== false) {
            callback();
        }
        if (remove) {
            deleteEntity(file);
        }
    }).catch((err) => {
        if (callback !== false && files !== false) {
            callback(err);
        }
        logger(err);
    });
}

/**
 * Decrypt files and launch callback() if callback != false and remove file.json if remove is true
 * @typedef {function}
 * @memberOf AES
 * @param {string} enc - path/to/encrypted-file.
 * @param {string} file - path/to/file.
 * @param {function} callback - Callback().
 * @param {boolean} remove - Remove encrypted file if set on true
 * @param {boolean} files - Deals with files opréations
 * @example
 * decrypt(.encryptedFile, file.json, function() {
 *     // Some code
 * });
 * @returns {void}
 */

exports.decrypt = (enc, file, callback = false, remove = false, files = false) => {

    folderEncrypt.decrypt({
        password: key,
        input: enc,
        output: file
    }).then(() => {
        if (callback !== false) {
            callback();
        }
        if (remove) {
            deleteEntity(enc);
        }
    }).catch((err) => {
        if (callback !== false && files !== false) {
            callback(err);
        }
        //logger('Decrypt error', err);
    });
}

/**
 * Delete a file
 * @typedef {function}
 * @memberOf AES
 * @param {string} file - path/to/file.
 * @example
 * deleteEntity('path/to/my/fileToDelete')
 * @returns {void}
 */

function deleteEntity(path) {

    if (explorer.existsSync(path) && explorer.lstatSync(path).isDirectory()) {

        let sep = (process.platform !== 'darwin') ? '\\' : '/';

        explorer.rmdir(path, { recursive: true }, (err) => {
            if (err) {
                logger('Delete directory error', err)
                return
            }
            logger(path.split(sep).pop() + ' has been deleted');
        });

    } else {

        explorer.unlink(path, (err) => {
            if (err) {
                logger('Delete file error', err)
                return
            }
            logger(path.split(sep).pop() + ' has been deleted');
        })
    }
}