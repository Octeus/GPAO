import './Drag.css';
import Button from "../Button/Button";
import Input from "../Input/Input";
import {useState, useEffect} from "react";
import "leaflet/dist/leaflet.css";
import Select from "../Select/Select";
import { storage } from "../../Tools/Tools";

let packaging = {
    coords: {
        from: {lat: null, lng: null, address: null},
        to: {lat: null, lng: null, address: null}
    },
    weight: 0,
    pack: 'letter',
    distance: null
}, toInterval, group = [], readyToPack = null;

/**
 * Create React Drag component.
 * @typedef {function}
 * @memberOf UI-Kit
 * @param {object} props - Object transmitted from parent component.
 * @returns {string} - Returns the compiled React component
 */

function Drag(props) {

    const db = props.data;
    const theme = props.theme;

    let centers = db.operational_centers;
    for (let i = 0; i < centers.length; i++) {
        group.push({
            coord: [parseFloat(centers[i].lat), parseFloat(centers[i].lng)],
            popup: centers[i].name
        })
    }

    const Window = () => {
        return callWindow(db, props, theme);
    };

    const cssClass = () => {
        if (props.type.includes('Drag')) {
            return 'drags';
        } else if (props.type.includes('Nano')) {
            return 'modals';
        }
    };

    return (
        <div id={props.type} className={props.type.split('-')[0] + ' ' + cssClass() + ' ' + theme + ' bg-2 color border-color footer-' + props.job.toLowerCase()}>
            <Window />
        </div>
    );
}

/**
 * Details Title for sides.
 * @typedef {function}
 * @memberOf UI-Kit
 * @param {string} type - Job name.
 * @returns {string} - Returns explicit title if exists.
 */

function expliciter(str) {

    let refs = {
        'Remote': '<svg class="blue befores befores-2" viewBox="0 0 24 24"><path d="M3.984 11.016v1.969h2.016v-1.969h-2.016zM2.016 14.016v-4.031h19.969v4.031h-19.969zM6 6.984v-1.969h-2.016v1.969h2.016zM2.016 3.984h19.969v4.031h-19.969v-4.031zM3.984 17.016v1.969h2.016v-1.969h-2.016zM2.016 20.016v-4.031h19.969v4.031h-19.969z"></path></svg>Remote Host',
        'Database': '<svg class="orange befores befores-2" viewBox="0 0 24 24"><path d="M18 8.016v-4.031h-2.016v4.031h2.016zM15 8.016v-4.031h-2.016v4.031h2.016zM12 8.016v-4.031h-2.016v4.031h2.016zM18 2.016q0.797 0 1.406 0.586t0.609 1.383v16.031q0 0.797-0.609 1.383t-1.406 0.586h-12q-0.797 0-1.406-0.586t-0.609-1.383l0.047-12 5.953-6h8.016z"></path></svg>Browse Database',
        'Print': '<svg class="green befores befores-2" viewBox="0 0 24 24"><path d="M17.484 12q0.609 0 1.055-0.422t0.445-1.078-0.445-1.078-1.055-0.422-1.055 0.422-0.445 1.078 0.445 1.078 1.055 0.422zM14.484 8.016q0.609 0 1.055-0.445t0.445-1.055-0.445-1.055-1.055-0.445-1.055 0.445-0.445 1.055 0.445 1.055 1.055 0.445zM9.516 8.016q0.609 0 1.055-0.445t0.445-1.055-0.445-1.055-1.055-0.445-1.055 0.445-0.445 1.055 0.445 1.055 1.055 0.445zM6.516 12q0.609 0 1.055-0.422t0.445-1.078-0.445-1.078-1.055-0.422-1.055 0.422-0.445 1.078 0.445 1.078 1.055 0.422zM12 3q3.703 0 6.352 2.344t2.648 5.672q0 2.063-1.477 3.516t-3.539 1.453h-1.734q-0.656 0-1.078 0.445t-0.422 1.055q0 0.516 0.375 0.984t0.375 1.031q0 0.656-0.422 1.078t-1.078 0.422q-3.75 0-6.375-2.625t-2.625-6.375 2.625-6.375 6.375-2.625z"></path></svg>Design patterns & Files',
        'Project': '<svg class="green befores befores-2" viewBox="0 0 24 24"><path d="M21 14.016v-10.031h-18v10.031h18zM21 2.016q0.797 0 1.406 0.586t0.609 1.383v12q0 0.797-0.609 1.406t-1.406 0.609h-6.984l1.969 3v0.984h-7.969v-0.984l1.969-3h-6.984q-0.797 0-1.406-0.609t-0.609-1.406v-12q0-0.797 0.609-1.383t1.406-0.586h18z"></path></svg>Data models',
        'Customer': '<svg class="blue befores befores-2" viewBox="0 0 24 24"><path d="M18 18.984v-1.406q0-1.359-2.063-2.227t-3.938-0.867-3.938 0.867-2.063 2.227v1.406h12zM12 6.984q-1.219 0-2.109 0.891t-0.891 2.109 0.891 2.109 2.109 0.891 2.109-0.891 0.891-2.109-0.891-2.109-2.109-0.891zM12 3q-0.422 0-0.703 0.281t-0.281 0.703 0.281 0.727 0.703 0.305 0.703-0.305 0.281-0.727-0.281-0.703-0.703-0.281zM18.984 3q0.797 0 1.406 0.609t0.609 1.406v13.969q0 0.797-0.609 1.406t-1.406 0.609h-13.969q-0.797 0-1.406-0.609t-0.609-1.406v-13.969q0-0.797 0.609-1.406t1.406-0.609h4.172q0.328-0.891 1.078-1.453t1.734-0.563 1.734 0.563 1.078 1.453h4.172z"></path></svg>Customer informations',
        'Providers': '<svg class="gold befores befores-2" viewBox="0 0 24 24"><path d="M18 18.516q0.656 0 1.078-0.445t0.422-1.055-0.422-1.055-1.078-0.445-1.078 0.445-0.422 1.055 0.422 1.055 1.078 0.445zM19.5 9.516h-2.484v2.484h4.453zM6 18.516q0.656 0 1.078-0.445t0.422-1.055-0.422-1.055-1.078-0.445-1.078 0.445-0.422 1.055 0.422 1.055 1.078 0.445zM20.016 8.016l3 3.984v5.016h-2.016q0 1.219-0.891 2.109t-2.109 0.891-2.109-0.891-0.891-2.109h-6q0 1.219-0.891 2.109t-2.109 0.891-2.109-0.891-0.891-2.109h-2.016v-11.016q0-0.797 0.609-1.406t1.406-0.609h14.016v4.031h3z"></path></svg>Delivery process'
    }

    return (refs[str]) ?? str;
}

