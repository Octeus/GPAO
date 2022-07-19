import QRCode from 'qrcode';
import {mapper} from "./Mapper";

let prefixes = ["+0", "+1", "+1", "+1-242", "+1-246", "+1-264", "+1-268", "+1-284", "+1-340", "+1-345", "+1-441", "+1-473", "+1-649", "+1-658", "+1-876", "+1-664", "+1-670", "+1-671", "+1-684", "+1-721", "+1-758", "+1-767", "+1-784", "+1-787", "+1-939", "+1-809", "+1-829", "+1-849", "+1-868", "+1-869", "+20", "+210", "+211", "+212", "+213", "+214", "+215", "+216", "+217", "+218", "+219", "+220", "+221", "+222", "+223", "+224", "+225", "+226", "+227", "+228", "+229", "+230", "+231", "+232", "+233", "+234", "+235", "+236", "+237", "+238", "+239", "+240", "+241", "+242", "+243", "+244", "+245", "+246", "+247", "+248", "+249", "+250", "+251", "+252", "+253", "+254", "+255", "+256", "+257", "+258", "+259", "+260", "+261", "+262", "+263", "+264", "+265", "+266", "+267", "+268", "+269", "+27", "+28", "+290", "+291", "+292", "+296", "+297", "+298", "+299", "+30", "+31", "+32", "+33", "+34", "+350", "+351", "+352", "+353", "+354", "+355", "+356", "+357", "+358", "+359", "+36", "+37", "+370", "+371", "+372", "+373", "+374", "+375", "+376", "+377", "+378", "+379", "+38", "+380", "+381", "+382", "+383", "+384", "+385", "+386", "+387", "+388", "+389", "+39", "+40", "+41", "+42", "+420", "+421", "+422", "+423", "+424", "+429", "+43", "+44", "+45", "+46", "+47", "+48", "+49", "+500", "+501", "+502", "+503", "+504", "+505", "+506", "+507", "+508", "+509", "+51", "+52", "+53", "+54", "+55", "+56", "+57", "+58", "+590", "+591", "+592", "+593", "+594", "+595", "+596", "+597", "+598", "+599", "+60", "+61", "+62", "+63", "+64", "+65", "+66", "+670", "+671", "+672", "+673", "+674", "+675", "+676", "+677", "+678", "+679", "+680", "+681", "+682", "+683", "+684", "+685", "+686", "+687", "+688", "+689", "+690", "+691", "+692", "+693", "+699", "+7", "+7", "+800", "+801", "+807", "+808", "+809", "+81", "+82", "+830", "+839", "+84", "+850", "+851", "+852", "+853", "+854", "+855", "+856", "+857", "+859", "+86", "+870", "+875", "+877", "+878", "+879", "+880", "+881", "+882", "+883", "+884", "+885", "+886", "+887", "+888", "+889", "+89", "+90", "+91", "+92", "+93", "+94", "+95", "+960", "+961", "+962", "+963", "+964", "+965", "+966", "+967", "+968", "+969", "+970", "+971", "+972", "+973", "+974", "+975", "+976", "+977", "+978", "+979", "+98", "+990", "+991", "+992", "+993", "+994", "+995", "+996", "+997", "+998", "+999"];

export function getRole(user, array) {

    let role = user.role,
        check = false;

    for (let i = 0; i < array.length; i++) {
        if (role.toLowerCase().includes(array[i])) {
            check = true;
            break;
        }
    }

    return check;
}

export function storage(item) {

    if (localStorage.getItem(item)) {
        try {
            let content = JSON.parse(localStorage.getItem(item))
            return content
        } catch {
            return null
        }
    }
    return null;
}

export function isJson(str) {

    if (typeof str === "string") {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    } else {
        return false
    }
}

