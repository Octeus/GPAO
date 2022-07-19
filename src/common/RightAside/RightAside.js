import React from 'react';
import './RightAside.css';
import Drag from "../../components/Draggables/Drag";
import { getRole } from "../../Tools/Tools";

/**
 * Create React RightAside component.
 * @class
 * @memberOf Commons
 */

class RightAside extends React.Component {

    constructor(props) {

        super(props);
        this.theme = props.data.settings.theme;
        this.state = {
            db: props.data,
            classList: props.classList,
            remote: null,
            parent: null,
            tables: null
        }
    }

    displayRightWindow(ev, id) {

        let elmt = ev.currentTarget,
            onglets = elmt.parentElement.children,
            main = document.querySelector('#main'),
            mainWidth = window.innerWidth - 42,
            all = elmt.closest('aside').querySelectorAll('.drags');

        for (let i = 0; i < onglets.length; i++) {
            onglets[i].classList.remove('selected');
        }

        if (document.querySelector('#' + id).style.display === 'flex') {

            document.querySelector('#' + id).style.display = 'none';
            main.style.width = this.analyseOpenLeftSideModals(mainWidth) + 'px';

        } else {

            for (let i = 0; i < all.length; i++) {
                all[i].style.display = 'none';
            }
            elmt.classList.add('selected');
            document.querySelector('#' + id).style.display = 'flex';
            main.style.width = this.analyseOpenLeftSideModals(mainWidth, document.querySelector('#' + id)) + 'px';
        }
        return true;
    }

    analyseOpenLeftSideModals(mainWidth, elmt = null) {

        let leftDrags = document.querySelectorAll('.leftDrag'),
            oppositSize = 0;

        for (let i = 0; i < leftDrags.length; i++) {
            if (leftDrags[i].style.display === 'flex') {
                let opposit = leftDrags[i];
                oppositSize = opposit.scrollWidth;
            }
        }

        return (elmt !== null) ? mainWidth - elmt.scrollWidth - oppositSize : mainWidth - oppositSize;
    }

    componentDidMount() {

        const ipc = window.require('electron').ipcRenderer;
        ipc.on('openFile', (event, mess) => {
            if (!mess.data.err) {
                console.log('rightside');
            }
        });

        let side = document.querySelector('#right-aside ul'),
            height = 40,
            width = side.scrollWidth - 200;
        side.style.right = '-' +( width + height) + 'px';

        ipc.on('openFile', (event, mess) => {

            if (!mess.data.err) {
                console.log('rightside');
            }
        });

        if (this.state.remote === null) {
            this.getRemoteHostContent('', 'get');
        }

        if (this.state.tables === null) {
            this.getTables();
        }
    }

    getRemoteHostContent = (path, mode) => {

        const ipc = window.require('electron').ipcRenderer;
        let args = {mode: mode, path: path};
        let split = path.split('/');
        split.pop();
        path = split.join('/');
        ipc.once('getSFTPContent.reply', (event, data) => {
            this.setState({remote: data, parent: path})
            setTimeout(() => {
                window.initDraggableContainers();
                window.resizeMainContentOnWindowResize();
            }, 500)
        });
        ipc.send('getSFTPContent', args)
    }

    getTables = (table = 'all') => {

        const ipc = window.require('electron').ipcRenderer;
        ipc.once('getAllTables.reply', (event, data) => {
            this.setState({tables: data})
            setTimeout(() => {
                window.initDraggableContainers();
                window.resizeMainContentOnWindowResize();
            }, 500)
        });
        ipc.send('getTable', table)
    }

