import React from "react";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import './Template.css';
import JsonThemes from '../../../common/Themes/themes.json';
import Themes from '../../../common/Themes/Themes';
import Select from "../../../components/Select/Select";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Shortcuts from './shortcuts.json';
import { getRole } from "../../../Tools/Tools";

class Settings extends React.Component {

    constructor(props) {

        super(props);
        this.fixedTheme = props.data.settings.theme;
        this.actualSettings = null;

        this.state = {
            db: props.data,
            id: props.id,
            markdowns: null,
            classList: props.classList,
            content: props.content,
            getModal: props.getModal,
            selected: 'appearance',
            updateDataBase: props.updateDataBase,
            themeName: props.data.settings.theme,
            confirmModal: false,
            windows: props.data.settings.windows,
            items: props.data.settings.stats.items,
            lapse: props.data.settings.stats.lapse,
            leftWindow: props.data.settings.windows.left,
            rightWindow: props.data.settings.windows.right,
            bottomWindow: props.data.settings.windows.bottom
        }
    }

    componentDidMount() {

        document.onkeyup = (e) => {
            if (e.code === 'Escape') {
                let closeModal = document.querySelector('#close-modal');
                if (closeModal) {
                    closeModal.click();
                }
            }
        }

        const ipc = window.require('electron').ipcRenderer;
        ipc.on('getMardownFiles.reply',  (event, res) => {
            this.setState({markdowns: res});
        });
        ipc.send('getMardownFiles');

        if (this.state.content !== 'settings') {
            let section = document.querySelector('#settings-nav > li[data-name="' + this.state.content + '"]');
            if (section) {
                section.click();
            }
        }
    }

    closeModal = () => {
        let closeModal = document.querySelector('#close-modal');
        if (closeModal !== null) {
            closeModal.click();
        }
    }

    gotToAnchor = (section, anchor) => {
        let target = document.querySelector('#settings-' + section + ' [data-ref="' + anchor + '"');
        target.scrollIntoView({behavior: "smooth"});
    }

    updateSettings = () => {

        let setts = this.actualSettings;
        let dB = this.state.db;

        if (setts !== null) {

            dB.settings[setts['mode']] = this.sortData(dB.settings[setts['mode']], setts['mode'], setts['value']);

            this.setState({confirmModal: false});
            this.closeModal();
            window.remoteUpdateDB('settings', dB.settings, true);

        } else {
            this.setState({confirmModal: false});
            this.closeModal();
        }
    }

    sortData = (db, mode, data) => {

        if (mode === 'theme') {
            return data;
        } else {
            if (mode === 'print') {
                for (const dataKey in data) {
                    if (dataKey !== 'dimensions') {
                        db[dataKey] = data[dataKey];
                    } else {
                        let auth = data[dataKey];
                        for (const key in auth) {
                            db[dataKey][key] = auth[key];
                        }
                    }
                }
            } else if (mode === 'stats' || mode === 'windows') {
                for (const dataKey in data) {
                    db[dataKey] = data[dataKey];
                }
            }
            return db;
        }
    }

