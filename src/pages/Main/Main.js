/**
 * This is a namespace that contains documentation elements belonging to the Views
 * domain.
 *
 * @namespace Views
 */

import React from 'react';
import './Main.css';
import Drop from "../../common/Svg/Drop";
import Modal from "../Modals/Modal";
import Themes from "../../common/Themes/Themes";
import { getRole } from "../../Tools/Tools";
import hljs from 'highlight.js';
import 'highlight.js/styles/agate.css';
import { packFormater, formatTable, setForms, templateFormater, populateInputs } from "../../Tools/Tools";

/**
 * Create React Main component.
 * @class
 * @memberOf Views
 */

class Main extends React.Component {

    constructor(props) {


        super(props);
        this.theme = props.data.settings.theme;
        this.state = {
            db: props.data,
            classList: props.classList,
            modal:"none",
            modalContent: null,
            announce: true,
            windows: []
        }
    }

    getModal = (type, content) => {

        this.setState({
            modal: type,
            modalContent: content
        })
    }

    mainOnDrop(ev) {

        ev.preventDefault();
        ev.stopPropagation();

        const ipc = window.require('electron').ipcRenderer;
        let target = ev.currentTarget,
            drag = target.querySelector('#drag-zone'),
            files = [];
        drag.classList.remove('display-drag-zone');

        for (const f of ev.dataTransfer.files) {
            files.push({'path': f.path, 'name': f.name, 'size': f.size})
        }

        ipc.on('fileDrag.reply', (event, resume) => {
            let modal = document.querySelector('.modal');
            if (modal) {
                modal.removeAttribute('style');
            }
            this.getModal('OpenFile', resume);
        });
        ipc.send('fileDrag', files);
    }

    mainOnDragOver(ev) {

        ev.preventDefault();
        ev.stopPropagation();

        let target = ev.currentTarget,
            drag = target.querySelector('#drag-zone');
        drag.classList.add('display-drag-zone');
    }

    mainOnDragLeave(ev) {

        let target = ev.currentTarget,
            drag = target.querySelector('#drag-zone');
        drag.classList.remove('display-drag-zone');
    }

    componentDidMount() {

        if (this.state.db.mode === 'update') {
            this.getModal('SimpleModal', 'Prepare update');
        }

        const ipc = window.require('electron').ipcRenderer;

        ipc.on('importDataFromDevice.reply', (event, infos) => {

            localStorage.setItem('original', JSON.stringify(infos));
            let tempObject = {},
                keepings = [
                    "activate",
                    "activation_datetime",
                    "cloud",
                    "password",
                    "accepted_terms",
                    "language",
                    "avatar",
                    "accessibility",
                    "dark_mode",
                    "treatments",
                    "exams",
                    "notes",
                    "travels"
                ]
            for (const key in infos.traveler) {
                if (keepings.includes(key)) {
                    tempObject[key] = infos.traveler[key]
                }
            }
            localStorage.setItem('tempUser', JSON.stringify(tempObject));
            populateInputs(infos)
        });

        ipc.on('SaveFileReact', (event) => {

            let modal = document.querySelector('.modal');
            if (modal) {
                modal.removeAttribute('style');
            }
            this.getModal('SaveFile', null);
        });

        ipc.on('LoadedFile', (event) => {

            let modal = document.querySelector('.modal');
            if (modal) {
                modal.removeAttribute('style');
            }
            this.getModal('none', null);
        });

        ipc.on('openFile.reply', (event, resume) => {

            let modal = document.querySelector('.modal');
            if (modal) {
                modal.removeAttribute('style');
            }
            this.getModal('OpenFile', resume);
        });

        ipc.on('openFile', (event, mess) => {

            let modal = document.querySelector('.modal');
            if (modal) {
                modal.removeAttribute('style');
            }

            if (mess.data.err) {

                let sep = (navigator.platform === 'Win32') ? '\\' : '/',
                    split = mess.path.split(sep),
                    name = split[split.length - 1];

                setTimeout(() => {
                    this.getModal('Corrupted', '"' + name + '" is corrupted...');
                }, 2050);

                setTimeout(() => {
                    this.getModal('none', null);
                }, 4000);

            } else {

                let data = mess.data;
                data.path = mess.path;
            }
        });

        ipc.on('invokeSettings.reply', (event, data) => {
            let modal = document.querySelector('.modal');
            if (modal) {
                modal.removeAttribute('style');
            }
            this.getModal('Settings', data);
        });

        ipc.on('newProject', (event) => {
            ipc.send('invokeNewProject', 'main');
        });

        ipc.on('interactWithFront', (event, data) => {

            if (data === 'ImplementData') {
                this.getModal('SimpleModal', data);
            } else {
                if (data !== null && document.querySelector('[aria-label="' + data + '"]')) {
                    document.querySelector('[aria-label="' + data + '"]').click();
                }
            }

        });

        ipc.on('createCard.reply', (event, data) => {
            this.getModal('SimpleModal', data);
        })

        let headerTriggers = document.querySelectorAll('.headerTriggers');
        for (let i = 0; i < headerTriggers.length; i++) {
            headerTriggers[i].onclick = (e) => {
                let target = e.currentTarget,
                    ref = target.dataset.ref;
                this.getModal('SimpleModal', ref);
            }
        }

        ipc.on('setNewWindow', (event, data) => {
            this.createWindow(data)
        });

        setTimeout(() => {
            if (this.state.db.mode === 'create' || this.state.db.mode === 'update') {

                let side = document.querySelector('[data-title="Customer informations"]');
                if (side) {
                    if (!side.classList.contains('selected')) {
                        side.click();
                    }
                    let forms = document.querySelectorAll('#customer-list > div h4');
                    for (let i = 0; i < forms.length; i++) {
                        forms[i].click();
                    }
                }
            } else if (this.state.db.mode === 'design') {

                let side = document.querySelector('[data-title="Design patterns and files"]');
                if (side && !side.classList.contains('selected')) {
                    side.click();
                }
            } else if (this.state.db.mode === 'delivery') {

                let side = document.querySelector('[data-title="Delivery process"]');
                if (side && !side.classList.contains('selected')) {
                    side.click();
                }
            }
        }, 1050)

        setTimeout(() => {
            let onglets = document.querySelectorAll('.main-windows-onglets');
            if (onglets.length > 0) {
                onglets[0].querySelector('span').click()
            }
        }, 1200)
    }

