import logo from '../../Default/logo.svg';
import Button from "../../../components/Button/Button";
import React from "react";
import { getRole } from "../../../Tools/Tools";

class NewProject extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            db: props.data,
            oldFiles: null
        }
    }

    /*componentDidMount() {

        const ipc = window.require('electron').ipcRenderer;
        ipc.on('getOldFiles.reply', (event, data) => {
            this.setState({oldFiles: data})
        });
        ipc.send('getOldFiles');
    }*/

    render() {

        const ipc = window.require('electron').ipcRenderer;
        return (
            <div id='newProject-window' className={this.state.db.settings.theme + ' bg-2 modal-newProject'}>
                <div id='new-project-deco' className={this.state.db.settings.theme + ' bg'}>
                    <div className={this.state.db.settings.theme + ' bg-2'}/>
                </div>
                {/*{(getRole(this.state.db.user, ['octeus']) === true && this.state.oldFiles !== null && this.state.oldFiles.length > 0) &&
                    <div id='new-project-octeus-container' className={this.state.db.settings.theme + ' border-color color new-project-container files'}>
                        <h2 className={this.state.db.settings.theme + ' color bg-2'}>Open file</h2>
                        <div className={this.state.db.settings.theme + ' bg files-container'}>
                            {this.state.oldFiles.map((file, i) =>
                                <div
                                    key={i}
                                    className={this.state.db.settings.theme + ' color border-color old-file'}
                                    data-path={file.path}
                                >
                                    <svg className="icon-file-empty" viewBox="0 0 16 16">
                                        <path d="M14.341 3.579c-0.347-0.473-0.831-1.027-1.362-1.558s-1.085-1.015-1.558-1.362c-0.806-0.591-1.197-0.659-1.421-0.659h-7.75c-0.689 0-1.25 0.561-1.25 1.25v13.5c0 0.689 0.561 1.25 1.25 1.25h11.5c0.689 0 1.25-0.561 1.25-1.25v-9.75c0-0.224-0.068-0.615-0.659-1.421zM12.271 2.729c0.48 0.48 0.856 0.912 1.134 1.271h-2.406v-2.405c0.359 0.278 0.792 0.654 1.271 1.134zM14 14.75c0 0.136-0.114 0.25-0.25 0.25h-11.5c-0.135 0-0.25-0.114-0.25-0.25v-13.5c0-0.135 0.115-0.25 0.25-0.25 0 0 7.749-0 7.75 0v3.5c0 0.276 0.224 0.5 0.5 0.5h3.5v9.75z"></path>
                                    </svg>
                                    <img src={logo} alt='DC'/>
                                    <span className={this.state.db.settings.theme + ' color'}>{file.name}</span>
                                </div>
                            )}
                        </div>
                    </div>
                }*/}
                {getRole(this.state.db.user, ['octeus', 'operator']) === true &&
                    <div id='new-project-operator-container' className={this.state.db.settings.theme + ' border-color color new-project-container'}>
                        <h2 className={this.state.db.settings.theme + ' color bg-2'}>Create or Update Card Jobs</h2>
                        <div className={this.state.db.settings.theme +  ' bg new-project-btns'}>
                            <Button
                                className='new-project-btn'
                                text='Create Card'
                                onClick={() => {
                                    ipc.send('invokeActionToMain', 'create')
                                }}
                                type='button'
                                data={this.state.db}
                                active={true}
                            />
                            <Button
                            className='new-project-btn'
                            text='Update Card'
                            onClick={() => {
                                ipc.send('invokeActionToMain', 'update')
                            }}
                            type='button'
                            data={this.state.db}
                            active={true}
                            />
                        </div>
                    </div>
                }
                {getRole(this.state.db.user, ['octeus']) === true &&
                    <div id='new-project-design-container' className={this.state.db.settings.theme + ' border-color color new-project-container'}>
                        <h2 className={this.state.db.settings.theme + ' color bg-2'}>Design or Delivery Jobs</h2>
                        <div className={this.state.db.settings.theme +  ' bg new-project-btns'}>
                            <Button
                                className='new-project-btn'
                                text='New Print'
                                onClick={() => {
                                    ipc.send('invokeActionToMain', 'design')
                                }}
                                type='button'
                                data={this.state.db}
                                active={true}
                            />
                            <Button
                                className='new-project-btn'
                                text='Get Delivery'
                                onClick={() => {
                                    ipc.send('invokeActionToMain', 'delivery')
                                }}
                                type='button'
                                data={this.state.db}
                                active={true}
                            />
                        </div>
                    </div>
                }
                {(getRole(this.state.db.user, ['design']) === true && getRole(this.state.db.user, ['octeus']) === false) &&
                    <div id='new-project-design-container' className={this.state.db.settings.theme + ' border-color color new-project-container solo'}>
                        <h2 className={this.state.db.settings.theme + ' color bg-2'}>Design Job</h2>
                        <div className={this.state.db.settings.theme +  ' bg new-project-btns'}>
                            <Button
                                className='new-project-btn'
                                text='New Print'
                                onClick={() => {
                                    ipc.send('invokeActionToMain', 'design')
                                }}
                                type='button'
                                data={this.state.db}
                                active={true}
                            />
                        </div>
                    </div>
                }
                {(getRole(this.state.db.user, ['operator']) === true && getRole(this.state.db.user, ['octeus']) === false) &&
                    <div id='new-project-design-container' className={this.state.db.settings.theme + ' border-color color new-project-container'}>
                        <h2 className={this.state.db.settings.theme + ' color bg-2'}>Delivery Job</h2>
                        <div className={this.state.db.settings.theme +  ' bg new-project-btns'}>
                            <Button
                                className='new-project-btn'
                                text='Get Delivery'
                                onClick={() => {
                                    ipc.send('invokeActionToMain', 'delivery')
                                }}
                                type='button'
                                data={this.state.db}
                                active={true}
                            />
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default NewProject;