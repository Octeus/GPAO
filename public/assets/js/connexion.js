/**
 * This is a namespace that contains documentation elements belonging to the SplashUtils
 * domain.
 *
 * @namespace  ConnexionUtils
 */

const ipc = require('electron').ipcRenderer;
const bcrypt = require('bcryptjs');

let get = JSON.parse(decodeURI(window.location.search.replace('?data=', '')));
document.body.dataset.view = get.view;
document.body.dataset.modal = get.modal;
document.body.dataset.path = encodeURI(JSON.stringify(get.pathToMedia));

let db = {
    'settings': 'settings',
    'admins': 'admins',
    'operational_centers': 'operational_centers',
    'user': 'user',
    'prints': 'prints',
    'patients': 'patients'
};

ipc.once('actionReply', function (event, data) {

    // Data variables
    let settings = (data.settings) ?? {},
        admins = (data.admins) ?? [],
        user = (data.user) ?? {},
        appName = (settings.appName) ?? '',
        theme = (settings.theme) ? settings.theme : 'default',
        lang = (settings.lang) ? settings.lang : 'en';

    // DOM elements
    let connexionContainer = document.querySelector('#connexion-container'),
        connFormKnown = document.querySelector('#conn-form-known'),
        connFormNew = document.querySelector('#conn-form-new'),
        submiters = document.querySelectorAll('.submit-conn-form'),
        exits = document.querySelectorAll('.quit-app'),
        userName = document.querySelectorAll('.user-name'),
        loader = document.querySelector('#conn-loader'),
        switchers = document.querySelectorAll('.switcher'),
        containers = document.querySelectorAll('.containers'),
        all = document.body.querySelectorAll('*:not(script)'),
        eyes = document.querySelectorAll('.eyes'),
        eyeClosed = '<path d="M29.561 0.439c-0.586-0.586-1.535-0.586-2.121 0l-6.318 6.318c-1.623-0.492-3.342-0.757-5.122-0.757-6.979 0-13.028 4.064-16 10 1.285 2.566 3.145 4.782 5.407 6.472l-4.968 4.968c-0.586 0.586-0.586 1.535 0 2.121 0.293 0.293 0.677 0.439 1.061 0.439s0.768-0.146 1.061-0.439l27-27c0.586-0.586 0.586-1.536 0-2.121zM13 10c1.32 0 2.44 0.853 2.841 2.037l-3.804 3.804c-1.184-0.401-2.037-1.521-2.037-2.841 0-1.657 1.343-3 3-3zM3.441 16c1.197-1.891 2.79-3.498 4.67-4.697 0.122-0.078 0.246-0.154 0.371-0.228-0.311 0.854-0.482 1.776-0.482 2.737 0 1.715 0.54 3.304 1.459 4.607l-1.904 1.904c-1.639-1.151-3.038-2.621-4.114-4.323z"></path><path d="M24 13.813c0-0.849-0.133-1.667-0.378-2.434l-10.056 10.056c0.768 0.245 1.586 0.378 2.435 0.378 4.418 0 8-3.582 8-8z"></path><path d="M25.938 9.062l-2.168 2.168c0.040 0.025 0.079 0.049 0.118 0.074 1.88 1.199 3.473 2.805 4.67 4.697-1.197 1.891-2.79 3.498-4.67 4.697-2.362 1.507-5.090 2.303-7.889 2.303-1.208 0-2.403-0.149-3.561-0.439l-2.403 2.403c1.866 0.671 3.873 1.036 5.964 1.036 6.978 0 13.027-4.064 16-10-1.407-2.81-3.504-5.2-6.062-6.938z"></path>',
        eyeOpen = '<path d="M16 6c-6.979 0-13.028 4.064-16 10 2.972 5.936 9.021 10 16 10s13.027-4.064 16-10c-2.972-5.936-9.021-10-16-10zM23.889 11.303c1.88 1.199 3.473 2.805 4.67 4.697-1.197 1.891-2.79 3.498-4.67 4.697-2.362 1.507-5.090 2.303-7.889 2.303s-5.527-0.796-7.889-2.303c-1.88-1.199-3.473-2.805-4.67-4.697 1.197-1.891 2.79-3.498 4.67-4.697 0.122-0.078 0.246-0.154 0.371-0.228-0.311 0.854-0.482 1.776-0.482 2.737 0 4.418 3.582 8 8 8s8-3.582 8-8c0-0.962-0.17-1.883-0.482-2.737 0.124 0.074 0.248 0.15 0.371 0.228v0zM16 13c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"></path>';

    for (let i = 0; i < all.length; i++) {
        all[i].classList.add(theme);
    }

    for (let i = 0; i < switchers.length; i++) {
        switchers[i].onclick = function(e) {
            let target = e.currentTarget,
                id = target.dataset.id;
            for (let j = 0; j < containers.length; j++) {
                containers[j].classList.add('hidden');
            }
            document.querySelector('#' + id).classList.remove('hidden');
        }
    }

    for (let i = 0; i < eyes.length; i++) {
        eyes[i].onclick = function(e) {
            let target = e.currentTarget,
                input = target.parentElement.querySelector('input');
            if (input.type === 'password') {
                input.type = 'text';
                target.innerHTML = eyeClosed;
            } else {
                input.type = 'password';
                target.innerHTML = eyeOpen;
            }
        }
    }

    for (let i = 0; i < exits.length; i++) {
        exits[i].onclick = function() {
            loader.classList.remove('hidden');
            connexionContainer.classList.remove('visible');
            ipc.send('invokeActionCloseApp');
        }
    }

    if (user.nom && user.prenom) {

        connFormKnown.classList.remove('hidden');
        connFormNew.classList.add('hidden');
        for (let i = 0; i < userName.length; i++) {
            userName[i].innerHTML = user.prenom + ' ' + user.nom;
        }

    } else {

        connFormKnown.classList.add('hidden');
        connFormNew.classList.remove('hidden');
        connFormNew.querySelector('.switcher').classList.add('hidden');
    }

    loader.classList.add('hidden');
    connexionContainer.classList.add('visible');

    for (let i = 0; i < submiters.length; i++) {
        submiters[i].onclick = function(e) {
            let target = e.currentTarget,
                parent = target.closest('.containers');
            inspectFields(parent, user, admins, loader);
        }
    }
});
ipc.send('invokeActionDB', ['read', db]);

