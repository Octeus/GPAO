const nodeDiskInfo = require('node-disk-info');
const fs = require('fs');
const path = require("path");
const dicomParser = require('dicom-parser');
const drivelist = require('drivelist');


/**
 * Get all devices mounted on the system.
 * @typedef {function}
 * @memberOf MountedDevices
 * @param {function} callback - Callback().
 * @example
 * getDevices(function (devices) {

       event.sender.send('some.reply', devices);
   });
 * @returns {function}
 */

exports.getDevices = async (callback) => {

    const drives = await drivelist.list();
    let all = [];
    drives.forEach((drive) => {
        if (drive.isUSB === true) {
            all.push(drive);
        }
    });

    nodeDiskInfo.getDiskInfo().then(disks => {

        let devices = [];
        let sep = (process.platform !== 'darwin') ? '\\' : '/';

        for (const disk of disks) {

            if (!disk.filesystem.includes("local") && disk.used > 0) {

                let device = {
                    'filesystem': disk.filesystem,
                    'blocks': disk.blocks,
                    'used': disk.used,
                    'available': disk.available,
                    'capacity': disk.capacity,
                    'mounted': disk.mounted,
                    'octeus': fs.existsSync(path.join(disk.mounted, 'Volumes/.0d25f4rf8'))
                };

                for (let i = 0; i < all.length; i++) {

                    if (all[i].mountpoints[0].path.includes(disk.mounted) === true) {
                        let alls = all[i];
                        for (const key in alls) {
                            device[key] = alls[key];
                        }
                    }
                }

                devices.push(device);
            }
        }

        callback(devices)

    }).catch(reason => {

        console.error(reason);
    });
};

/**
 * Get all dicon devices mounted on the system.
 * @typedef {function}
 * @memberOf MountedDevices
 * @param {function} callback - Callback().
 * @example
 * getDicomDevices(function (devices) {

       event.sender.send('actionReply', devices);
   });
 * @returns {function}
 */

exports.getDicomDevices = (path, callback) => {

    nodeDiskInfo.getDiskInfo().then(disks => {

        let devices = [];
        let sep = (process.platform !== 'darwin') ? '\\' : '/';

        for (const disk of disks) {

            if (!disk.filesystem.includes("local") && disk.used > 0) {

                let device = {
                    'filesystem': disk.filesystem,
                    'blocks': disk.blocks,
                    'used': disk.used,
                    'available': disk.available,
                    'capacity': disk.capacity,
                    'mounted': disk.mounted,
                    'isDicom': false,
                    'folder': null,
                    'dicomDir': null,
                    'infos': {}
                };

                fs.readdirSync(device.mounted).forEach(file => {
                    if (file.toUpperCase() === 'DICOMDIR') {
                        device.isDicom = true;
                        device.infos = readDICOMDIR(device.mounted + sep + file);
                        device.folder = (device.infos.images[0])
                            ? (device.mounted + sep + device.infos.images[0].split(sep)[0])
                                ? device.mounted + sep + device.infos.images[0].split(sep)[0]
                                : device.mounted + sep + device.infos.images[0]
                            : null;
                        device.dicomDir = device.mounted + sep + 'DICOMDIR';
                        let moreInfos = readDICOMImage(device.mounted + sep + device.infos.images[0].replaceAll('\\', sep).split(' - ')[0]);
                        device.infos.sex = moreInfos.sex;
                        device.infos.birthDate = moreInfos.birthDate;
                    }
                });

                if (device.isDicom === true && device.dicomDir === path) {
                    devices.push(device);
                }
            }
        }

        return callback(devices[0]);

    }).catch(reason => {

        console.error(reason);
    });
};

/**
 * Get all dicon info from a dicom directory on the card.
 * @typedef {function}
 * @memberOf MountedDevices
 * @param {string} path - Path to the DICOMDIR file on specific mounted device.
 * @returns {object}
 */