/**
 * Toggling the Aside window on drag.
 * @typedef {function}
 * @memberOf UI-Kit
 * @param {string} type - Modal type.
 * @param {object} db - Database from localStorage.
 * @param {string} mode - Modal mode like bubble or window setting.
 * @param {string} job - Container title.
 * @returns {boolean} - Returns true.
 */

function callWindow(db, props, theme) {

    let {type, mode, job} = props;

    const parent = type.split('-')[0];

    const heading = () => {

        if (job === 'Terminal') {
            return (
                <div>
                    <p className='footerModal-label'>{job} :</p>
                </div>
            );
        } else {
            return (
                <div>
                    <p className='footerModal-label'>{job} : </p>
                </div>
            );
        }
    };

    if (parent === 'footerDrag') {

        return (
            <div className={'drag-container ' + mode}>
                <div className={theme + ' draggable-element drag-title bg-2 color border-color'}>
                    {heading()}
                </div>
                <div className={theme + ' footer-container bg'}>
                    {Job(job, props, db, theme)}
                </div>
            </div>
        );

    } else if (parent === 'footerNano') {

        return (
            <div className={theme + ' nano-container bg-2 color border-color'}>
                <div className={theme + ' bg footerNanoTitle'}>
                    <h3>{Job(job, props, db, theme)}</h3>
                </div>
                <div className='footerNanoContent'>
                    {Content(job, db)}
                </div>
            </div>
        );

    } else if (parent === 'leftDrag') {

        return (
            <div className={theme + ' left-drag-container bg-2 color border-color ' + mode}>
                <div className={theme + ' drag-title bg color border-color'}>
                    <p dangerouslySetInnerHTML={{__html: expliciter(job)}}/>
                </div>
                <div className={theme + ' bg color border-color sides-container'}>
                    {Job(job, props, db, theme)}
                </div>
                <div className='draggable-element' />
            </div>
        );

    } else if (parent === 'rightDrag') {

        return (
            <div className={theme + ' right-drag-container bg-2 color border-color ' + mode}>
                <div className='draggable-element' />
                <div className={theme + ' drag-title bg color border-color'}>
                    <p dangerouslySetInnerHTML={{__html: expliciter(job)}}/>
                    {job === 'Remote' &&
                        <svg
                            className='gold befores befores-2 remote-refresh'
                            viewBox="0 0 24 24"
                            onClick={() => props.getRemoteHostContent('', 'get')}
                        >
                            <path d="M12 18v-3l3.984 3.984-3.984 4.031v-3q-3.281 0-5.648-2.367t-2.367-5.648q0-2.344 1.266-4.266l1.453 1.453q-0.703 1.266-0.703 2.813 0 2.484 1.758 4.242t4.242 1.758zM12 3.984q3.281 0 5.648 2.367t2.367 5.648q0 2.344-1.266 4.266l-1.453-1.453q0.703-1.266 0.703-2.813 0-2.484-1.758-4.242t-4.242-1.758v3l-3.984-3.984 3.984-4.031v3z"/>
                        </svg>
                    }
                    {job === 'Database' &&
                        <svg
                            className='gold befores befores-2 remote-refresh'
                            viewBox="0 0 24 24"
                            onClick={() => props.getTables()}
                        >
                            <path d="M12 18v-3l3.984 3.984-3.984 4.031v-3q-3.281 0-5.648-2.367t-2.367-5.648q0-2.344 1.266-4.266l1.453 1.453q-0.703 1.266-0.703 2.813 0 2.484 1.758 4.242t4.242 1.758zM12 3.984q3.281 0 5.648 2.367t2.367 5.648q0 2.344-1.266 4.266l-1.453-1.453q0.703-1.266 0.703-2.813 0-2.484-1.758-4.242t-4.242-1.758v3l-3.984-3.984 3.984-4.031v3z"/>
                        </svg>
                    }
                </div>
                <div className={theme + ' bg color border-color sides-container'}>
                    {Job(job, props, db, theme)}
                </div>
            </div>
        );

    }
}

