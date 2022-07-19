/*
========================================================
======================== Modals ========================
========================================================
 */

function aliveExitModal (storage) {

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
        html += '<label class="checkbox-container" id="exit-ask">Don\'t ask again<input type="checkbox"><span class="checkmark"></span></label>\n\t\t\t';
        html += '</div>\n\t\t';
        html += '</div>\n\t';
    }
    html += '<div class="sub-modal ' + storage.settings.theme + ' bg color">\n\t\t';
    if (isWindowsNav) {
        html += '<label class="checkbox-container" id="exit-ask">Don\'t ask again<input type="checkbox"><span class="checkmark"></span></label>\n\t\t';
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

    document.onkeyup = function(ev) {

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
            setTimeout(function(){
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
            setTimeout(function(){
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

    /*window.onbeforeunload = function (e) {

        if (confirmQuit === false) {
            e.returnValue = false;
            document.querySelector('.exit-modal-container').style.display = 'flex';
            if (!isWindowsNav) {
                setTimeout(function(){
                    document.querySelector('#exit-modal').classList.add('displayUnixErrorModal');
                }, 50);
            }
        }
    }*/
}