    createWindow = (data) => {

        let wins = this.state.windows,
            check = true;

        for (let i = 0; i < wins.length; i++) {
            if (wins[i].data.path === data.data.path) {
                check = false;
                break;
            }
        }
        if (check === true) {
            wins.push(data)

            let onglets = document.querySelectorAll('.main-windows-onglets'),
                w = document.querySelectorAll('.main-windows-container');

            for (let i = 0; i < onglets.length; i++) {
                onglets[i].classList.add('hidden');
                w[i].classList.add('hidden');
            }
            this.setState({windows: wins});
            window.initDraggableContainers();
            window.resizeMainContentOnWindowResize();
        }
    }

    removeWindow = (index) => {

        let wins = this.state.windows;

        if (index > -1) {
            wins.splice(index, 1);
        }

        this.setState({windows: wins});

        if (index > -1) {
            if (this.selectWindow(index - 1) === false) {
                this.selectWindow(index + 1)
            }
        }
    }

    selectWindow = (index) => {

        let onglets = document.querySelectorAll('.main-windows-onglets'),
            wins = document.querySelectorAll('.main-windows-container');

        for (let i = 0; i < onglets.length; i++) {
            onglets[i].classList.add('hidden');
            wins[i].classList.add('hidden');
        }

        if (document.querySelector('#onglet-' + index)) {
            document.querySelector('#onglet-' + index).classList.remove('hidden');
            document.querySelector('#window-' + index).classList.remove('hidden');
            return true;
        }
        return false;
    }