function inspectFields(parent, user, admins, loader) {

    let pwd, email;
    loader.classList.remove('hidden');

    if (parent.id === 'conn-form-known') {

        let originalPwd = user.password;
        email = user.pseudo;
        pwd = parent.querySelector('#conn-password').value;
        let check = bcrypt.compareSync(pwd, originalPwd);
        if (check === true) {
            ipc.send('invokeNewProject', 'conn');
        } else {
            loader.classList.add('hidden');
            parent.querySelector('#conn-password').classList.add('failed');
        }

    } else {

        email = parent.querySelector('#conn-email-new').value;
        pwd = parent.querySelector('#conn-password-new').value;
        let check = false,
            newUser;

        for (let i = 0; i < admins.length; i++) {
            if (admins[i].pseudo === email) {
                check = bcrypt.compareSync(pwd, admins[i].password);
                if (check === true) {
                    newUser = admins[i];
                }
            }
        }

        if (check === true) {

            ipc.on('update-user.reply', function(event, response) {
                console.log(response)
                ipc.send('invokeNewProject', 'conn');
            });
            ipc.send('update-user', {user: newUser, admins: admins});

        } else {
            loader.classList.add('hidden');
            parent.querySelector('#conn-email-new').classList.add('failed')
            parent.querySelector('#conn-password-new').classList.add('failed');
        }
    }
}