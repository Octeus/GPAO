import React from 'react';
import './Footer.css';
import Drag from "../../components/Draggables/Drag";
import { getRole } from "../../Tools/Tools";

/**
 * Create React Footer component.
 * @class
 * @memberOf Commons
 */

class Footer extends React.Component {

    constructor(props) {

        super(props);
        this.theme = props.data.settings.theme;
        this.state = {
            db: props.data,
            classList: props.classList,
            logs: [{type: 'good', line: 'No log available yet.'}]
        }
    }

    displayWindow(ev, type, action = null) {

        let ipc = window.require('electron').ipcRenderer,
            elmt = ev.currentTarget,
            onglets = elmt.closest('ul').children,
            customClass = (type === 'wide') ? '.drags' : '.modals',

            all = (type === 'wide')
                ? elmt.closest('footer').querySelectorAll('.footer-windows .drags')
                : elmt.closest('footer').querySelectorAll('.footer-nanos .modals'),

            header = document.querySelector('header'),
            footer = document.querySelector('footer'),
            main = document.querySelector('#main'),

            leftSides = document.querySelectorAll('.leftDrag'),
            rightSides = document.querySelectorAll('.rightDrag'),

            mainHeight = (navigator.platform === 'Win32')
                ? window.innerHeight - (header.scrollHeight + footer.scrollHeight + 30 + 2)
                : window.innerHeight - (header.scrollHeight + footer.scrollHeight + 2),
            sideFullHeight = (navigator.platform === 'Win32')
                ? window.innerHeight - (header.scrollHeight + footer.scrollHeight + 30)
                : window.innerHeight - (header.scrollHeight + footer.scrollHeight);

        for (let i = 0; i < onglets.length; i++) {
            onglets[i].classList.remove('selected');
        }

        if (elmt.parentElement.querySelector(customClass).style.display === 'flex') {

            elmt.parentElement.querySelector(customClass).style.display = 'none';
            if (type === 'wide') {
                main.style.height = mainHeight + 'px';
                for (let i = 0; i < leftSides.length; i++) {
                    let side = leftSides[i];
                    side.style.height = sideFullHeight + 'px';
                }
                for (let i = 0; i < rightSides.length; i++) {
                    let side = rightSides[i];
                    side.style.height = sideFullHeight + 'px';
                }
            }

        } else {

            for (let i = 0; i < all.length; i++) {
                all[i].style.display = 'none';
            }

            elmt.parentElement.querySelector(customClass).style.display = 'flex';
            if (type === 'wide') {
                main.style.height = mainHeight - elmt.parentElement.querySelector(customClass).scrollHeight + 'px';
                for (let i = 0; i < leftSides.length; i++) {
                    let side = leftSides[i];
                    side.style.height = sideFullHeight - elmt.parentElement.querySelector(customClass).scrollHeight + 'px';
                }
                for (let i = 0; i < rightSides.length; i++) {
                    let side = rightSides[i];
                    side.style.height = sideFullHeight - elmt.parentElement.querySelector(customClass).scrollHeight + 'px';
                }
            }
            elmt.parentElement.classList.add('selected');

            if (action === 'terminal') {
                ipc.send('activeTerminal');
            }

            if (action === 'logs') {
                this.scrollerLogs();
            }
        }
        return true;
    }

    componentDidMount() {

        const ipc = window.require('electron').ipcRenderer;

        ipc.on('openFile', (event, mess) => {

            if (!mess.data.err) {

                console.log('footerSide');
            }
        });

        ipc.once('logsList', (event, mess) => {
            this.setState({logs: mess})
        })
    }

    scrollerLogs() {

        let lastLi = document.querySelector('#logs-list li:last-of-type');
        lastLi.scrollIntoView();
    }

