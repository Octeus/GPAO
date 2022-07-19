import React from "react";
import './Header.css';
//import Svg from "../Svg/Svg";
import { getRole } from "../../Tools/Tools";

/**
 * Create React Header component.
 * @typedef {function}
 * @param {object} props - Object transmitted from parent component.
 * @memberOf Commons
 * @returns {string} - Returns the compiled React component
 */

class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            db: props.data,
            classList: props.classList,
            timerOn: false,
            timerStart: 0,
            timerTime: 0
        }
    }

    componentDidMount() {

        this.startTimer();
    }

    startTimer = () => {
        this.setState({
            timerOn: true,
            timerTime: this.state.timerTime,
            timerStart: Date.now() - this.state.timerTime
        });
        this.timer = setInterval(() => {
            this.setState({
                timerTime: Date.now() - this.state.timerStart
            });
        }, 10);
    };

    render() {

        const shell = window.require('electron').shell;
        const ipc = window.require('electron').ipcRenderer;

        const { timerTime } = this.state;
        let seconds = ("0" + (Math.floor(timerTime / 1000) % 60)).slice(-2);
        let minutes = ("0" + (Math.floor(timerTime / 60000) % 60)).slice(-2);
        let hours = ("0" + Math.floor(timerTime / 3600000)).slice(-2);

        return (

            <header className={this.state.db.settings.theme + ' ' + this.state.classList + ' flex jc-between items-center'}>
                <p id='hello-user' className='flex jc-start'>
                    <span>Welcome <span>{this.state.db.user.prenom} {this.state.db.user.nom.toUpperCase()}</span></span>&nbsp;<small>(Login time: <b>{hours}:{minutes}:{seconds}</b>)</small>
                </p>
                <ul className='flex jc-end items-center'>
                    <li data-title='User account' data-ref='User account'
                        className='hover flex center headerSoloIcon headerTriggers'>
                        <svg className="header-icons orange" viewBox="0 0 24 24">
                            <path
                                d="M12 14.016q2.531 0 5.273 1.102t2.742 2.883v2.016h-16.031v-2.016q0-1.781 2.742-2.883t5.273-1.102zM12 12q-1.641 0-2.813-1.172t-1.172-2.813 1.172-2.836 2.813-1.195 2.813 1.195 1.172 2.836-1.172 2.813-2.813 1.172z"></path>
                        </svg>
                    </li>
                    <li className={this.state.db.settings.theme + ' border-color header-sep'}/>
                    {getRole(this.state.db.user, ['octeus']) === true &&
                        <>
                            <li className={this.state.db.settings.theme + ' bg color-2 flex center hover border-color'}
                                id='access-to-crm' onClick={() => shell.openExternal('https://octeus.fr/admin')}>ACCESS
                                TO CRM
                            </li>
                            <li className={this.state.db.settings.theme + ' border-color header-sep'}/>
                        </>
                    }
                    <li data-title='Send mails' data-ref='Emails sender'
                        className='hover flex center headerSoloIcon headerTriggers'>
                        <svg className="header-icons gold" viewBox="0 0 20 20">
                            <path
                                d="M18.64 2.634c-0.344 0.121-17.321 6.104-17.656 6.222-0.284 0.1-0.347 0.345-0.010 0.479 0.401 0.161 3.796 1.521 3.796 1.521v0l2.25 0.901c0 0 10.838-7.958 10.984-8.066 0.148-0.108 0.318 0.095 0.211 0.211s-7.871 8.513-7.871 8.513v0.002l-0.452 0.503 0.599 0.322c0 0 4.65 2.504 4.982 2.682 0.291 0.156 0.668 0.027 0.752-0.334 0.099-0.426 2.845-12.261 2.906-12.525 0.079-0.343-0.148-0.552-0.491-0.431zM7 17.162c0 0.246 0.139 0.315 0.331 0.141 0.251-0.229 2.85-2.561 2.85-2.561l-3.181-1.644v4.064z"></path>
                        </svg>
                    </li>
                    <li data-title='Get society members phone numbers' data-ref='Phone numbers'
                        className='hover flex center headerSoloIcon headerTriggers'>
                        <svg className="header-icons red" viewBox="0 0 20 20">
                            <path
                                d="M17.256 12.253c-0.096-0.667-0.611-1.187-1.274-1.342-2.577-0.604-3.223-2.088-3.332-3.734-0.457-0.085-1.27-0.177-2.65-0.177s-2.193 0.092-2.65 0.177c-0.109 1.646-0.755 3.13-3.332 3.734-0.663 0.156-1.178 0.675-1.274 1.342l-0.497 3.442c-0.175 1.212 0.715 2.305 1.953 2.305h11.6c1.237 0 2.128-1.093 1.953-2.305l-0.497-3.442zM10 15.492c-1.395 0-2.526-1.12-2.526-2.5s1.131-2.5 2.526-2.5 2.526 1.12 2.526 2.5-1.132 2.5-2.526 2.5zM19.95 6c-0.024-1.5-3.842-3.999-9.95-4-6.109 0.001-9.927 2.5-9.95 4s0.021 3.452 2.535 3.127c2.941-0.381 2.76-1.408 2.76-2.876 0-1.024 2.392-1.271 4.655-1.271s4.654 0.247 4.655 1.271c0 1.468-0.181 2.495 2.76 2.876 2.513 0.325 2.558-1.627 2.535-3.127z"></path>
                        </svg>
                    </li>
                    <li data-title='Get society activity stats' data-ref='Statistics'
                        className='hover flex center headerSoloIcon headerTriggers'>
                        <svg className="header-icons orange" viewBox="0 0 20 20">
                            <path
                                d="M0.69 11.331l1.363 0.338 1.026-1.611-1.95-0.482c-0.488-0.121-0.981 0.174-1.102 0.66-0.121 0.483 0.175 0.973 0.663 1.095zM18.481 11.592l-4.463 4.016-5.247-4.061c-0.1-0.076-0.215-0.133-0.338-0.162l-0.698-0.174-1.027 1.611 1.1 0.273 5.697 4.408c0.166 0.127 0.362 0.189 0.559 0.189 0.219 0 0.438-0.078 0.609-0.232l5.028-4.527c0.372-0.334 0.401-0.906 0.064-1.277s-0.911-0.4-1.284-0.064zM8.684 7.18l4.887 3.129c0.413 0.264 0.961 0.154 1.24-0.246l5.027-7.242c0.286-0.412 0.183-0.977-0.231-1.26-0.414-0.285-0.979-0.182-1.265 0.23l-4.528 6.521-4.916-3.147c-0.204-0.131-0.451-0.174-0.688-0.123-0.236 0.053-0.442 0.197-0.571 0.4l-7.497 11.767c-0.27 0.422-0.144 0.983 0.28 1.25 0.15 0.096 0.319 0.141 0.486 0.141 0.301 0 0.596-0.149 0.768-0.42l7.008-11z"></path>
                        </svg>
                    </li>
                    <li data-title='Calculator tool' data-ref='Calculator'
                        className='hover flex center headerSoloIcon headerTriggers'>
                        <svg className="header-icons green" viewBox="0 0 20 20">
                            <path
                                d="M14.6 1h-9.202c-0.769 0-1.398 0.629-1.398 1.4v15.2c0 0.77 0.629 1.4 1.398 1.4h9.202c0.769 0 1.4-0.631 1.4-1.4v-15.2c0-0.771-0.631-1.4-1.4-1.4zM7 12c0.689 0 1.25 0.447 1.25 1s-0.561 1-1.25 1c-0.69 0-1.25-0.447-1.25-1s0.56-1 1.25-1zM5.75 10c0-0.553 0.56-1 1.25-1s1.25 0.447 1.25 1-0.561 1-1.25 1c-0.69 0-1.25-0.447-1.25-1zM7 15c0.689 0 1.25 0.447 1.25 1s-0.561 1-1.25 1c-0.69 0-1.25-0.447-1.25-1s0.56-1 1.25-1zM10 12c0.689 0 1.25 0.447 1.25 1s-0.561 1-1.25 1c-0.69 0-1.25-0.447-1.25-1s0.56-1 1.25-1zM8.75 10c0-0.553 0.56-1 1.25-1s1.25 0.447 1.25 1-0.561 1-1.25 1c-0.69 0-1.25-0.447-1.25-1zM10 15c0.689 0 1.25 0.447 1.25 1s-0.561 1-1.25 1c-0.69 0-1.25-0.447-1.25-1s0.56-1 1.25-1zM13 12c0.689 0 1.25 0.447 1.25 1s-0.561 1-1.25 1c-0.69 0-1.25-0.447-1.25-1s0.56-1 1.25-1zM11.75 10c0-0.553 0.56-1 1.25-1s1.25 0.447 1.25 1-0.561 1-1.25 1c-0.69 0-1.25-0.447-1.25-1zM13 15c0.689 0 1.25 0.447 1.25 1s-0.561 1-1.25 1c-0.69 0-1.25-0.447-1.25-1s0.56-1 1.25-1zM5 7v-3h10v3h-10z"></path>
                        </svg>
                    </li>
                    {/*{getRole(this.state.db.user, ['octeus']) === true &&
                        <li data-title='Print current customer data' data-ref='Print'
                            className='hover flex center headerSoloIcon headerTriggers'>
                            <svg className="header-icons blue" viewBox="0 0 24 24">
                                <path
                                    d="M18 3v3.984h-12v-3.984h12zM18.984 12q0.422 0 0.727-0.281t0.305-0.703-0.305-0.727-0.727-0.305-0.703 0.305-0.281 0.727 0.281 0.703 0.703 0.281zM15.984 18.984v-4.969h-7.969v4.969h7.969zM18.984 8.016q1.219 0 2.109 0.891t0.891 2.109v6h-3.984v3.984h-12v-3.984h-3.984v-6q0-1.219 0.891-2.109t2.109-0.891h13.969z"></path>
                            </svg>
                        </li>
                    }*/}
                    <li className={this.state.db.settings.theme + ' border-color header-sep'}/>
                    {/*<li data-title='Search in settings and current project files' data-ref='Search'
                        className='hover flex center headerSoloIcon headerTriggers'>
                        <svg className="header-icons gold" viewBox="0 0 24 24">
                            <path
                                d="M9.516 14.016q1.875 0 3.188-1.313t1.313-3.188-1.313-3.188-3.188-1.313-3.188 1.313-1.313 3.188 1.313 3.188 3.188 1.313zM15.516 14.016l4.969 4.969-1.5 1.5-4.969-4.969v-0.797l-0.281-0.281q-1.781 1.547-4.219 1.547-2.719 0-4.617-1.875t-1.898-4.594 1.898-4.617 4.617-1.898 4.594 1.898 1.875 4.617q0 0.984-0.469 2.227t-1.078 1.992l0.281 0.281h0.797z"></path>
                        </svg>
                    </li>*/}
                    <li id='system-infos-header-window' data-title='System and Project settings'
                        className='hover flex center headerSoloIcon system-infos-header-window'
                        onClick={(e) => displaySettingsNanoModal(e)}>
                        <svg className={this.state.db.settings.theme + ' color header-icons'} viewBox="0 0 24 24">
                            <path
                                d="M12 15.984q0.797 0 1.406 0.609t0.609 1.406-0.609 1.406-1.406 0.609-1.406-0.609-0.609-1.406 0.609-1.406 1.406-0.609zM12 9.984q0.797 0 1.406 0.609t0.609 1.406-0.609 1.406-1.406 0.609-1.406-0.609-0.609-1.406 0.609-1.406 1.406-0.609zM12 8.016q-0.797 0-1.406-0.609t-0.609-1.406 0.609-1.406 1.406-0.609 1.406 0.609 0.609 1.406-0.609 1.406-1.406 0.609z"></path>
                        </svg>
                    </li>
                </ul>
                <div className={this.state.db.settings.theme + ' bg-2 border-color header-settings-trigger'}
                     id='header-settings-trigger'>
                    <li className='hover flex jc-start items-center' onClick={(e) => {
                        ipc.send('invokeSettings', 'settings');
                        window.getModal(e)
                    }}>
                        <svg className="befores green" viewBox="0 0 24 24">
                            <path
                                d="M12 15.516q1.453 0 2.484-1.031t1.031-2.484-1.031-2.484-2.484-1.031-2.484 1.031-1.031 2.484 1.031 2.484 2.484 1.031zM19.453 12.984l2.109 1.641q0.328 0.234 0.094 0.656l-2.016 3.469q-0.188 0.328-0.609 0.188l-2.484-0.984q-0.984 0.703-1.688 0.984l-0.375 2.625q-0.094 0.422-0.469 0.422h-4.031q-0.375 0-0.469-0.422l-0.375-2.625q-0.891-0.375-1.688-0.984l-2.484 0.984q-0.422 0.141-0.609-0.188l-2.016-3.469q-0.234-0.422 0.094-0.656l2.109-1.641q-0.047-0.328-0.047-0.984t0.047-0.984l-2.109-1.641q-0.328-0.234-0.094-0.656l2.016-3.469q0.188-0.328 0.609-0.188l2.484 0.984q0.984-0.703 1.688-0.984l0.375-2.625q0.094-0.422 0.469-0.422h4.031q0.375 0 0.469 0.422l0.375 2.625q0.891 0.375 1.688 0.984l2.484-0.984q0.422-0.141 0.609 0.188l2.016 3.469q0.234 0.422-0.094 0.656l-2.109 1.641q0.047 0.328 0.047 0.984t-0.047 0.984z"></path>
                        </svg>
                        Settings
                    </li>
                    <li className='hover flex jc-start items-center' onClick={(e) => {
                        ipc.send('invokeSettings', 'appearance');
                        window.getModal(e)
                    }}>
                        <svg className="befores red" viewBox="0 0 24 24">
                            <path
                                d="M18 3.984h3v8.016h-8.016v9q0 0.422-0.281 0.703t-0.703 0.281h-2.016q-0.422 0-0.703-0.281t-0.281-0.703v-11.016h9.984v-3.984h-0.984v0.984q0 0.422-0.281 0.727t-0.703 0.305h-12q-0.422 0-0.727-0.305t-0.305-0.727v-3.984q0-0.422 0.305-0.703t0.727-0.281h12q0.422 0 0.703 0.281t0.281 0.703v0.984z"></path>
                        </svg>
                        Appearance...
                    </li>
                    <li className='hover flex jc-start items-center' onClick={(e) => {
                        ipc.send('invokeSettings', 'stats');
                        window.getModal(e)
                    }}>
                        <svg className="befores orange" viewBox="0 0 24 24">
                            <path
                                d="M0.69 11.331l1.363 0.338 1.026-1.611-1.95-0.482c-0.488-0.121-0.981 0.174-1.102 0.66-0.121 0.483 0.175 0.973 0.663 1.095zM18.481 11.592l-4.463 4.016-5.247-4.061c-0.1-0.076-0.215-0.133-0.338-0.162l-0.698-0.174-1.027 1.611 1.1 0.273 5.697 4.408c0.166 0.127 0.362 0.189 0.559 0.189 0.219 0 0.438-0.078 0.609-0.232l5.028-4.527c0.372-0.334 0.401-0.906 0.064-1.277s-0.911-0.4-1.284-0.064zM8.684 7.18l4.887 3.129c0.413 0.264 0.961 0.154 1.24-0.246l5.027-7.242c0.286-0.412 0.183-0.977-0.231-1.26-0.414-0.285-0.979-0.182-1.265 0.23l-4.528 6.521-4.916-3.147c-0.204-0.131-0.451-0.174-0.688-0.123-0.236 0.053-0.442 0.197-0.571 0.4l-7.497 11.767c-0.27 0.422-0.144 0.983 0.28 1.25 0.15 0.096 0.319 0.141 0.486 0.141 0.301 0 0.596-0.149 0.768-0.42l7.008-11z"></path>
                        </svg>
                        Statistics...
                    </li>
                    <li className='hover flex jc-start items-center' onClick={(e) => {
                        ipc.send('invokeSettings', 'users');
                        window.getModal(e)
                    }}>
                        <svg className="befores blue" viewBox="0 0 30 28">
                            <path
                                d="M9.266 14c-1.625 0.047-3.094 0.75-4.141 2h-2.094c-1.563 0-3.031-0.75-3.031-2.484 0-1.266-0.047-5.516 1.937-5.516 0.328 0 1.953 1.328 4.062 1.328 0.719 0 1.406-0.125 2.078-0.359-0.047 0.344-0.078 0.688-0.078 1.031 0 1.422 0.453 2.828 1.266 4zM26 23.953c0 2.531-1.672 4.047-4.172 4.047h-13.656c-2.5 0-4.172-1.516-4.172-4.047 0-3.531 0.828-8.953 5.406-8.953 0.531 0 2.469 2.172 5.594 2.172s5.063-2.172 5.594-2.172c4.578 0 5.406 5.422 5.406 8.953zM10 4c0 2.203-1.797 4-4 4s-4-1.797-4-4 1.797-4 4-4 4 1.797 4 4zM21 10c0 3.313-2.688 6-6 6s-6-2.688-6-6 2.688-6 6-6 6 2.688 6 6zM30 13.516c0 1.734-1.469 2.484-3.031 2.484h-2.094c-1.047-1.25-2.516-1.953-4.141-2 0.812-1.172 1.266-2.578 1.266-4 0-0.344-0.031-0.688-0.078-1.031 0.672 0.234 1.359 0.359 2.078 0.359 2.109 0 3.734-1.328 4.062-1.328 1.984 0 1.937 4.25 1.937 5.516zM28 4c0 2.203-1.797 4-4 4s-4-1.797-4-4 1.797-4 4-4 4 1.797 4 4z"></path>
                        </svg>
                        Users list...
                    </li>
                </div>
            </header>
        );
    }
}

function displaySettingsNanoModal(e) {

    let //target = e.currentTarget,
        modal = document.querySelector('#header-settings-trigger');

    if (modal.classList.contains('displaySystemNanoModal')) {
        modal.classList.remove('displaySystemNanoModal');
    } else {
        modal.classList.add('displaySystemNanoModal');
    }
}

export default Header;