    render() {

        const shell = window.require('electron').shell;

        return (
            <div id={this.state.id} className={this.state.classList + ' modal-settings'}>
                {this.state.confirmModal === true &&
                    <div id='settings-confirm-container' style={{backgroundColor: 'var(--' + this.fixedTheme + '-theme-opacity'}}>
                        <div id='settings-confirm' className={this.state.classList}>
                            <p>The changes will be active after restarting the software</p>
                            <div id='settings-confirm-btns'>
                                <Button
                                    className='confirm-btns'
                                    text='Restart'
                                    onClick={() => this.updateSettings()}
                                    type='button'
                                    data={this.state.db}
                                    active={true}
                                />
                                <Button
                                    className='confirm-btns'
                                    text='Cancel'
                                    onClick={() => this.setState({confirmModal: false})}
                                    type='button'
                                    data={this.state.db}
                                    active={true}
                                />
                            </div>
                        </div>
                    </div>
                }
                <div className={this.fixedTheme + ' bg color modal-title'}>
                    <h3 className='flex jc-start items-center'>
                        <svg className="befores green" viewBox="0 0 24 24">
                            <path d="M12 15.516q1.453 0 2.484-1.031t1.031-2.484-1.031-2.484-2.484-1.031-2.484 1.031-1.031 2.484 1.031 2.484 2.484 1.031zM19.453 12.984l2.109 1.641q0.328 0.234 0.094 0.656l-2.016 3.469q-0.188 0.328-0.609 0.188l-2.484-0.984q-0.984 0.703-1.688 0.984l-0.375 2.625q-0.094 0.422-0.469 0.422h-4.031q-0.375 0-0.469-0.422l-0.375-2.625q-0.891-0.375-1.688-0.984l-2.484 0.984q-0.422 0.141-0.609-0.188l-2.016-3.469q-0.234-0.422 0.094-0.656l2.109-1.641q-0.047-0.328-0.047-0.984t0.047-0.984l-2.109-1.641q-0.328-0.234-0.094-0.656l2.016-3.469q0.188-0.328 0.609-0.188l2.484 0.984q0.984-0.703 1.688-0.984l0.375-2.625q0.094-0.422 0.469-0.422h4.031q0.375 0 0.469 0.422l0.375 2.625q0.891 0.375 1.688 0.984l2.484-0.984q0.422-0.141 0.609 0.188l2.016 3.469q0.234 0.422-0.094 0.656l-2.109 1.641q0.047 0.328 0.047 0.984t-0.047 0.984z"></path>
                        </svg>
                        Settings
                    </h3>
                    <span id='close-modal' className='hover headerSoloIcon flex center' onClick={(e) => this.state.getModal('none', null)}>
                        <svg className='red header-icons' viewBox="0 0 24 24">
                            <path d="M18.984 6.422l-5.578 5.578 5.578 5.578-1.406 1.406-5.578-5.578-5.578 5.578-1.406-1.406 5.578-5.578-5.578-5.578 1.406-1.406 5.578 5.578 5.578-5.578z"></path>
                        </svg>
                    </span>
                </div>
                <div className={this.fixedTheme + ' bg-2 color flex modal-content'} id={this.state.content.replaceAll(' ', '-').toLowerCase()}>
                    <div id='settings-left-container'>
                        <Input
                            type='search'
                            placeholder='Search'
                            className={this.fixedTheme + ' bg color'}
                            onInput={e => window.searchSettings(e)}
                        />
                        <ul id='settings-nav'>
                            <li
                                className={(this.state.selected === 'appearance') ? 'checked' : ''}
                                data-name='appearance'
                                onClick={() => {
                                    this.setState({selected: 'appearance'});
                                    this.actualSettings = null;
                                }}
                            >
                                <span>
                                    <svg className="settings-chevron" viewBox="0 0 20 20">
                                        <path d="M9.163 4.516c0.418 0.408 4.502 4.695 4.502 4.695 0.223 0.219 0.335 0.504 0.335 0.789s-0.112 0.57-0.335 0.787c0 0-4.084 4.289-4.502 4.695-0.418 0.408-1.17 0.436-1.615 0-0.446-0.434-0.481-1.041 0-1.574l3.747-3.908-3.747-3.908c-0.481-0.533-0.446-1.141 0-1.576s1.197-0.409 1.615 0z"></path>
                                    </svg>
                                    Appearance
                                </span>
                                <ul>
                                    {JsonThemes.map((theme, i) =>
                                        <li
                                            className='sub-settings'
                                            key={i}
                                            onClick={() => this.gotToAnchor('appearance', theme.name)}
                                        >
                                            {window.capitalize(theme.name)} theme
                                        </li>
                                    )}
                                </ul>
                            </li>
                            <li
                                className={(this.state.selected === 'windows') ? 'checked' : ''}
                                onClick={() => {
                                    this.setState({selected: 'windows'});
                                    this.actualSettings = null;
                                }}
                            >
                                <span>
                                    <svg className="settings-chevron" viewBox="0 0 20 20">
                                        <path d="M9.163 4.516c0.418 0.408 4.502 4.695 4.502 4.695 0.223 0.219 0.335 0.504 0.335 0.789s-0.112 0.57-0.335 0.787c0 0-4.084 4.289-4.502 4.695-0.418 0.408-1.17 0.436-1.615 0-0.446-0.434-0.481-1.041 0-1.574l3.747-3.908-3.747-3.908c-0.481-0.533-0.446-1.141 0-1.576s1.197-0.409 1.615 0z"></path>
                                    </svg>
                                    Windows options
                                </span>
                                <ul>
                                    {getRole(this.state.db.user, ['octeus']) === true &&
                                        <li
                                            className='sub-settings'
                                            onClick={() => this.gotToAnchor('save', 'left')}
                                        >
                                            Left side
                                        </li>
                                    }
                                    <li
                                        className='sub-settings'
                                        onClick={() => this.gotToAnchor('save', 'right')}
                                    >
                                        Right side
                                    </li>
                                    <li
                                        className='sub-settings'
                                        onClick={() => this.gotToAnchor('save', 'bottom')}
                                    >
                                        Bottom side
                                    </li>
                                </ul>
                            </li>
                            <li
                                className={(this.state.selected === 'users') ? 'checked' : ''}
                                onClick={() => {
                                    this.setState({selected: 'users'});
                                    this.actualSettings = null;
                                }}
                                data-name='users'
                            >
                                <span>
                                    <svg className="settings-chevron" viewBox="0 0 20 20">
                                        <path d="M9.163 4.516c0.418 0.408 4.502 4.695 4.502 4.695 0.223 0.219 0.335 0.504 0.335 0.789s-0.112 0.57-0.335 0.787c0 0-4.084 4.289-4.502 4.695-0.418 0.408-1.17 0.436-1.615 0-0.446-0.434-0.481-1.041 0-1.574l3.747-3.908-3.747-3.908c-0.481-0.533-0.446-1.141 0-1.576s1.197-0.409 1.615 0z"></path>
                                    </svg>
                                    Users list
                                </span>
                                <ul>
                                    <li
                                        className='sub-settings'
                                        onClick={() => this.gotToAnchor('users', 'octeus')}
                                    >
                                        Octeus
                                    </li>
                                    <li
                                        className='sub-settings'
                                        onClick={() => this.gotToAnchor('users', 'prod')}
                                    >
                                        Production
                                    </li>
                                </ul>
                            </li>
                            <li
                                className={(this.state.selected === 'print') ? 'checked' : ''}
                                onClick={() => {
                                    this.setState({selected: 'print'});
                                    this.actualSettings = null;
                                }}
                                data-name='print'
                            >
                                <span>
                                    <svg className="settings-chevron" viewBox="0 0 20 20">
                                        <path d="M9.163 4.516c0.418 0.408 4.502 4.695 4.502 4.695 0.223 0.219 0.335 0.504 0.335 0.789s-0.112 0.57-0.335 0.787c0 0-4.084 4.289-4.502 4.695-0.418 0.408-1.17 0.436-1.615 0-0.446-0.434-0.481-1.041 0-1.574l3.747-3.908-3.747-3.908c-0.481-0.533-0.446-1.141 0-1.576s1.197-0.409 1.615 0z"></path>
                                    </svg>
                                    Print options
                                </span>
                                <ul>
                                    <li
                                        className='sub-settings'
                                        onClick={() => this.gotToAnchor('print', 'dimensions')}
                                    >
                                        Dimensions
                                    </li>
                                    <li
                                        className='sub-settings'
                                        onClick={() => this.gotToAnchor('print', 'format')}
                                    >
                                        Format
                                    </li>
                                </ul>
                            </li>
                            <li
                                className={(this.state.selected === 'stats') ? 'checked' : ''}
                                onClick={() => {
                                    this.setState({selected: 'stats'});
                                    this.actualSettings = null;
                                }}
                                data-name='stats'
                            >
                                <span>
                                    <svg className="settings-chevron" viewBox="0 0 20 20">
                                        <path d="M9.163 4.516c0.418 0.408 4.502 4.695 4.502 4.695 0.223 0.219 0.335 0.504 0.335 0.789s-0.112 0.57-0.335 0.787c0 0-4.084 4.289-4.502 4.695-0.418 0.408-1.17 0.436-1.615 0-0.446-0.434-0.481-1.041 0-1.574l3.747-3.908-3.747-3.908c-0.481-0.533-0.446-1.141 0-1.576s1.197-0.409 1.615 0z"></path>
                                    </svg>
                                    Statistics
                                </span>
                                <ul>
                                    <li
                                        className='sub-settings'
                                        onClick={() => this.gotToAnchor('stats', 'items')}
                                    >
                                        Items
                                    </li>
                                    <li
                                        className='sub-settings'
                                        onClick={() => this.gotToAnchor('stats', 'lapse')}
                                    >
                                        Time lapse
                                    </li>
                                    <li
                                        className='sub-settings'
                                        onClick={() => this.gotToAnchor('stats', 'presentation')}
                                    >
                                        Presentation
                                    </li>
                                </ul>
                            </li>
                            <li
                                className={(this.state.selected === 'shortcuts') ? 'checked' : ''}
                                onClick={() => {
                                    this.setState({selected: 'shortcuts'})
                                    this.actualSettings = null;
                                }}
                                data-name='shortcuts'
                            >
                                <span>
                                    Shortcuts
                                </span>
                            </li>
                            <li
                                className={(this.state.selected === 'about') ? 'checked' : ''}
                                onClick={() => {
                                    this.setState({selected: 'about'})
                                    this.actualSettings = null;
                                }}
                                data-name='about'
                            >
                                <span>
                                    <svg className="settings-chevron" viewBox="0 0 20 20">
                                        <path d="M9.163 4.516c0.418 0.408 4.502 4.695 4.502 4.695 0.223 0.219 0.335 0.504 0.335 0.789s-0.112 0.57-0.335 0.787c0 0-4.084 4.289-4.502 4.695-0.418 0.408-1.17 0.436-1.615 0-0.446-0.434-0.481-1.041 0-1.574l3.747-3.908-3.747-3.908c-0.481-0.533-0.446-1.141 0-1.576s1.197-0.409 1.615 0z"></path>
                                    </svg>
                                    About DC
                                </span>
                                <ul>
                                    <li
                                        className='sub-settings'
                                        onClick={() => this.gotToAnchor('about', 'info')}
                                    >
                                        Information
                                    </li>
                                    <li
                                        className='sub-settings'
                                        onClick={() => this.gotToAnchor('about', 'system')}
                                    >
                                        System
                                    </li>
                                </ul>
                            </li>
                            <li
                                className={(this.state.selected === 'policy') ? 'checked' : ''}
                                onClick={() => this.setState({selected: 'policy'})}
                                data-name='policy'
                            >
                                <span>
                                    <svg className="settings-chevron" viewBox="0 0 20 20">
                                        <path d="M9.163 4.516c0.418 0.408 4.502 4.695 4.502 4.695 0.223 0.219 0.335 0.504 0.335 0.789s-0.112 0.57-0.335 0.787c0 0-4.084 4.289-4.502 4.695-0.418 0.408-1.17 0.436-1.615 0-0.446-0.434-0.481-1.041 0-1.574l3.747-3.908-3.747-3.908c-0.481-0.533-0.446-1.141 0-1.576s1.197-0.409 1.615 0z"></path>
                                    </svg>
                                    Policy
                                </span>
                                <ul>
                                    <li
                                        className='sub-settings'
                                        onClick={() => this.gotToAnchor('policy', 'terms')}
                                    >
                                        Terms
                                    </li>
                                    <li
                                        className='sub-settings'
                                        onClick={() => this.gotToAnchor('policy', 'credits')}
                                    >
                                        Credits
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div id='settings-frame' className={this.fixedTheme + ' bg color border-color'}>
                        {this.state.selected === 'appearance' &&
                            <>
                                <div id='settings-content'>
                                    <h3>Appearance</h3>
                                    <div id='settings-appearance'>
                                    {JsonThemes.map((theme, i) =>
                                        <fieldset className={this.fixedTheme + ' border-color color-2'} key={i} data-ref={theme.name}>
                                            <legend>{window.capitalize(theme.name)} theme</legend>
                                            <Input
                                                className='settings-input'
                                                label={'Choose ' + theme.name + ' theme :'}
                                                type='radio'
                                                name='theme'
                                                checked={theme.name.toLowerCase() === this.state.themeName.toLowerCase()}
                                                value={theme.name}
                                                onInput={() => {
                                                    this.actualSettings = {
                                                        'mode': 'theme',
                                                        'value': theme.name
                                                    }
                                                    this.setState({themeName: theme.name});
                                                }}
                                            />
                                            <Themes
                                                data={{settings: {theme: theme.name}}}
                                                id={theme.name + '-settings-logo'}
                                                className='themes-logos'
                                            />
                                            <ul>
                                                <li>
                                                    <span className='key-name'>Background color:&nbsp;</span>
                                                    <span className={theme.name + ' bg sample shadow'}></span>
                                                </li>
                                                <li>
                                                    <span className='key-name'>Background color secondary:&nbsp;</span>
                                                    <span className={theme.name + ' bg-2 sample shadow'}></span>
                                                </li>
                                                <li>
                                                    <span className='key-name'>Font color:&nbsp;</span>
                                                    <span className={theme.name + ' color sample'}>Text</span>
                                                </li>
                                                <li>
                                                    <span className='key-name'>Font color secondary:&nbsp;</span>
                                                    <span className={theme.name + ' color-2 sample'}>Text</span>
                                                </li>
                                                <li>
                                                    <span className='key-name'>Border color:&nbsp;</span>
                                                    <span className={theme.name + ' border-color sample shadow'}></span>
                                                </li>
                                            </ul>
                                        </fieldset>
                                    )}
                                    </div>
                                </div>
                                <div id='settings-btns-container'>
                                <Button
                                    className='refresh-devices'
                                    text='Cancel'
                                    onClick={() => this.closeModal()}
                                    type='button'
                                    data={this.state.db}
                                    active={false}
                                />
                                <Button
                                    className='refresh-devices'
                                    text='OK'
                                    onClick={() => {
                                        this.setState({confirmModal: true})
                                    }}
                                    type='button'
                                    data={this.state.db}
                                    active={true}
                                />
                                </div>
                            </>
                        }
                        {this.state.selected === 'windows' &&
                            <>
                                <div id='settings-content'>
                                    <h3>Windows options</h3>
                                    <div id='settings-save'>
                                        {getRole(this.state.db.user, ['octeus']) === true &&
                                            <fieldset className={this.fixedTheme + ' border-color color-2'}
                                                      data-ref='left'>
                                                <legend>Left side</legend>
                                                <div>
                                                    <Input
                                                        type='radio'
                                                        name='windows'
                                                        label='None'
                                                        checked={this.state.leftWindow === null}
                                                        className={this.fixedTheme + ' border-color color-2'}
                                                        title='None'
                                                        onInput={(e) => {
                                                            if (this.actualSettings === null) {
                                                                this.actualSettings = {'mode': {}, 'value': {}};
                                                            }
                                                            this.actualSettings.mode = 'windows';
                                                            this.actualSettings.value.left = null;
                                                            this.setState({leftWindow: null});
                                                        }}
                                                    />
                                                    <Input
                                                        type='radio'
                                                        name='windows'
                                                        label='Data models'
                                                        checked={this.state.leftWindow === 'Data models'}
                                                        className={this.fixedTheme + ' border-color color-2'}
                                                        title='Data models'
                                                        onInput={(e) => {
                                                            if (this.actualSettings === null) {
                                                                this.actualSettings = {'mode': {}, 'value': {}};
                                                            }
                                                            this.actualSettings.mode = 'windows';
                                                            this.actualSettings.value.left = 'Data models';
                                                            this.setState({leftWindow: 'Data models'});
                                                        }}
                                                    />
                                                    <Input
                                                        type='radio'
                                                        name='windows'
                                                        label='Customer informations'
                                                        checked={this.state.leftWindow === 'Customer informations'}
                                                        className={this.fixedTheme + ' border-color color-2'}
                                                        title='Customer informations'
                                                        onInput={(e) => {
                                                            if (this.actualSettings === null) {
                                                                this.actualSettings = {'mode': {}, 'value': {}};
                                                            }
                                                            this.actualSettings.mode = 'windows';
                                                            this.actualSettings.value.left = 'Customer informations';
                                                            this.setState({leftWindow: 'Customer informations'});
                                                        }}
                                                    />
                                                    <Input
                                                        type='radio'
                                                        name='windows'
                                                        label='Delivery process'
                                                        checked={this.state.leftWindow === 'Delivery process'}
                                                        className={this.fixedTheme + ' border-color color-2'}
                                                        title='Delivery process'
                                                        onInput={(e) => {
                                                            if (this.actualSettings === null) {
                                                                this.actualSettings = {'mode': {}, 'value': {}};
                                                            }
                                                            this.actualSettings.mode = 'windows';
                                                            this.actualSettings.value.left = 'Delivery process';
                                                            this.setState({leftWindow: 'Delivery process'});
                                                        }}
                                                    />
                                                </div>
                                            </fieldset>
                                        }
                                        {getRole(this.state.db.user, ['octeus', 'design']) === true &&
                                            <fieldset className={this.fixedTheme + ' border-color color-2'}
                                                      data-ref='right'>
                                                <legend>Right side</legend>
                                                <div>
                                                    <Input
                                                        type='radio'
                                                        name='windows2'
                                                        label='None'
                                                        checked={this.state.rightWindow === null}
                                                        className={this.fixedTheme + ' border-color color-2'}
                                                        title='None'
                                                        onInput={(e) => {
                                                            if (this.actualSettings === null) {
                                                                this.actualSettings = {'mode': {}, 'value': {}};
                                                            }
                                                            this.actualSettings.mode = 'windows';
                                                            this.actualSettings.value.right = null;
                                                            this.setState({rightWindow: null});
                                                        }}
                                                    />
                                                    {getRole(this.state.db.user, ['octeus']) === true &&
                                                        <>
                                                            <Input
                                                                type='radio'
                                                                name='windows2'
                                                                label='Browse remote hosts'
                                                                checked={this.state.rightWindow === 'Browse remote hosts'}
                                                                className={this.fixedTheme + ' border-color color-2'}
                                                                title='Browse remote hosts'
                                                                onInput={(e) => {
                                                                    if (this.actualSettings === null) {
                                                                        this.actualSettings = {'mode': {}, 'value': {}};
                                                                    }
                                                                    this.actualSettings.mode = 'windows';
                                                                    this.actualSettings.value.right = 'Browse remote hosts';
                                                                    this.setState({rightWindow: 'Browse remote hosts'});
                                                                }}
                                                            />
                                                            <Input
                                                                type='radio'
                                                                name='windows2'
                                                                label='Browse database from project'
                                                                checked={this.state.rightWindow === 'Browse database from project'}
                                                                className={this.fixedTheme + ' border-color color-2'}
                                                                title='Browse database from project'
                                                                onInput={(e) => {
                                                                    if (this.actualSettings === null) {
                                                                        this.actualSettings = {'mode': {}, 'value': {}};
                                                                    }
                                                                    this.actualSettings.mode = 'windows';
                                                                    this.actualSettings.value.right = 'Browse database from project';
                                                                    this.setState({rightWindow: 'Browse database from project'});
                                                                }}
                                                            />
                                                        </>
                                                    }
                                                    {getRole(this.state.db.user, ['octeus', 'design']) === true &&
                                                        <Input
                                                            type='radio'
                                                            name='windows2'
                                                            label='Design patterns and files'
                                                            checked={this.state.rightWindow === 'Design patterns and files'}
                                                            className={this.fixedTheme + ' border-color color-2'}
                                                            title='Design patterns and files'
                                                            onInput={(e) => {
                                                                if (this.actualSettings === null) {
                                                                    this.actualSettings = {'mode': {}, 'value': {}};
                                                                }
                                                                this.actualSettings.mode = 'windows';
                                                                this.actualSettings.value.right = 'Design patterns and files';
                                                                this.setState({rightWindow: 'Design patterns and files'});
                                                            }}
                                                        />
                                                    }
                                                </div>
                                            </fieldset>
                                        }
                                        <fieldset className={this.fixedTheme + ' border-color color-2'} data-ref='bottom'>
                                            <legend>Bottom side</legend>
                                            <div>
                                                <Input
                                                    type='radio'
                                                    name='windows3'
                                                    label='None'
                                                    checked={this.state.bottomWindow === null}
                                                    className={this.fixedTheme + ' border-color color-2'}
                                                    title='None'
                                                    onInput={(e) => {
                                                        if (this.actualSettings === null) {
                                                            this.actualSettings = {'mode': {}, 'value': {}};
                                                        }
                                                        this.actualSettings.mode = 'windows';
                                                        this.actualSettings.value.bottom = null;
                                                        this.setState({bottomWindow: null});
                                                    }}
                                                />
                                                <Input
                                                    type='radio'
                                                    name='windows3'
                                                    label='Mounted devices'
                                                    checked={this.state.bottomWindow === 'Mounted devices'}
                                                    className={this.fixedTheme + ' border-color color-2'}
                                                    title='Mounted devices'
                                                    onInput={(e) => {
                                                        if (this.actualSettings === null) {
                                                            this.actualSettings = {'mode': {}, 'value': {}};
                                                        }
                                                        this.actualSettings.mode = 'windows';
                                                        this.actualSettings.value.bottom = 'Mounted devices';
                                                        this.setState({bottomWindow: 'Mounted devices'});
                                                    }}
                                                />
                                                <Input
                                                    type='radio'
                                                    name='windows3'
                                                    label='Logs list'
                                                    checked={this.state.bottomWindow === 'Error logs list'}
                                                    className={this.fixedTheme + ' border-color color-2'}
                                                    title='Logs list'
                                                    onInput={(e) => {
                                                        if (this.actualSettings === null) {
                                                            this.actualSettings = {'mode': {}, 'value': {}};
                                                        }
                                                        this.actualSettings.mode = 'windows';
                                                        this.actualSettings.value.bottom = 'Error logs list';
                                                        this.setState({bottomWindow: 'Error logs list'});
                                                    }}
                                                />
                                                {/*<Input
                                                    type='radio'
                                                    name='windows3'
                                                    label='Terminal window'
                                                    checked={this.state.bottomWindow === 'Terminal window'}
                                                    className={this.fixedTheme + ' border-color color-2'}
                                                    title='Terminal window'
                                                    onInput={(e) => {
                                                        if (this.actualSettings === null) {
                                                            this.actualSettings = {'mode': {}, 'value': {}};
                                                        }
                                                        this.actualSettings.mode = 'windows';
                                                        this.actualSettings.value.bottom = 'Terminal window';
                                                        this.setState({bottomWindow: 'Terminal window'});
                                                    }}
                                                />*/}
                                                {getRole(this.state.db.user, ['octeus', 'operator']) === true &&
                                                    <Input
                                                        type='radio'
                                                        name='windows3'
                                                        label='TODO list'
                                                        checked={this.state.bottomWindow === 'TODO list'}
                                                        className={this.fixedTheme + ' border-color color-2'}
                                                        title='TODO list'
                                                        onInput={(e) => {
                                                            if (this.actualSettings === null) {
                                                                this.actualSettings = {'mode': {}, 'value': {}};
                                                            }
                                                            this.actualSettings.mode = 'windows';
                                                            this.actualSettings.value.bottom = 'TODO list';
                                                            this.setState({bottomWindow: 'TODO list'});
                                                        }}
                                                    />
                                                }
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                                <div id='settings-btns-container'>
                                    <Button
                                        className='refresh-devices'
                                        text='Cancel'
                                        onClick={() => this.closeModal()}
                                        type='button'
                                        data={this.state.db}
                                        active={false}
                                    />
                                    <Button
                                        className='refresh-devices'
                                        text='OK'
                                        onClick={() => this.setState({confirmModal: true})}
                                        type='button'
                                        data={this.state.db}
                                        active={true}
                                    />
                                </div>
                            </>
                        }
                        {this.state.selected === 'users' &&
                            <>
                                <div id='settings-content'>
                                    <h3>Users list</h3>
                                    <div id='settings-users'>
                                        <fieldset className={this.fixedTheme + ' border-color color-2'} data-ref='octeus'>
                                            <legend>Octeus</legend>
                                            <ul className='settings-users'>
                                            {this.state.db.admins.map((user, i) => {
                                                if (user.fonction.indexOf('Octeus') > -1) {
                                                    return (
                                                        <li key={i}>
                                                            <p className={this.fixedTheme + ' color'}>{user.prenom} {user.nom.toUpperCase()}</p>
                                                            <small>{user.fonction}</small>
                                                            <small>Email: <b onClick={() => shell.openExternal('mailto:' + user.pseudo)}>{user.pseudo}</b></small>
                                                            <small>Phone: <b onClick={() => shell.openExternal('tel:'+ user.tel)}>{user.tel}</b></small>
                                                        </li>
                                                    )
                                                }
                                            })}
                                            </ul>
                                        </fieldset>
                                        <fieldset className={this.fixedTheme + ' border-color color-2'} data-ref='prod'>
                                            <legend>Production</legend>
                                            <ul className='settings-users'>
                                                {this.state.db.admins.map((user, i) => {
                                                    if (user.fonction.indexOf('Octeus') < 0) {
                                                        return (
                                                            <li key={i}>
                                                                <p className={this.fixedTheme + ' color'}>{user.prenom} {user.nom.toUpperCase()}</p>
                                                                <small>{user.fonction}</small>
                                                                <small>Email: <b onClick={() => shell.openExternal('mailto:' + user.pseudo)}>{user.pseudo}</b></small>
                                                                <small>Phone: <b onClick={() => shell.openExternal('tel:'+ user.tel)}>{user.tel}</b></small>
                                                            </li>
                                                        )
                                                    }
                                                })}
                                            </ul>
                                        </fieldset>
                                    </div>
                                </div>
                                <div id='settings-btns-container'>
                                    <Button
                                        className='refresh-devices'
                                        text='Cancel'
                                        onClick={() => this.closeModal()}
                                        type='button'
                                        data={this.state.db}
                                        active={false}
                                    />
                                </div>
                            </>
                        }
                        {this.state.selected === 'print' &&
                            <>
                                <div id='settings-content'>
                                    <h3>Print options</h3>
                                    <div id='settings-print'>
                                        <fieldset className={this.fixedTheme + ' border-color color-2'} data-ref='dimensions'>
                                            <legend>Dimensions</legend>
                                            <Input
                                                value={this.state.db.settings.print.dimensions.width}
                                                type='number'
                                                name='width'
                                                label='Width (cm) :'
                                                className={this.fixedTheme + ' border-color color-2'}
                                                title='Print width'
                                                onInput={(e) => {
                                                    if (this.actualSettings === null) {
                                                        this.actualSettings = {'mode': {}, 'value': {}};
                                                    }
                                                    this.actualSettings.mode = 'print';
                                                    if (!this.actualSettings.value.dimensions) {
                                                        this.actualSettings.value.dimensions = {};
                                                    }
                                                    this.actualSettings.value.dimensions.width = parseInt(e.currentTarget.value);
                                                }}
                                            />
                                            <Input
                                                value={this.state.db.settings.print.dimensions.height}
                                                type='number'
                                                name='height'
                                                label='Height (cm) :'
                                                className={this.fixedTheme + ' border-color color-2'}
                                                title='Print height'
                                                onInput={(e) => {
                                                    if (this.actualSettings === null) {
                                                        this.actualSettings = {'mode': {}, 'value': {}};
                                                    }
                                                    this.actualSettings.mode = 'print';
                                                    if (!this.actualSettings.value.dimensions) {
                                                        this.actualSettings.value.dimensions = {};
                                                    }
                                                    this.actualSettings.value.dimensions.height = parseInt(e.currentTarget.value);
                                                }}

                                            />
                                        </fieldset>
                                        <fieldset className={this.fixedTheme + ' border-color color-2'} data-ref='format'>
                                            <legend>Format</legend>
                                            <Select
                                                label='Choose format :'
                                                options={['pdf','jpg']}
                                                name='format'
                                                defaultValue={this.state.db.settings.print.format}
                                                className={this.fixedTheme + ' bg border-color color-2'}
                                                onChange={(e) => {
                                                    if (this.actualSettings === null) {
                                                        this.actualSettings = {'mode': {}, 'value': {}};
                                                    }
                                                    this.actualSettings.mode = 'print';
                                                    this.actualSettings.value.format = e.currentTarget.value;
                                                }}
                                            />
                                        </fieldset>
                                    </div>
                                </div>
                                <div id='settings-btns-container'>
                                    <Button
                                        className='refresh-devices'
                                        text='Cancel'
                                        onClick={() => this.closeModal()}
                                        type='button'
                                        data={this.state.db}
                                        active={false}
                                    />
                                    <Button
                                        className='refresh-devices'
                                        text='OK'
                                        onClick={() => this.setState({confirmModal: true})}
                                        type='button'
                                        data={this.state.db}
                                        active={true}
                                    />
                                </div>
                            </>
                        }
                        {this.state.selected === 'stats' &&
                            <>
                                <div id='settings-content'>
                                    <h3>Statistics</h3>
                                    <div id='settings-stats'>
                                        <fieldset className={this.fixedTheme + ' border-color color-2'} data-ref='items'>
                                            <legend>Items</legend>
                                            <p>Choose options :</p>
                                            <div>
                                                <Input
                                                    type='checkbox'
                                                    name='items[]'
                                                    label='Created cards'
                                                    checked={this.state.items.includes('created')}
                                                    value='created'
                                                    className={this.fixedTheme + ' border-color color-2'}
                                                    title='Created Cards'
                                                    onInput={(e) => {
                                                        if (this.actualSettings === null) {
                                                            this.actualSettings = {'mode': {}, 'value': {}};
                                                        }
                                                        this.actualSettings.mode = 'stats';
                                                        if (!this.actualSettings.value.items) {
                                                            this.actualSettings.value.items = this.state.items;
                                                        }
                                                        let checked = e.currentTarget.checked;
                                                        if (checked === true) {
                                                            this.actualSettings.value.items.push('created');
                                                        } else {
                                                            let index = this.actualSettings.value.items.indexOf('created');
                                                            if (index > -1) {
                                                                this.actualSettings.value.items.splice(index, 1);
                                                            }
                                                        }
                                                        this.setState({items: this.actualSettings.value.items});
                                                    }}
                                                />
                                                <Input
                                                    type='checkbox'
                                                    name='items[]'
                                                    label='Updated cards'
                                                    checked={this.state.items.includes('updated')}
                                                    value='updated'
                                                    className={this.fixedTheme + ' border-color color-2'}
                                                    title='Updated Cards'
                                                    onInput={(e) => {
                                                        if (this.actualSettings === null) {
                                                            this.actualSettings = {'mode': {}, 'value': {}};
                                                        }
                                                        this.actualSettings.mode = 'stats';
                                                        if (!this.actualSettings.value.items) {
                                                            this.actualSettings.value.items = this.state.items;
                                                        }
                                                        let checked = e.currentTarget.checked;
                                                        if (checked === true) {
                                                            this.actualSettings.value.items.push('updated');
                                                        } else {
                                                            let index = this.actualSettings.value.items.indexOf('updated');
                                                            if (index > -1) {
                                                                this.actualSettings.value.items.splice(index, 1);
                                                            }
                                                        }
                                                        this.setState({items: this.actualSettings.value.items});
                                                    }}
                                                />
                                            </div>
                                        </fieldset>
                                        <fieldset className={this.fixedTheme + ' border-color color-2'} data-ref='lapse'>
                                            <legend>Time lapse</legend>
                                            <p>Choose options :</p>
                                            <div>
                                                <Input
                                                    type='checkbox'
                                                    name='lapse[]'
                                                    label='Month'
                                                    checked={this.state.lapse.includes('month')}
                                                    value='month'
                                                    className={this.fixedTheme + ' border-color color-2'}
                                                    title='Stats by month'
                                                    onInput={(e) => {
                                                        if (this.actualSettings === null) {
                                                            this.actualSettings = {'mode': {}, 'value': {}};
                                                        }
                                                        this.actualSettings.mode = 'stats';
                                                        if (!this.actualSettings.value.lapse) {
                                                            this.actualSettings.value.lapse = this.state.lapse;
                                                        }
                                                        let checked = e.currentTarget.checked;
                                                        if (checked === true) {
                                                            this.actualSettings.value.lapse.push('month');
                                                        } else {
                                                            let index = this.actualSettings.value.lapse.indexOf('month');
                                                            if (index > -1) {
                                                                this.actualSettings.value.lapse.splice(index, 1);
                                                            }
                                                        }
                                                        this.setState({lapse: this.actualSettings.value.lapse});
                                                    }}
                                                />
                                                <Input
                                                    type='checkbox'
                                                    name='lapse[]'
                                                    label='Year'
                                                    checked={this.state.lapse.includes('year')}
                                                    value='year'
                                                    className={this.fixedTheme + ' border-color color-2'}
                                                    title='Stats by year'
                                                    onInput={(e) => {
                                                        if (this.actualSettings === null) {
                                                            this.actualSettings = {'mode': {}, 'value': {}};
                                                        }
                                                        this.actualSettings.mode = 'stats';
                                                        if (!this.actualSettings.value.lapse) {
                                                            this.actualSettings.value.lapse = this.state.lapse;
                                                        }
                                                        let checked = e.currentTarget.checked;
                                                        if (checked === true) {
                                                            this.actualSettings.value.lapse.push('year');
                                                        } else {
                                                            let index = this.actualSettings.value.lapse.indexOf('year');
                                                            if (index > -1) {
                                                                this.actualSettings.value.lapse.splice(index, 1);
                                                            }
                                                        }
                                                        this.setState({lapse: this.actualSettings.value.lapse});
                                                    }}
                                                />
                                            </div>
                                        </fieldset>
                                        <fieldset className={this.fixedTheme + ' border-color color-2'} data-ref='presentation'>
                                            <legend>Presentation</legend>
                                            <Select
                                                label='Choose a presentation graph :'
                                                options={['Bar','Line']}
                                                name='presentation'
                                                defaultValue={this.state.db.settings.stats.presentation}
                                                className={this.fixedTheme + ' bg border-color color-2'}
                                                onChange={(e) => {
                                                    if (this.actualSettings === null) {
                                                        this.actualSettings = {'mode': {}, 'value': {}};
                                                    }
                                                    this.actualSettings.mode = 'stats';
                                                    this.actualSettings.value.presentation = e.currentTarget.value;
                                                }}
                                            />
                                        </fieldset>
                                    </div>
                                </div>
                                <div id='settings-btns-container'>
                                    <Button
                                        className='refresh-devices'
                                        text='Cancel'
                                        onClick={() => this.closeModal()}
                                        type='button'
                                        data={this.state.db}
                                        active={false}
                                    />
                                    <Button
                                        className='refresh-devices'
                                        text='OK'
                                        onClick={() => this.setState({confirmModal: true})}
                                        type='button'
                                        data={this.state.db}
                                        active={true}
                                    />
                                </div>
                            </>
                        }
                        {this.state.selected === 'shortcuts' &&
                            <>
                                <div id='settings-content'>
                                    <h3>Shortcuts list</h3>
                                    <div id='settings-shortcuts'>
                                        <fieldset className={this.fixedTheme + ' border-color color-2'}>
                                            <legend>Key combinations</legend>
                                            <ul id='shortcuts-list'>
                                                {Shortcuts.map((shortcut, i) =>
                                                    <li key={i} className={this.fixedTheme + ' border-color'}>
                                                        <span>{shortcut.desc}</span>
                                                        <ul className='shortcuts-icons'>
                                                            {navigator.platform === 'Win32' &&
                                                                shortcut.shortcut.win.map((win, iw) =>
                                                                    <li key={iw}>{win}</li>
                                                                )
                                                            }
                                                            {navigator.platform !== 'Win32' &&
                                                                shortcut.shortcut.win.map((mac, im) =>
                                                                    <li key={im}>{mac}</li>
                                                                )
                                                            }
                                                        </ul>
                                                    </li>
                                                )}
                                            </ul>
                                        </fieldset>

                                    </div>
                                </div>
                                <div id='settings-btns-container'>
                                    <Button
                                        className='refresh-devices'
                                        text='Cancel'
                                        onClick={() => this.closeModal()}
                                        type='button'
                                        data={this.state.db}
                                        active={false}
                                    />
                                </div>
                            </>
                        }
                        {this.state.selected === 'about' &&
                            <>
                                <div id='settings-content'>
                                    <h3>About</h3>
                                    <div id='settings-about'>
                                        <fieldset className={this.fixedTheme + ' border-color color-2'} data-ref='info'>
                                            <legend>Information</legend>
                                            {this.state.markdowns !== null &&
                                                <ReactMarkdown children={this.state.markdowns.Information} remarkPlugins={[remarkGfm]} />
                                            }
                                        </fieldset>
                                        <fieldset className={this.fixedTheme + ' border-color color-2'} data-ref='system'>
                                            <legend>System</legend>
                                            {this.state.markdowns !== null &&
                                                <ReactMarkdown children={this.state.markdowns.System} remarkPlugins={[remarkGfm]} />
                                            }
                                        </fieldset>
                                    </div>
                                </div>
                                <div id='settings-btns-container'>
                                    <Button
                                        className='refresh-devices'
                                        text='Cancel'
                                        onClick={() => this.closeModal()}
                                        type='button'
                                        data={this.state.db}
                                        active={false}
                                    />
                                </div>
                            </>
                        }
                        {this.state.selected === 'policy' &&
                            <>
                                <div id='settings-content'>
                                    <h3>Policy</h3>
                                    <div id='settings-policy'>
                                        <fieldset className={this.fixedTheme + ' border-color color-2'} data-ref='terms'>
                                            <legend>Terms of use</legend>
                                            {this.state.markdowns !== null &&
                                                <ReactMarkdown children={this.state.markdowns.Terms} remarkPlugins={[remarkGfm]} />
                                            }
                                        </fieldset>
                                        <fieldset className={this.fixedTheme + ' border-color color-2'} data-ref='credits'>
                                            <legend>Credits</legend>
                                            {this.state.markdowns !== null &&
                                                <ReactMarkdown children={this.state.markdowns.Credits} remarkPlugins={[remarkGfm]} />
                                            }
                                        </fieldset>
                                    </div>
                                </div>
                                <div id='settings-btns-container'>
                                    <Button
                                        className='refresh-devices'
                                        text='Cancel'
                                        onClick={() => this.closeModal()}
                                        type='button'
                                        data={this.state.db}
                                        active={false}
                                    />
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default Settings;