export function packFormater(data, theme, index) {

    const generateQR = async text => {
        try {
            let win = document.querySelector('#window-' + index);
            if (win) {
                let canvas = win.querySelector('.qr-code canvas');
                await QRCode.toCanvas(canvas, text)
            }
        } catch (err) {
            console.error(err)
        }
    }

    setTimeout(() => {
        generateQR('https://octeus.fr')
    }, 500)

    let customer = JSON.parse(localStorage.getItem('customer'));
    let html = '<div class="' + theme + ' bg border-color customer-form delivery-form"><h1 class="' + theme + ' bg-2">PACKING FORM</h1>';
    html += '<ul class="packing-list">';
    html += '<li class="packing-type packing-' + data.pack + '"><img src="/assets/media/img/' + data.pack + '.png" alt="delivery type"/></li>';
    html += '<li class="' + theme + ' color border-color"><b class="' + theme + ' color-2">Average distance : </b>' + data.distance + 'km</li>';
    html += '<li class="' + theme + ' color border-color"><b class="' + theme + ' color-2">Weight : </b>' + data.weight + 'g</li>';
    html += '</ul>';
    html += '<div class="sticker-container ' + data.pack + '-container ' + theme + ' bg color">';
    html += '<div class="sticker-form ' + theme + ' bg-2 color">';
    html += '<div class="inputs input-ins ' + theme + ' color-2">';
    html += '<label><span>QR Code :</span>';
    html += '<textarea spellcheck="false" class="customer-form-input ' + theme + ' color border-color" type="text" name="fullname">https://octeus.fr</textarea>';
    html += '<div class="buttons ' + theme + ' bg">';
    html += '<button class="' + theme + ' bg-2 color" type="button" onclick="createQRCode(this.parentElement.previousElementSibling)">Update QR Code</button>';
    html += '</div>';
    html += '</label></div>';
    html += '<div class="inputs input-ins ' + theme + ' color-2">';
    html += '<label><span>Fullname :</span>';
    html += '<input spellcheck="false" class="customer-form-input ' + theme + ' color border-color" type="text" name="fullname" value="' + customer.fixed.lastname.toUpperCase() + ' ' + customer.fixed.firstname + '" oninput="setAddressListener(this, \'fullname\')"/>';
    html += '</label></div>';
    let to = data.coords.to.address;
    for (const toKey in to) {
        html += '<div class="inputs input-ins ' + theme + ' color-2">';
        html += '<label><span>' + toKey.replaceAll('_', ' ') + ' :</span>';
        html += '<input spellcheck="false" class="customer-form-input ' + theme + ' color border-color" type="text" name="' + toKey + '" value="' + to[toKey] + '" oninput="setAddressListener(this, \'' + toKey + '\')"/>';
        html += '</label></div>';
    }
    html += '</div>';
    html += '<div class="sticker sticker-' + data.pack + '">';
    html += '<div class="cutter">';
    html += '<svg viewBox="0 0 32 32"><path d="M21.5 20.988c1.934 0 3.5 2.016 3.5 4.5 0 2.486-1.566 4.5-3.5 4.5s-3.5-2.014-3.5-4.5c0-1.498 0.576-2.816 1.452-3.635l-3.452-4.955-3.453 4.955c0.877 0.819 1.453 2.137 1.453 3.635 0 2.486-1.567 4.5-3.5 4.5s-3.5-2.014-3.5-4.5c0-2.484 1.567-4.5 3.5-4.5 0.199 0 0.392 0.035 0.582 0.076l3.475-6.238-3.631-5.212c-2.961-5.129-0.62-7.604-0.62-7.604l5.694 10.225 5.694-10.224c0 0 2.341 2.475-0.62 7.604l-3.631 5.212 3.475 6.238c0.189-0.042 0.383-0.077 0.582-0.077zM10.5 22.969c-1.104 0-2 1.119-2 2.5s0.896 2.5 2 2.5 2-1.119 2-2.5-0.896-2.5-2-2.5zM16 14.073c-0.552 0-1 0.447-1 1 0 0.552 0.448 1 1 1 0.553 0 1-0.448 1-1 0-0.553-0.447-1-1-1zM19.5 25.469c0 1.381 0.896 2.5 2 2.5s2-1.119 2-2.5-0.896-2.5-2-2.5-2 1.119-2 2.5z"></path></svg>';
    html += '<div class="sticker-content">';
    if (data.pack === 'letter') {
        html += '<ul class="stick-letter">';
        html += '<li class="qr-code"><span class="loader"><span></span></span><canvas></canvas></li>';
        html += '<li><span data-name="fullname">' + customer.fixed.lastname.toUpperCase() + ' ' + customer.fixed.firstname + '</span></li>';
        html += '<li><span data-name="street">' + to.street + '</span></li>';
        html += '<li><span data-name="zip">' + to.zip + '</span> <span data-name="city">' + to.city + '</li>';
        html += '<li><span data-name="country">' + to.country.toUpperCase() + '</span></li>';
        html += '</ul>';
    } else {
        let from = data.coords.from.address;
        html += '<img class="bg-sticker" src="/assets/media/img/octeus-circuit-blue.svg"/>';
        html += '<div class="stick-package">';
        html += '<ul class="stick-package-top">';
        html += '<li class="stick-label">FROM :</li>';
        html += '<li><span>' + from.name + '</span></li>';
        html += '<li><span>' + from.street + '</span></li>';
        html += '<li><span>' + from.zip + '</span> <span data-name="city">' + from.city + '</li>';
        html += '<li><span>' + from.country.toUpperCase() + '</span></li>';
        html += '</ul>';
        html += '<span class="qr-code"><span class="loader"><span></span></span><canvas></canvas></span>';
        html += '<span class="weight-sticker"><b>Weight :</b> ' + data.weight + 'g</span>';
        html += '<ul class="stick-package-bottom">';
        html += '<li class="stick-label-to">TO :</li>';
        html += '<li><span data-name="fullname">' + customer.fixed.lastname.toUpperCase() + ' ' + customer.fixed.firstname + '</span></li>';
        html += '<li><span data-name="street">' + to.street + '</span></li>';
        html += '<li><span data-name="zip">' + to.zip + '</span> <span data-name="city">' + to.city + '</li>';
        html += '<li><span data-name="country">' + to.country.toUpperCase() + '</span></li>';
        html += '</ul>';
        html += '<i class="sticker-checker">Please check the contents of the package before accepting it or signing any acknowledgment of receipt.</i>';
        html += '</div>';
    }
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '<div class="buttons">';
    html += '<button class="' + theme + ' bg-2 color" type="button" onclick="printSticker(this, ' + index + ', \'' + data.pack + '\')">Print sticker</button>';
    html += '</div>';
    html += '</div>';
    return html;
}

