/**
 * This is a namespace that contains documentation elements belonging to the UI-Kit
 * domain.
 *
 * @namespace  UI-Kit
 */

import './Button.css';

/**
 * Create Button UI Component.
 * @typedef {function}
 * @memberOf UI-Kit
 * @param {object} props - Object transmitted from parent component.
 * @returns {object}
 */

function Button(props) {

    let classes = (props.active === true)
        ? props.data.settings.theme + ' bg-2 color'
        : props.data.settings.theme + ' bg-2 color-2';
    classes = (props.active === null)
        ? classes + ' inactive'
        : classes

    return (
        <div className='buttons'>
            <button
                type={props.type}
                id={props.id}
                className={classes + ' ' + props.className}
                onClick={props.onClick}
            >
                {props.text}
            </button>
        </div>
    );
}

export default Button;