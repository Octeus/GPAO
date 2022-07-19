/**
 * This is a namespace that contains documentation elements belonging to the FilesManager
 * domain.
 *
 * @namespace  FilesManager
 */

const ipc = require('electron').ipcMain,
    { dialog } = require('electron'),
    fs = require('fs'),
    fse = require('fs-extra'),
    { encrypt, decrypt } = require('./aes'),
    { logger } = require('./logger'),
    cloudToken = '$ghtF52Dfr584Reds2899RTGhjyD52F68ev55',
    xlsParser = new (require('simple-excel-to-json').XlsParser)(),
    { cypher } = require('./volumes'),
    { getDevices, getDicomDevices } = require('./mounted_devices'),
    tmpFolder = cypher.decrypted.tmp,
    path = require("path"),
    axios = require('axios');
let stopPropagation = false;

// ==============================================================================================================
// ==============================================================================================================

// Encrypt test files
/*encrypt('C:\\Users\\Dee Web\\Desktop\\test2.osdc', 'C:\\Users\\Dee Web\\Desktop\\encrypted\\test2.osdc', function () {

});
encrypt('C:\\Users\\Dee Web\\Desktop\\test.osdc', 'C:\\Users\\Dee Web\\Desktop\\encrypted\\test.osdc', function () {

});*/

// Decrypt test files
/*decrypt('C:\\Users\\Dee Web\\Desktop\\encrypted\\test2.osdc', 'C:\\Users\\Dee Web\\Desktop\\test2.osdc', function () {

});
decrypt('C:\\Users\\Dee Web\\Desktop\\encrypted\\test.osdc', 'C:\\Users\\Dee Web\\Desktop\\test.osdc', function () {

});*/

// ==============================================================================================================
// ==============================================================================================================

exports.fileDrag = (files) => {

    return fileAnalyser(files);
};

/**
 * Check file transfered by drag and drop.
 * @typedef {function}
 * @memberOf FilesManager
 * @param {object} files - The text that will be displayed on the QRCode scan.
 * @returns {array} - An array of file object statements.
 */

function fileAnalyser(files) {

    let resume = [];

    for (let i = 0; i < files.length; i++) {

        let file = files[i];
        if (isDir(file.path)) {
            resume.push({'err': '"' + file.name + '" is a folder ! Only .osdc files are allowed.', 'ok': null, 'path': null});
        } else {

            if (checkNativeFile(file)) {
                resume.push({'err': null, 'ok': '"' + file.name + '" is loading...', 'path': file.path});
            } else {
                resume.push({'err': '"' + file.name + '" is not a .osdc file.', 'ok': null, 'path': null});
            }
        }
    }

    return resume;
}

/**
 * Check if a file is a directory.
 * @typedef {function}
 * @memberOf FilesManager
 * @param {string} filePath - The file path.
 * @returns {boolean} - Return true if the file is a directory.
 */

function isDir(filePath) {

    return fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory();
}

/**
 * Check if a file is a native .osdc type.
 * @typedef {function}
 * @memberOf FilesManager
 * @param {string} file - The file path.
 * @returns {boolean} - Return true if the file is a native .osdc file.
 */

function checkNativeFile(file) {

    if (file.name.split('.')[file.name.split('.').length - 1]
        && file.name.split('.')[file.name.split('.').length - 1] === 'osdc') {
        return true;
    }
    return false;
}

/**
 * Save file.
 * @typedef {function}
 * @memberOf FilesManager
 * @param {string} type - The file extension.
 * @param {string} path - The file path.
 * @param {object} content - The file data content.
 * @param {function} callback - Callback() optional.
 * @returns {void}
 */

exports.save = (type, path, content, callback = null) => {

    let d = new Date(),
        tempName = 'saving' + d.getFullYear() + ('0' + parseInt(d.getMonth() + 1)).slice(-2) + ('0' + d.getDate()).slice(-2) + ('0' + d.getHours()).slice(-2) + ('0' + d.getMinutes()).slice(-2) + ('0' + d.getSeconds()).slice(-2) + '.tmp';

    fs.writeFileSync(tmpFolder + tempName, content, {encoding: "utf8"});

    encrypt(tmpFolder + tempName, path, function () {
        logger(path + ' as been saved successfully');
        if (callback !== null) {
            callback(path);
        }
    }, true, true);
}

