import React from "react";
import './CompileData.css';
import Button from "../../../../components/Button/Button";

class CompileData extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            db: props.data,
            mode: props.data.mode,
            initialize: false,
            createFiles: false,
            compileDB: false,
            copy: false,
            encrypt: false,
            server : false,
            done: false,
            error: null,
            stepper: 1,
            getModal: props.getModal
        }
    }

    componentDidMount() {

        const ipc = window.require('electron').ipcRenderer;

        ipc.on('setProjetList', (event, project) => {

            let db = this.state.db,
                projects = db.projects;
            projects.push(project);
            db.projects = projects;
            this.setState({'db': db});
        });

        this.changeState();
    }

    changeState = (data) => {

        const ipc = window.require('electron').ipcRenderer;
        ipc.on('compileStep', (event, data) => {
            this.setState(data);
            ipc.send('stop.propagator');
        })
    }

    render() {

        const ipc = window.require('electron').ipcRenderer;

        return(
            <div
                id='compile-container'
            >
                <div className={this.state.db.settings.theme + ' bg-2'}>
                    {this.state.error !== null &&
                        <>
                            <p className='card-stepper log-error'>{this.state.error}</p>
                            <div className={this.state.db.settings.theme + ' bg color btn-container'}>
                                <Button
                                    className='Done-job-btn'
                                    text='Close'
                                    onClick={() => this.state.getModal('none', null)}
                                    type='button'
                                    data={this.state.db}
                                    active={true}
                                />
                            </div>
                        </>
                    }
                    {this.state.error === null &&
                        <ul className='card-stepper'>
                            {this.state.initialize === false &&
                                <li className='step-todo'>
                                    Initialize device
                                    {this.state.stepper === 1 &&
                                        <span className={this.state.db.settings.theme + ' color'}/>
                                    }
                                </li>
                            }
                            {this.state.initialize === true &&
                                <li className='step-done'>
                                    <svg className="stepper-checked" viewBox="0 0 32 32">
                                        <path d="M28 0h-24c-2.2 0-4 1.8-4 4v24c0 2.2 1.8 4 4 4h24c2.2 0 4-1.8 4-4v-24c0-2.2-1.8-4-4-4zM14 24.828l-7.414-7.414 2.828-2.828 4.586 4.586 9.586-9.586 2.828 2.828-12.414 12.414z"></path>
                                    </svg>
                                    Device ready
                                </li>
                            }
                            {this.state.createFiles === false &&
                                <li className='step-todo'>
                                    Files creation
                                    {this.state.stepper === 2 &&
                                        <span className={this.state.db.settings.theme + ' color'}/>
                                    }
                                </li>
                            }
                            {this.state.createFiles === true &&
                                <li className='step-done'>
                                    <svg className="stepper-checked" viewBox="0 0 32 32">
                                        <path d="M28 0h-24c-2.2 0-4 1.8-4 4v24c0 2.2 1.8 4 4 4h24c2.2 0 4-1.8 4-4v-24c0-2.2-1.8-4-4-4zM14 24.828l-7.414-7.414 2.828-2.828 4.586 4.586 9.586-9.586 2.828 2.828-12.414 12.414z"></path>
                                    </svg>
                                    Files created
                                </li>
                            }
                            {this.state.compileDB === false &&
                                <li className='step-todo'>
                                    Compiling Database
                                    {this.state.stepper === 3 &&
                                        <span className={this.state.db.settings.theme + ' color'}/>
                                    }
                                </li>
                            }
                            {this.state.compileDB === true &&
                                <li className='step-done'>
                                    <svg className="stepper-checked" viewBox="0 0 32 32">
                                        <path d="M28 0h-24c-2.2 0-4 1.8-4 4v24c0 2.2 1.8 4 4 4h24c2.2 0 4-1.8 4-4v-24c0-2.2-1.8-4-4-4zM14 24.828l-7.414-7.414 2.828-2.828 4.586 4.586 9.586-9.586 2.828 2.828-12.414 12.414z"></path>
                                    </svg>
                                    Database compiled
                                </li>
                            }
                            {this.state.copy === false &&
                                <li className='step-todo'>
                                    Copying Database on device
                                    {this.state.stepper === 4 &&
                                        <span className={this.state.db.settings.theme + ' color'}/>
                                    }
                                </li>
                            }
                            {this.state.copy === true &&
                                <li className='step-done'>
                                    <svg className="stepper-checked" viewBox="0 0 32 32">
                                        <path d="M28 0h-24c-2.2 0-4 1.8-4 4v24c0 2.2 1.8 4 4 4h24c2.2 0 4-1.8 4-4v-24c0-2.2-1.8-4-4-4zM14 24.828l-7.414-7.414 2.828-2.828 4.586 4.586 9.586-9.586 2.828 2.828-12.414 12.414z"></path>
                                    </svg>
                                    Copy succeed
                                </li>
                            }
                            {this.state.encrypt === false &&
                                <li className='step-todo'>
                                    Data encryption
                                    {this.state.stepper === 5 &&
                                        <span className={this.state.db.settings.theme + ' color'}/>
                                    }
                                </li>
                            }
                            {this.state.encrypt === true &&
                                <li className='step-done'>
                                    <svg className="stepper-checked" viewBox="0 0 32 32">
                                        <path d="M28 0h-24c-2.2 0-4 1.8-4 4v24c0 2.2 1.8 4 4 4h24c2.2 0 4-1.8 4-4v-24c0-2.2-1.8-4-4-4zM14 24.828l-7.414-7.414 2.828-2.828 4.586 4.586 9.586-9.586 2.828 2.828-12.414 12.414z"></path>
                                    </svg>
                                    Data encrypted
                                </li>
                            }
                            {this.state.server === false &&
                                <li className='step-todo'>
                                    Server synchronization
                                    {this.state.stepper === 6 &&
                                        <span className={this.state.db.settings.theme + ' color'}/>
                                    }
                                </li>
                            }
                            {this.state.server === true &&
                                <li className='step-done'>
                                    <svg className="stepper-checked" viewBox="0 0 32 32">
                                        <path d="M28 0h-24c-2.2 0-4 1.8-4 4v24c0 2.2 1.8 4 4 4h24c2.2 0 4-1.8 4-4v-24c0-2.2-1.8-4-4-4zM14 24.828l-7.414-7.414 2.828-2.828 4.586 4.586 9.586-9.586 2.828 2.828-12.414 12.414z"></path>
                                    </svg>
                                    Server synchronized
                                </li>
                            }
                            {this.state.done === false &&
                                <li className='step-todo'>
                                    Job processing
                                    {this.state.stepper === 7 &&
                                        <span className={this.state.db.settings.theme + ' color'}/>
                                    }
                                </li>
                            }
                            {this.state.done === true &&
                                <li className='step-done'>
                                    <svg className="stepper-checked" viewBox="0 0 32 32">
                                        <path d="M28 0h-24c-2.2 0-4 1.8-4 4v24c0 2.2 1.8 4 4 4h24c2.2 0 4-1.8 4-4v-24c0-2.2-1.8-4-4-4zM14 24.828l-7.414-7.414 2.828-2.828 4.586 4.586 9.586-9.586 2.828 2.828-12.414 12.414z"></path>
                                    </svg>
                                    Job succeed
                                </li>
                            }
                        </ul>
                    }
                    {this.state.done === true &&
                        <div className={this.state.db.settings.theme + ' bg color btn-container'}>
                            <Button
                                className='Done-job-btn'
                                text='New project'
                                onClick={() => ipc.send('invokeNewProject', 'main')}
                                type='button'
                                data={this.state.db}
                                active={true}
                            />
                            <Button
                                className='Done-job-btn'
                                text='Close'
                                onClick={() => this.state.getModal('none', null)}
                                type='button'
                                data={this.state.db}
                                active={true}
                            />
                        </div>
                    }

                </div>
            </div>
        )
    }
}

export default CompileData;