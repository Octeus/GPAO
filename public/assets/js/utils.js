/**
 * This is a namespace that contains documentation elements belonging to the MainUtils
 * domain.
 *
 * @namespace  MainUtils
 */

const fs = require('fs');
const pathUtils = require('path');
const { remote, shell } = require('electron');
const dialog = require('electron').remote.dialog;
const dns2 = require("dns2");
const ipc = require('electron').ipcRenderer;
const customTitlebar = require('custom-electron-titlebar');
const isWindowsPlatform = navigator.platform === 'Win32';
const version = '1.0.0';
let QRCode = require('qrcode');
let storage = {},
    root = getRootCSS(),
    confirmQuit = false,
    connectedTimeOut,
    loopCheckOnline = 1000,
    isWWW = false,
    titlebarOptions = {
        backgroundColor: customTitlebar.Color.fromHex('#fff'),
        minimizable: true,
        maximizable: true,
        closeable: true,
        enableMnemonics: true
    },
    L = require('leaflet'),
    matInterval,
    map,
    windowInterval,
    markers = [];
/*
========================================================
==================== Script JavaScript =================
========================================================
 */

if (localStorage.key('selectedDevice')) {
    localStorage.removeItem('selectedDevice');
}

isOnline();
window.setInterval(function() {
    isOnline();
}, loopCheckOnline);

connectionStt('off', []);
initializedWindow();
getAllDevices();

for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
        if (typeof localStorage[key] === 'string') {
            storage[key] = (isJson(localStorage[key])) ? JSON.parse(localStorage[key]) : localStorage[key]
        } else {
            storage[key] = localStorage[key];
        }
    }
}

//=========================== TitleBar invocation ===========================//

if (isWindowsPlatform) {

    titlebarOptions.backgroundColor = customTitlebar.Color.fromHex(root['__' + storage.settings.theme + '_theme_bg_primary']);
    titlebarOptions.icon = 'assets/media/img/favicon.svg';
    let titlebar = new customTitlebar.Titlebar(titlebarOptions);
    titlebar.updateTitle(' ');
}
document.querySelector('#container').style.visibility = 'visible';

//===========================================================================//

let showModals = document.querySelectorAll('.show-modals');

for (let i = 0; i < showModals.length; i++) {
    showModals[i].addEventListener('click', function (ev) {
        let elmt = ev.currentTarget,
            data = elmt.dataset.fn;

        ipc.send('invokeActionModal', data);
    });

}

document.onclick = function(ev) {
    let target = ev.target,
        nanos = document.querySelectorAll('.nano-windows'),
        terminals = document.querySelectorAll('.terminals'),
        terminalsArea = document.querySelectorAll('.textTerminals'),
        errorWindow = document.querySelector('.exit-modal-container'),
        errorInner = document.querySelector('#exit-modal'),
        setter;

    if (target.classList.contains('nano-windows') || target.closest('.nano-windows')) {
        //
    } else {
        for (let i = 0; i < nanos.length; i++) {
            if (nanos[i].querySelector('.footerNano')) {
                nanos[i].querySelector('.footerNano').style.display = 'none';
            }
            nanos[i].classList.remove('selected');
        }
    }

    if (errorWindow && errorWindow.style.display === 'flex') {

        if (target.id === 'exit-modal' || target.closest('#exit-modal')) {
            //
        } else {

            if (isWindowsPlatform) {

                shell.beep();
                clearTimeout(setter);
                errorInner.style.animation = 'none';
                errorInner.style.animation = 'exit-clignote linear 0.3s';
                setter = setTimeout(function () {
                    document.querySelector('#exit-modal').style.animation = 'none';
                }, 310);

            } else {
                //
            }
        }
    }

    if (target.classList.contains('system-infos-header-window') || target.closest('.system-infos-header-window') || target.classList.contains('header-settings-trigger') || target.closest('.header-settings-trigger')) {
        //
    } else {
        if (document.querySelector('#header-settings-trigger')) {
            document.querySelector('#header-settings-trigger').classList.remove('displaySystemNanoModal');
        }
    }

    if (target.id === 'to-list' || target.closest('#to-list')) {
        //
    } else {
        if (document.querySelector('#to-list')) {
            document.querySelector('#to-list').innerHTML = '';
            document.querySelector('#to-list').classList.add('hidden');
        }
    }
}

function initializedWindow() {

    let startWindow = document.querySelector('#loading-modal');
    let action = document.body.dataset.action;
    if (startWindow) {

        clearTimeout(windowInterval);
        let loaderSpan = startWindow.querySelector("#loading-bar span");
        loaderSpan.classList.add('fullStartLoader');
        windowInterval = setTimeout(function () {
            startWindow.parentElement.removeChild(startWindow);
        }, 1500)
    }
}

/*
========================================================
================= Functions JavaScript =================
========================================================
 */

/**
 * Update table in database and reset localStorage.
 * @typedef {function}
 * @memberOf MainUtils
 * @param {string} table - Table name.
 * @param {object} obj - JSON Database object used to update the table.
 * @returns {void}
 */

function remoteUpdateDB(table, obj, close = false) {

    ipc.once('actionReplyDBWrite', function (event, response) {
        localStorage.setItem(response[1], JSON.stringify(response[0]));
        if (close !== false) {
            ipc.send('invokeActionRestartApp');
        }
    });
    ipc.send('invokeActionDBWrite', ['write', table, obj]);
}

/**
 * Check if the application is web connected.
 * @typedef {function}
 * @memberOf MainUtils
 * @returns {void}
 */

function isOnline() {

    try {

        const xhr = new XMLHttpRequest();
        xhr.onload = async function () {
            const dns = new dns2({recursive: 'boolean'});
            const result = await dns.resolveA('api.octeus.fr');
            if (isWWW === false) {
                isWWW = true;
                connectionStt('on', result.answers);
            }
        }
        xhr.onerror = function () {
            if (isWWW === true) {
                isWWW = false;
                connectionStt('off', []);
            }
        }
        xhr.onabort = function () {
            if (isWWW === true) {
                isWWW = false;
                connectionStt('off', []);
            }
        }
        xhr.open("GET", "https://google.com");
        xhr.send();

    } catch {

        connectionStt('off', []);
    }
}