exports.openNative = (path, callback) => {

    openNativeOperation(path, callback);
}

/**
 * Open native file(s).
 * @typedef {function}
 * @memberOf FilesManager
 * @param {string} path - File path.
 * @param {function} callback - Callback().
 * @returns {void}
 */

exports.openDialog = (win) => {

    dialog.showOpenDialog(
        {
            title: 'Open Files',
            properties: ['openFile', 'multiSelections'],
            filters: [
                { name: 'OSDC Files', extensions: ['osdc'] }
            ],
            buttonLabel: 'Select files'
        }
    ).then(result => {

        if (result.canceled === false) {

            let sep = (process.platform !== 'darwin') ? '\\' : '/',
                files = result.filePaths,
                resume = [];

            for (let i = 0; i < files.length; i++) {
                let file = files[i],
                    split = file.split(sep),
                    name = split[split.length-1];
                resume.push({'err': null, 'ok': '"' + name + '" is loading...', 'path': file});
            }
            win.webContents.send('openFile.reply', resume);

            openGoods(files);

            function openGoods(files) {

                if (files.length > 0) {

                    openNativeOperation(files[0], function (data) {

                        win.webContents.send('openFile', { 'path': files[0], 'data': data });
                        files.shift();
                        openGoods(files);
                    });

                } else {

                    setTimeout(function(){
                        win.webContents.send('LoadedFile');
                    }, 2000);
                }
            }
        }
    }).catch(err => {
        console.log(err)
    });
}

/**
 * Import XLS file(s).
 * @typedef {function}
 * @memberOf FilesManager
 * @param {array} paths - Array of file(s) path(s).
 * @returns {array} - Return an array of file(s) decrypted content(s) object(s).
 */

exports.importXLS = (paths) => {

    let docs = [];
    for (let i = 0; i < paths.length; i++) {
        let doc = parser.parseXls2Json(paths[i]);
        docs.push(doc);
    }
    return docs;
}

function openNativeOperation(path, callback) {

    let d = new Date(),
        tempName = 'open' + d.getFullYear() + ('0' + parseInt(d.getMonth() + 1)).slice(-2) + ('0' + d.getDate()).slice(-2) + ('0' + d.getHours()).slice(-2) + ('0' + d.getMinutes()).slice(-2) + ('0' + d.getSeconds()).slice(-2) + '.tmp';

    decrypt(path, tmpFolder + tempName, function () {

        fs.access(tmpFolder + tempName, fs.F_OK, (err) => {

            if (err) {

                callback({'err': true});
                return
            }

            let data = fs.readFileSync(tmpFolder + tempName, {encoding: 'utf8', flag: 'r'})
            if (isJson(data)) {
                callback(JSON.parse(data));
            } else {
                let sep = (process.platform !== 'darwin') ? '\\' : '/',
                    split = path.split(sep),
                    name = split[split.length - 1]
                callback({'err': name = ' is corrupted...'});
            }

            fs.unlinkSync(tmpFolder + tempName);
            logger(path + ' has been opened successfully !');

        })
    }, false, true);
}

