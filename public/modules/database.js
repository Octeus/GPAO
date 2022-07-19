/**
 * This is a namespace that contains documentation elements belonging to the Database
 * domain.
 *
 * @namespace Database
 */

const fs = require('fs');
const { app } = require('electron');
const { cypher } = require('./volumes');
const { logger } = require('./logger');

/**
 * Operations on the Resources and launch callback() in render process.
 * @typedef {function}
 * @memberOf Database
 * @param {array} array - Array with a minimum length of 2 and maximum length of 3. First index is the opération type
 * like "read"|"write"|"updateAll. Second index is the DB obj. And the last index is, for the "write" option, the
 * new DB obj to update single table.
 * @param {function} callback - Callback().
 * @example
 * database(['read', dbObj], function(mess){

    // Some code..
});
 * @returns {void}
 */

exports.database = (array, callback) => {

    let type = array[0],
        table = array[1],
        mess;

    if (type === 'read') {

        mess = {};
        for (const key in table) {
            mess[key] = getDB(table[key]);
        }

        logger('db read');

    } else if (type === 'user-update') {

        let obj = array[1];
        updateUser(obj);
        mess = obj;
        logger('db user and admins updated');

    } else if (type === 'write') {

        let obj = array[2];
        updateDB(table, obj);
        mess = [obj, table];
        logger('db updated');

    } else if (type === 'updateAll') {

        let obj = array[1];
        for (const objKey in obj) {
            if (objKey !== 'error' && obj.hasOwnProperty(objKey)) {
                updateDB(objKey, obj[objKey]);
            }
        }
        mess = obj;
        logger('db full updated');
    }

    callback(mess);
};

/**
 * Get user role
 * @typedef {function}
 * @memberOf Database
 * @param {array} roles - Array of roles: octeus|operator|design
 * @example
 * getRole(['role1', 'role2', ...])
 * @returns {Boolean} Return true if role is Octeus or false if not.
 */

exports.getRole = (roles) => {

    let sep = (process.platform !== 'darwin') ? '\\' : '/',
        file = fs.readFileSync((cypher.decrypted.db + sep + 'user.json'), 'utf-8'),
        check = false;

    if (file) {

        try {

            let user = JSON.parse(file),
                role = user.role.toLowerCase();

            for (let i = 0; i < roles.length; i++) {
                if (role.includes(roles[i])) {
                    check = true;
                    break;
                }
            }

            logger('User role has been read');

            return check;

        } catch (e) {
            logger('Parsing error:', e);
            return check
        }
    }
    return check
}

exports.getOldFiles = (callback) => {

    let files = [],
        sep = (process.platform !== 'darwin') ? '\\' : '/',
        json = fs.readFileSync((cypher.decrypted.db + sep + 'oldFiles.json'), 'utf-8');

    if (json) {

        try {

            let olds = JSON.parse(json);

            for (let i = 0; i < olds.length; i++) {
                let split = olds[i].split(sep),
                    name = split[split.length - 1];
                files.push({
                    name: name.replace('.osdc', ''),
                    path: olds[i]
                });
            }

            logger('Old files has been successfully registered');
            callback(files);

        } catch (e) {
            logger('Parsing error:', e);
            callback([])
        }
    }
}

/**
 * Get a table from the Database
 * @typedef {function}
 * @memberOf Database
 * @param {string} table - A DB Table
 * @example
 * getDB('myTable')
 * @returns {Object} Return a table from the database to a JSON parsed object.
 */

function getDB(table) {

    let sep = (process.platform !== 'darwin') ? '\\' : '/';
    let exist = fs.existsSync(cypher.decrypted.db + sep + table + '.json');

    if (exist) {
        let file = fs.readFileSync((cypher.decrypted.db + sep + table + '.json'), 'utf-8');
        try {
            logger('The file ' + table + '.json has been successfully read');
            return JSON.parse(file);
        } catch (e) {
            logger('Parsing error:', e);
        }
    }
}

/**
 * Update a table in the Database
 * @typedef {function}
 * @memberOf Database
 * @param {string} file - A DB Table to update.
 * @param {Object} obj - The JSON object to update a table in the DB.
 * @example
 * updateDB('myTableToUpdate', dbObj)
 * @returns {Object} Return the updated table from the database to a JSON parsed object.
 */

function updateDB(table, obj) {

    let sep = (process.platform !== 'darwin') ? '\\' : '/';
    let json = JSON.stringify(obj, null, 4);

    try {
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
}

/**
 * Update user and admins tables in local database
 * @typedef {function}
 * @memberOf Database
 * @param {Object} obj - The JSON object to update tables.
 * @example
 * updateUser(dbObj)
 * @returns {Object} Return the updated table from the database to a JSON parsed object.
 */

function updateUser(obj) {

    let sep = (process.platform !== 'darwin') ? '\\' : '/';
    let user = JSON.stringify(obj.user, null, 4);
    let admins = JSON.stringify(obj.admins, null, 4);

    try {
        fs.writeFile(cypher.decrypted.db + sep + 'user.json', user, (err) => {
            if (err) {
                logger('An error occurred creating the file ' + err.message);
            }
            logger('The file user.json has been successfully saved');
            return obj;
        });
        fs.writeFile(cypher.decrypted.db + sep + 'admins.json', admins, (err) => {
            if (err) {
                logger('An error occurred creating the file ' + err.message);
            }
            logger('The file admins.json has been successfully saved');
            return obj;
        });
    } catch (e) {
        logger('Parsing error:', e);
    }
}

/**
 * Encrypt the DB folder.
 * @typedef {function}
 * @memberOf Database
 * @returns {void}
 */

function encryptOnce() {

    encrypt(cypher.decrypted.db, cypher.crypted.db, function () {

        logger('db encrypted');
        setTimeout(function(){
            app.quit();
        }, 2000);

    }, true);
};

/**
 * Decrypt the DB folder.
 * @typedef {function}
 * @memberOf Database
 * @returns {void}
 */

function decryptOnce() {

    decrypt(cypher.crypted.db, cypher.decrypted.db, function () {

        logger('db decrypted');
        app.quit();
    });
};

/**
 * Decrypt or encrypt DB if needed instead of launching App.
 * @typedef {function}
 * @memberOf Database
 * @returns {void}
 */

exports.debugDB = () => {

    if (process.env.ENCRYPT_ONCE === 'true') {
        encryptOnce();
    }   if (process.env.DECRYPT_ONCE === 'true') {
        decryptOnce();
    }
};