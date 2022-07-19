/**
 * This is a namespace that contains documentation elements belonging to the Commons
 * domain.
 *
 * @namespace  Commons
 */

import React from 'react';
import './Aside.css';
import Drag from "../../components/Draggables/Drag";
import { getRole } from "../../Tools/Tools";

/**
 * Create React Aside component.
 * @class
 * @memberOf Commons
 */

class Aside extends React.Component {

    constructor(props) {

        super(props);
        this.theme = props.data.settings.theme;
        this.state = {
            db: props.data,
            classList: props.classList,
            models: null
        }
    }

    displayLeftWindow(ev, id) {

        let elmt = ev.currentTarget,
            onglets = elmt.parentElement.children,
            main = document.querySelector('#main'),
            mainWidth = window.innerWidth - 42,
            all = elmt.closest('aside').querySelectorAll('.drags');

        for (let i = 0; i < onglets.length; i++) {
            onglets[i].classList.remove('selected');
        }

        if (document.querySelector('#' + id).style.display === 'flex') {

            document.querySelector('#' + id).style.display = 'none';
            main.style.width = this.analyseOpenRightSideModals(mainWidth) + 'px';
            main.style.left = 20 + 'px';

        } else {

            for (let i = 0; i < all.length; i++) {
                all[i].style.display = 'none';
            }
            elmt.classList.add('selected');
            document.querySelector('#' + id).style.display = 'flex';
            main.style.width = this.analyseOpenRightSideModals(mainWidth, document.querySelector('#' + id)) + 'px';
            main.style.left = document.querySelector('#' + id).scrollWidth + 20 + 'px';
        }
        return true;
    }

    /**
     * Resize Main content on Sides open / close trigger.
     * @typedef {function}
     * @param {number} mainWidth - Main container original size.
     * @param {object} elmt - HTML triggered element.
     * @returns {number} - Returns Main container final size.
     */

    analyseOpenRightSideModals(mainWidth, elmt = null) {

        let rightDrags = document.querySelectorAll('.rightDrag'),
            oppositSize = 0;

        for (let i = 0; i < rightDrags.length; i++) {
            if (rightDrags[i].style.display === 'flex') {
                let opposit = rightDrags[i];
                oppositSize = opposit.scrollWidth;
            }
        }

        return (elmt !== null) ? mainWidth - elmt.scrollWidth - oppositSize : mainWidth - oppositSize;
    }

    componentDidMount() {

        const ipc = window.require('electron').ipcRenderer;

        ipc.on('openFile', (event, mess) => {

            if (!mess.data.err) {

                console.log('leftside');
            }
        });

        let side = document.querySelector('#left-aside ul'),
            height = 40,
            width = side.scrollWidth - 200;
        side.style.left = '-' + (width + height) + 'px';

        if (this.state.models === null) {
            this.getCustomerModel();
        }
    }

    getCustomerModel = () => {

        const ipc = window.require('electron').ipcRenderer;

        ipc.once('getCustomerModels.reply',  (event, jsons) => {

            this.setState({models: jsons})

            localStorage.setItem('models', JSON.stringify({
                'fixed': jsons.data[0].content,
                'traveler': jsons.data[1].content
            }))

            setTimeout(() => {
                window.initDraggableContainers();
                window.resizeMainContentOnWindowResize();

                let centers = this.state.db.operational_centers,
                    group = [];

                for (let i = 0; i < centers.length; i++) {
                    group.push({
                        coord: [parseFloat(centers[i].lat), parseFloat(centers[i].lng)],
                        popup: centers[i].name
                    })
                }

                window.setMap([44.83968, -0.57804], group, []);
            }, 500)
        });
        ipc.send('getCustomerModels');
    }

