import React from "react";
import './Emails.css'
import Input from "../../../../components/Input/Input";
import TextArea from "../../../../components/TextArea/TextArea";
import Button from "../../../../components/Button/Button";
import Datalist from "../../../../components/Datalist/Datalist";

class Emails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            db: props.data,
            classList: props.classList,
            users: props.data.admins,
            to: null,
            cci: null,
            subject: null,
            body: null,
            errors: [],
            messages: [],
            errorSent: null
        }
    }

    prepareOptions = () => {

        let options = [],
            users = this.state.users;

        for (let i = 0; i < users.length; i++) {
            let user = users[i];
            options.push(user.prenom + ' ' + user.nom.toUpperCase() + ' <' + user.pseudo + '>');
        }
        return options;
    }

    controlFormat = (value, mode, callback) => {

        let json = null;
        if (mode === 'change') {

            if ((value.slice(-1) === ',' || value.slice(-1) === ' ') && value.slice(0, -1).length > 0) {

                let data = value.slice(0, -1);
                if (data.length > 0) {
                    if (data.slice(-1) === '>') {
                        let trimer = data.slice(0, -1).split('<')[1];
                        json = {'content': data, 'stt': this.verifyEmailFormat(trimer)};
                    } else {
                        json = {'content': data, 'stt': this.verifyEmailFormat(data)};
                    }
                }
            }

        } else if (mode === 'blur') {

            if (value.length > 0) {
                if (value.slice(-1) === '>') {
                    let trimer = value.slice(0, -1).split('<')[1];
                    json = {'content': value, 'stt': this.verifyEmailFormat(trimer)};
                } else {
                    json = {'content': value, 'stt': this.verifyEmailFormat(value)};
                }
            }

        }

        callback(json);
        this.getErrors();
    }

    verifyEmailFormat = (email) => {

        let mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/;
        if (email.match(mailformat)) {
            return true;
        } else {
            return false;
        }
    }

    handleSubject = (e) => {

        let target = e.currentTarget,
            value = target.value;
        if (value.length > 0) {
            this.setState({subject: value});
        } else {
            this.setState({subject: null});
        }
        this.getErrors();
    }

    handleText = (e) => {

        let target = e.currentTarget,
            value = target.value;
        if (value.length > 0) {
            this.setState({body: value});
        } else {
            this.setState({body: null});
        }
        this.getErrors();
    }

    recall = (mode, data) => {

        if (mode === 'To') {
            this.setState({to: data});
        } else {
            this.setState({cci: data});
        }

        this.getErrors();
    }

    sendMail = () => {

        let json = {
            to: this.state.to,
            cci: this.state.cci,
            subject: this.state.subject,
            body: this.state.body,
            user: this.state.db.user
        },
            check = this.checkBeforeSend(json);

        this.setState({messages: check.mess})
        if (check.check === true) {
            const ipc = window.require('electron').ipcRenderer;
            ipc.on('send-mail.reply', (event, data) => {
                let mess = (data.error === false) ? data.mess : data.mess + '<br>Please try again.'
                this.setState({errorSent: mess});
                setTimeout(() => {
                    this.setState({errorSent: null});
                    if (data.error === false) {
                        this.closeModal();
                    }
                }, 3000)
            })
            ipc.send('send-mail', json);
        }
    }

    checkBeforeSend = (json) => {

        let check = true,
            mess = [];

        if (json.to === null || json.to.length === 0) {
            mess.push('"To :"');
            check = false
        }
        if (json.subject === null || json.subject.trim().length === 0) {
            mess.push('"Subject :"');
            check = false
        }
        if (json.body === null || json.body.trim().length === 0) {
            mess.push('"Body :"');
            check = false
        }
        return {'check': check, 'mess': mess};
    }

    closeModal = () => {
        let closeModal = document.querySelector('#close-modal');
        if (closeModal !== null) {
            closeModal.click();
        }
    }

    getErrors = () => {

        let to = this.state.to,
            cci = this.state.cci,
            errs = [];

        if (to) {

            for (let i = 0; i < to.length; i++) {
                if (to[i].stt === false) {
                    errs.push(to[i].content);
                }
            }
        }

        if (cci) {

            for (let i = 0; i < cci.length; i++) {
                if (cci[i].stt === false) {
                    errs.push(cci[i].content);
                }
            }
        }

        this.setState({errors: [...errs]});
    }

    render() {

        return(
            <div id='email-container' className={this.state.db.settings.theme + ' bg color border-color'}>
                {this.state.errorSent !== null &&
                    <div id='after-sent'>
                        <p
                            className={this.state.db.settings.theme + ' bg color border-color'}
                            dangerouslySetInnerHTML={{__html: this.state.errorSent}}
                        />
                    </div>
                }
                <Datalist
                    classList={this.state.classList}
                    data={this.state.db}
                    label='To'
                    list={this.prepareOptions()}
                    id='mails-list'
                    control={this.controlFormat}
                    recall={this.recall}
                    errors={this.getErrors}
                />
                <Datalist
                    classList={this.state.classList}
                    data={this.state.db}
                    label='Cc/Cci'
                    list={this.prepareOptions()}
                    id='cci-list'
                    control={this.controlFormat}
                    recall={this.recall}
                    errors={this.getErrors}
                />
                <Input
                    type='text'
                    label='Subject :'
                    className={this.state.db.settings.theme + ' bg color border-color'}
                    onInput={e => this.handleSubject(e)}
                />
                <TextArea
                    label='Message :'
                    name='mail-body'
                    className={this.state.db.settings.theme + ' bg-2 color border-color'}
                    onInput={(e) => this.handleText(e)}
                />
                {this.state.errors.length > 0 &&
                    <p className='errors-color'>The email addresses {this.state.errors.join(', ')} are not in the correct format. The message will not be sent to these addresses.</p>
                }
                {this.state.messages.length > 0 &&
                    <p className='errors-color'>You must fill the {this.state.messages.join(', ')} field(s).</p>
                }
                <div className={this.state.db.settings.theme + ' color border-color btns-emails-container'}>
                    <Button
                        className='confirm-btns'
                        text='Send Email'
                        onClick={() => this.sendMail()}
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
                        active={false}
                    />
                </div>
            </div>
        );
    }
}

export default Emails;