import './Radio.css';

/**
 * Create Radio input UI Component.
 * @typedef {function}
 * @memberOf UI-Kit
 * @param {object} props - Object transmitted from parent component.
 * @returns {object}
 */

function Radio(props) {

    return (
        <div className='inputs radio-ins'>
            <label>
                <span>
                    {props.label}
                </span>
                <input
                    type='radio'
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

export default Radio;