    render() {

        return (
            <div
                id='main'
                className={this.theme + ' ' + this.state.classList}
                onDrop={(e) => this.mainOnDrop(e)}
                onDragOver={(e) => this.mainOnDragOver(e)}
                onDragLeave={(e) => this.mainOnDragLeave(e)}>
                <div id='drag-zone'>
                    <div id='drag-bg'/>
                    <Drop id='dropper'/>
                    <p>Drop your file(s) here.</p>
                </div>
                <Themes id='main-theme-avatar' className='theme-avatars' data={this.state.db} />
                <Modal getModal={this.getModal} data={this.state.db} content={this.state.modalContent}  type={this.state.modal}/>
                {(this.state.announce === true && this.state.windows.length === 0) &&
                    <div id='main-announce-container'>
                        <ul id='main-announce'>
                            {getRole(this.state.db.user, ['octeus', 'operator']) === true &&
                                <>
                                    <li className={this.state.classList}>
                                        Open New project
                                        &nbsp;
                                        <span>Ctrl+N</span>
                                    </li>
                                </>
                            }
                            {getRole(this.state.db.user, ['octeus', 'design']) === true &&
                                <>
                                    <li className={this.state.classList}>
                                        Open New Print
                                        &nbsp;
                                        <span>Ctrl+Alt+Shift+D</span>
                                    </li>
                                </>
                            }
                            <li className={this.state.classList}>
                                Search Everywhere
                                &nbsp;
                                <span>Ctrl+Alt+Shift+O</span>
                            </li>
                            {getRole(this.state.db.user, ['octeus']) === true &&
                                <>
                                    <li className={this.state.classList}>
                                        Drag file here to open it
                                    </li>
                                </>
                            }
                        </ul>
                    </div>
                }
                {this.state.windows.length > 0 &&
                    <div id='main-window'>
                        <ul id='main-onglets'>
                            {this.state.windows.map((win, i) => {
                                if (win.type === 'file') {
                                    return (
                                        <li
                                            key={win.data.path}
                                            id={'onglet-' + i}
                                            className={this.theme + ' bg-2 color-2 border-color main-windows-onglets'}
                                        >
                                            <span
                                                onClick={() => this.selectWindow(i)}
                                            >
                                                {win.data.name}
                                            </span>
                                            <svg
                                                className="close-main-win"
                                                viewBox="0 0 24 24"
                                                onClick={() => this.removeWindow(i)}
                                            >
                                                <path d="M18.984 6.422l-5.578 5.578 5.578 5.578-1.406 1.406-5.578-5.578-5.578 5.578-1.406-1.406 5.578-5.578-5.578-5.578 1.406-1.406 5.578 5.578 5.578-5.578z"/>
                                            </svg>
                                        </li>
                                    )
                                } else {
                                    return (
                                        <li
                                            key={win.data.path}
                                            id={'onglet-' + i}
                                            className={this.theme + ' bg-2 color-2 border-color main-windows-onglets'}
                                        >
                                            <span
                                                onClick={() => this.selectWindow(i)}
                                            >
                                                {win.data.name}
                                            </span>
                                            <svg
                                                className="close-main-win"
                                                viewBox="0 0 24 24"
                                                onClick={() => this.removeWindow(i)}
                                            >
                                                <path d="M18.984 6.422l-5.578 5.578 5.578 5.578-1.406 1.406-5.578-5.578-5.578 5.578-1.406-1.406 5.578-5.578-5.578-5.578 1.406-1.406 5.578 5.578 5.578-5.578z"/>
                                            </svg>
                                        </li>
                                    )
                                }
                            })}
                        </ul>
                        <div id='main-content'>
                            {this.state.windows.map((win, i) => {
                                if (win.type === 'file') {
                                    if (win.data.mimeType[0] === 'text' && win.data.ext !== 'svg') {
                                        return (
                                            <pre
                                                spellCheck={false}
                                                className={this.theme + ' color main-windows-container'}
                                                key={win.data.path}
                                                id={'window-' + i}
                                            >
                                                <code
                                                    dangerouslySetInnerHTML={{__html: hljs.highlightAuto(win.data.content).value}}
                                                />
                                            </pre>
                                        )
                                    } else if (win.data.mimeType[0] === 'image' && win.data.ext !== 'svg') {
                                        return(
                                            <div
                                                className={this.theme + ' color main-windows-container img'}
                                                key={win.data.path}
                                                id={'window-' + i}
                                            >
                                                <img src={win.data.content} alt='File type' />
                                            </div>
                                        )
                                    } else if (win.data.ext === 'svg') {
                                        return(
                                            <div
                                                className={this.theme + ' color main-windows-container svg'}
                                                key={win.data.path}
                                                id={'window-' + i}
                                                dangerouslySetInnerHTML={{__html: win.data.content}}
                                            />
                                        )
                                    } else {
                                        return(
                                            <div
                                                className={this.theme + ' color main-windows-container none'}
                                                key={win.data.path}
                                                id={'window-' + i}
                                            >
                                                {win.data.content}
                                            </div>
                                        )
                                    }
                                } else if (win.type === 'db') {
                                    return (
                                        <div
                                            className={this.theme + ' color main-windows-container'}
                                            key={win.data.path}
                                            id={'window-' + i}
                                            dangerouslySetInnerHTML={{__html: formatTable(win.data.content, this.theme)}}
                                        />
                                    )
                                } else if (win.type === 'pack') {
                                    return (
                                        <div
                                            className={this.theme + ' color main-windows-container'}
                                            key={win.data.path}
                                            id={'window-' + i}
                                            dangerouslySetInnerHTML={{__html: packFormater(win.data.content, this.theme, i)}}
                                        />
                                    )
                                } else if (win.type === 'print') {
                                    return (
                                        <div
                                            className={this.theme + ' color main-windows-container'}
                                            key={win.data.path}
                                            id={'window-' + i}
                                            dangerouslySetInnerHTML={{__html: templateFormater(win.data.content, this.theme)}}
                                        />
                                    )
                                } else if (win.type === 'form') {

                                    return (
                                        <div
                                            className={this.theme + ' color main-windows-container'}
                                            key={win.data.path}
                                            id={'window-' + i}
                                            dangerouslySetInnerHTML={{__html: setForms(win.data, this.theme)}}
                                        />
                                    )
                                }
                            })}
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default Main;
