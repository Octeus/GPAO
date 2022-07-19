import React from "react";
import './User.css';
import Input from "../../../../components/Input/Input";
import Button from "../../../../components/Button/Button";

class User extends React.Component {

    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            db: props.data,
            classList: props.classList,
            user: props.data.user,
            pass: null,
            conf: null,
            match: false,
            option: false,
            errorSent: null
        }
    }

    componentDidMount() {
        this._isMounted = true
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    closeModal = () => {
        let closeModal = document.querySelector('#close-modal');
        if (closeModal !== null) {
            closeModal.click();
        }
    }

    handlePassword = (e, mode) => {

        let target = e.currentTarget,
            value = target.value,
            newVal = (value.length > 0) ? value : null;

        if (mode === 'new') {
            this.setState({pass: newVal})
        } else {
            this.setState({conf: newVal})
        }

        if ((this.state.pass !== null && this.state.pass.length > 0) || (this.state.conf !== null && this.state.conf.length > 0)) {

            if (this.state.pass === this.state.conf) {
                this.setState({match: true, option: true})
            } else {
                this.setState({match: false, option: true})
            }

        } else {

            this.setState({match: false, option: false})
        }
    }

    updateSettings = () => {

        const ipc = window.require('electron').ipcRenderer,
            bcrypt = window.require('bcryptjs');


        if (this.state.option === false || (this.state.match === true && this.state.option === true)) {

            let data = {
                id: this.state.user.id,
                pseudo: this.state.user.pseudo,
                prenom: this.state.user.prenom,
                nom: this.state.user.nom,
                tel: this.state.user.tel,
                fonction: this.state.user.fonction,
                password: (this.state.pass !== null) ? bcrypt.hashSync(this.state.pass, 12) : this.state.user.password,
                lang: this.state.user.lang,
                derniere_connexion: this.state.user.derniere_connexion,
                date: this.state.user.date
            }

            let admins = this.state.db.admins;
            for (let i = 0; i < admins.length; i++) {
                if (admins[i].id === data.id) {
                    admins[i] = data
                }
            }

            let newDB = this.state.db
            newDB.admins = admins
            newDB.user = data
            this.setState({db: newDB})
            localStorage.setItem('admins', JSON.stringify(admins));
            localStorage.setItem('user', JSON.stringify(data));

            let pack = {user: data, admins: admins}

            ipc.send('update-user', pack);
            ipc.on('update-user.reply', (event, response) => {

                console.log(response)
                this.setState({errorSent: response.mess});
                setTimeout(() => {
                    this.setState({errorSent: null});
                    if (response.error === false) {
                        this.closeModal()
                    }
                }, 3000)
            })
        }
    }

    render() {

        let user = this.state.db.user;

        return(
            <div id='user-container' className={this.state.db.settings.theme + ' bg color border-color'}>
                {this.state.errorSent !== null &&
                    <div id='after-sent'>
                        <p className={this.state.db.settings.theme + ' bg color border-color'}>{this.state.errorSent}</p>
                    </div>
                }
                <div id='scroll-user-content'>
                    <fieldset id='user-info-container'>
                        <legend>Your profile</legend>
                        <Input
                            type='text'
                            name='prenom'
                            label='Firstname'
                            value={user.prenom}
                            className={this.state.db.settings.theme + ' border-color color'}
                            title='User firstname'
                            onInput={(e) => {
                                let user = this.state.user,
                                    target = e.currentTarget,
                                    value = target.value;
                                user.prenom = value;
                                this.setState({user: user})
                            }}
                        />
                        <Input
                            type='text'
                            name='nom'
                            label='Lastname'
                            value={user.nom}
                            className={this.state.db.settings.theme + ' border-color color'}
                            title='User lastname'
                            onInput={(e) => {
                                let user = this.state.user,
                                    target = e.currentTarget,
                                    value = target.value;
                                user.nom = value;
                                this.setState({user: user})
                            }}
                        />
                        <Input
                            type='text'
                            name='nom'
                            label='Phone'
                            value={user.tel}
                            className={this.state.db.settings.theme + ' border-color color'}
                            title='User phone'
                            onInput={(e) => {
                                let user = this.state.user,
                                    target = e.currentTarget,
                                    value = target.value;
                                user.tel = value;
                                this.setState({user: user})
                            }}
                        />
                        <Input
                            type='email'
                            name='pseudo'
                            label='Email'
                            value={user.pseudo}
                            className={this.state.db.settings.theme + ' border-color color'}
                            title='User email'
                            onInput={(e) => {
                                let user = this.state.user,
                                    target = e.currentTarget,
                                    value = target.value;
                                user.pseudo = value;
                                this.setState({user: user})
                            }}
                        />
                        <Input
                            type='email'
                            name='fonction'
                            label='Status'
                            value={user.fonction}
                            className={this.state.db.settings.theme + ' border-color color'}
                            title='User status'
                            onInput={(e) => {
                                let user = this.state.user,
                                    target = e.currentTarget,
                                    value = target.value;
                                user.fonction = value;
                                this.setState({user: user})
                            }}
                        />
                    </fieldset>
                    <fieldset id='password-container' className={(this.state.option === true && this.state.match === false) ? 'mismatch' : ''}>
                        <legend>Change password</legend>
                        <small className={this.state.db.settings.theme + ' color-2'}><i>Leave empty if no need to change password.</i></small>
                        <Input
                            type='password'
                            name='password'
                            label='New password'
                            className={this.state.db.settings.theme + ' border-color color'}
                            title='User new password'
                            onInput={(e) => this.handlePassword(e, 'new')}
                        />
                        <Input
                            type='password'
                            name='confirm-password'
                            label='Confirm password'
                            className={this.state.db.settings.theme + ' border-color color'}
                            title='User confirm password'
                            onInput={(e) => this.handlePassword(e, 'confirm')}
                        />
                    </fieldset>
                </div>
                <div id='settings-confirm-btns'>
                    <Button
                        className='confirm-btns'
                        text='Modify'
                        onClick={() => this.updateSettings()}
                        type='button'
                        data={this.state.db}
                        active={true}
                    />
                    <Button
                        className='confirm-btns'
                        text='Cancel'
                        onClick={() => this.closeModal()}
                        type='button'
                        data={this.state.db}
                        active={true}
                    />
                </div>
            </div>
        );
    }
}

export default User;