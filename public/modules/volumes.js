/**
 * This is a namespace that contains documentation elements belonging to the Volumes
 * domain.
 *
 * @namespace  Volumes
 */

const path = require("path");
const isDev = require('electron-is-dev');

/**
 * JSON Object array listing all decrypted / encrypted paths.
 * @constant
 * @memberOf Volumes
 */

exports.cypher = {
    'key': process.env.CYPHER_KEY,
    'decrypted': {
        'tmp': (isDev)
            ? path.join(__dirname, '../Data/Temp')
            : path.join(__dirname, '../Data/Temp'),
        'logs': (isDev)
            ? path.join(__dirname, '../Logs')
            : path.join(__dirname, '../Logs'),
        'prints': (isDev)
            ? path.join(__dirname, '../Prints')
            : path.join(__dirname, '../Prints'),
        'icons': (isDev)
            ? path.join(__dirname, '../IconsRef')
            : path.join(__dirname, '../IconsRef'),
        'db': (isDev)
            ? path.join(__dirname, '../Data/Resources')
            : path.join(__dirname, '../Data/Resources'),
        'data': (isDev)
            ? path.join(__dirname, '../Data')
            : path.join(__dirname, '../Data'),
        'preload': (isDev)
            ? path.join(__dirname, '../Data/.preload')
            : path.join(__dirname, '../Data/.preload'),
        'printer': (isDev)
            ? path.join(__dirname, '../Data/print')
            : path.join(__dirname, '../Data/print'),
        'markdowns': (isDev)
            ? path.join(__dirname, '../MarkdownFiles')
            : path.join(__dirname, '../MarkdownFiles')
    },
    'crypted': {
        'tmp': (isDev)
            ? path.join(__dirname, '../Data/.temp')
            : path.join(__dirname, '../Data/.temp'),
        'logs': (isDev)
            ? path.join(__dirname, '../.logs')
            : path.join(__dirname, '../.logs'),
        'prints': (isDev)
            ? path.join(__dirname, '../.prints')
            : path.join(__dirname, '../.prints'),
        'icons': (isDev)
            ? path.join(__dirname, '../.iconsRef')
            : path.join(__dirname, '../.iconsRef'),
        'db': (isDev)
            ? path.join(__dirname, '../Data/.0d25f4rf8')
            : path.join(__dirname, '../Data/.0d25f4rf8'),
        'data': (isDev)
            ? path.join(__dirname, '../Data')
            : path.join(__dirname, '../Data'),
        'preload': (isDev)
            ? path.join(__dirname, '../Data/.preload')
            : path.join(__dirname, '../Data/.preload'),
        'printer': (isDev)
            ? path.join(__dirname, '../Data/.print')
            : path.join(__dirname, '../Data/.print'),
        'markdowns': (isDev)
            ? path.join(__dirname, '../.markdowns')
            : path.join(__dirname, '../.markdowns')
    }
}