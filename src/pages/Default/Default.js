import './Default.css';
import react from './react.png';
import logo from './logo.svg';
import { useState, useEffect } from "react";

/**
 * Create Default localhost View.
 * @typedef {function}
 * @memberOf Views
 * @returns {object}
 */

function Default() {

    document.querySelector('#container').style.visibility = 'visible';
    let to = (navigator.platform === 'Win32') ? ' >' : ' %';
    let cmd = (navigator.platform === 'Win32') ? 'npm start' : 'sudo npm start';

    let [conn, setConn] = useState({
        "path": "...",
        "stt": "offline",
        "name": "Octeus DataCommander",
        "logs": ""
    });

    useEffect(() => {

        let xhr = new XMLHttpRequest();
        xhr.open("GET", './isElectronOn', true);
        xhr.onload = function (e) {
            setConn(conn => JSON.parse(xhr.response));
        }
        xhr.send();

        const interval = setInterval(() => {
            xhr = new XMLHttpRequest();
            xhr.open("GET", './isElectronOn', true);
            xhr.onload = function (e) {
                setConn(conn => JSON.parse(xhr.response));
            }
            xhr.send();
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <img id='localhost-svg' src={logo} alt='octeus' />
            <div id='localhost-body'>
                <div id='localhost-section' className={(conn.stt === 'offline') ? 'inactive' : ''}>
                    <div className="localhost-center"></div>
                    <article className="localhost-ring1">
                        <div></div>
                    </article>
                    <article className="localhost-ring2">
                        <div></div>
                    </article>
                    <article className="localhost-ring3">
                        <div></div>
                    </article>
                </div>
                <div id='localhost-main'>
                    <img id="emoji" src={react} alt='octeus'/>
                    <p id="text">Lancer Electron avec la commande</p>
                    <pre id='localhost-pre'>{cmd}</pre>
                    <p id='text2'>dans votre terminal au chemin</p>
                    <pre id='localhost-path'>{(!conn.path) ?  '...' : conn.path + to}</pre>
                    <pre id='localhost-checker' className={'electronIs-' + conn.stt}>{(conn.stt === 'online') ? conn.name.toUpperCase() + ' RUNNING >>' : 'STANDBY...'}</pre>
                    <div className="flags displayFlag" id="fr" onClick={(ev) => chooseLang(ev, 'fr')}></div>
                    <div className="flags" id="en" onClick={(ev) => chooseLang(ev, 'en')}></div>
                </div>
            </div>
        </>
    );
}

/**
 * Choose teh selected language.
 * @typedef {function}
 * @memberOf Views
 * @returns {void}
 */

function chooseLang(ev, lang) {

    let text = document.querySelector('#text');
    let text2 = document.querySelector('#text2');
    let elmt = ev.currentTarget;

    if (lang === 'fr') {

        elmt.classList.add('displayFlag');
        elmt.nextElementSibling.classList.remove('displayFlag');
        text.innerHTML = 'Lancer Electron avec la commande';
        text2.innerHTML = 'dans votre terminal au chemin';

    } else if (lang === 'en') {

        elmt.classList.add('displayFlag');
        elmt.previousElementSibling.classList.remove('displayFlag');
        text.innerHTML = 'Run Electron with command line';
        text2.innerHTML = 'in your terminal at path';
    }
}

export default Default;