/**
 * Display HTML button statement about internet connection status
 * @typedef {function}
 * @memberOf MainUtils
 * @param {string} mode - If online or not.
 * @param {array} details - Array of connection states
 * @returns {void}
 */

function connectionStt(mode, details) {

    ipc.once('actionReplyOnline', function (event, status) {
        let synchro = document.querySelector('#connexion-info'),
            cloud = document.querySelector('#cloud-info');

        if (synchro) {

            setConnexionStt(status);
            setCloudStt(status);

            if (status.mode === 'on') {

                synchro.children[1].innerHTML = '<svg class="blue soloIcon" viewBox="0 0 24 24"><path d="M5.016' +
                    ' 12.984q2.906-2.859 7.008-2.859t6.961 2.859l-1.969 2.016q-0.844-0.844-2.32-1.453t-2.695-0.609-2.695 0.609-2.32 1.453zM9 17.016q1.266-1.266 3-1.266t3 1.266l-3 3zM0.984 9q4.594-4.547 11.039-4.547t10.992 4.547l-2.016 2.016q-3.75-3.703-9-3.703t-9 3.703z"></path></svg>';
                synchro.classList.remove('unsync');
                synchro.children[1].dataset.title = 'You are connected to the web'

                cloud.children[1].innerHTML = '<svg class="' + storage.settings.theme + ' color soloIcon" viewBox="0 0 24 24"><path d="M9.984 17.016l6.609-6.609-1.406-1.406-5.203 5.156-2.063-2.063-1.406 1.406zM19.359 10.031q1.922 0.141 3.281 1.57t1.359 3.398q0 2.063-1.477 3.539t-3.539 1.477h-12.984q-2.484 0-4.242-1.758t-1.758-4.242q0-2.203 1.57-3.961t3.773-1.992q0.984-1.828 2.766-2.953t3.891-1.125q2.531 0 4.711 1.781t2.648 4.266z"></path></svg>';
                cloud.classList.remove('unsync');
                cloud.children[1].dataset.title = 'Cloud is online'

            } else {

                synchro.children[1].innerHTML = '<svg class="red soloIcon" viewBox="0 0 24 24"><path d="M9' +
                    ' 17.016q1.266-1.266 3-1.266t3 1.266l-3 3zM2.016 3.047l1.266-1.266 16.969 16.969-1.266 1.266-7.078-7.078q-1.172 0-2.625 0.609t-2.297 1.453l-1.969-1.969v-0.047q1.828-1.828 4.406-2.531l-2.25-2.203q-2.297 0.938-4.172 2.766l-2.016-2.016q1.828-1.828 4.078-2.906zM18.984 12.984l-0.938 0.984-3.563-3.516q2.672 0.703 4.5 2.531zM22.969 9l-1.969 2.016q-3.938-4.031-9.656-3.703l-2.484-2.531q3.797-0.797 7.523 0.281t6.586 3.938z"></path></svg>';
                synchro.children[1].dataset.title = 'Web connexion is disabled'
                synchro.classList.add('unsync');

                cloud.children[1].innerHTML = '<svg class="red soloIcon" viewBox="0 0 24 24"><path d="M19.359 10.031q1.922 0.141 3.281 1.57t1.359 3.398q0 2.063-1.477 3.539t-3.539 1.477h-12.984q-2.484 0-4.242-1.758t-1.758-4.242q0-2.203 1.57-3.961t3.773-1.992q0.984-1.828 2.766-2.953t3.891-1.125q2.531 0 4.711 1.781t2.648 4.266z"></path></svg>';
                cloud.children[1].dataset.title = 'Cloud is offline'
                cloud.classList.add('unsync');
            }
        }
    });
    ipc.send('online-status', { 'mode': mode, 'details': details });
}

/**
 * Get root css file content
 * @typedef {function}
 * @memberOf MainUtils
 * @returns {object} - All root css properties in a json object.
 */

function getRootCSS() {

    let final = {},
        rootFile = ':root {\n' +
            '    --default-theme-bg-primary: #f7f7f7;\n' +
            '    --default-theme-bg-secondary: #d1d1d1;\n' +
            '    --default-theme-bg-hover: #c1c1c1;\n' +
            '    --default-theme-color-primary: #3c3c3c;\n' +
            '    --default-theme-color-secondary: #6d6d6d;\n' +
            '    --default-theme-border-color: #191919;\n' +
            '    --default-theme-exit-heading-bg: #ccc;\n' +
            '    --default-theme-opacity: rgba(255, 255, 255, 0.5);\n' +
            '\n' +
            '    --dark-theme-bg-primary: #191919;\n' +
            '    --dark-theme-bg-secondary: #1f1f1f;\n' +
            '    --dark-theme-bg-hover: #363636;\n' +
            '    --dark-theme-color-primary: #f7f7f7;\n' +
            '    --dark-theme-color-secondary: #a1a1a1;\n' +
            '    --dark-theme-border-color: #5d5d5d;\n' +
            '    --dark-theme-exit-heading-bg: #191919;\n' +
            '    --dark-theme-opacity: rgba(0, 0, 0, 0.5);\n' +
            '\n' +
            '    --ocean-theme-bg-primary: #041111;\n' +
            '    --ocean-theme-bg-secondary: #111f28;\n' +
            '    --ocean-theme-bg-hover: #264659;\n' +
            '    --ocean-theme-color-primary: #457b9d;\n' +
            '    --ocean-theme-color-secondary: #a8cfdd;\n' +
            '    --ocean-theme-border-color: #ccc;\n' +
            '    --ocean-theme-exit-heading-bg: #041111;\n' +
            '    --ocean-theme-opacity: rgba(0, 0, 0, 0.5);\n' +
            '\n' +
            '    --dracula-theme-bg-primary: #110202;\n' +
            '    --dracula-theme-bg-secondary: #161616;\n' +
            '    --dracula-theme-bg-hover: #404040;\n' +
            '    --dracula-theme-color-primary: #8f0000;\n' +
            '    --dracula-theme-color-secondary: #fff;\n' +
            '    --dracula-theme-border-color: #110207;\n' +
            '    --dracula-theme-exit-heading-bg: #110202;\n' +
            '    --dracula-theme-opacity: rgba(0, 0, 0, 0.5);\n' +
            '\n' +
            '    --unicorn-theme-bg-primary: #f7e9f3;\n' +
            '    --unicorn-theme-bg-secondary: #aaeae8;\n' +
            '    --unicorn-theme-bg-hover: #ebc7e1;\n' +
            '    --unicorn-theme-color-primary: #cbb272;\n' +
            '    --unicorn-theme-color-secondary: #af7ce0;\n' +
            '    --unicorn-theme-border-color: #abe7e2;\n' +
            '    --unicorn-theme-exit-heading-bg: #aaeae8;\n' +
            '    --unicorn-theme-opacity: rgba(255, 255, 255, 0.5);\n' +
            '}',
        splitRootFile = rootFile.split('\n');

    for (let i = 0; i < splitRootFile.length; i++) {

        let line = splitRootFile[i].trim();
        if (!line.includes(':root') && !line.includes('}') && line.length > 0) {

            let split = line.split(':'),
                key = split[0].trim().replaceAll('-', '_');
            final[key] = split[1].trim().replaceAll(';', '');
        }
    }
    return final;
}