export function formatTable(data, theme) {

    let html = 'This table does not exist',
        headings = '';

    if (data.length > 0) {

        let first = data[0];
        headings += '<thead><tr>';
        for (const key in first) {
            headings += '<th>' + key + '</th>';
        }
        headings += '</tr></thead>';
        html = '<table class="styled-table">' + headings + '<tbody>';
        for (let i = 0; i < data.length; i++) {
            let row = data[i];
            html += '<tr>';
            for (const rowKey in row) {
                let slicer = (row[rowKey] && row[rowKey].length > 100) ? row[rowKey].slice(0, 97) + '...' : row[rowKey];
                html += '<td><span>' + slicer + '</span></td>';
            }
            html += '</tr>';
        }
        html += '</tbody></table>';
    }

    return html;
}

export function setForms(data, theme) {

    let name = data.path.replace('/forms/', ''),
        content = data.content,
        html = '<div class="' + theme + ' bg border-color customer-form" data-key="' + ((name === 'strict') ? 'fixed' : name) + '"><h1 class="' + theme + ' bg-2">' + name.toUpperCase() + ' FORM</h1>',
        excepts = ['password', 'puk', 'avatar'],
        dates = ['birthdate'],
        radios = ['sex'],
        numbers = ['children', 'height', 'weight', 'bmi'],
        numbersRules = {
            'children': 1,
            'height': 0.1,
            'weight': 0.1,
            'bmi': 1
        },
        empty = true,
        specials = ['exams', 'treatments'];

    for (const key in content) {

        if (!excepts.includes(key)) {

            if (typeof content[key] !== 'object') {

                empty = false;
                html += '<div class="inputs input-ins ' + theme + ' color-2">';
                html += '<label><span>' + key.replaceAll('_', ' ') + ' :</span>';

                if (dates.includes(key)) {

                    html += '<input spellcheck="false" class="customer-form-input ' + theme + ' color border-color" type="date" name="' + key + '" value="' + content[key] + '" oninput="setFormListener(this, \'' + key + '\')"/>';

                    html += '<svg viewBox="0 0 24 24"><path d="M20.016 21v-12.984h-16.031v12.984h16.031zM20.016 3q0.797 0 1.383 0.609t0.586 1.406v15.984q0 0.797-0.586 1.406t-1.383 0.609h-16.031q-0.797 0-1.383-0.609t-0.586-1.406v-15.984q0-0.797 0.586-1.406t1.383-0.609h1.031v-2.016h1.969v2.016h10.031v-2.016h1.969v2.016h1.031z"></path></svg>';

                } else if (radios.includes(key)) {

                    let valTrue = (key === 'sex') ? ['Female', 'F'] : ['Yes', 'true'],
                        valFalse = (key === 'sex') ? ['Male', 'M'] : ['No', 'false'],
                        params = (key === 'sex') ? ['M', 'F'] : [true, false];

                    html += '<div class="radio-container"><label><input spellcheck="false" class="customer-form-input ' + theme + ' color border-color" type="radio" name="' + key + '" value="' + valTrue[1] + '" oninput="setFormListener(this, \'' + key + '\')" ' + ((content[key] === params[0]) ? 'checked' : '') + '/><span>' + valTrue[0] + '</span></label>';

                    html += '<label><input spellcheck="false" class="customer-form-input ' + theme + ' color border-color" type="radio" name="' + key + '" value="' + valFalse[1] + '" ' + ((content[key] === params[1]) ? 'checked' : '') + ' oninput="setFormListener(this, \'' + key + '\')"/><span>' + valFalse[0] + '</span></label></div>';

                } else if (key === 'language') {

                    html += '<select class="customer-form-input ' + theme + ' color border-color" name="' + key + '" oninput="setFormListener(this, \'' + key + '\')"/>';
                    html += '<option class="' + theme + ' bg-2" selected value="fr">French</option>';
                    html += '<option class="' + theme + ' bg-2" ' + ((content[key] === 'en') ? 'selected' : '') + ' value="en">English</option>';
                    html += '<option class="' + theme + ' bg-2" ' + ((content[key] === 'de') ? 'selected' : '') + ' value="de">German</option>';
                    html += '<option class="' + theme + ' bg-2" ' + ((content[key] === 'es') ? 'selected' : '') + ' value="es">Spanish</option>';
                    html += '</select>';

                } else if (key.includes('prefix')) {

                    html += '<select class="customer-form-input ' + theme + ' color border-color" name="' + key + '" oninput="setFormListener(this, \'' + key + '\')"/>';
                    for (let i = 0; i < prefixes.length; i++) {
                        html += '<option class="' + theme + ' bg-2" value="' + prefixes[i] + '" ' + ((content[key] === prefixes[i]) ? 'selected' : '') + '>' + prefixes[i] + '</option>';
                    }
                    html += '</select>';

                } else {

                    html += '<input spellcheck="false" class="customer-form-input ' + theme + ' color border-color" type="text" name="' + key + '" value="' + content[key] + '" oninput="setFormListener(this, \'' + key + '\')"/>';
                }
                html += '</label>';
                html += '</div>';

            } else {

                if (!specials.includes(name)) {

                    html += '<fieldset class="inputs input-ins sub-contents ' + theme + ' border-color color-2">';
                    html += '<legend>' + key.replaceAll('_', ' ') + '</legend>';
                    for (const contentKey in content[key]) {
                        empty = false;
                        html += '<div class="inputs input-ins ' + theme + ' color-2">';
                        html += '<label><span>' + contentKey.replaceAll('_', ' ') + ' :</span>';

                        if (dates.includes(contentKey)) {

                            html += '<input spellcheck="false" class="customer-form-input ' + theme + ' color border-color" type="date" name="' + key.toLowerCase().replaceAll('_', '') + '.' + contentKey + '" value="' + content[key][contentKey] + '" oninput="setFormListener(this, \'' + key.toLowerCase().replaceAll('_', '') + '.' + contentKey + '\')"/>';

                            html += '<svg viewBox="0 0 24 24"><path d="M20.016 21v-12.984h-16.031v12.984h16.031zM20.016 3q0.797 0 1.383 0.609t0.586 1.406v15.984q0 0.797-0.586 1.406t-1.383 0.609h-16.031q-0.797 0-1.383-0.609t-0.586-1.406v-15.984q0-0.797 0.586-1.406t1.383-0.609h1.031v-2.016h1.969v2.016h10.031v-2.016h1.969v2.016h1.031z"></path></svg>';

                        } else if (radios.includes(contentKey)) {

                            html += '<div class="radio-container"><label><input spellcheck="false" class="customer-form-input ' + theme + ' color border-color" type="radio" name="' + key.toLowerCase().replaceAll('_', '') + '.' + contentKey + '" value="true" oninput="setFormListener(this, \'' + key.toLowerCase().replaceAll('_', '') + '.' + contentKey + '\')" ' + ((content[key][contentKey] === true) ? 'checked' : '') + '/><span>Yes</span></label>';

                            html += '<label><input spellcheck="false" class="customer-form-input ' + theme + ' color border-color" type="radio" name="' + key.toLowerCase().replaceAll('_', '') + '.' + contentKey + '" value="false" ' + ((content[key][contentKey] === false) ? 'checked' : '') + ' oninput="setFormListener(this, \'' + key.toLowerCase().replaceAll('_', '') + '.' + contentKey + '\')"/><span>No</span></label></div>';

                        } else if (contentKey.includes('prefix')) {

                            html += '<select class="customer-form-input ' + theme + ' color border-color" name="' + key.toLowerCase().replaceAll('_', '') + '.' + contentKey + '" oninput="setFormListener(this, \'' + key.toLowerCase().replaceAll('_', '') + '.' + contentKey + '\')"/>';
                            for (let i = 0; i < prefixes.length; i++) {
                                html += '<option class="' + theme + ' bg-2" value="' + prefixes[i] + '" ' + ((content[key] === prefixes[i]) ? 'selected' : '') + '>' + prefixes[i] + '</option>';
                            }
                            html += '</select>';

                        } else {

                            html += '<input spellcheck="false" class="customer-form-input ' + theme + ' color border-color" type="text" name="' + key.toLowerCase().replaceAll('_', '') + '.' + contentKey + '" value="' + content[key][contentKey] + '" oninput="setFormListener(this, \'' + key.toLowerCase().replaceAll('_', '') + '.' + contentKey + '\')"/>';
                        }
                        html += '</label>';
                        html += '</div>';
                    }
                    html += '</fieldset>';

                } else {

                    empty = false;
                    if (name === 'exams') {

                        html += '<div id="exams-list"></div>';
                        html += '<div class="buttons">';
                        html += '<button type="button" onclick="addBlock(this, \'exams-list\', \'' + theme + '\')" class="' + theme + ' bg-2 color add-btn">Add an exam</button>';
                        html += '</div>';

                    } else {

                        html += '<div id="treatments-list"></div>';
                        html += '<div class="buttons">';
                        html += '<button type="button" onclick="addBlock(this, \'treatments-list\', \'' + theme + '\')" class="' + theme + ' bg-2 color add-btn">Add a treatment</button>';
                        html += '</div>';
                    }
                }
            }
        }
    }

    if (empty === true) {
        html += '<i>Nothing to display</i>';
    }
    html += '</div>';
    return html
}

