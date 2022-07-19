import './CheckBox.css';

/**
 * Create Checkbox UI Component.
 * @typedef {function}
 * @memberOf UI-Kit
 * @param {object} props - Object transmitted from parent component.
 * @returns {object}
 */

function CheckBox(props) {

    return (
        <div className='inputs input-ins'>
            <label>
                <span>
                    {props.label}
                </span>
                <input
                    type='checkbox'
                    name={props.name}
                    placeholder={props.placeholder}
                    value={props.value}
                    id={props.id}
                    className={props.className}
                />
            </label>
        </div>
    );
}

export default CheckBox;