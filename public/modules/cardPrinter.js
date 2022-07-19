/**
 * This is a namespace that contains documentation elements belonging to the CardPrinter
 * domain.
 *
 * @namespace  CardPrinter
 */

const QRCode = require('qrcode');
const fs = require("fs");
const path = require('path');
const { logger } = require('./logger');
const format = require('xml-formatter');
const PDFDocument = require('pdfkit');
const SVGtoPDF = require('svg-to-pdfkit');

/**
 * Create a QRCode.
 * @typedef {function}
 * @memberOf CardPrinter
 * @param {string} text - The text that will be displayed on the QRCode scan.
 * @param {string} email - Unique client reference.
 * @example
 * qrCode('someText', 'example@email.com')
 * @returns {void}
 */

exports.qrCode = (text, email) => {

    try {

        if (!fs.existsSync(path.join(__dirname, '../../../Prints/' + email))) {

            fs.mkdir(path.join(__dirname, '../../../Prints/' + email), function(err) {

                if (err) {
                    logger('Print directory "' + email + '" creation failed...', err);
                } else {
                    logger('Print directory "' + email + '" done !');
                }
            });
        }

        const generateQR = async text => {

            let opts = {
                errorCorrectionLevel: 'H',
                quality: 0.3,
                margin: 1,
                color: {
                    dark:"#010599FF",
                    light:"#fff"
                }
            }

            try {

                await QRCode.toFile(path.join(__dirname, '../../../Prints/' + email + '/qrCode.svg'), text, opts);
                const xml = fs.readFileSync(path.join(__dirname, '../../../Prints/' + email + '/qrCode.svg'), {encoding:'utf8', flag:'r'});
                let indent = format(xml);
                fs.writeFileSync(path.join(__dirname, '../../../Prints/' + email + '/qrCode.svg'), indent);
                logger('QRcode generation done !');

            } catch (err) {
                logger('QRcode generation failed...', err);
            }
        }

        generateQR(text);

    } catch (err) {

        logger('QRcode generation failed...', err);
    }
};

/**
 * Client Card Design builder in svg format.
 * @typedef {function}
 * @memberOf CardPrinter
 * @param {string} email - Unique client reference.
 * @param {object} infos - Client stricts informations to display on print.
 * @example
 * buildCard('example@email.com', {
 *     firstname: 'John',
 *     lastname: 'Doe',
 *     ...
 * })
 * @returns {void}
 */

exports.buildCard = (email, infos) => {

    try {

        let recto = fs.readFileSync(path.join(__dirname, '../../../Prints/' + email + '/qrCode.svg'), {
                encoding: 'utf8',
                flag: 'r'
            }),
            verso = fs.readFileSync(path.join(__dirname, '../../../Prints/Models/verso.svg'), {
                encoding: 'utf8',
                flag: 'r'
            });

        prepareFaces(email, 'recto', recto);
        prepareFaces(email, 'verso', verso);

        logger('Setting card faces for "' + email + '" done !');

    } catch (err) {

        logger('Setting card faces for "' + email + '" failed...', err);
    }

};

/**
 * Client Card Design builder in PDF format.
 * @typedef {function}
 * @memberOf CardPrinter
 * @param {string} fullname - Unique client reference.
 * @param {string} face - Side to print "recto"|"verso".
 * @param {string} svg - SVG format document to convert for creating PDF file.
 * @param {string} pathTo - path to saved file.
 * @example
 * const svg = '<svg className="svg-icons" version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
 * viewBox="0 0 32 32"><title>alarm</title><path d="M27.013 25.278v1.825h-22.026v-1.825c0 0-0.471-1.009 2.085-3.429 2.554-2.419 2.218-8.672 2.218-12.907s5.948-4.325 5.948-4.325h0.204c0 0.002 0-0.029 0-0.688 0-0.423-1.42-1.955-1.42-1.955l-0.021-0.927h4.010l-0.027 0.962c0 0-1.539 1.531-1.539 1.982 0 0.436 0 0.582 0 0.625h0.317c0 0 5.948 0.090 5.948 4.325s-0.336 10.489 2.219 12.909 2.084 3.428 2.084 3.428zM18.512 28.070c0 1.385-1.122 2.883-2.506 2.883s-2.506-1.498-2.506-2.883c0 0.031 5.012-0.032 5.012 0z"></path></svg>',
 *
 * prepareFaces('example@email.com', 'recto', svg)
 * @returns {void}
 */

exports.prepareFaces = (fullname, face, svg, pathTo) => {

    try {

        let doc = new PDFDocument(),
            stream = fs.createWriteStream(pathTo);

        SVGtoPDF(doc, svg, 0, 0, {
            width: 255.118,
            height: 170.079,
            useCSS: true,
            assumePt: true
        });

        stream.on('finish', function () {
            logger('Creating ' + face.toUpperCase() + ' print for "' + fullname + '" done !');
        });

        doc.pipe(stream);
        doc.end();

    } catch (err) {

        logger('Creating prints for "' + fullname + '" failed...', err);
    }
}