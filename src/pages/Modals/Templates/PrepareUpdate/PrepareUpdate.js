import React from "react";
import './PrepareUpdate.css';
import Button from "../../../../components/Button/Button";

class PrepareUpdate extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            db: props.data,
            mode: props.data.mode,
            getModal: props.getModal,
            devices: null,
            device: null
        }
    }

    componentDidMount() {

        this.refreshList()
    }

    refreshList = () => {

        const ipc = window.require('electron').ipcRenderer;
        ipc.on('checkDevicesToUpdate.reply', (event, data) => {
            this.setState({devices: data})
        })
        ipc.send('checkDevicesToUpdate');
    }

    setDevice = (e) => {
        this.setState({device: JSON.parse(e.currentTarget.value)})
    }

    selectDevice = () => {
        const ipc = window.require('electron').ipcRenderer;
        ipc.send('importDataFromDevice', this.state.device.mounted);
        if (this.state.device !== null) {
            localStorage.setItem('selectedDevice', JSON.stringify(this.state.device))
        }
        this.state.getModal('none', null);
        let div = document.createElement('div');
        div.setAttribute('id', 'loading-modal');
        let html = '<div id="loading-modal-container" class="' + this.state.db.settings.theme + ' bg border-color color">\n' +
            '            <h3 class=\'modal-title\'>\n' +
            '                <img style="width: 40px" class=\'modal-logo\' src="./assets/media/img/logo.svg" alt=\'logo DC\' />\n' +
            '                <span>Import data from Card</span>\n' +
            '            </h3>\n' +
            '            <div id="loading-bar">\n' +
            '                <span></span>\n' +
            '            </div>\n' +
            '        </div>';
        div.innerHTML = html;
        document.body.appendChild(div)
    }

    render() {

        const ipc = window.require('electron').ipcRenderer;

        return(
            <div
                id='prepare-container'
            >
                <div className={this.state.db.settings.theme + ' bg-2'}>
                    {(this.state.devices && this.state.devices.length > 0) &&
                        <>
                            <ul className='prepare-devices-list'>
                                {this.state.devices.map((device, i) =>
                                    <li key={i} className='prepare-device-item device-li'>
                                        <b>
                                            <input name="prepare-device-item" onInput={(e) => this.setDevice(e)} type="radio" className="with-font" value={JSON.stringify(device)}/>
                                            {device.mounted.replace('\\', '') + ' ' + device.description}
                                        </b>
                                        <ul>
                                            <li>Total size:&nbsp;<span>{device.size}</span></li>
                                            <li>Used size:&nbsp;<span>{device.used}</span></li>
                                            <li>Available size:&nbsp;<span>{device.available}</span></li>
                                        </ul>
                                    </li>
                                )}
                            </ul>
                            <div className={this.state.db.settings.theme + ' bg color btn-container'}>
                                {this.state.device &&
                                    <Button
                                        className='refresh-btn'
                                        text={'Import data from ' + this.state.device.mounted}
                                        onClick={() => this.selectDevice()}
                                        type='button'
                                        data={this.state.db}
                                        active={true}
                                    />
                                }
                                <Button
                                    className='Done-job-btn'
                                    text='Back to new project'
                                    onClick={() => ipc.send('invokeNewProject', 'main')}
                                    type='button'
                                    data={this.state.db}
                                    active={true}
                                />
                            </div>
                        </>
                    }
                    {(!this.state.devices || this.state.devices.length === 0) &&
                        <>
                            <p className='green prepare-advice'>
                                Please connect OCTEUS devices to update
                            </p>
                            <div className={this.state.db.settings.theme + ' bg color btn-container'}>
                                <Button
                                    className='refresh-btn'
                                    text='Refresh devices list'
                                    onClick={() => this.refreshList()}
                                    type='button'
                                    data={this.state.db}
                                    active={true}
                                />
                            </div>
                        </>
                    }
                </div>
            </div>
        )
    }
}

export default PrepareUpdate;