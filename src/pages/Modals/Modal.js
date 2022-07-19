/**
 * This is a namespace that contains documentation elements belonging to the Modals
 * domain.
 *
 * @namespace Modals
 */

import React from 'react';
import './Modals.css';
import SaveFile from './Templates/SaveFile';
import OpenFile from './Templates/OpenFile';
import Corrupted from './Templates/Corrupted';
import SimpleModal from "./Templates/SimpleModal";
import Settings from "./Templates/Settings";

/**
 * Create React Modal component.
 * @typedef {function}
 * @param {object} props - Object transmitted from parent component.
 * @memberOf Modals
 * @returns {string} - Returns the compiled React component
 */

function Modal(props) {

    const db = props.data;

    const Render = () => {

        if (props.type === 'SaveFile') {

            return <SaveFile id='modal-center' data={db} content={props.content} classList={db.settings.theme + ' bg' +
                ' color border-color'}/>

        } else if (props.type === 'OpenFile') {

            return <OpenFile id='modal-center' data={db} content={props.content} classList={db.settings.theme + ' bg' +
                ' color border-color'}/>

        } else if (props.type === 'Corrupted') {

            return <Corrupted id='modal-center' data={db} content={props.content} classList={db.settings.theme + ' bg' +
                ' color border-color'}/>

        } else if (props.type === 'Settings') {

            return <Settings getModal={props.getModal} id='modal-center' data={db} content={props.content} classList={db.settings.theme + ' bg color border-color'}/>

        } else if (props.type === 'SimpleModal') {

            return <SimpleModal getModal={props.getModal} id='modal-center' data={db} content={props.content} classList={db.settings.theme + ' bg color border-color'}/>

        } else {

            return (
                <div id='noModal' />
            )
        }
    }

    return (
        <div className={db.settings.theme + ' modal modal-' + props.type}>
            <Render/>
        </div>
    );
}

export default Modal;
