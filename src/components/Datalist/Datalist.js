import React from "react";
import './Datalist.css';

/**
 * Create Datalist UI Component.
 * @typedef {function}
 * @memberOf UI-Kit
 * @param {object} props - Object transmitted from parent component.
 * @returns {object}
 */

class Datalist extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classList: props.classList,
            id: props.id,
            list: props.list,
            db: props.data,
            label: props.label,
            tags: [],
            control: props.control,
            recall: props.recall,
            errors: props.errors
        }
    }

    handleChange = (e) => {

        let target = e.currentTarget,
            value = target.value,
            tagsList = this.state.tags;

        if (value.trim().length > 0) {

            this.state.control(value, 'change', (data) => {
                if (data !== null) {
                    tagsList.push(data);
                    target.value = '';
                    this.setState({tags: tagsList});
                    this.state.recall(this.state.label, tagsList);
                }
            })

        } else {
            target.value = '';
        }
        target.focus();
        this.state.errors();
    }

    deleteOption = (e) => {

        let target = e.currentTarget,
            content = target.dataset.content,
            input = target.closest('.fake-input').querySelector('input'),
            tagsList = this.state.tags,
            final = [];

        for (let i = 0; i < tagsList.length; i++) {
            let row = tagsList[i];
            if (row.content !== content) {
                final.push(row);
            }
        }

        this.setState({tags: final});
        this.state.recall(this.state.label, final);
        this.state.errors();
        input.focus();
    }

    handleFocusOut = (e) => {

        let target = e.currentTarget,
            value = target.value,
            tagsList = this.state.tags;
        this.state.errors();

        this.state.control(value, 'blur', (data) => {
            if (data !== null) {
                tagsList.push(data);
                target.value = '';
                this.setState({tags: tagsList});
                this.state.recall(this.state.label, tagsList);
                this.state.errors();
            }
        })
    }

    handleFocus = (e) => {

        let target = e.currentTarget,
            value = target.value,
            tagsList = this.state.tags;
        this.state.errors();

        this.state.control(value, 'change', (data) => {
            if (data !== null) {
                tagsList.push(data);
                target.value = '';
                this.setState({tags: tagsList});
                this.state.recall(this.state.label, tagsList);
                this.state.errors();
            }
        })
    }

    render() {

        return (
            <div>
                <label htmlFor={this.state.id} className='datalist-label'>
                    <span>{this.state.label} :</span>
                    <span className='fake-input'>
                        <span className='selected-data-from-list'>
                            {this.state.tags.map((tag, i) => {
                               return (<i key={i} className={(tag.stt === true) ? 'good-format' : 'bad-format'}>
                                    {tag.content}
                                    <svg
                                        viewBox="0 0 24 24"
                                        data-content={tag.content}
                                        onClick={(e) => this.deleteOption(e)}
                                    >
                                        <path d="M18.984 6.422l-5.578 5.578 5.578 5.578-1.406 1.406-5.578-5.578-5.578 5.578-1.406-1.406 5.578-5.578-5.578-5.578 1.406-1.406 5.578 5.578 5.578-5.578z"></path>
                                    </svg>
                                </i>)}
                            )}
                        </span>
                        <input
                            spellCheck={false}
                            list={this.state.id}
                            name={this.state.id}
                            id={this.state.id + '-input'}
                            onFocus={(e) => this.handleFocus(e)}
                            onInput={(e) => this.handleChange(e)}
                            onBlur={(e) => this.handleFocusOut(e)}
                        />
                    </span>
                </label>
                <datalist id={this.state.id}>
                    {this.state.list.map((option, i) => {
                       return (
                           <option key={i} value={option}/>
                       )}
                    )}
                </datalist>
            </div>
        )
    }
}

export default Datalist;