    render() {

        return (
            <aside id='right-aside' className={this.theme + ' ' + this.state.classList}>
                <div className='flex column'>
                    <ul className='flex'>
                        {getRole(this.state.db.user, ['octeus']) === true
                            ? <li className='flex w-max right-windows hover'
                                onClick={(ev) => this.displayRightWindow(ev, 'rightDrag-1')}
                                data-title='Browse remote hosts' aria-label='Browse remote hosts'>
                                <svg className='blue befores' viewBox="0 0 24 24">
                                    <path
                                        d="M3.984 11.016v1.969h2.016v-1.969h-2.016zM2.016 14.016v-4.031h19.969v4.031h-19.969zM6 6.984v-1.969h-2.016v1.969h2.016zM2.016 3.984h19.969v4.031h-19.969v-4.031zM3.984 17.016v1.969h2.016v-1.969h-2.016zM2.016 20.016v-4.031h19.969v4.031h-19.969z"></path>
                                </svg>
                                <span>Remote</span>
                            </li>
                            : <li className='flex w-max right-windows forbidden'
                                  data-title='No Access' aria-label='No Access'>
                                <svg className='grey befores' viewBox="0 0 24 24">
                                    <path
                                        d="M3.984 11.016v1.969h2.016v-1.969h-2.016zM2.016 14.016v-4.031h19.969v4.031h-19.969zM6 6.984v-1.969h-2.016v1.969h2.016zM2.016 3.984h19.969v4.031h-19.969v-4.031zM3.984 17.016v1.969h2.016v-1.969h-2.016zM2.016 20.016v-4.031h19.969v4.031h-19.969z"></path>
                                </svg>
                                <span>Remote</span>
                            </li>
                        }
                        {getRole(this.state.db.user, ['octeus']) === true
                            ? <li className='flex w-max right-windows hover'
                                onClick={(ev) => this.displayRightWindow(ev, 'rightDrag-2')}
                                data-title='Browse database from project' aria-label='Browse database from project'>
                                <svg className='orange befores' viewBox="0 0 24 24">
                                    <path
                                        d="M18 8.016v-4.031h-2.016v4.031h2.016zM15 8.016v-4.031h-2.016v4.031h2.016zM12 8.016v-4.031h-2.016v4.031h2.016zM18 2.016q0.797 0 1.406 0.586t0.609 1.383v16.031q0 0.797-0.609 1.383t-1.406 0.586h-12q-0.797 0-1.406-0.586t-0.609-1.383l0.047-12 5.953-6h8.016z"></path>
                                </svg>
                                <span>Database</span>
                            </li>
                            : <li className='flex w-max right-windows forbidden'
                                  data-title='No Access' aria-label='No Access'>
                                <svg className='grey befores' viewBox="0 0 24 24">
                                    <path
                                        d="M18 8.016v-4.031h-2.016v4.031h2.016zM15 8.016v-4.031h-2.016v4.031h2.016zM12 8.016v-4.031h-2.016v4.031h2.016zM18 2.016q0.797 0 1.406 0.586t0.609 1.383v16.031q0 0.797-0.609 1.383t-1.406 0.586h-12q-0.797 0-1.406-0.586t-0.609-1.383l0.047-12 5.953-6h8.016z"></path>
                                </svg>
                                <span>Database</span>
                            </li>
                        }
                        {getRole(this.state.db.user, ['octeus', 'design']) === true
                            ? <li className='flex w-max right-windows hover'
                                onClick={(ev) => this.displayRightWindow(ev, 'rightDrag-3')}
                                data-title='Design patterns and files' aria-label='Design patterns and files'>
                                <svg className='green befores' viewBox="0 0 24 24">
                                    <path
                                        d="M17.484 12q0.609 0 1.055-0.422t0.445-1.078-0.445-1.078-1.055-0.422-1.055 0.422-0.445 1.078 0.445 1.078 1.055 0.422zM14.484 8.016q0.609 0 1.055-0.445t0.445-1.055-0.445-1.055-1.055-0.445-1.055 0.445-0.445 1.055 0.445 1.055 1.055 0.445zM9.516 8.016q0.609 0 1.055-0.445t0.445-1.055-0.445-1.055-1.055-0.445-1.055 0.445-0.445 1.055 0.445 1.055 1.055 0.445zM6.516 12q0.609 0 1.055-0.422t0.445-1.078-0.445-1.078-1.055-0.422-1.055 0.422-0.445 1.078 0.445 1.078 1.055 0.422zM12 3q3.703 0 6.352 2.344t2.648 5.672q0 2.063-1.477 3.516t-3.539 1.453h-1.734q-0.656 0-1.078 0.445t-0.422 1.055q0 0.516 0.375 0.984t0.375 1.031q0 0.656-0.422 1.078t-1.078 0.422q-3.75 0-6.375-2.625t-2.625-6.375 2.625-6.375 6.375-2.625z"></path>
                                </svg>
                                <span>Print</span>
                            </li>
                            : <li className='flex w-max right-windows forbidden'
                                  data-title='No Access' aria-label='No Access'>
                                <svg className='grey befores' viewBox="0 0 24 24">
                                    <path
                                        d="M17.484 12q0.609 0 1.055-0.422t0.445-1.078-0.445-1.078-1.055-0.422-1.055 0.422-0.445 1.078 0.445 1.078 1.055 0.422zM14.484 8.016q0.609 0 1.055-0.445t0.445-1.055-0.445-1.055-1.055-0.445-1.055 0.445-0.445 1.055 0.445 1.055 1.055 0.445zM9.516 8.016q0.609 0 1.055-0.445t0.445-1.055-0.445-1.055-1.055-0.445-1.055 0.445-0.445 1.055 0.445 1.055 1.055 0.445zM6.516 12q0.609 0 1.055-0.422t0.445-1.078-0.445-1.078-1.055-0.422-1.055 0.422-0.445 1.078 0.445 1.078 1.055 0.422zM12 3q3.703 0 6.352 2.344t2.648 5.672q0 2.063-1.477 3.516t-3.539 1.453h-1.734q-0.656 0-1.078 0.445t-0.422 1.055q0 0.516 0.375 0.984t0.375 1.031q0 0.656-0.422 1.078t-1.078 0.422q-3.75 0-6.375-2.625t-2.625-6.375 2.625-6.375 6.375-2.625z"></path>
                                </svg>
                                <span>Print</span>
                            </li>
                        }
                    </ul>
                    <Drag theme={this.theme} data={this.state.db} type='rightDrag-1' mode='right' job='Remote' remote={this.state.remote} getRemoteHostContent={this.getRemoteHostContent} parent={this.state.parent}/>
                    <Drag theme={this.theme} data={this.state.db} type='rightDrag-2' mode='right' job='Database' tables={this.state.tables} getTables={this.getTables}/>
                    <Drag theme={this.theme} data={this.state.db} type='rightDrag-3' mode='right' job='Print'/>
                </div>
            </aside>
        );
    }
}

export default RightAside;