/**
 * Create drag window content.
 * @typedef {function}
 * @memberOf UI-Kit
 * @param {string} job - Modal title.
 * @returns {object} - Returns compiled object.
 */

function Job(job, props, db, theme) {

    let [btn1, setBtn1] = useState(true),
        [btn2, setBtn2] = useState(false),
        [list, setList] = useState(db.todo);

    useEffect(() => {
        scrollerLogs();
    })

    /*if (job === 'Terminal') {

        return (
            <div className='terminals-container' id='terminal-container-1'>
                <div id='terminal-1' className='terminals'>
                    <div className='xterm-container'></div>
                </div>
            </div>
        );

    } else*/ if (job === 'Logs') {

        return (
            <div id='logs-container'>
                <div id='logs-number'>
                    <span>Logs list</span>
                    {props.logs.length > 1 &&
                        props.logs.length + ' logs'
                    }
                    {props.logs.length <= 1 &&
                        '0 log'
                    }
                    <Button
                        className='logs-selector all'
                        onClick={(e) => {
                            selectLogDisplay(e, 'all')
                            setBtn1(true)
                            setBtn2(false)
                        }}
                        text='All'
                        type='button'
                        data={db}
                        active={btn1}
                    />
                    <Button
                        className='logs-selector errors'
                        onClick={(e) => {
                            selectLogDisplay(e, 'errors')
                            setBtn1(false)
                            setBtn2(true)
                        }}
                        text='Only Errors'
                        type='button'
                        data={db}
                        active={btn2}
                    />
                </div>
                <ul id='logs-list'>
                {props.logs.map((log, index) =>
                    <li className={'log-' + log.type} key={index}><pre>{log.line}</pre></li>
                )}
                </ul>
            </div>
        );

    } else if (job === 'TODO') {

        let title = '';
        switch (db.mode) {
            case 'update': title = 'Update a customer Card'; break;
            case 'design': title = 'Card design'; break;
            case 'delivery': title = 'Estimate delivery'; break;
            default: title = 'Create a new Card'; break;
        }

        return (
            <div id='todo-container'>
                <p id='todo-title'>{title}</p>
                <ul id='todo-list'>
                    {list.map((row, index) =>
                        <li key={index}>
                            <span className={(row.done === row.steps.length) ? 'complete' : ''}>
                                {row.text} {row.done}/{row.steps.length}
                            </span>
                            <ul>
                                {row.steps.map((step, i) =>
                                    <li key={i} className={theme + ' color'}>
                                        <Input
                                            label={step.text}
                                            title={false}
                                            type='checkbox'
                                            name='todo'
                                            value={step.done}
                                            className='checkboxes'
                                            onInput={(e) => {
                                                let target = e.currentTarget,
                                                    checked = target.checked,
                                                    cnt = (checked === true) ? list[index].done + 1 : list[index].done - 1;

                                                list[index].steps[i].done = checked;
                                                list[index].done = (cnt > 0) ? cnt : 0;
                                                setList([...list]);
                                            }}
                                        />
                                    </li>
                                )}
                            </ul>
                        </li>
                    )}
                </ul>
            </div>
        );

    } else if (job === 'Devices') {

        return (
            <div id='device-container'>
                <div id='device-title'>
                    <span>All mounted devices list</span>
                    <Button
                        className='refresh-devices'
                        text='Refresh list'
                        type='button'
                        data={db}
                        active={true}
                    />
                </div>
                <ul id='devices-list'/>
            </div>
        );

    } else if (job === 'Remote') {

        return (
            <div id='remote-container' className='inner-sides-container'>
                <div id='remote-list'>
                    <ul id='remote-lister'>
                        {(props.remote === null || props.remote.error === true || props.remote.data === undefined) &&
                            <li id='empty-folder'><i>Something went wrong...</i></li>
                        }
                        {(props.remote !== null && props.remote.data !== undefined && props.remote.data.length > 0 && props.remote.data[0].home === false) &&
                            <li
                                className={props.theme}
                                id='back-to-parent'
                                onClick={() => {
                                    props.getRemoteHostContent(props.parent, 'get')
                                }}
                            >
                                <svg id="back-icon" viewBox="0 0 24 24">
                                    <path d="M18 11h-7.244l1.586-1.586c0.781-0.781 0.781-2.049 0-2.828-0.781-0.781-2.047-0.781-2.828 0l-6.414 6.414 6.414 6.414c0.39 0.391 0.902 0.586 1.414 0.586s1.023-0.195 1.414-0.586c0.781-0.781 0.781-2.049 0-2.828l-1.586-1.586h7.244c1.104 0 2-0.896 2-2 0-1.105-0.896-2-2-2z"/>
                                </svg>
                                Back to parent
                            </li>
                        }
                        {(props.remote !== null && props.remote.data !== undefined) &&
                            props.remote.data.map((file, i) => {
                                if (file.dir === null) {
                                    return(
                                        <li
                                            id='empty-folder'
                                            className={props.theme + ' color-2'}
                                            key={i}
                                        >
                                            <i>{file.name}</i>
                                        </li>
                                    )
                                } else {
                                    return (
                                        <li
                                            className={props.theme}
                                            key={i}
                                            onClick={() => {
                                                let mode = (file.dir === true) ? 'get' : 'sel';
                                                props.getRemoteHostContent(file.path, mode)
                                            }}
                                        >
                                            {file.dir === true
                                                ? <svg className="remote-folder remote-icons" viewBox="0 0 24 24">
                                                    <path
                                                        d="M9.984 3.984l2.016 2.016h8.016q0.797 0 1.383 0.609t0.586 1.406v9.984q0 0.797-0.586 1.406t-1.383 0.609h-16.031q-0.797 0-1.383-0.609t-0.586-1.406v-12q0-0.797 0.586-1.406t1.383-0.609h6z"/>
                                                </svg>
                                                : <svg className="remote-file remote-icons" viewBox="0 0 24 24">
                                                    <path
                                                        d="M12.984 9h5.531l-5.531-5.484v5.484zM6 2.016h8.016l6 6v12q0 0.797-0.609 1.383t-1.406 0.586h-12q-0.797 0-1.406-0.586t-0.609-1.383l0.047-16.031q0-0.797 0.586-1.383t1.383-0.586z"/>
                                                </svg>
                                            }
                                            <span>
                                            {file.name}
                                                &nbsp;
                                                <small>({file.size})</small>
                                        </span>
                                        </li>
                                    )
                                }
                            })
                        }
                    </ul>
                </div>
            </div>
        );

    } else if (job === 'Database') {

        return (
            <div id='database-container' className='inner-sides-container'>
                <div id='database-list'>
                    <ul id='database-lister'>
                        {(props.tables === null || props.tables.error === true || props.tables.data === undefined) &&
                            <li id='empty-database'><i>Something went wrong...</i></li>
                        }
                        {(props.tables !== null && props.tables.data !== undefined) &&
                            props.tables.data.map((table, i) => {
                                return(
                                    <li
                                        key={i}
                                        className={props.theme + ' color-2'}
                                    >
                                        <span
                                            onClick={() => props.getTables(table.name)}
                                        >
                                            <b>Table</b>&nbsp;"{table.name}"
                                        </span>
                                        <ul className={props.theme + ' bg-2 sub-list'}>
                                            {table.data.map((val, n) => {
                                                return(
                                                    <li
                                                        key={n}
                                                        className={props.theme + ' color-2 sub-lister'}
                                                    >
                                                        <i>Col:</i>"{val.column_name}"
                                                        <i>Type:</i>"{val.data_type}
                                                        {val.character_maximum_length !== null &&
                                                            <small>({val.character_maximum_length})</small>
                                                        }
                                                        {val.numeric_precision !== null &&
                                                            <small>({val.numeric_precision})</small>
                                                        }"
                                                        <i>Nullable:</i>"{val.is_nullable}"
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        );

    }  else if (job === 'Project')  {

        return (
            <div id='customer-container' className='inner-sides-container'>
                <div id='customer-list'>
                    <ul id='customer-lister'>
                        {(props.models === null || props.models.error === true) &&
                            <li id='empty-customer'><i>Something went wrong...</i></li>
                        }
                        {props.models !== null &&
                            props.models.data.map((form, i) => {
                                return(
                                    <li
                                        key={i}
                                        className={props.theme + ' color-2'}
                                    >
                                        <span>
                                            BDD {form.name}
                                        </span>
                                        <p
                                            dangerouslySetInnerHTML={{__html: setJsons(form.content, props.theme)}}
                                        />
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        );

    }  else if (job === 'Providers')  {

        let options = [],
            centers = props.data.operational_centers

        if (centers.length > 0) {
            packaging.coords.from.lat = parseFloat(centers[0].lat)
            packaging.coords.from.lng = parseFloat(centers[0].lng)
            packaging.coords.from.address = {
                name: centers[0].name,
                street: centers[0].address,
                zip: centers[0].zip,
                city: centers[0].city.toUpperCase(),
                country: centers[0].country.toUpperCase()
            };
        }

        for (let i = 0; i < centers.length; i++) {
            options.push({name: centers[i].name, value: centers[i].lat + ',' + centers[i].lng})
        }

        return (
            <div id='providers-container' className='inner-sides-container'>
                <div id='providers-list' className={props.theme + ' bg color-2 border-color'}>
                    <Select
                        name='from'
                        id='from-location'
                        className={props.theme + ' bg color border-color locations-ins'}
                        label='From:'
                        defaultValue={(options[0]) ? options[0].value : null}
                        onChange={(e) => {
                            let target = e.currentTarget,
                                value = target.value,
                                split = value.split(','),
                                coords = {lat: split[0], lng: split[1]}
                            for (let i = 0; i < centers.length; i++) {
                                if (centers[i].lat === split[0] && centers[i].lng === split[1]) {
                                    packaging.coords.from.address = {
                                        name: centers[i].name,
                                        street: centers[i].address,
                                        zip: centers[i].zip,
                                        city: centers[i].city.toUpperCase(),
                                        country: centers[i].country.toUpperCase()
                                    };
                                    break;
                                }
                            }
                            completePackaging('from', coords)
                        }}
                        special={options}
                    />
                    <div id='search-coords-container'>
                        <Input
                            type='text'
                            name='to'
                            id='to-location'
                            className={props.theme + ' bg color border-color locations-ins'}
                            onKeyUp={(e) => {
                                clearTimeout(toInterval)
                                let target = e.currentTarget,
                                    value = target.value;
                                if (value !== '') {
                                    toInterval = setTimeout(() => {
                                        const xhr = new XMLHttpRequest();
                                        xhr.onload = function () {
                                            setAddressesList(this.responseText, props.theme);
                                        }
                                        xhr.open("GET", "https://www.mapquestapi.com/geocoding/v1/address?key=5z5CMWFoaFl474PIww8qkjJ76bTKHpCg&location=" + encodeURIComponent(value));
                                        xhr.send();
                                    }, 500)
                                } else {
                                    document.querySelector('#to-list').classList.add('hidden');
                                    document.querySelector('#to-list').innerHTML = '';
                                    completePackaging('to-address', null)
                                    completePackaging('to', {lat: null, lng: null})
                                }
                            }}
                            label='To:'
                        />
                        <ul
                            id='to-list'
                            className={props.theme + ' bg-2 color-2 border-color hidden'}
                        />
                    </div>
                    <Input
                        type='number'
                        name='weight'
                        id='weight-location'
                        className={props.theme + ' bg color border-color locations-ins'}
                        onInput={(e) => {
                            let target = e.currentTarget,
                                value = target.value;
                            completePackaging('weight', value)
                        }}
                        label='Weight (grams unit):'
                    />
                    <Select
                        name='pack'
                        id='pack-location'
                        className={props.theme + ' bg color border-color locations-ins'}
                        label='Packing:'
                        defaultValue={'letter'}
                        onChange={(e) => {
                            let target = e.currentTarget,
                                value = target.value;
                            completePackaging('pack', value)
                        }}
                        options={['letter', 'package']}
                    />
                    <Button
                        className='prepare-send'
                        text='Process'
                        onClick={() => {

                            if (readyToPack !== null) {
                                const ipc = window.require('electron').ipcRenderer;
                                let d = new Date();
                                ipc.send('setPacking', {
                                    path: '/packing/' + d.getFullYear() + d.getMonth() + d.getDate() + d.getHours() + d.getMinutes() + d.getSeconds() + d.getMilliseconds(),
                                    name: 'pack:' + d.getSeconds() + d.getMilliseconds(),
                                    content: readyToPack
                                })
                            }
                        }}
                        type='button'
                        data={props.data}
                        active={true}
                    />
                </div>
                <div id='map'/>
            </div>
        );

    } else if (job === 'Customer') {

        return (
            <div id='customer-container' className='inner-sides-container'>
                <div id='customer-list'>
                    <div id='customer-first' className={props.theme + ' bg-2 color-2 border-color'}>
                        <h4
                            onClick={() => {
                                const ipc = window.require('electron').ipcRenderer
                                ipc.send('getFormFileContent', {
                                    name: 'form:strict',
                                    path: '/forms/strict',
                                    content: storage('fixed')
                                })
                            }}
                        >
                            Strict info
                        </h4>
                        <ul
                            className='customer-sections'
                            data-key='fixed'
                            dangerouslySetInnerHTML={{__html: compileDataToList(props.theme, storage('fixed'))}}
                        />
                    </div>
                    <div id='customer-second' className={props.theme + ' bg-2 color-2 border-color'}>
                        <h4
                            onClick={() => {
                                const ipc = window.require('electron').ipcRenderer
                                ipc.send('getFormFileContent', {
                                    name: 'form:traveler',
                                    path: '/forms/traveler',
                                    content: storage('traveler')
                                })
                            }}
                        >
                            Traveler info
                        </h4>
                        <ul
                            className='customer-sections'
                            data-key='traveler'
                            dangerouslySetInnerHTML={{__html: compileDataToList(props.theme, storage('traveler'))}}
                        />
                    </div>
                    <div id='customer-third' className={props.theme + ' bg-2 color-2 border-color'}>
                        <h4
                            onClick={() => {
                                const ipc = window.require('electron').ipcRenderer
                                ipc.send('getFormFileContent', {
                                    name: 'form:ice',
                                    path: '/forms/ice',
                                    content: storage('ice')
                                })
                            }}
                        >
                            Ice info
                        </h4>
                        <ul
                            className='customer-sections'
                            data-key='ice'
                            dangerouslySetInnerHTML={{__html: compileDataToList(props.theme, storage('ice').trusted_third_party, 'Trusted third party')}}
                        />
                        <ul
                            className='customer-sections'
                            data-key='ice'
                            dangerouslySetInnerHTML={{__html: compileDataToList(props.theme, storage('ice').ice1, 'Ice 1')}}
                        />
                        <ul
                            className='customer-sections'
                            data-key='ice'
                            dangerouslySetInnerHTML={{__html: compileDataToList(props.theme, storage('ice').ice2, 'Ice 2')}}
                        />
                        <ul
                            className='customer-sections'
                            data-key='ice'
                            dangerouslySetInnerHTML={{__html: compileDataToList(props.theme, storage('ice').local1, 'Local 1')}}
                        />
                        <ul
                            className='customer-sections'
                            data-key='ice'
                            dangerouslySetInnerHTML={{__html: compileDataToList(props.theme, storage('ice').local2, 'Local 2')}}
                        />
                        <ul
                            className='customer-sections'
                            data-key='ice'
                            dangerouslySetInnerHTML={{__html: compileDataToList(props.theme, storage('ice').doctor, 'Doctor')}}
                        />
                        <ul
                            className='customer-sections'
                            data-key='ice'
                            dangerouslySetInnerHTML={{__html: compileDataToList(props.theme, storage('ice').insurance, 'Insurance')}}
                        />
                    </div>
                    <div id='customer-fourth' className={props.theme + ' bg-2 color-2 border-color'}>
                        <h4
                            onClick={() => {
                                const ipc = window.require('electron').ipcRenderer
                                ipc.send('getFormFileContent', {
                                    name: 'form:doctor',
                                    path: '/forms/doctor',
                                    content: storage('doctor')
                                })
                            }}
                        >
                            Doctor info
                        </h4>
                        <ul
                            className='customer-sections'
                            data-key='doctor'
                            dangerouslySetInnerHTML={{__html: compileDataToList(props.theme, storage('doctor'))}}
                        />
                    </div>
                    <div id='customer-fifth' className={props.theme + ' bg-2 color-2 border-color'}>
                        <h4
                            onClick={() => {
                                const ipc = window.require('electron').ipcRenderer
                                ipc.send('getFormFileContent', {
                                    name: 'form:health',
                                    path: '/forms/health',
                                    content: storage('health')
                                })
                            }}
                        >
                            Health info
                        </h4>
                        <ul
                            className='customer-sections'
                            data-key='health'
                            dangerouslySetInnerHTML={{__html: compileDataToList(props.theme, storage('health'))}}
                        />
                    </div>
                    <div id='customer-sixth' className={props.theme + ' bg-2 color-2 border-color'}>
                        <h4
                            onClick={() => {
                                const ipc = window.require('electron').ipcRenderer
                                ipc.send('getFormFileContent', {
                                    name: 'form:exams',
                                    path: '/forms/exams',
                                    content: storage('exams')
                                })
                            }}
                        >
                            Exams info
                        </h4>
                        <p id='exams-counter' className='customer-counters'>
                            <i>No exam yet</i>
                        </p>
                    </div>
                    <div id='customer-seventh' className={props.theme + ' bg-2 color-2 border-color'}>
                        <h4
                            onClick={() => {
                                const ipc = window.require('electron').ipcRenderer
                                ipc.send('getFormFileContent', {
                                    name: 'form:treatments',
                                    path: '/forms/treatments',
                                    content: storage('treatments')
                                })
                            }}
                        >
                            Treatments info
                        </h4>
                        <p id='treatments-counter' className='customer-counters'>
                            <i>No treatment yet</i>
                        </p>
                    </div>
                </div>
            </div>
        );

    } else if (job === 'Print') {

        return (
            <div id='design-container' className='inner-sides-container'>
                <div id='design-list'>
                    {props.data.prints.length > 0 &&
                        props.data.prints.map((print, i) =>
                            <div className={props.theme + ' bg'} key={i}>
                                <p className={props.theme + ' color template-name'}>Template {print.name}</p>
                                <ul
                                    className={props.theme + ' bg-2'}
                                    onClick={() => {
                                        const ipc = window.require('electron').ipcRenderer
                                        ipc.send('getPrintFileContent', {
                                            name: 'design:' + print.name,
                                            path: '/forms/' + print.name,
                                            content: print
                                        })
                                    }}
                                >
                                    <li
                                        className={props.theme + ' color-2'}
                                    >
                                        Recto
                                        <span dangerouslySetInnerHTML={{__html: print.recto}} />
                                    </li>
                                    <li
                                        className={props.theme + ' color-2'}
                                    >
                                        Verso
                                        <span dangerouslySetInnerHTML={{__html: print.verso}} />
                                    </li>
                                </ul>
                            </div>
                        )
                    }
                    {props.data.prints.length < 1 &&
                        <i className={props.theme + ' color-2 '}>No template available yet</i>
                    }
                </div>
            </div>
        );
    }
};

function compileDataToList(theme, json, step = '') {

    let html = (step !== '') ? '<li class="' + theme + ' color steps-title">' + step + '</li>' : '';
    for (let key in json) {

        let cle = (step !== '') ? step.toLowerCase().replaceAll(' ', '') + '.' + key : key;

        if (typeof json[key] === 'object' && !Array.isArray(json[key])) {

            let sub = json[key];
            html += '<ul>';
            html += '<li class="' + theme + ' color steps-title">' + key.replaceAll('_', ' ') + '</li>';
            for (let subKey in sub) {

                let c = cle + '.' + subKey;
                html += '<li class="customer-checks" data-key="' + c + '">';
                html += (sub[subKey] !== '' && sub[subKey] !== false) ? '<svg class="customer-icons" viewBox="0 0 32 32"><path d="M28 0h-24c-2.2 0-4 1.8-4 4v24c0 2.2 1.8 4 4 4h24c2.2 0 4-1.8 4-4v-24c0-2.2-1.8-4-4-4zM14 24.828l-7.414-7.414 2.828-2.828 4.586 4.586 9.586-9.586 2.828 2.828-12.414 12.414z"></path></svg>' : '<svg class="customer-icons" viewBox="0 0 32 32"><path d="M28 0h-24c-2.2 0-4 1.8-4 4v24c0 2.2 1.8 4 4 4h24c2.2 0 4-1.8 4-4v-24c0-2.2-1.8-4-4-4zM28 28h-24v-24h24v24z"></path></svg>';
                html += '<span>' + subKey.replaceAll('_', ' ') + '</span>';
                html += '</li>';
            }

            html += '</ul>';

        } else {

            html += '<li class="customer-checks" data-key="' + cle + '">';
            html += (json[key] !== '' && json[key] !== false) ? '<svg class="icon-checked customer-icons" viewBox="0 0 32 32"><path d="M28 0h-24c-2.2 0-4 1.8-4 4v24c0 2.2 1.8 4 4 4h24c2.2 0 4-1.8 4-4v-24c0-2.2-1.8-4-4-4zM14 24.828l-7.414-7.414 2.828-2.828 4.586 4.586 9.586-9.586 2.828 2.828-12.414 12.414z"></path></svg>' : '<svg class="icon-unchecked customer-icons" viewBox="0 0 32 32"><path d="M28 0h-24c-2.2 0-4 1.8-4 4v24c0 2.2 1.8 4 4 4h24c2.2 0 4-1.8 4-4v-24c0-2.2-1.8-4-4-4zM28 28h-24v-24h24v24z"></path></svg>';
            html += '<span>' + key.replaceAll('_', ' ') + '</span>';
            html += '</li>';
        }
    }
    return html;
}

function Content(job, db, theme) {

    if (job === 'Connexion') {

        return (
            <ul>
                <li data-name='address'>Address : <span className='red'>Not available</span></li>
                <li data-name='class'>Class : <span className='red'>-1</span></li>
                <li data-name='name'>Name : <span className='red'>Not available</span></li>
                <li data-name='ttl'>TTL : <span className='red'>000</span></li>
                <li data-name='type'>Type : <span className='red'>0</span></li>
            </ul>
        );

    } else if (job === 'Cloud') {

        return (
            <ul id='cloud-list' className={theme}>
                <li className='hover' data-name='updates'>Check for updates</li>
                <li className='hover' data-name='synchro'>Synchronize Settings</li>
                <li className='hover' data-name='account'>Synchronize Account</li>
            </ul>
        );

    } else if (job === 'Projects done') {

        return (
            <ul id='projects-list'>
                {(db.projects.length === 0)
                    ? <li className='empty-list'>No project done yet</li>
                    : db.projects.map((project, i) =>
                        <li key={i} className={'project-' + project.stt}>
                            {project.ref}
                            <small>at {project.time}</small>
                        </li>
                    )
                }
            </ul>
        );
    }
}

function setAddressesList(jsonText, theme) {

    let json = JSON.parse(jsonText),
        res = json.results,
        html = '';
    document.querySelector('#to-list').innerHTML = html;
    document.querySelector('#to-list').classList.add('hidden');

    if (res[0]) {
        let loc = res[0].locations;
        if (loc.length > 0) {

            for (let i = 0; i < 6; i++) {
                if (loc[i]) {
                    let details = loc[i],
                        array = [],
                        jsonAddress = {
                            street: details.street,
                            zip: details.postalCode,
                            city: details.adminArea5,
                            country: details.adminArea1
                        };

                    html += '<li class="locations-results ' + theme + ' color-2" data-lat="' + details.latLng.lat + '" data-lng="' + details.latLng.lng + '" data-address="' + encodeURIComponent(JSON.stringify(jsonAddress)) + '">';
                    if (details.street !== '') {
                        array.push(details.street);
                    }
                    if (details.postalCode !== '') {
                        array.push(details.postalCode);
                    }
                    if (details.adminArea5 !== '') {
                        array.push(details.adminArea5);
                    }
                    if (details.adminArea4 !== '') {
                        array.push(details.adminArea4);
                    }
                    if (details.adminArea3 !== '') {
                        array.push(details.adminArea3);
                    }
                    if (details.adminArea1 !== '') {
                        array.push(details.adminArea1);
                    }
                    html += array.join(' ') + '</li>';
                }
            }
        }
    }
    if (html !== '') {
        document.querySelector('#to-list').classList.remove('hidden');
        document.querySelector('#to-list').innerHTML = html;
        setListeners()
    }
}

function setListeners() {

    let lis = document.querySelectorAll('.locations-results'),
        input = document.querySelector('#to-location');

    for (let i = 0; i < lis.length; i++) {

        lis[i].onclick = function(e) {
            let target = e.currentTarget,
                html = target.innerHTML,
                coords = {lat: parseFloat(target.dataset.lat), lng: parseFloat(target.dataset.lng)}
            input.value = html;

            document.querySelector('#to-list').classList.add('hidden');
            document.querySelector('#to-list').innerHTML = '';
            completePackaging('to-address', JSON.parse(decodeURIComponent(target.dataset.address)))
            completePackaging('to', coords)
        }
    }
}

function completePackaging(key, value) {

    if (key === 'to') {
        packaging.coords.to.lat = parseFloat(value.lat);
        packaging.coords.to.lng = parseFloat(value.lng);
    } else if (key === 'from') {
        packaging.coords.from.lat = parseFloat(value.lat);
        packaging.coords.from.lng = parseFloat(value.lng);
    } else if (key === 'weight') {
        packaging.weight = parseFloat(value);
    } else if (key === 'pack') {
        packaging.pack = value
    } else if (key === 'to-address') {
        packaging.coords.to.address = value
    }

    if (packaging.coords.to.lat !== null
        && packaging.coords.from.lat !== null
        && packaging.coords.to.address !== null
        && packaging.coords.from.address !== null) {

        packaging.distance = parseFloat((getDistanceFromLatLonInKm(
            packaging.coords.from.lat,
            packaging.coords.from.lng,
            packaging.coords.to.lat,
            packaging.coords.to.lng
        )* 1.417).toFixed(2))
        setMapWithCoords(packaging.coords.from, packaging.coords.to);
    }

    if (packaging.coords.to.lat !== null
        && packaging.coords.from.lat !== null
        && packaging.coords.to.lng !== null
        && packaging.coords.from.lng !== null
        && packaging.coords.to.address !== null
        && packaging.coords.from.address !== null
        && packaging.weight > 0) {

        readyToPack = packaging;

    } else {

        readyToPack = null
    }
}

function setMapWithCoords(from, to) {

    if (!isNaN(to.lat) && !isNaN(to.lng)) {

        let g = [];
        g.push({
            coord: [parseFloat(from.lat), parseFloat(from.lng)],
            popup: from.address
        })
        g.push({
            coord: [parseFloat(to.lat), parseFloat(to.lng)],
            popup: to.address
        })
        let c = [parseFloat(to.lat), parseFloat(to.lng)];
        window.resetMap(c, g);
    }
}

function selectLogDisplay(e, type) {

    let target = e.currentTarget,
        all = document.querySelectorAll('.logs-selector'),
        goods = document.querySelectorAll('.log-good');

    for (let i = 0; i < all.length; i++) {
        all[i].classList.remove('active');
    }
    target.classList.add('active');

    if (type === 'errors') {

        for (let i = 0; i < goods.length; i++) {
            goods[i].classList.add('hidden');
        }

    } else {

        for (let i = 0; i < goods.length; i++) {
            goods[i].classList.remove('hidden');
        }
    }
}

function scrollerLogs() {
    let lastLi = document.querySelector('#logs-list li:last-of-type');
    lastLi.scrollIntoView();
}

function setJsons(json, theme, first = true) {

    let html = (first === true) ? '<ul class="' + theme + ' bg-2 first-ul">' : '<ul>';
    for (const key in json) {

        if (typeof json[key] !== 'object') {
            let val = json[key];
            val = (val === false) ? '<span class="bool"> false</span>' : val;
            val = (val === true) ? '<span class="bool"> true</span>' : val;
            val = (val === null) ? '<span class="null"> null</span>' : val;
            val = (val === '') ? '<span class="empty"> <i>""</i></span>' : val;
            html += '<li data-key="' + key + '"><span>"' + key + '":</span> ' + val + '</li>';
        } else if (Array.isArray(json[key])) {
            let array = json[key];
            html += '<li data-key="' + key + '"><span>"' + key + '":</span>';
            if (array.length > 0) {
                for (let i = 0; i < array.length; i++) {
                    html += setJsons(json[key], theme, false);
                }
            } else {
                html += '<span class="array">[]</span>';
            }
            html += '</li>';
        } else {
            html += '<li data-key="' + key + '"><span>"' + key + '":</span> ' + setJsons(json[key], theme, false) + '</li>';
        }
    }
    html += '</ul>';
    return html;
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}

export default Drag;