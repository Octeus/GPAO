import './Select.css';

/**
 * Create Select UI Component.
 * @typedef {function}
 * @memberOf UI-Kit
 * @param {object} props - Object transmitted from parent component.
 * @returns {object}
 */

function Select(props) {

    return (
        <div className='inputs select-ins'>
            <label>
                <span>
                    {props.label}
                </span>
                <select
                    name={props.name}
                    id={props.id}
                    className={props.className + ' capitalize'}
                    onChange={props.onChange}
                    defaultValue={props.defaultValue}
                >
                    {props.options &&
                        props.options.map((option, i) =>
                            <option value={(props.array !== true) ? option : i} className={props.className + ' capitalize'}
                                    key={i}>{option}</option>
                        )
                    }
                    {props.special &&
                        props.special.map((option, i) =>
                            <option key={i} value={option.value}>{option.name}</option>
                        )
                    }
                </select>
            </label>
        </div>
    );
}

export default Select;