    render() {

        const ipc = window.require('electron').ipcRenderer;

        return (
            <footer className={this.theme + ' ' + this.state.classList}>

                <ul className='flex'>

                    <li className='wide-windows footer-windows hover'>
                        <Drag data={this.state.db} theme={this.theme} type='footerDrag-1' mode='vertical' job='Devices'/>
                        <svg className="gold befores" viewBox="0 0 24 24">
                            <path d="M16.031 6.984q0.75 0 1.359 0.633t0.609 1.383v5.484l-3.516 3.516v3h-4.969v-3l-3.516-3.516v-5.484q0-0.75 0.609-1.383t1.359-0.633h0.047v-3.984h1.969v3.984h4.031v-3.984h1.969z"></path>
                        </svg>
                        <span onClick={(ev) => this.displayWindow(ev, 'wide')} data-title='Mounted devices' aria-label='Mounted devices'>
                            Devices
                        </span>
                    </li>

                    <li className='wide-windows footer-windows hover'>
                        <Drag data={this.state.db} theme={this.theme} type='footerDrag-2' mode='vertical' job='Logs' logs={this.state.logs}/>
                        <svg className="blue befores" viewBox="0 0 24 24">
                            <path d="M14.016 12v-2.016h-4.031v2.016h4.031zM14.016 15.984v-1.969h-4.031v1.969h4.031zM20.016 8.016v1.969h-2.109q0.094 0.656 0.094 1.031v0.984h2.016v2.016h-2.016v0.984q0 0.328-0.094 0.984h2.109v2.016h-2.813q-0.797 1.359-2.18 2.18t-3.023 0.82-3.023-0.82-2.18-2.18h-2.813v-2.016h2.109q-0.094-0.656-0.094-0.984v-0.984h-2.016v-2.016h2.016v-0.984q0-0.375 0.094-1.031h-2.109v-1.969h2.813q0.703-1.172 1.828-1.969l-1.641-1.641 1.406-1.406 2.203 2.156q0.703-0.141 1.406-0.141t1.406 0.141l2.203-2.156 1.406 1.406-1.641 1.641q1.172 0.797 1.828 1.969h2.813z"></path>
                        </svg>
                        <span onClick={(ev) => this.displayWindow(ev, 'wide', 'logs')} data-title='Logs list' aria-label='Error logs list'>
                            Logs
                        </span>
                    </li>

                    {/*<li className='wide-windows footer-windows hover'>
                        <Drag data={this.state.db} theme={this.theme} type='footerDrag-3' mode='vertical' job='Terminal'/>
                        <svg className="orange befores" viewBox="0 0 24 24">
                            <path d="M21 15.609l-1.406 1.406-5.016-5.016 5.016-5.016 1.406 1.406-3.563 3.609zM3 6h12.984v2.016h-12.984v-2.016zM3 12.984v-1.969h9.984v1.969h-9.984zM3 18v-2.016h12.984v2.016h-12.984z"></path>
                        </svg>
                        <span onClick={(ev) => this.displayWindow(ev, 'wide', 'terminal')} data-title='Terminal window' aria-label='Terminal window'>
                            Terminal
                        </span>
                    </li>*/}
                    {getRole(this.state.db.user, ['octeus', 'operator']) === true &&
                        <li className='wide-windows footer-windows hover'>
                            <Drag data={this.state.db} theme={this.theme} type='footerDrag-4' mode='vertical'
                                  job='TODO'/>
                            <svg className="green befores" viewBox="0 0 24 24">
                                <path
                                    d="M21.516 11.484l1.5 1.5-6.984 7.031-4.547-4.5 1.5-1.5 3.047 3zM2.016 15.984v-1.969h7.969v1.969h-7.969zM14.016 6v2.016h-12v-2.016h12zM14.016 9.984v2.016h-12v-2.016h12z"></path>
                            </svg>
                            <span onClick={(ev) => this.displayWindow(ev, 'wide', 'todo')} data-title='TODO list'
                                  aria-label='TODO list'>
                            TODO
                        </span>
                        </li>
                    }
                </ul>

                <ul className='flex'>

                    <li className='nano-windows footer-nanos hover' id='connexion-info'>
                        <Drag data={this.state.db} theme={this.theme} type='footerNano-1' job='Connexion' mode='connexion'/>
                        <span onClick={(ev) => this.displayWindow(ev, 'nano')} data-title='Web connexion is disabled'>
                            <svg className="red soloIcon" viewBox="0 0 24 24">
                                <path d="M9 17.016q1.266-1.266 3-1.266t3 1.266l-3 3zM2.016 3.047l1.266-1.266 16.969 16.969-1.266 1.266-7.078-7.078q-1.172 0-2.625 0.609t-2.297 1.453l-1.969-1.969v-0.047q1.828-1.828 4.406-2.531l-2.25-2.203q-2.297 0.938-4.172 2.766l-2.016-2.016q1.828-1.828 4.078-2.906zM18.984 12.984l-0.938 0.984-3.563-3.516q2.672 0.703 4.5 2.531zM22.969 9l-1.969 2.016q-3.938-4.031-9.656-3.703l-2.484-2.531q3.797-0.797 7.523 0.281t6.586 3.938z"></path>
                            </svg>
                        </span>
                    </li>

                    <li className='nano-windows footer-nanos hover' id='cloud-info'>
                        <Drag data={this.state.db} theme={this.theme} type='footerNano-2' job='Cloud' mode='cloud'/>
                        <span data-title='Cloud is offline'>
                            <svg className={this.theme + " color soloIcon"} viewBox="0 0 24 24">
                                <path d="M9.984 17.016l6.609-6.609-1.406-1.406-5.203 5.156-2.063-2.063-1.406 1.406zM19.359 10.031q1.922 0.141 3.281 1.57t1.359 3.398q0 2.063-1.477 3.539t-3.539 1.477h-12.984q-2.484 0-4.242-1.758t-1.758-4.242q0-2.203 1.57-3.961t3.773-1.992q0.984-1.828 2.766-2.953t3.891-1.125q2.531 0 4.711 1.781t2.648 4.266z"></path>
                            </svg>
                        </span>
                    </li>

                    <li className='nano-windows footer-nanos hover' id='theme-info' onClick={(e) => {
                        ipc.send('invokeSettings', 'themes');
                        window.getModal(e)
                    }}>
                        <span data-title='Current theme' className='flex center'>
                            <small id='theme-indicator' className={this.theme + ' bg border-color'}/>
                            <span id='footer-theme'>{this.theme}</span>
                            &nbsp;theme
                        </span>
                    </li>
                    {getRole(this.state.db.user, ['octeus']) === true &&
                        <li className='nano-windows footer-nanos hover' id='projects-info'>
                            <Drag data={this.state.db} theme={this.theme} type='footerNano-4' job='Projects done'
                                  mode='projects'/>
                            <svg className="orange befores" viewBox="0 0 24 24">
                                <path d="M10.5 20h-10.5v-13l5 3.33v-3.33l5 3.33v-3.33l5 3.33v-10.33h5v20h-9.5z"></path>
                            </svg>
                            <span onClick={(ev) => this.displayWindow(ev, 'nano')} data-title='Projects done'>
                            Projects done
                        </span>
                        </li>
                    }
                </ul>

            </footer>
        );
    }
}

export default Footer;