exports.getSingleDicom = (path) => {

    let sep = (process.platform !== 'darwin') ? '\\' : '/',
        infos = readDICOMDIR(path.replaceAll('\\', sep) + sep + 'DICOMDIR'),
        moreInfos = readDICOMImage(path.replaceAll('\\', sep) + sep + infos.images[0].replaceAll('\\', sep).split(' - ')[0]);
    infos.sex = moreInfos.sex;
    infos.birthDate = moreInfos.birthDate;
    return infos;
};

/**
 * Read DICOMDIR strucure.
 * @typedef {function}
 * @memberOf MountedDevices
 * @param {string} path - Path to the DICOMDIR file on specific mounted device.
 * @returns {object}
 */

function readDICOMDIR(file) {

    try {

        const data = fs.readFileSync(file);
        let byteArray = new Uint8Array(data);
        return dumpDICOMDIR(byteArray);

    } catch (err) {

        console.error(err);
    }
}

/**
 * Read DICOM file.
 * @typedef {function}
 * @memberOf MountedDevices
 * @param {string} file - Path to a specific DICOM file.
 * @returns {object}
 */

function readDICOMImage(file) {

    try {

        const data = fs.readFileSync(file);
        let byteArray = new Uint8Array(data);
        return dumpDICOMImage(byteArray);

    } catch (err) {

        console.error(err);
    }
}

/**
 * Dump DICOMDIR file.
 * @typedef {function}
 * @memberOf MountedDevices
 * @param {array} byteArray - Bytes array.
 * @returns {object}
 */

function dumpDICOMDIR(byteArray) {

    let dataSet, output = {};

    try {

        dataSet = dicomParser.parseDicom(byteArray);
        output.fileSetID = dataSet.string('x00041130').replaceAll('_', ' ');
        output.versionName = dataSet.string('x00020013');
        output.images = [];
        let sep = (process.platform !== 'darwin') ? '\\' : '/';

        for (var j in dataSet.elements) {

            if (dataSet.elements.hasOwnProperty(j)) {

                let element = dataSet.elements[j];
                if(element.tag == "x00041220") {

                    for (var item in element.items) {

                        if (element.items.hasOwnProperty(item)) {

                            for (var k in element.items[item].dataSet.elements) {

                                if (element.items[item].dataSet.elements.hasOwnProperty(k)) {

                                    if (element.items[item].dataSet.elements[k].tag == 'x00041430') {

                                        let type = element.items[item].dataSet.string('x00041430');

                                        switch(type) {

                                            case "PATIENT" :

                                                let patient = element.items[item].dataSet.string('x00100010');
                                                let id = element.items[item].dataSet.string('x00100020');
                                                let birthDate = element.items[item].dataSet.string('x00100030');
                                                let sex = element.items[item].dataSet.string('x00100040');

                                                output.patientName = patient.replaceAll('^', ' ');
                                                output.clinicalID = id;
                                                output.birthDate = birthDate;
                                                output.sex = sex;
                                                break;

                                            case "STUDY" :

                                                let study = element.items[item].dataSet.string('x00081030');
                                                output.study = study;
                                                break;

                                            case "SERIES" :

                                                let modality = element.items[item].dataSet.string('x00080060');
                                                output.seriesModality = modality;
                                                break;

                                            case "IMAGE" :

                                                let path = element.items[item].dataSet.string('x00041500');
                                                let instance = element.items[item].dataSet.string('x00200013');
                                                output.images.push(path.replaceAll('\\', sep) + " - INSTANCE : " + instance);
                                                break;

                                            default :

                                                output.type = type;
                                                break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return output;
    }
    catch(err) {

        console.log("DicomParsing Error");
    }
}

/**
 * Dump DICOM image file.
 * @typedef {function}
 * @memberOf MountedDevices
 * @param {array} byteArray - Bytes array.
 * @returns {object}
 */

function dumpDICOMImage(byteArray) {

    let dataSet, output = {};

    try {

        dataSet = dicomParser.parseDicom(byteArray);
        output.sex = dataSet.string('x00100040');
        output.birthDate = dataSet.string('x00100030');
        return output;
    }
    catch(err) {

        console.log("DicomParsing Error");
    }
}