/**
 * Send notifications to system from render process.
 * @typedef {function}
 * @memberOf MainUtils
 * @param {object} data - Object with notification data.
 * @param {function} callback - function | null - Optional callback.
 * @returns {void}
 */

function sendNotification(data, callback = null) {

    ipc.once('replyNotifications', function (event, mess) {
        if (callback !== null) {
            callback(mess);
        }
    });
    ipc.send('notifications', data);
}

ipc.on('fileOperations', function (event, mess) {

    if (mess === 'saveAs') {

        dialog.showSaveDialog(remote.getCurrentWindow(), {
            title: 'Save File',
            filters: [
                { name: 'OSDC Files', extensions: ['osdc'] }
            ],
            buttonLabel: 'Save',
            defaultPath: 'test.osdc'
        }).then(result => {

            if (result.canceled === false) {
                console.log(result.filePath);
            }

        }).catch(err => {
            console.log(err)
        });
    }

    if (mess === 'save') {


    }
});

function getModal(e) {

    let target = e.currentTarget;
    document.body.click();
    target.classList.remove('selected');
}

function setConnexionStt(status) {

    let nanoWindow = document.querySelector('#footerNano-1'),
        container = nanoWindow.querySelector('.footerNanoContent'),
        mode = status.mode,
        details = status.details,
        classe = (details.length > 0) ? 'green' : 'red',
        contents = (details.length > 0)
            ?  details[0]
            : {
                address: "Not available",
                class: -1,
                name: "Not available",
                ttl: 000,
                type: 0
            };

    for (const key in contents) {

        let li = container.querySelector('li[data-name="' + key + '"]');
        li.querySelector('span').className = classe;
        li.querySelector('span').innerHTML = contents[key];
    }
}

function setCloudStt(status) {

    let nanoWindow = document.querySelector('#footerNano-2'),
        container = nanoWindow.querySelector('.footerNanoContent'),
        mode = status.mode;

    if (mode === 'on') {
        nanoWindow.style.visibility = 'visible';
    } else {
        nanoWindow.style.visibility = 'hidden';
    }
}

function getAllDevices() {

    let ul = document.querySelector('#devices-list');
    if (ul) {

        ul.innerHTML = '';
        ipc.once('devices.reply', function (event, devices) {

            for (let i = 0; i < devices.length; i++) {

                let li = document.createElement('LI'),
                    device = devices[i],
                    path = (device.mountpoints) ? device.mountpoints[0].path : device.mounted,
                    desc = (device.description) ? device.description : device.filesystem,
                    size = (device.size) ? device.size : device.blocks,
                    used = (device.size) ? device.size - device.available : device.used,
                    left = device.available,
                    isOcteus = device.octeus;

                li.setAttribute('class', 'device-li');

                let html = '<b>';
                if (left > 20 && isOcteus === false) {
                    html += '<input name="devices-item" oninput="setDevice(this)" type="radio" class="with-font" value=\'' + JSON.stringify(device) + '\'>';
                }
                html += path.replace('\\', '') + ' ' + desc;
                html += (isOcteus === true) ? '<span class="octeus-original">Octeus Device</span>' : ''
                html += '</b><ul>';
                html += '<li>Total size:&nbsp;<span>' + humanizeSize(size) + '</span></li>';
                html += '<li>Used size:&nbsp;<span>' + humanizeSize(used) + '</span></li>';
                html += '<li>Available size:&nbsp;<span>' + humanizeSize(left) + '</span></li>';
                html += '<ul>';

                li.innerHTML = html;
                ul.appendChild(li);
            }

            let btn = document.querySelector('#device-title button');
            btn.onclick = function() {
                getAllDevices();
            }
        });
        ipc.send('devices');
    }
}