export function templateFormater(data, theme) {

    let html = '<div class="' + theme + ' bg border-color customer-form design-form"><h1 class="' + theme + ' bg-2">DESIGN ' + data.name.toUpperCase() + '</h1>';
    html += '<ul class="design-faces">';
    html += '<li class="' + theme + ' bg-2 color" id="design-recto"><span class="' + theme + ' bg color border-color">Recto</span>' + data.recto + '</li>' ;
    html += '<li class="' + theme + ' bg-2 color" id="design-verso"><span class="' + theme + ' bg color border-color">Verso</span>' + data.verso + '</li>' ;
    html += '</ul>';
    html += '<div class="buttons">';
    html += '<button class="' + theme + ' bg-2 color" type="button" onclick="printTemplate(this, \'recto\')">Print Recto</button>';
    html += '<button class="' + theme + ' bg-2 color" type="button" onclick="printTemplate(this, \'verso\')">Print Verso</button>';
    html += '</div>';
    html += '<div class="' + theme + ' bg-2 color design-form-container">';

    html += '<div class="inputs input-ins ' + theme + ' color-2">';
    html += '<label><span>Lastname :</span>';
    html += '<input spellcheck="false" class="customer-form-input ' + theme + ' color border-color" type="text" name="lastname" value="DUPONT" oninput="setDesignListener(this, \'lastname\')"/>';
    html += '</div>';

    html += '<div class="inputs input-ins ' + theme + ' color-2">';
    html += '<label><span>Firstname :</span>';
    html += '<input spellcheck="false" class="customer-form-input ' + theme + ' color border-color" type="text" name="firstname" value="Nicolas" oninput="setDesignListener(this, \'firstname\')"/>';
    html += '</div>';

    html += '<div class="inputs input-ins ' + theme + ' color-2">';
    html += '<label><span>Birthdate :</span>';
    html += '<input spellcheck="false" class="customer-form-input ' + theme + ' color border-color" type="date" name="birthdate" value="1978-08-14" oninput="setDesignListener(this, \'birthdate\')"/>';
    html += '<svg viewBox="0 0 24 24"><path d="M20.016 21v-12.984h-16.031v12.984h16.031zM20.016 3q0.797 0 1.383 0.609t0.586 1.406v15.984q0 0.797-0.586 1.406t-1.383 0.609h-16.031q-0.797 0-1.383-0.609t-0.586-1.406v-15.984q0-0.797 0.586-1.406t1.383-0.609h1.031v-2.016h1.969v2.016h10.031v-2.016h1.969v2.016h1.031z"></path></svg>';
    html += '</div>';

    html += '<div class="inputs input-ins ' + theme + ' color-2">';
    html += '<label><span>Blood group :</span>';
    html += '<input spellcheck="false" class="customer-form-input ' + theme + ' color border-color" type="text" name="bloodgroup" value="A+" oninput="setDesignListener(this, \'bloodgroup\')"/>';
    html += '</div>';

    html += '</div>';
    html += '</div>';

    return html;
}

