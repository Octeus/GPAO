import './Input.css';
import {useState} from "react";

/**
 * Create Input UI Component.
 * @typedef {function}
 * @memberOf UI-Kit
 * @param {object} props - Object transmitted from parent component.
 * @returns {object}
 */

function Input(props) {

    let title = (props.className !== 'stricts') ? 'Champs de saisi pour ' + props.label : 'Champs ' + props.label;
    title = (props.title === false) ? '' : title;

    let [type,setType] = useState(props.type),
        [see,setSee] = useState(props.see)

    return (
        <div className='inputs input-ins'>
            {props.type !== 'search' &&
                <label className={(props.type === 'radio' || props.type === 'checkbox') ? 'inline' : ''}>
                    {(props.type === 'radio' || props.type === 'checkbox') &&
                        <>
                            <input
                                type={props.type}
                                name={props.name}
                                placeholder={props.placeholder}
                                value={props.value}
                                id={props.id}
                                className={props.className}
                                readOnly={props.className === 'stricts'}
                                title={title}
                                checked={props.checked}
                                onChange={props.onInput}
                            />
                            <span>
                            {props.label}
                        </span>
                        </>
                    }
                    {props.type !== 'radio' && props.type !== 'checkbox' &&
                        <>
                        <span>
                            {props.label}
                        </span>
                            <input
                                type={type}
                                name={props.name}
                                placeholder={props.placeholder}
                                defaultValue={props.value}
                                id={props.id}
                                className={props.className}
                                readOnly={props.className === 'stricts'}
                                title={title}
                                onInput={props.onInput}
                                onKeyUp={(props.onKeyUp) ? props.onKeyUp : props.onInput}
                                onBlur={props.onBlur}
                                spellCheck={false}
                            />
                            {(props.type === 'password')
                                ? (see === true)
                                    ? <svg
                                        className="icon-eye-blocked"
                                        viewBox="0 0 32 32"
                                        onClick={() => {
                                            setType('password')
                                            setSee(false)
                                        }}
                                    >
                                        <path
                                            d="M29.561 0.439c-0.586-0.586-1.535-0.586-2.121 0l-6.318 6.318c-1.623-0.492-3.342-0.757-5.122-0.757-6.979 0-13.028 4.064-16 10 1.285 2.566 3.145 4.782 5.407 6.472l-4.968 4.968c-0.586 0.586-0.586 1.535 0 2.121 0.293 0.293 0.677 0.439 1.061 0.439s0.768-0.146 1.061-0.439l27-27c0.586-0.586 0.586-1.536 0-2.121zM13 10c1.32 0 2.44 0.853 2.841 2.037l-3.804 3.804c-1.184-0.401-2.037-1.521-2.037-2.841 0-1.657 1.343-3 3-3zM3.441 16c1.197-1.891 2.79-3.498 4.67-4.697 0.122-0.078 0.246-0.154 0.371-0.228-0.311 0.854-0.482 1.776-0.482 2.737 0 1.715 0.54 3.304 1.459 4.607l-1.904 1.904c-1.639-1.151-3.038-2.621-4.114-4.323z"></path>
                                        <path
                                            d="M24 13.813c0-0.849-0.133-1.667-0.378-2.434l-10.056 10.056c0.768 0.245 1.586 0.378 2.435 0.378 4.418 0 8-3.582 8-8z"></path>
                                        <path
                                            d="M25.938 9.062l-2.168 2.168c0.040 0.025 0.079 0.049 0.118 0.074 1.88 1.199 3.473 2.805 4.67 4.697-1.197 1.891-2.79 3.498-4.67 4.697-2.362 1.507-5.090 2.303-7.889 2.303-1.208 0-2.403-0.149-3.561-0.439l-2.403 2.403c1.866 0.671 3.873 1.036 5.964 1.036 6.978 0 13.027-4.064 16-10-1.407-2.81-3.504-5.2-6.062-6.938z"></path>
                                    </svg>
                                    : <svg
                                        className="icon-eye"
                                        viewBox="0 0 32 32"
                                        onClick={() => {
                                            setType('text')
                                            setSee(true)
                                        }}
                                    >
                                        <path
                                            d="M16 6c-6.979 0-13.028 4.064-16 10 2.972 5.936 9.021 10 16 10s13.027-4.064 16-10c-2.972-5.936-9.021-10-16-10zM23.889 11.303c1.88 1.199 3.473 2.805 4.67 4.697-1.197 1.891-2.79 3.498-4.67 4.697-2.362 1.507-5.090 2.303-7.889 2.303s-5.527-0.796-7.889-2.303c-1.88-1.199-3.473-2.805-4.67-4.697 1.197-1.891 2.79-3.498 4.67-4.697 0.122-0.078 0.246-0.154 0.371-0.228-0.311 0.854-0.482 1.776-0.482 2.737 0 4.418 3.582 8 8 8s8-3.582 8-8c0-0.962-0.17-1.883-0.482-2.737 0.124 0.074 0.248 0.15 0.371 0.228v0zM16 13c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"></path>
                                    </svg>
                                : ''
                            }
                        </>
                    }

                </label>
            }
            {props.type === 'search' &&
                <label className={props.className + ' search-input-label'}>
                    <input
                        type='text'
                        name={props.name}
                        placeholder={props.placeholder}
                        defaultValue={props.value}
                        id={props.id}
                        className={props.className}
                        onInput={props.onInput}
                        onKeyUp={props.onInput}
                        spellCheck={false}
                    />
                    <svg className="icon-search" viewBox="0 0 16 16">
                        <path d="M15.56 15.56c-0.587 0.587-1.538 0.587-2.125 0l-2.652-2.652c-1.090 0.699-2.379 1.116-3.771 1.116-3.872 0-7.012-3.139-7.012-7.012s3.14-7.012 7.012-7.012c3.873 0 7.012 3.139 7.012 7.012 0 1.391-0.417 2.68-1.116 3.771l2.652 2.652c0.587 0.587 0.587 1.538 0 2.125zM7.012 2.003c-2.766 0-5.009 2.242-5.009 5.009s2.243 5.009 5.009 5.009c2.766 0 5.009-2.242 5.009-5.009s-2.242-5.009-5.009-5.009z"></path>
                    </svg>
                </label>
            }
        </div>
    );
}

export default Input;