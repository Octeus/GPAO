/**
 * This is a namespace that contains documentation elements belonging to the Print parser
 * domain.
 *
 * @namespace  Print-parser
 */

const fs = require('fs');
const path = require('path');
const isDev = require('electron-is-dev');
const beautify = require('beautify');
const { cypher } = require('./volumes');

/**
 * Parse Data to create HTML content
 * @typedef {function}
 * @memberOf Print-parser
 * @param {object} data - db.
 * @param {string} file - path/to/file.html.
 * @returns {void}
 */

exports.writeFileToPrint = (data, file) => {

    let language = data.traveler.language,
        traveler = data.traveler,
        fixed = data.fixed,
        lang = data.lang,
        svg = path.join(cypher.decrypted.printer, 'assets/logo.svg'),
        sex = (fixed.sex === 'male') ? 'M' : 'F',
        // Today's date
        d = new Date(),
        year = d.getFullYear(),
        month = ('0' + (parseInt(d.getMonth()) + 1)).slice(-2),
        date = ('0' + d.getDate()).slice(-2),
        hours = ('0' + d.getHours()).slice(-2),
        minutes = ('0' + d.getMinutes()).slice(-2),
        seconds = ('0' + d.getSeconds()).slice(-2),
        // Active date
        da = new Date(traveler.activation_datetime),
        year_a = da.getFullYear(),
        month_a = ('0' + (parseInt(da.getMonth()) + 1)).slice(-2),
        date_a = ('0' + da.getDate()).slice(-2),
        hours_a = ('0' + da.getHours()).slice(-2),
        minutes_a = ('0' + da.getMinutes()).slice(-2),
        seconds_a = ('0' + da.getSeconds()).slice(-2),
        // Birth date
        b = new Date(fixed.birthdate),
        year_b = b.getFullYear(),
        month_b = ('0' + (parseInt(b.getMonth()) + 1)).slice(-2),
        date_b = ('0' + b.getDate()).slice(-2),
        //Address
        address = traveler.address_1;
    address += (traveler.address_2.length > 0) ? ' ' + traveler.address_2 : '';
    address += (traveler.address_3.length > 0) ? ' ' + traveler.address_3 : '';
    address += ' ' + traveler.zip_code + ' ' + traveler.city + ' ' + traveler.country.toUpperCase();
    // HTML Content
    let html = '<!DOCTYPE html>\n';
    html += '<html lang="' + language + '">\n';
    html += '<head>\n';
    html += '    <meta charset="UTF-8">\n';
    html += '    <title>' + lang["My health record"] + ' - ' + year + month + date + hours + minutes + seconds + '</title>\n';
    html += '    <link rel="stylesheet" href="./assets/style.css">\n';
    html += '</head>\n';
    html += '<body>\n';
    html += '    <header>\n';
    html += '        <div id="header-brand">\n';
    html += beautify(fs.readFileSync(svg, "utf8"), {format: "xml"}) + '\n';
    html += '            <i>' + lang["Copy intended for the patient"] + '</i>\n';
    html += '        </div>\n';
    html += '        <div id="octeus-header">\n';
    html += '            <h2>' + lang["Health data"] + ' - OCTEUS Card</h2>\n';
    html += '            <div id="octeus-header-content">\n';
    html += '                <b>OCTEUS - 18 PARC ECONOMIQUE PAYSAGER 33750 BEYCHAC-ET-CAILLAU</b><br>\n';
    html += '                <i>' + lang["Mail"] + ': infos@octeus.com - ' + lang["Phone"] + ': +33750042849</i>\n';
    html += '                <small>Siret: 84029536400011 - Capital: 1000€</small>\n';
    html += '            </div>\n';
    html += '        </div>\n';
    html += '    </header>\n';
    html += '    <section id="section-1">\n';
    html += '        <div>\n';
    html += '            <p>' + lang["First name"] + ': <b>' + fixed.firstname.toUpperCase() + '</b> - ' + lang["Last Name"] + ': <b>' + fixed.lastname.toUpperCase() + '</b> - ' + lang["Sex"] + ': <b>' + sex + '</b></p>\n';
    html += '            <p><b>' + lang["Born " + sex] + ': ' + fixed.lastname.toUpperCase() + ' - ' + lang["Date"] + ': ' + date_b + '/' + month_b + '/' + year_b + '</b></p>\n';
    html += '            <small>' + address + '</small>\n';
    html += '            <br>\n';
    html += '            <p>ID: <b>' + fixed.puk + '</b></p>\n';
    html += '            <small>' + lang["Active since"] + ' <b>' + date_a + '/' + month_a + '/' + year_a + ' ' + lang["At"] + ' ' + hours_a + ':' + minutes_a + ':' + seconds_a + '</b> - ' + lang["Published on"] + ' <b>' + date + '/' + month + '/' + year + ' ' + lang["At"] + ' ' + hours + ':' + minutes + ':' + seconds + '</b></small>\n';
    html += '        </div>\n';
    html += '        <div>\n';
    html += '            <small>' + lang["Confidential data"] + '</small>\n';
    html += '            <h3>' + fixed.use_name.toUpperCase() + ' ' + fixed.firstname.toUpperCase() + '</h3>\n';
    html += '            <div>\n';
    html += '                <i>' + lang["Doctor"] + ' : ' + traveler.doctor.lastname.toUpperCase() + ' ' + traveler.doctor.firstname.toUpperCase() + '<br><b>' + traveler.doctor.email + '</b></i>\n';
    html += '            </div>\n';
    html += '        </div>\n';
    html += '    </section>\n';
    html += '    ' + loadData(data) + '\n';
    html += '    <footer>\n';
    html += '       <p id="footer-legals">Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem.' +
        ' Pellentesque in ipsum id orci porta dapibus. Curabitur aliquet quam id dui posuere blandit.<br>Sed' +
        ' porttitor lectus nibh. Pellentesque in ipsum id orci porta dapibus. Curabitur aliquet quam id dui posuere blandit.</p>\n';
    html += '       <div id="footer-left">\n';
    html += '           <p>' + lang["Certified data"] + '</p>\n';
    html += '           <p>' + traveler.certificate.lastname.toUpperCase() + ' ' + traveler.certificate.firstname + '</p>\n';
    html += '           <p>' + traveler.certificate.organisation + '</p>\n';
    html += '           <img src="./assets/signature.png">\n';
    html += '       </div>\n';
    html += '       <div id="footer-right">\n';
    html += '           <img src="./assets/stamp.png">\n';
    html += '       </div>\n';
    html += '    </footer>\n';
    html += '</body>\n';
    html += '</html>';

    fs.writeFileSync(file, html);
}

function loadData(data) {

    let traveler = data.traveler,
        fixed = data.fixed,
        lang = data.lang,
        html = dataRecords(data);

    return beautify(html, {format: 'html'});
}

function dataRecords(data) {

    let traveler = data.traveler,
        fixed = data.fixed,
        lang = data.lang,
        html = '',
        json = {};
    return html;
}