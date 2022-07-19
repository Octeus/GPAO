import './TextArea.css';

/**
 * Create Textarea UI Component.
 * @typedef {function}
 * @memberOf UI-Kit
 * @param {object} props - Object transmitted from parent component.
 * @returns {object}
 */

function TextArea(props) {

    return (
        <div className='inputs textarea-ins'>
            <label>
                <span>
                    {props.label}
                </span>
               <textarea
                   name={props.name}
                   id={props.id}
                   className={props.className}
                   onInput={props.onInput}
                   spellCheck={false}
               >
                   {props.value}
               </textarea>
            </label>
        </div>
    );
}

export default TextArea;