function isJson(str) {

    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

exports.logsCleaner = () => {

    let files = fs.readdirSync(path.join(cypher.decrypted.logs)),
        toDelete = [],
        cnt = 0;

    while (files.length > 10) {
        toDelete.push(files[cnt]);
        files.shift();
        cnt++;
    }

    toDelete.forEach(file => {
        fs.unlinkSync(path.join(cypher.decrypted.logs, file));
    });
}

exports.getMarkdownFiles = () => {

    let files = fs.readdirSync(path.join(cypher.decrypted.markdowns)),
        final = {};

    for (let i = 0; i < files.length; i++) {
        let data = fs.readFileSync(path.join(cypher.decrypted.markdowns, files[i]), {encoding: 'utf8', flag: 'r'})
        final[files[i].replace('.md', '')] = data;
    }

    return final;
}

exports.getCustomerModels = () => {

    let jsonsPath = path.join(cypher.decrypted.data, '/Jsons'),
        files = fs.readdirSync(jsonsPath),
        error = true,
        final = [];

    for (let i = 0; i < files.length; i++) {
        error = false;
        let data = fs.readFileSync(path.join(jsonsPath, files[i]), {encoding: 'utf8', flag: 'r'})
        final.push({name: files[i].replace('.json', ''), content: JSON.parse(data)});
    }

    return {error: error, data: final};
}

exports.createCard = (data) => {

    if (stopPropagation === false) {

        stopPropagation = true;

        if (fs.existsSync(path.join(data.device.mounted, 'Volumes/dicom'))) {

            if (!fs.existsSync(path.join(data.device.mounted, 'Volumes/db'))) {

                let db = path.join(data.device.mounted, 'Volumes/db'),
                    hidden = path.join(data.device.mounted, 'Volumes/.drt25bg5'),
                    langs = path.join(data.device.mounted, 'Volumes/db/langs'),
                    originalLangs = path.join(cypher.decrypted.data, 'Builder/Volumes/db/langs'),
                    fixed = path.join(data.device.mounted, 'Volumes/db/fixed.json'),
                    demo = path.join(data.device.mounted, 'Volumes/db/demo.json'),
                    traveler = path.join(data.device.mounted, 'Volumes/db/traveler.json'),
                    langsFiles = fs.readdirSync(originalLangs);

                if (fs.existsSync(db)) {
                    fs.rmdirSync(db, {recursive: true});
                }

                fs.mkdirSync(db);
                fs.mkdirSync(langs);

                sendBackToFront({
                    'initialize': true,
                    'createFiles': false,
                    'compileDB': false,
                    'copy': false,
                    'encrypt': false,
                    'server': false,
                    'done': false,
                    'error': null,
                    'stepper': 2
                })

                for (const file in langsFiles) {
                    if (typeof originalLangs === 'string' && typeof langsFiles[file] === 'string') {
                        let content = fs.readFileSync(path.join(originalLangs, langsFiles[file]), {
                            encoding: 'utf8',
                            flag: 'r'
                        });
                        fs.writeFileSync(path.join(langs, langsFiles[file]), content);
                    }
                }

                if (data.mode === 'create') {

                    fs.copyFileSync(path.join(cypher.decrypted.data, 'Builder/Volumes/.drt25bg5'), hidden,
                        fs.constants.COPYFILE_FICLONE);
                }

                let fixedData = JSON.stringify(data.ready.fixed, null, 2);
                fs.writeFileSync(fixed, fixedData);

                sendBackToFront({
                    'initialize': true,
                    'createFiles': true,
                    'compileDB': false,
                    'copy': false,
                    'encrypt': false,
                    'server': false,
                    'done': false,
                    'error': null,
                    'stepper': 3
                })

                data.ready.traveler.treatments = copyFiles(data.mode, data.ready.traveler.treatments, 'treatments', data.device.mounted);
                data.ready.traveler.exams = copyFiles(data.mode, data.ready.traveler.exams, 'exams', data.device.mounted);
                if (data.mode === 'update') {
                    data.ready.traveler = completeData(data.ready.traveler, data.temp);
                }
                let travelerData = JSON.stringify(data.ready.traveler, null, 2);
                fs.writeFileSync(traveler, travelerData);
                fs.writeFileSync(demo, travelerData);

                sendBackToFront({
                    'initialize': true,
                    'createFiles': true,
                    'compileDB': true,
                    'copy': false,
                    'encrypt': false,
                    'server': false,
                    'done': false,
                    'error': null,
                    'stepper': 4
                })

                encrypt(db, path.join(data.device.mounted, 'Volumes/.0d25f4rf8'), function () {

                    sendBackToFront({
                        'initialize': true,
                        'createFiles': true,
                        'compileDB': true,
                        'copy': true,
                        'encrypt': true,
                        'server': false,
                        'done': false,
                        'error': null,
                        'stepper': 6
                    })

                    if (fs.existsSync(db)) {
                        fs.rmdirSync(db, {recursive: true});
                    }

                });

                const options = {
                    method: 'post',
                    url: 'https://api.octeus.fr',
                    data: {
                        'module': 'manage_user',
                        'lang': 'fr',
                        'api': 'OcteusApis',
                        'token': cloudToken,
                        'data': JSON.stringify(data)
                    },
                    transformRequest: [(data, headers) => {
                        const serializedData = []
                        for (const k in data) {
                            if (data[k]) {
                                serializedData.push(`${k}=${encodeURIComponent(data[k])}`)
                            }
                        }
                        return serializedData.join('&')
                    }]
                };
                axios(options).then(function (response) {
                    if (response.data.error !== false) {
                        logger(response.data.error, true)
                        sendBackToFront({
                            'initialize': false,
                            'createFiles': false,
                            'compileDB': false,
                            'copy': false,
                            'encrypt': false,
                            'server': false,
                            'done': false,
                            'error': response.data.error,
                            'stepper': 1
                        })
                    } else {
                        updatePatients(response.data.data);
                        const remoteWin = require('electron').BrowserWindow.getFocusedWindow()
                        remoteWin.webContents.send('setProjetList', response.data.data);
                        sendBackToFront({
                            'initialize': true,
                            'createFiles': true,
                            'compileDB': true,
                            'copy': true,
                            'encrypt': true,
                            'server': true,
                            'done': true,
                            'error': null,
                            'stepper': 8
                        })
                    }
                }).catch(function (error) {

                    logger(error, true)
                    sendBackToFront({
                        'initialize': false,
                        'createFiles': false,
                        'compileDB': false,
                        'copy': false,
                        'encrypt': false,
                        'server': false,
                        'done': false,
                        'error': 'Something went wrong on server side. Please try again.',
                        'stepper': 1
                    })
                });

            } else {

                sendBackToFront({
                    'initialize': false,
                    'createFiles': false,
                    'compileDB': false,
                    'copy': false,
                    'encrypt': false,
                    'server': false,
                    'done': false,
                    'error': 'The "Device:/Volumes/db" folder already exists. Please delete it manualy.',
                    'stepper': 1
                })
            }

        } else {

            sendBackToFront({
                'initialize': false,
                'createFiles': false,
                'compileDB': false,
                'copy': false,
                'encrypt': false,
                'server': false,
                'done': false,
                'error': 'Destination device not found or not an OCTEUS device',
                'stepper': 1
            })
        }
    }
}

exports.setStopPropagator = () => {

    stopPropagation = false;
}

function completeData(traveler, temp) {

    traveler.notes = temp.notes;
    traveler.travels = temp.travels;
    for (let i = 0; i < temp.exams.length; i++) {
        traveler.exams.push(temp.exams[i])
    }
    for (let i = 0; i < temp.treatments.length; i++) {
        traveler.treatments.push(temp.treatments[i])
    }
    for (const tempKey in temp) {
        if (tempKey !== 'notes' && tempKey !== 'travels' && tempKey !== 'exams' && tempKey !== 'treatments') {
            traveler[tempKey] = temp[tempKey];
        }
    }
    return traveler;
}

function sendBackToFront(mess) {

    const remoteWin = require('electron').BrowserWindow.getFocusedWindow()
    remoteWin.webContents.send('createCard.reply', 'Compile data');
    remoteWin.webContents.send('compileStep', mess);
}

function creatPrefix() {

    let d = new Date;
    return d.getFullYear() + formatTimer(d.getMonth() + 1) + formatTimer(d.getDate()) + formatTimer(d.getHours()) + formatTimer(d.getMinutes()) + formatTimer(d.getSeconds()) + '-OCTEUS-';
}

function formatTimer(data) {

    return ('0' + data).slice(-2);
}

function copyFiles(mode, data, type, mounted) {

    let final = [],
        sep = (process.platform !== 'darwin') ? '\\' : '/',
        dicom = path.join(mounted, 'Volumes/dicom'),
        img = path.join(mounted, 'Volumes/media/images'),
        pdf = path.join(mounted, 'Volumes/media/pdf'),
        video = path.join(mounted, 'Volumes/media/video');

    if (type === 'treatments') {

        for (let i = 0; i < data.length; i++) {
            let treatment = data[i];
            let docs = {'pdf' : []};
            for (const key in treatment.documents.pdf) {
                if (typeof treatment.documents.pdf[key] === 'string') {
                    let oldPath = treatment.documents.pdf[key];
                    let prefix = creatPrefix() + 'PDF-';
                    let doc = prefix + oldPath.split(sep)[oldPath.split(sep).length - 1]
                    docs.pdf.push(doc);

                    sendBackToFront({
                        'initialize': true,
                        'createFiles': true,
                        'compileDB': true,
                        'copy': false,
                        'encrypt': false,
                        'server': false,
                        'done': false,
                        'error': null,
                        'stepper': 4
                    })

                    try {
                        fs.copyFileSync(oldPath, path.join(pdf, doc),
                            fs.constants.COPYFILE_FICLONE);

                        sendBackToFront({
                            'initialize': true,
                            'createFiles': true,
                            'compileDB': true,
                            'copy': true,
                            'encrypt': false,
                            'server': false,
                            'done': false,
                            'error': null,
                            'stepper': 5
                        })
                    }
                    catch (err) {
                        sendBackToFront({
                            'initialize': false,
                            'createFiles': false,
                            'compileDB': false,
                            'copy': false,
                            'encrypt': false,
                            'server': false,
                            'done': false,
                            'error': 'An error occured while copying ' + doc + ' file. Please try again.',
                            'stepper': 1
                        })
                    }
                }
            }
            treatment.documents = docs;
            final.push(treatment);
        }

    } else if (type === 'exams') {

        for (let i = 0; i < data.length; i++) {
            let exam = data[i];
            let docs = {'pdf' : [], 'video': [], 'dicom': []};
            for (const key in exam.documents.video) {
                if (typeof exam.documents.video[key] === 'string') {
                    let oldPath = exam.documents.video[key];
                    let prefix = creatPrefix() + 'VIDEO-';
                    let doc = prefix + oldPath.split(sep)[oldPath.split(sep).length - 1];
                    docs.video.push(doc);

                    sendBackToFront({
                        'initialize': true,
                        'createFiles': true,
                        'compileDB': true,
                        'copy': false,
                        'encrypt': false,
                        'server': false,
                        'done': false,
                        'error': null,
                        'stepper': 4
                    })

                    try {
                        fs.copyFileSync(oldPath, path.join(video, doc),
                            fs.constants.COPYFILE_FICLONE);

                        sendBackToFront({
                            'initialize': true,
                            'createFiles': true,
                            'compileDB': true,
                            'copy': true,
                            'encrypt': false,
                            'server': false,
                            'done': false,
                            'error': null,
                            'stepper': 5
                        })
                    }
                    catch (err) {
                        sendBackToFront({
                            'initialize': false,
                            'createFiles': false,
                            'compileDB': false,
                            'copy': false,
                            'encrypt': false,
                            'server': false,
                            'done': false,
                            'error': 'An error occured while copying ' + doc + ' file. Please try again.',
                            'stepper': 1
                        })
                    }
                }
            }
            for (const key in exam.documents.pdf) {
                if (typeof exam.documents.pdf[key] === 'string') {
                    let oldPath = exam.documents.pdf[key];
                    let prefix = creatPrefix() + 'PDF-';
                    let doc = prefix + oldPath.split(sep)[oldPath.split(sep).length - 1]
                    docs.pdf.push(doc);

                    sendBackToFront({
                        'initialize': true,
                        'createFiles': true,
                        'compileDB': true,
                        'copy': false,
                        'encrypt': false,
                        'server': false,
                        'done': false,
                        'error': null,
                        'stepper': 4
                    })

                    try {
                        fs.copyFileSync(oldPath, path.join(pdf, doc),
                            fs.constants.COPYFILE_FICLONE);

                        sendBackToFront({
                            'initialize': true,
                            'createFiles': true,
                            'compileDB': true,
                            'copy': true,
                            'encrypt': false,
                            'server': false,
                            'done': false,
                            'error': null,
                            'stepper': 5
                        })
                    }
                    catch (err) {
                        sendBackToFront({
                            'initialize': false,
                            'createFiles': false,
                            'compileDB': false,
                            'copy': false,
                            'encrypt': false,
                            'server': false,
                            'done': false,
                            'error': 'An error occured while copying ' + doc + ' file. Please try again.',
                            'stepper': 1
                        })
                    }
                }
            }
            for (const key in exam.documents.dicom) {
                if (typeof exam.documents.dicom[key] === 'string') {
                    let oldPath = exam.documents.dicom[key];
                    let doc = creatPrefix() + 'DICOM';
                    docs.dicom.push(doc);
                    let dir = path.join(dicom, doc);
                    fs.mkdirSync(dir);

                    sendBackToFront({
                        'initialize': true,
                        'createFiles': true,
                        'compileDB': true,
                        'copy': false,
                        'encrypt': false,
                        'server': false,
                        'done': false,
                        'error': null,
                        'stepper': 4
                    })

                    getDicomDevices(oldPath, (device) => {
                        try {
                            fs.copyFileSync(oldPath, path.join(dir, 'DICOMDIR'),
                                fs.constants.COPYFILE_FICLONE);
                            if (device.folder) {
                                let fold = device.folder.split(sep)[device.folder.split(sep).length - 1];
                                fs.mkdirSync(path.join(dir, fold));
                                fse.copySync(device.folder, path.join(dir, fold))

                                sendBackToFront({
                                    'initialize': true,
                                    'createFiles': true,
                                    'compileDB': true,
                                    'copy': true,
                                    'encrypt': false,
                                    'server': false,
                                    'done': false,
                                    'error': null,
                                    'stepper': 5
                                })
                            }
                        } catch (err) {
                            sendBackToFront({
                                'initialize': false,
                                'createFiles': false,
                                'compileDB': false,
                                'copy': false,
                                'encrypt': false,
                                'server': false,
                                'done': false,
                                'error': 'An error occured while copying ' + oldPath + '. Please try again.',
                                'stepper': 1
                            })
                        }
                    })
                }
            }
            exam.documents = docs;
            final.push(exam);
        }
    }

    return final;
}

function updatePatients(data) {

    try {

        let file = JSON.parse(fs.readFileSync(path.join(cypher.decrypted.db, 'patients.json'), {
            encoding: 'utf8',
            flag: 'r'
        }));
        file.push(data);
        let newList = JSON.stringify(file, null, 2);
        fs.writeFileSync(path.join(cypher.decrypted.db, 'patients.json'), newList);

    } catch (err) {

        logger(err, true);
    }
}

exports.manageCardsToUpdate = () => {

    getDevices((devices) => {
        final = [];
        for (let i = 0; i < devices.length; i++) {
            let device = devices[i];
            if (fs.existsSync(path.join(device.mounted, 'Volumes/.0d25f4rf8')) && device.isUSB === true) {
                let size = (device.size) ? device.size : device.blocks,
                    used = size - device.available;
                final.push({
                    'size': humanizeSize(size),
                    'used': humanizeSize(used),
                    'available': humanizeSize(device.available),
                    'mounted': device.mounted,
                    'description': device.description
                });
            }
        }
        const remoteWin = require('electron').BrowserWindow.getFocusedWindow();
        if (remoteWin) {
            remoteWin.webContents.send('checkDevicesToUpdate.reply', final);
        }
    });
}

function humanizeSize(space) {

    let used = '0o';

    if (space / Math.pow(1024, 4) < 1 && space / Math.pow(1024, 3) >= 1) {
        used = (space / Math.pow(1024, 3)).toFixed(2) + 'Go';
    } else if (space / Math.pow(1024, 3) < 1 && space / Math.pow(1024, 2) >= 1) {
        used = (space / Math.pow(1024, 2)).toFixed(2) + 'Mo';
    } else if (space / Math.pow(1024, 2) < 1 && space / 1024 >= 1) {
        used = (space / 1024).toFixed(2) + 'Ko';
    } else if (space / 1024 < 1 && space >= 1) {
        used = space.toFixed(2) + 'o';
    }
    return used;
}

exports.importDataFromDevice = (device) => {

    let data = {},
        sep = (process.platform !== 'darwin') ? '\\' : '/',
        dbCrypted = path.join(device + sep, 'Volumes/.0d25f4rf8'),
        db = path.join(device + sep, 'Volumes/db'),
        volumes = path.join(device + sep, 'Volumes'),
        demo = path.join(device + sep, 'Volumes/db/demo.json'),
        fixed = path.join(device + sep, 'Volumes/db/fixed.json');

    if (!fs.existsSync(db)) {
        fs.mkdirSync(db);
    }

    decrypt(dbCrypted, db, function(){

        let fixedData = JSON.parse(fs.readFileSync(fixed, {encoding: 'utf8', flag: 'r'})),
            demoData = JSON.parse(fs.readFileSync(demo, {encoding: 'utf8', flag: 'r'}));
        if (fs.existsSync(db)) {
            fs.rmdirSync(db, {recursive: true});
        }
        const remoteWin = require('electron').BrowserWindow.getFocusedWindow();
        remoteWin.webContents.send('importDataFromDevice.reply', {'fixed': fixedData, 'traveler': demoData});

    })
}