export function populateInputs(data) {

    let mapping = mapper(),
        fixedElmts = mapping.fixed,
        travelerElmts = mapping.traveler,
        excepts = ['puk', 'product', 'activate', 'activation_datetime', 'cloud', 'password', 'accepted_terms', 'language', 'avatar', 'accessibility', 'dark_mode', 'certificate', 'treatments', 'exams', 'notes', 'travels'],
        loadingModal = document.querySelector('#loading-modal');

    for (const dataKey in data.fixed) {
        if (!dataKey.includes(excepts)) {
            if (typeof data.fixed[dataKey] !== 'object') {
                let elmt = (fixedElmts[dataKey]) ? document.querySelector(fixedElmts[dataKey]) : null;
                if (fixedElmts[dataKey] && elmt) {
                    if (elmt.type === 'radio') {
                        let selector = '.customer-form[data-key="fixed"] .customer-form-input[name="' + dataKey + '"][value="' + data.fixed[dataKey][0] + '"]';
                        document.querySelector(selector).checked = true;
                    } else {
                        elmt.value = data.fixed[dataKey];
                    }
                }
            }
        }
    }

    for (const dataKey in data.traveler) {
        if (!dataKey.includes(excepts)) {
            if (typeof data.traveler[dataKey] !== 'object') {
                let elmt = (travelerElmts[dataKey]) ? document.querySelector(travelerElmts[dataKey]) : null;
                if (travelerElmts[dataKey] && elmt) {
                    elmt.value = data.traveler[dataKey];
                }
            } else {
                if (dataKey === 'ice' || dataKey === 'doctor') {
                    let item = data.traveler[dataKey];
                    for (const itemKey in item) {
                        for (const itemSubKey in item[itemKey]) {
                            let elmt = (travelerElmts[dataKey][itemKey][itemSubKey]) ? document.querySelector(travelerElmts[dataKey][itemKey][itemSubKey]) : null;
                            if (item[itemKey][itemSubKey] && elmt) {
                                elmt.value = data.traveler[dataKey][itemKey][itemSubKey];
                            }
                        }
                    }
                }
                if (dataKey === 'health') {
                    let item = data.traveler[dataKey];
                    for (const itemKey in item) {
                        if (typeof item[itemKey] !== 'object') {
                            let elmt = (travelerElmts[dataKey][itemKey]) ? document.querySelector(travelerElmts[dataKey][itemKey]) : null;
                            if (item[itemKey] && elmt) {
                                elmt.value = data.traveler[dataKey][itemKey];
                            }
                        } else {
                            for (const itemSubKey in item[itemKey]) {
                                let elmt = (travelerElmts[dataKey][itemKey][itemSubKey]) ? document.querySelector(travelerElmts[dataKey][itemKey][itemSubKey]) : null;
                                if (item[itemKey][itemSubKey] && elmt) {
                                    elmt.value = data.traveler[dataKey][itemKey][itemSubKey];
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    if (loadingModal) {
        document.body.removeChild(loadingModal);
    }
}