function setDevice(elmt) {

    if (elmt.checked === true) {
        localStorage.setItem('selectedDevice', elmt.value);
    } else {
        if (localStorage.key('selectedDevice')) {
            localStorage.removeItem('selectedDevice');
        }
    }
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

function capitalize(str) {

    if (typeof str === 'string') {

        let first = str.substr(0, 1),
            rest = str.substr(1);
        return first.toUpperCase() + rest;
    }
    return str;
}

function searchSettings(e) {

    let target = e.currentTarget,
        text = target.value;
    console.log(text);
}

function setMap(coord, places, orphans) {

    clearInterval(matInterval);

    //Set icons
    let myIcons = [
        L.icon({
            iconUrl: 'assets/media/img/markers/develop.png',
            iconSize: [33, 50],
            iconAnchor: [18, 50],
            popupAnchor: [-3, -76],
            shadowUrl: 'assets/media/img/markers/marker-shadow.png',
            shadowSize: [68, 95],
            shadowAnchor: [22, 94]
        }),
        L.icon({
            iconUrl: 'assets/media/img/markers/production.png',
            iconSize: [33, 50],
            iconAnchor: [18, 50],
            popupAnchor: [-3, -76],
            shadowUrl: 'assets/media/img/markers/marker-shadow.png',
            shadowSize: [68, 95],
            shadowAnchor: [22, 94]
        }),
        L.icon({
            iconUrl: 'assets/media/img/markers/head-quarter.png',
            iconSize: [33, 50],
            iconAnchor: [18, 50],
            popupAnchor: [-3, -76],
            shadowUrl: 'assets/media/img/markers/marker-shadow.png',
            shadowSize: [68, 95],
            shadowAnchor: [22, 94]
        }),
        L.icon({
            iconUrl: 'assets/media/img/markers/operator.png',
            iconSize: [33, 50],
            iconAnchor: [18, 50],
            popupAnchor: [-3, -76],
            shadowUrl: 'assets/media/img/markers/marker-shadow.png',
            shadowSize: [68, 95],
            shadowAnchor: [22, 94]
        })
    ];

    let group = L.layerGroup();
    for (let i = 0; i < places.length; i++) {
        L.marker(places[i].coord, {icon: myIcons[i]}).bindPopup(places[i].popup).addTo(group);
    }

    // Set layers
    let mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
        grayscale = L.tileLayer(mbUrl, {
            id: 'mapbox/light-v9',
            tileSize: 512,
            zoomOffset: -1
        }),
        streets = L.tileLayer(mbUrl, {
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1
        }),
        baseLayers = {
            'Streets': streets,
            'Grayscale': grayscale
        };

    // Render map
    map = L.map('map', {
            center: coord,
            zoom: 9,
            layers: [streets, group]
        });
    L.control.layers(baseLayers).addTo(map);

    for (let i = 0; i < orphans.length; i++) {
        L.marker(orphans[i].coord, {icon: myIcon}).bindPopup(orphans[i].popup).addTo(map);
    }

    // Set Map Size on resize
    matInterval = setInterval(function () {
        map.invalidateSize();
    }, 100);
}

function resetMap(coord, orphans) {

    for (let i = 0; i < markers.length; i++) {
        map.removeLayer(markers[i]);
    }
    markers = [];

    let myIcons = [
        L.icon({
            iconUrl: 'assets/media/img/markers/arrow.png',
            iconSize: [33, 50],
            iconAnchor: [18, 50],
            popupAnchor: [-3, -76]
        }),
        L.icon({
            iconUrl: 'assets/media/img/markers/customer.png',
            iconSize: [33, 50],
            iconAnchor: [18, 50],
            popupAnchor: [-3, -76],
            shadowUrl: 'assets/media/img/markers/marker-shadow.png',
            shadowSize: [68, 95],
            shadowAnchor: [22, 94]
        })
    ];

    for (let i = 0; i < orphans.length; i++) {
        let name = (orphans[i].popup.name) ? orphans[i].popup.name : 'Customer'
        let neo = L.marker(orphans[i].coord, {icon: myIcons[i]}).bindPopup(name).addTo(map);
        markers.push(neo)
    }
    map.flyTo(coord, 8)
}

ipc.on('invokeConnexionBox.fromNew', function (event) {
    ipc.send('invokeConnexionBox', 'new');
});

ipc.on('invokeConnexionBox.fromMain', function (event) {
    ipc.send('invokeConnexionBox', 'main');
});

function isJson(str) {

    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function setFormListener(elmt, name) {

    let value = elmt.value,
        key = elmt.closest('.customer-form').dataset.key,
        cle = document.querySelector('.customer-sections[data-key="' + key + '"] .customer-checks[data-key="' + name + '"]'),
        ok = '<path d="M28 0h-24c-2.2 0-4 1.8-4 4v24c0 2.2 1.8 4 4 4h24c2.2 0 4-1.8 4-4v-24c0-2.2-1.8-4-4-4zM14 24.828l-7.414-7.414 2.828-2.828 4.586 4.586 9.586-9.586 2.828 2.828-12.414 12.414z"></path>',
        nok = '<path d="M28 0h-24c-2.2 0-4 1.8-4 4v24c0 2.2 1.8 4 4 4h24c2.2 0 4-1.8 4-4v-24c0-2.2-1.8-4-4-4zM28 28h-24v-24h24v24z"></path>',
        check = controlFormat(elmt, name);

    if (check === true || elmt.value.length < 1) {
        elmt.classList.remove('not-validated');
    } else {
        elmt.classList.add('not-validated');
    }

    if (value !== '' && check === true) {
        cle.querySelector('svg').innerHTML = ok;
    } else {
        cle.querySelector('svg').innerHTML = nok;
    }
}

function setAllFormListeners() {

    let controls = document.querySelectorAll('.customer-form-input')
    for (let i = 0; i < controls.length; i++) {
        let name = controls[i].name;
        setFormListener(controls[i], name);
    }
}

function controlFormat(elmt, name) {

    let dates = ['birthdate'],
        emails = ['email'],
        numbers = ['bmi', 'phone', 'mobile', 'children'],
        decimals = ['weight', 'height'],
        value = elmt.value,
        split = name.split('.'),
        now = new Date();
        validated = true;
    name = (split.length > 1) ? split[split.length - 1] : name;

    if (dates.includes(name)) {
        let date = new Date(value);
        validated = now.getTime() > date.getTime();
    } else if (emails.includes(name)) {
        let valide = String(value)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
        validated = valide !== null;
    } else if (numbers.includes(name)) {
        elmt.value = value.replace(/\D/g, "");
    } else if (decimals.includes(name)) {
        elmt.value = value.replace(/[^\d.]|\.(?=.*\.)/g, "");
    } else if (name === 'blood_group') {
        let validBloodGroupRegex = /^(A|B|AB|O)[+-]$/i;
        validated = validBloodGroupRegex.test(value);
        elmt.value = value.toUpperCase();
    }

    return validated;
}

function setAddressListener(elmt, name) {

    let parent = elmt.closest('.sticker-container'),
        span = parent.querySelector('span[data-name="' + name + '"]'),
        value = elmt.value;

    span.innerHTML = value;
}

function createQRCode(elmt) {

    let text = elmt.value,
        selector = elmt.closest('.sticker-container').querySelector('.qr-code');
    selector.querySelector('.loader').classList.add('visible');

    QRCode.toCanvas(selector.querySelector('canvas'), text, function (err, url) {
        if (err) {
            console.log(err)
        } else {
            if (selector) {
                selector.querySelector('.loader').classList.remove('visible');
                //selector.querySelector('img').src = url;
            }
        }
    })
}

function printSticker(elmt, index, type) {

    let sticker = elmt.closest('.delivery-form').querySelector('.sticker');
    let style = document.createElement('style');
    style.innerHTML = '@media print {\n' +
        '\n' +
        '    body {\n' +
        '        background-color: #fff;\n' +
        '    }\n' +
        '\n' +
        '    body > div:not(.container-after-titlebar),\n' +
        '    #container > header,\n' +
        '    #container > aside,\n' +
        '    #container > footer,\n' +
        '    #drag-zone,\n' +
        '    #main-theme-avatar{\n' +
        '        display: none!important;\n' +
        '    }\n' +
        '\n' +
        '    #window-' + index + ' .sticker-container {\n' +
        '        position: fixed;\n' +
        '        background-color: #fff;\n' +
        '        z-index: 99999999;\n' +
        '        top: 0;\n' +
        '        left: 0;\n' +
        '        width: 100%;\n' +
        '        height: 100%;\n' +
        '    }\n' +
        '\n' +
        '    #window-' + index + ' .sticker-container > .sticker-form, #window-' + index + ' .sticker-container > .buttons {\n' +
        '        display: none;\n' +
        '    }\n' +
        '\n' +
        '    #window-' + index + ' .sticker {\n' +
        '        position: fixed;\n' +
        '        z-index: 999999999;\n' +
        '        top: 0;\n' +
        '        left: 0;\n' +
        '        box-shadow: unset!important;\n' +
        '    }\n' +
        '}';
    sticker.appendChild(style);
    let d = new Date();
    let title = document.title;
    document.title = type.toUpperCase() + '-' + d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2) + ' ' + ('0' + d.getHours()).slice(-2) + 'h' + ('0' + d.getMinutes()).slice(-2) + 'm' + ('0' + d.getSeconds()).slice(-2) + 's';
    window.print();
    document.title = title;
    sticker.removeChild(style);
}

function printTemplate(elmt, face) {

    let svg = elmt.closest('.design-form').querySelector('#design-' + face + ' svg').outerHTML,
        fullname = elmt.closest('.design-form').querySelector('input[name="firstname"]').value + ' ' + elmt.closest('.design-form').querySelector('input[name="lastname"]').value

    dialog.showSaveDialog(remote.getCurrentWindow(), {
        title: 'Save ' + face + ' template',
        filters: [
            { name: 'Document', extensions: ['pdf'] }
        ],
        buttonLabel: 'Save',
        defaultPath: face + '.pdf'
    }).then(result => {

        if (result.canceled === false) {

            ipc.send('saveTemplateFace', {
                'fullname': fullname,
                'face': face,
                'svg': svg,
                'pathTo': result.filePath
            });
        }

    }).catch(err => {
        console.log(err)
    });
}

function setDesignListener(elmt, name) {

    let parent = elmt.closest('.design-form'),
        target = parent.querySelector('text[data-id="' + name + '"]'),
        value = elmt.value;

    if (elmt.type === 'date') {
        let split = value.split('-');
        target.innerHTML = split[2] + '/' + split[1] + '/' + split[0];
    } else {
        target.innerHTML = value;
    }
}

function addBlock(elmt, to, theme) {

    let data = JSON.parse(localStorage.getItem(to.replace('-list', '')))[0],
        list = document.querySelector('#' + to),
        children = list.children.length,
        counter = document.querySelector('#' + to.replace('-list', '') + '-counter'),
        div = document.createElement('fieldset'),
        removeBtn = document.querySelector('#remove-last-' + to.replace('s-list', '')),
        html = '<legend>' + to.replace('s-list', '') + ' ' + (children + 1) + '</legend>';
    if (removeBtn) {
        removeBtn.parentElement.removeChild(removeBtn);
    }
    html += '<button class="' + theme + ' bg-2 color removeBtn" id="remove-last-' + to.replace('s-list', '') + '" type="button" onclick="removeBlock(\'' + to + '\', \'' + theme + '\')">Delete</button>';
    div.setAttribute('class', to + '-item inputs input-ins sub-contents ' + theme + ' border-color color-2');
    div.dataset.child = children;

    for (const key in data) {
        if (typeof data[key] !== 'object') {
            html += '<div class="inputs input-ins ' + theme + ' color-2">';
            html += '<label><span>' + key.replaceAll('_', ' ') + ' :</span>';
            if (key !== 'date') {
                html += '<input spellcheck="false" class="customer-form-input ' + theme + ' color border-color" type="text" name="' + key + '" value="' + data[key] + '"/>';
            } else {
                html += '<input spellcheck="false" class="customer-form-input ' + theme + ' color border-color" type="date" name="' + key.toLowerCase().replaceAll('_', '') + '.' + key + '" value="' + data[key] + '"/>';

                html += '<svg viewBox="0 0 24 24"><path d="M20.016 21v-12.984h-16.031v12.984h16.031zM20.016 3q0.797 0 1.383 0.609t0.586 1.406v15.984q0 0.797-0.586 1.406t-1.383 0.609h-16.031q-0.797 0-1.383-0.609t-0.586-1.406v-15.984q0-0.797 0.586-1.406t1.383-0.609h1.031v-2.016h1.969v2.016h10.031v-2.016h1.969v2.016h1.031z"></path></svg>';
            }
            html += '</label>';
            html += '</div>';
        } else {
            html += '<div class="inputs input-ins ' + theme + ' color-2">';
            html += '<div class="label-like"><span class="special-label-span ' + theme + ' bg-2">' + key.replaceAll('_', ' ') + ' :</span>';
            if (key !== 'drugs') {
                for (const sub in data[key]) {
                    html += '<p>' + sub + ' files list:</p>';
                    html += '<ul class="' + to.replace('s-list', '') + '-' + key + '-' + sub + '-list-' + children + '"><li class="add-item"><i>Add item</i></li></ul>';
                    if (sub !== 'dicom') {
                        let ext = (sub === 'pdf') ? '.pdf' : '.mp4,.avi,.mov,.mkv';
                        html += '<button class="' + theme + ' bg-2 color addDrug" type="button" onclick="this.nextElementSibling.click()">Import file</button>';
                        html += '<input accept="' + ext + '" type="file" onchange="setImportedFiles(this, \'' + to.replace('s-list', '') + '.' + key + '.' + sub + '-list' + children + '\', \'' + ext + '\', \'' + theme + '\')">';
                    } else {
                        html += '<button class="' + theme + ' bg-2 color addDrug" type="button" onclick="getDicomPath(this, \'' + theme + '\')">Import DICOMDIR file</button>';
                    }
                }
            } else {
                html += '<div class="drugs-list"><i>Add item</i></div>';
                html += '<button class="' + theme + ' bg-2 color addDrug" id="add-drug-' + children + '" type="button" onclick="addDrug(this, ' + children + ', \'' + theme + '\')">Add drug</button>';
            }
            html += '</div>';
            html += '</div>';
        }
    }
    div.innerHTML = html;
    list.appendChild(div);
    counter.innerHTML = (children + 1 === 1)
        ? (children + 1) + ' ' + to.replace('s-list', '')
        : (children + 1) + ' ' + to.replace('-list', '');
}

function removeBlock(to, theme) {

    let blocks = document.querySelectorAll('.' + to + '-item'),
        last = blocks[blocks.length-1],
        list = document.querySelector('#' + to),
        children = list.children.length,
        counter = document.querySelector('#' + to.replace('-list', '') + '-counter');
    last.parentElement.removeChild(last);
    if (children - 1 > 0) {
        counter.innerHTML = (children - 1 === 1)
            ? (children - 1) + ' ' + to.replace('s-list', '')
            : (children - 1) + ' ' + to.replace('-list', '');
    } else {
        counter.innerHTML = '<i>No ' + to.replace('s-list', '') + ' yet</i>';
    }

    let lasts = document.querySelectorAll('.' + to + '-item'),
        newLast = lasts[lasts.length-1];

    if (lasts.length > 0) {
        let btn = document.createElement('button');
        btn.setAttribute('type', 'button');
        btn.setAttribute('class', theme + ' bg-2 color removeBtn');
        btn.setAttribute('id','remove-last-' + to.replace('s-list', ''));
        btn.setAttribute('onclick', 'removeBlock(\'' + to + '\', \'' + theme + '\')');
        btn.innerHTML = 'Delete';
        newLast.insertBefore(btn, newLast.children[1]);
    }
}

function addDrug(elmt, child, theme) {

    let i = elmt.previousElementSibling.querySelector('i'),
        parent = elmt.previousElementSibling;

    if (i) {
        parent.removeChild(i);
    }

    let div = document.createElement('fieldset'),
        children = parent.children.length,
        removeBtn = elmt.parentElement.querySelector('#removeDrugBtn'),
        html = '<legend>Drug ' + (children + 1) + ' :</legend>',
        model = JSON.parse(localStorage.getItem('treatments'))[0].drugs[0];

    if (removeBtn) {
        removeBtn.parentElement.removeChild(removeBtn);
    }

    div.dataset.key = child;
    div.setAttribute('class', theme + ' border-color color-2 drug-list-item');
    html += '<button class="' + theme + ' bg-2 color removeDrug" type="button" onclick="deleteDrug(this, \'' + theme + '\')" id="removeDrugBtn">Delete</button>';
    for (const key in model) {
        html += '<div class="inputs input-ins ' + theme + ' color-2">';
        html += '<label><span>' + key.replaceAll('_', ' ') + ' :</span>';
        if (key !== 'date') {
            html += '<input spellcheck="false" class="customer-form-input ' + theme + ' color border-color" type="text" name="' + key + '" value="' + model[key] + '"/>';
        } else {
            html += '<input spellcheck="false" class="customer-form-input ' + theme + ' color border-color" type="date" name="' + key.toLowerCase().replaceAll('_', '') + '.' + contentKey + '" value="' +  model[key] + '"/>';

            html += '<svg viewBox="0 0 24 24"><path d="M20.016 21v-12.984h-16.031v12.984h16.031zM20.016 3q0.797 0 1.383 0.609t0.586 1.406v15.984q0 0.797-0.586 1.406t-1.383 0.609h-16.031q-0.797 0-1.383-0.609t-0.586-1.406v-15.984q0-0.797 0.586-1.406t1.383-0.609h1.031v-2.016h1.969v2.016h10.031v-2.016h1.969v2.016h1.031z"></path></svg>';
        }
        html += '</label>';
        html += '</div>';
    }
    div.innerHTML = html;
    parent.appendChild(div);
}

function deleteDrug(elmt, theme) {

    let blocks = elmt.closest('.drugs-list').querySelectorAll('.drug-list-item'),
        last = blocks[blocks.length-1],
        list = elmt.closest('.drugs-list'),
        children = list.children.length;
    last.parentElement.removeChild(last);

    let lasts = list.querySelectorAll('.drug-list-item'),
        newLast = lasts[lasts.length-1];

    if (lasts.length > 0) {
        let btn = document.createElement('button');
        btn.setAttribute('type', 'button');
        btn.setAttribute('id', 'removeDrugBtn');
        btn.setAttribute('class', theme + ' bg-2 color removeDrug');
        btn.setAttribute('onclick', 'deleteDrug(this, \'' + theme + '\')');
        btn.innerHTML = 'Delete';
        newLast.insertBefore(btn, newLast.children[1]);
    } else {
        list.innerHTML = '<i>Add item</i>';
    }
}

function setImportedFiles(elmt, list, ext, theme) {

    if (elmt.files[0]) {

        let accepteds = ext.split(','),
            file = elmt.files[0],
            name = file.name,
            path = file.path,
            type = name.split('.')[name.split('.').length - 1].toLowerCase(),
            ul = elmt.previousElementSibling.previousElementSibling,
            addItem = ul.querySelector('.add-item'),
            check = ext.includes(type);

        if (check === true) {
            if (addItem) {
                ul.removeChild(addItem);
            }
            let li = document.createElement('li');
            li.setAttribute('class', 'folder file-li ' + theme + ' border-color color-2');
            li.dataset.path = path;
            li.innerHTML = name + '<svg onclick="deletePath(this)" class="delete-icon" viewBox="0 0 32 32"><path d="M8 26c0 1.656 1.343 3 3 3h10c1.656 0 3-1.344 3-3l2-16h-20l2 16zM19 13h2v13h-2v-13zM15 13h2v13h-2v-13zM11 13h2v13h-2v-13zM25.5 6h-6.5c0 0-0.448-2-1-2h-4c-0.553 0-1 2-1 2h-6.5c-0.829 0-1.5 0.671-1.5 1.5s0 1.5 0 1.5h22c0 0 0-0.671 0-1.5s-0.672-1.5-1.5-1.5z"></path></svg>';
            ul.appendChild(li)
        } else {
            let format = (accepteds.length > 1) ? 'formats are' : 'format is'
            displayBadFormatModal(name + ' has a bad format !', 'Only "' + accepteds.join('", "') + '" ' + format + ' allowed here.', ul, theme);
        }
    }
}

function getDicomPath(elmt, theme) {

    let firstname = document.querySelector('.customer-form-input[name="firstname"]'),
        lastname = document.querySelector('.customer-form-input[name="lastname"]'),
        ul = elmt.previousElementSibling;

    if (firstname.value.length > 0 && lastname.value.length > 0) {

        dialog.showOpenDialog(remote.getCurrentWindow(), {
            title: 'Choose DICOMDIR file',
            properties: ['openFile'],
            filters: [
                { name: 'DICOMDIR', extensions: ['*'] },
            ]
        }).then(result => {

            if (result.canceled === false) {

                let addItem = ul.querySelector('.add-item'),
                    path = (result.filePaths.length > 0) ? result.filePaths[0] : null,
                    sep = (isWindowsPlatform === true) ? '\\' : '/',
                    split = path.split(sep),
                    name = split[split.length - 1],
                    isDicomDir = name === 'DICOMDIR';
                if (path !== null) {
                    if (isDicomDir === true) {
                        if (addItem) {
                            ul.removeChild(addItem);
                        }

                        ipc.once('checkDICOM.reply', function(event, device) {
                            console.log(device)
                            let li = document.createElement('li');
                            li.setAttribute('class', 'dicom-folder file-li ' + theme + ' border-color color-2');
                            li.dataset.path = path;
                            li.innerHTML = name + '<small>(' + path + ')</small>' + '<svg onclick="deletePath(this)" class="delete-icon" viewBox="0 0 32 32"><path d="M8 26c0 1.656 1.343 3 3 3h10c1.656 0 3-1.344 3-3l2-16h-20l2 16zM19 13h2v13h-2v-13zM15 13h2v13h-2v-13zM11 13h2v13h-2v-13zM25.5 6h-6.5c0 0-0.448-2-1-2h-4c-0.553 0-1 2-1 2h-6.5c-0.829 0-1.5 0.671-1.5 1.5s0 1.5 0 1.5h22c0 0 0-0.671 0-1.5s-0.672-1.5-1.5-1.5z"></path></svg>';
                            ul.appendChild(li)

                            let patientName = device.infos.patientName.toUpperCase(),
                                knownName1 = firstname.value.toUpperCase() + ' ' + lastname.value.toUpperCase(),
                                knownName2 = lastname.value.toUpperCase() + ' ' + firstname.value.toUpperCase();

                            if (patientName !== knownName1 && patientName !== knownName2) {

                                let div = document.createElement('div');
                                div.setAttribute('class', 'noMatchingPatient');
                                let html = '<div class="' + theme + ' bg-2 border-color color"><p><b>Warning :</b> Dicom patient name is not matching with the current name.</p>';
                                html += '<p>Current name is : <b>' + knownName1 + '</b></p>';
                                html += '<p>Dicom patient name is : <b>' + patientName + '</b></p>';
                                html += '<svg class="close-dicomWarning-win" onclick="hideDicomWarningModal(this)" viewBox="0 0 24 24"><path d="M18.984 6.422l-5.578 5.578 5.578 5.578-1.406 1.406-5.578-5.578-5.578 5.578-1.406-1.406 5.578-5.578-5.578-5.578 1.406-1.406 5.578 5.578 5.578-5.578z"></path></svg></div>';
                                div.innerHTML = html;
                                ul.parentElement.appendChild(div);
                            }
                        })

                        ipc.send('checkDICOM', path);
                    } else {
                        displayBadFormatModal(name + ' has a bad format !', 'Only DICOMDIR file is allowed here.', ul, theme);
                    }
                }
            }

        }).catch(err => {
            console.log(err)
        });

    } else {

        displayBadFormatModal('Some info is missing !', 'Firstname and Lastname are missing before loading DICOM directory.', ul, theme);
    }
}

function hideDicomWarningModal(elmt) {

    let div = document.querySelector('.noMatchingPatient'),
        parent = div.parentElement;
    parent.removeChild(div);
}

function deletePath(elmt) {

    let li = elmt.parentElement,
        ul = li.parentElement;
    ul.removeChild(li);
    let lis = ul.querySelectorAll('.file-li');
    if (lis.length === 0) {
        let li = document.createElement('li');
        li.setAttribute('class', 'add-item');
        li.innerHTML = '<i>Add item</i>';
        ul.appendChild(li)
    }
}

function displayBadFormatModal(claim, info, ul, theme) {

    let parent = ul.parentElement,
        p = document.createElement('p');
    p.setAttribute('class', 'claim-files ' + theme + ' bg-2');
    p.innerHTML = '<span>' + claim + '</span><span>' + info + '</span>';
    parent.insertBefore(p, ul);
    setTimeout(function(){
        parent.removeChild(p);
    }, 4000);
}

function prepareCard(theme) {

    let ready = JSON.parse(localStorage.getItem('ready')),
        device = JSON.parse(localStorage.getItem('selectedDevice')),
        mode = localStorage.getItem('mode'),
        temp = (localStorage.key('tempUser')) ? JSON.parse(localStorage.getItem('tempUser')) : null,
        data = {
            'modalTitle': 'Complile data',
            'ready': ready,
            'device': device,
            'mode': mode,
            'temp': temp
        }
    ipc.send('createCard', data);
}

/*
========================================================
======================== Modals ========================
========================================================
 */

/*
let get = JSON.parse(decodeURI(window.location.search.replace('?data=', '')));

if (get.view === 'main') {

    let exitModal = document.createElement('div'),
        isWindowsNav = navigator.platform === 'Win32',
        classe = (isWindowsNav) ? 'windows' : 'unix';
    exitModal.setAttribute('class', 'exit-modal-container ' + storage.settings.theme + ' border-color');
    exitModal.setAttribute('id', classe + '-exit-modal-container');

    let html;
    if (isWindowsNav) {
        html = '<div id="exit-modal" class="modal-block ' + storage.settings.theme + ' bg color border-color">\n\t';
        html += '<div id="exit-heading" class="' + storage.settings.theme + ' exitBG color-2">\n\t\t<img' +
            ' src="./assets/media/img/favicon.svg">\n\t\t<p>Confirm Exit</p>\n\t\t</div>\n\t';
        html += '<div class="sup-modal">\n\t\t';
        html += '<span id="question-exit">?</span>\n\t\t';
        html += '<p>Are you sure you want to exit ?</p>\n\t\t';
        html += '</div>\n\t';
    } else {
        html = '<div id="exit-modal" class="modal-block ' + storage.settings.theme + ' bg color">\n\t';
        html += '<div class="sup-modal" id="' + classe + '-sup-modal">\n\t\t';
        html += '<img src="./assets/media/img/logo.svg">\n\t\t';
        html += '<div>\n\t\t\t';
        html += '<h4>Confirm Exit</h4>\n\t\t\t';
        html += '<small>Are you sure you want to exit ?</small>\n\t\t\t';
        html += '</div>\n\t\t';
        html += '</div>\n\t';
    }
    html += '<div class="sub-modal ' + storage.settings.theme + ' bg color">\n\t\t';
    if (isWindowsNav) {
        html += '<button type="button" class="modal-button ' + storage.settings.theme + ' bg-2 color"' +
            ' id="exitModalOk">EXIT</button>\n\t\t';
        html += '<button type="button" class="modal-button ' + storage.settings.theme + ' bg-2 color"' +
            ' id="exitModalNok">CANCEL</button>\n\t';
    } else {
        html += '<button type="button" class="modal-button ' + storage.settings.theme + ' bg-2 color"' +
            ' id="exitModalNok">CANCEL</button>\n\t';
        html += '<button type="button" class="modal-button ' + storage.settings.theme + ' bg-2 color"' +
            ' id="exitModalOk">EXIT</button>\n\t\t';
    }
    html += '</div>\n';
    html += '</div>';

    exitModal.innerHTML = html;
    document.body.appendChild(exitModal);

    let ok = exitModal.querySelector('#exitModalOk'),
        nok = exitModal.querySelector('#exitModalNok');

    document.onkeyup = function (ev) {

        if (exitModal.style.display === 'flex') {

            if (ev.key === 'Enter') {
                confirmQuit = true;
                window.close();
            }

            if (ev.key === 'Escape') {
                if (isWindowsNav) {
                    exitModal.style.display = 'none';
                } else {
                    exitModal.querySelector('#exit-modal').classList.remove('displayUnixErrorModal');
                    setTimeout(function () {
                        exitModal.style.display = 'none';
                    }, 210);
                }
                confirmQuit = false;
            }
        }
    }

    nok.onclick = function () {
        if (isWindowsNav) {
            exitModal.style.display = 'none';
        } else {
            exitModal.querySelector('#exit-modal').classList.remove('displayUnixErrorModal');
            setTimeout(function () {
                exitModal.style.display = 'none';
            }, 210);
        }
        confirmQuit = false;
    }
    ok.onclick = function () {
        confirmQuit = true;
        window.close();
    }

    ipc.on('exitApp', (event, data) => {

        exitModal.style.display = 'flex';
        if (!isWindowsNav) {
            setTimeout(function () {
                exitModal.querySelector('#exit-modal').classList.add('displayUnixErrorModal');
            }, 50);
        }
    });

    ipc.on('focus', (event, data) => {

        if (exitModal.style.display === 'flex') {
            if (data === false) {
                document.body.classList.add('blurErrorWindow');
            } else {
                document.body.classList.remove('blurErrorWindow');
            }
        }
    });

    window.onbeforeunload = function (e) {

        if (confirmQuit === false) {
            e.returnValue = false;
            document.querySelector('.exit-modal-container').style.display = 'flex';
            if (!isWindowsNav) {
                setTimeout(function () {
                    document.querySelector('#exit-modal').classList.add('displayUnixErrorModal');
                }, 50);
            }
        }
    }
}*/
