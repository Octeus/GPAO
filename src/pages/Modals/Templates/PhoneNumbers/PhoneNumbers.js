import React from "react";
import './PhoneNumbers.css'

class PhoneNumbers extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            db: props.data,
            classList: props.classList
        }
    }

    render() {

        const shell = window.require('electron').shell;

        return(
            <div id='phone-numbers-container'>
                <fieldset className={this.state.db.settings.theme + ' border-color color-2'}>
                    <legend>Octeus</legend>
                    <ul className='phone-numbers'>
                        {this.state.db.admins.map((user, i) => {
                            if (user.fonction.indexOf('Octeus') > -1) {
                                return (
                                    <li key={i}>
                                        <p className={this.state.db.settings.theme + ' color'}>{user.prenom} {user.nom.toUpperCase()}</p>
                                        <small>{user.fonction}</small>
                                        <small>Phone: <b onClick={() => shell.openExternal('tel:'+ user.tel)}>{user.tel}</b></small>
                                    </li>
                                )
                            }
                        })}
                    </ul>
                </fieldset>
                <fieldset className={this.state.db.settings.theme + ' border-color color-2'}>
                    <legend>Production</legend>
                    <ul className='phone-numbers'>
                        {this.state.db.admins.map((user, i) => {
                            if (user.fonction.indexOf('Octeus') < 0) {
                                return (
                                    <li key={i}>
                                        <p className={this.state.db.settings.theme + ' color'}>{user.prenom} {user.nom.toUpperCase()}</p>
                                        <small>{user.fonction}</small>
                                        <small>Phone: <b onClick={() => shell.openExternal('tel:'+ user.tel)}>{user.tel}</b></small>
                                    </li>
                                )
                            }
                        })}
                    </ul>
                </fieldset>
            </div>
        );
    }
}

export default PhoneNumbers;