    render() {

        return (
            <aside id="left-aside" className={this.theme + ' ' + this.state.classList}>
                <div className='flex column'>
                    <ul className='flex'>
                    {getRole(this.state.db.user, ['octeus', 'operator']) === true
                        ? <>
                            <li className='flex w-max left-windows hover' onClick={(ev) => this.displayLeftWindow(ev, 'leftDrag-3')} data-title='Delivery process' aria-label='Delivery process'>
                                <svg className="gold befores" viewBox="0 0 24 24">
                                    <path d="M18 18.516q0.656 0 1.078-0.445t0.422-1.055-0.422-1.055-1.078-0.445-1.078 0.445-0.422 1.055 0.422 1.055 1.078 0.445zM19.5 9.516h-2.484v2.484h4.453zM6 18.516q0.656 0 1.078-0.445t0.422-1.055-0.422-1.055-1.078-0.445-1.078 0.445-0.422 1.055 0.422 1.055 1.078 0.445zM20.016 8.016l3 3.984v5.016h-2.016q0 1.219-0.891 2.109t-2.109 0.891-2.109-0.891-0.891-2.109h-6q0 1.219-0.891 2.109t-2.109 0.891-2.109-0.891-0.891-2.109h-2.016v-11.016q0-0.797 0.609-1.406t1.406-0.609h14.016v4.031h3z"></path>
                                </svg>
                                <span>Delivery</span>
                            </li>

                            <li className='flex w-max left-windows hover' onClick={(ev) => this.displayLeftWindow(ev, 'leftDrag-2')} data-title='Customer informations' aria-label='Customer informations'>
                                <svg className="blue befores" viewBox="0 0 24 24">
                                    <path d="M18 18.984v-1.406q0-1.359-2.063-2.227t-3.938-0.867-3.938 0.867-2.063 2.227v1.406h12zM12 6.984q-1.219 0-2.109 0.891t-0.891 2.109 0.891 2.109 2.109 0.891 2.109-0.891 0.891-2.109-0.891-2.109-2.109-0.891zM12 3q-0.422 0-0.703 0.281t-0.281 0.703 0.281 0.727 0.703 0.305 0.703-0.305 0.281-0.727-0.281-0.703-0.703-0.281zM18.984 3q0.797 0 1.406 0.609t0.609 1.406v13.969q0 0.797-0.609 1.406t-1.406 0.609h-13.969q-0.797 0-1.406-0.609t-0.609-1.406v-13.969q0-0.797 0.609-1.406t1.406-0.609h4.172q0.328-0.891 1.078-1.453t1.734-0.563 1.734 0.563 1.078 1.453h4.172z"></path>
                                </svg>
                                <span>Customer</span>
                            </li>

                            <li className='flex w-max left-windows hover' onClick={(ev) => this.displayLeftWindow(ev, 'leftDrag-1')} data-title='Data models' aria-label='Data models'>
                                <svg className="green befores" viewBox="0 0 24 24">
                                    <path d="M21 14.016v-10.031h-18v10.031h18zM21 2.016q0.797 0 1.406 0.586t0.609 1.383v12q0 0.797-0.609 1.406t-1.406 0.609h-6.984l1.969 3v0.984h-7.969v-0.984l1.969-3h-6.984q-0.797 0-1.406-0.609t-0.609-1.406v-12q0-0.797 0.609-1.383t1.406-0.586h18z"></path>
                                </svg>
                                <span>Models</span>
                            </li>
                        </>
                        : <>
                            <li className='flex w-max left-windows forbidden' data-title='No Access' aria-label='No Access'>
                                <svg className="grey befores" viewBox="0 0 24 24">
                                    <path d="M18 18.516q0.656 0 1.078-0.445t0.422-1.055-0.422-1.055-1.078-0.445-1.078 0.445-0.422 1.055 0.422 1.055 1.078 0.445zM19.5 9.516h-2.484v2.484h4.453zM6 18.516q0.656 0 1.078-0.445t0.422-1.055-0.422-1.055-1.078-0.445-1.078 0.445-0.422 1.055 0.422 1.055 1.078 0.445zM20.016 8.016l3 3.984v5.016h-2.016q0 1.219-0.891 2.109t-2.109 0.891-2.109-0.891-0.891-2.109h-6q0 1.219-0.891 2.109t-2.109 0.891-2.109-0.891-0.891-2.109h-2.016v-11.016q0-0.797 0.609-1.406t1.406-0.609h14.016v4.031h3z"></path>
                                </svg>
                                <span>Delivery</span>
                            </li>

                            <li className='flex w-max left-windows forbidden' data-title='No Access' aria-label='No Access'>
                                <svg className="grey befores" viewBox="0 0 24 24">
                                    <path d="M18 18.984v-1.406q0-1.359-2.063-2.227t-3.938-0.867-3.938 0.867-2.063 2.227v1.406h12zM12 6.984q-1.219 0-2.109 0.891t-0.891 2.109 0.891 2.109 2.109 0.891 2.109-0.891 0.891-2.109-0.891-2.109-2.109-0.891zM12 3q-0.422 0-0.703 0.281t-0.281 0.703 0.281 0.727 0.703 0.305 0.703-0.305 0.281-0.727-0.281-0.703-0.703-0.281zM18.984 3q0.797 0 1.406 0.609t0.609 1.406v13.969q0 0.797-0.609 1.406t-1.406 0.609h-13.969q-0.797 0-1.406-0.609t-0.609-1.406v-13.969q0-0.797 0.609-1.406t1.406-0.609h4.172q0.328-0.891 1.078-1.453t1.734-0.563 1.734 0.563 1.078 1.453h4.172z"></path>
                                </svg>
                                <span>Customer</span>
                            </li>

                            <li className='flex w-max left-windows forbidden' data-title='No Access' aria-label='No Access'>
                                <svg className="grey befores" viewBox="0 0 24 24">
                                    <path d="M21 14.016v-10.031h-18v10.031h18zM21 2.016q0.797 0 1.406 0.586t0.609 1.383v12q0 0.797-0.609 1.406t-1.406 0.609h-6.984l1.969 3v0.984h-7.969v-0.984l1.969-3h-6.984q-0.797 0-1.406-0.609t-0.609-1.406v-12q0-0.797 0.609-1.383t1.406-0.586h18z"></path>
                                </svg>
                                <span>Models</span>
                            </li>
                        </>
                    }
                    </ul>
                    <Drag theme={this.theme} data={this.state.db} type='leftDrag-3' mode='left' job='Providers'/>
                    <Drag theme={this.theme} data={this.state.db} type='leftDrag-2' mode='left' job='Customer'/>
                    <Drag theme={this.theme} data={this.state.db} type='leftDrag-1' mode='left' job='Project' models={this.state.models} getCustomerModel={this.getCustomerModel}/>
                </div>
            </aside>
        );
    }
}

export default Aside;
