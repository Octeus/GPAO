/**
 * This is a namespace that contains documentation elements belonging to the SVGLister
 * domain.
 *
 * @namespace  SVGLister
 */

const path = require('path');
const fs = require('fs');
const { logger } = require('./logger');
const format = require('xml-formatter');

/**
 * Create React SVG Component.
 * @typedef {function}
 * @memberOf SVGLister
 * @param {string} svg - SVG file name in the IconsRef directory.
 * @param {string} component - React Component <Name />
 * @example
 * createReactSVGComponent('my_svg_file_name_without_extension', 'MyReactComponentName')
 * @returns {void}
 */

exports.createReactSVGComponent = (svg, component) => {

    const svgs = path.join(__dirname, '../../../IconsRef');
    const comp = path.join(__dirname, '../../src/common/Svg/' + component + '.js');
    let check = false;
    let content = 'import \'./Svg.css\';\n' +
        '\n' +
        'function ' + component + '() {\n' +
        '    return (\n';

    fs.readdir(svgs, (err, files) => {

        if (!err) {

            if (files.length > 0) {

                files.forEach(file => {

                    if (file === svg + '.svg') {

                        try {

                            let data = fs.readFileSync(path.join(svgs, file), {encoding: 'utf8', flag: 'r'});
                            content += format('<svg className=\'svg-icons\' ' + data.split('<svg ')[1]) + '\n';

                            content += '    );\n' +
                                '}\n' +
                                '\n' +
                                'export default ' + component + ';';

                            try {

                                fs.writeFileSync(comp, content);
                                try {

                                    fs.renameSync(path.join(svgs, svg + '.svg'), path.join(svgs, svg + '-used.svg'));
                                    logger('Rename ' + svg + '.svg to ' + svg + '-used.svg done');

                                } catch (err) {

                                    logger('The Svg called ' + svg + '.svg does not exist');
                                }

                                logger('File icons.html has been created successfully');
                                buildIndex(true);

                            } catch (err) {

                                logger('Create React component <' + component + '/> failed...', err);
                            }

                        } catch (err) {

                            logger('The Svg called ' + svg + '.svg does not exist');
                        }

                    } else if (file === svg + '-used.svg') {

                        check = true;

                    } else {

                        check = false;
                    }
                });

            } else {

                logger('The svg directory is empty');
            }

            if (check === true) {

                logger('The component <' + component + '/> is already created');

            } else {

                logger('The Svg called ' + svg + '.svg does not exist');
            }

        } else {

            logger('Failed reading IconsRef directory', err);
        }
    });
};

exports.createSVGIndexHTML = (force = false) => {

    buildIndex(force);
};

/**
 * Create the icons.html file, listing all available svg files in IconsRef directory.
 * @typedef {function}
 * @memberOf SVGLister
 * @param {boolean} force - Force the icons.html to overwrite itself if exists.
 * @returns {void}
 */

function buildIndex(force) {

    const svgs = path.join(__dirname, '../../../IconsRef');
    const htmlFile = path.join(__dirname, '../../../icons.html');

    if (!fs.existsSync(htmlFile) || force === true) {

        fs.readdir(svgs, (err, files) => {

            if (!err) {

                if (files.length > 0) {

                    logger('Reading SVGs directory');

                    let html = '<!DOCTYPE html>\n' +
                        '<html lang="fr">\n' +
                        '<head>\n' +
                        '    <meta charset="UTF-8">\n' +
                        '    <title>List icons</title>\n' +
                        '    <link rel="icon" href="./CRP/public/assets/media/img/favicon.png"/>\n' +
                        '\t<style>\n' +
                        '\t\tbody {\n' +
                        '\t\t\tdisplay: flex;\n' +
                        '\t\t\tflex-wrap: wrap;\n' +
                        '\t\t\tjustify-content: center;\n' +
                        '\t\t\talign-items: center;\n' +
                        '\t\t\twidth: 100%;\n' +
                        '\t\t\tbox-sizing: border-box;\n' +
                        '\t\t\tmargin: 0;\n' +
                        '\t\t\tpadding: 0;\n' +
                        '\t\t\tfont-family: \'Arial\', sans-serif;\n' +
                        '\t\t\tbackground-color: #E7E7E7;\n' +
                        '\t\t}\n' +
                        '\t\t#heading {\n' +
                        '\t\t\twidth: 100%;\n' +
                        '\t\t\tdisplay: flex;\n' +
                        '\t\t\tjustify-content: center;\n' +
                        '\t\t\talign-items: center;\n' +
                        '\t\t}\n' +
                        '\t\t.container {\n' +
                        '\t\t\twidth: calc(20% - 40px);\n' +
                        '\t\t\tmargin: 10px;\n' +
                        '\t\t\tpadding: 10px;\n' +
                        '\t\t\tborder-radius: 6px;\n' +
                        '\t\t\tdisplay: flex;\n' +
                        '\t\t\tjustify-content: flex-start;\n' +
                        '\t\t\talign-items: center;\n' +
                        '\t\t\tborder: 1px solid;\n' +
                        '\t\t\tbackground-color: #fff;\n' +
                        '\t\t}\n' +
                        '\t\t.used {\n' +
                        '\t\t\topacity: 0.3;\n' +
                        '\t\t}\n' +
                        '\n' +
                        '\t\t.container img {\n' +
                        '\t\t\twidth: 24px;\n' +
                        '\t\t\tmargin-right: 10px;\n' +
                        '\t\t}\n' +
                        '\t</style>\n' +
                        '</head>\n' +
                        '<body>\n' +
                        '<div id="heading">\n' +
                        '\t<h1>Icons list</h1>\n' +
                        '</div>';

                    files.forEach(file => {

                        if (file.includes('-used')) {

                            html += '<div class="container used">\n\t' +
                                '<img src="./IconsRef/' + file + '">\n\t' +
                                '<span>' + file.replace('-used.svg', '') + '</span>\n\t' +
                                '</div>\n';

                        } else {

                            html += '<div class="container">\n\t' +
                                '<img src="./IconsRef/' + file + '">\n\t' +
                                '<span>' + file.replace('.svg', '') + '</span>\n\t' +
                                '</div>\n';
                        }
                    });

                    html += '</body>\n' +
                        '</html>';

                    try {

                        fs.writeFileSync(htmlFile, html);
                        if (force === true) {

                            logger('File icons.html has been overwritten successfully');

                        } else {

                            logger('File icons.html has been created successfully');
                        }

                    } catch (err) {

                        logger('Create icons.html failed...', err);
                    }

                } else {

                    logger('The svg directory is empty');
                }

            } else {

                logger('Failed reading IconsRef directory', err);
            }
        });
    }
}