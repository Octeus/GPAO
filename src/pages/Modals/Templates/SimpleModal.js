import React from "react";
import Calculator from "./Calculator/Calculator";
import Emails from "./Emails/Emails";
import PhoneNumbers from "./PhoneNumbers/PhoneNumbers";
import Print from "./Print/Print";
import Search from "./Search/Search";
import Statistics from "./Statistics/Statistics";
import User from "./User/User";
import ImplementData from "./ImplementData/ImplementData";
import CompileData from "./CompileData/CompileData";
import PrepareUpdate from "./PrepareUpdate/PrepareUpdate";

class SimpleModal extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
            db : props.data,
            classList: props.classList,
            getModal: props.getModal,
            content: props.content,
            id: props.id
        }
    }

    html = () => {
        if (this.state.content === 'Emails sender') {
            return (
                <Emails data={this.state.db} classList={this.state.classList}/>
            );

        } else if (this.state.content === 'Phone numbers') {
            return (
                <PhoneNumbers data={this.state.db} classList={this.state.classList}/>
            );

        } else if (this.state.content === 'Statistics') {
            return (
                <Statistics data={this.state.db} classList={this.state.classList}/>
            );

        } else if (this.state.content === 'Calculator') {
            return (
                <Calculator data={this.state.db} classList={this.state.classList}/>
            );

        } else if (this.state.content === 'Print') {
            return (
                <Print data={this.state.db} classList={this.state.classList}/>
            );

        } else if (this.state.content === 'Search') {
            return (
                <Search data={this.state.db} classList={this.state.classList}/>
            );

        } else if (this.state.content === 'User account') {
            return (
                <User data={this.state.db} classList={this.state.classList}/>
            );

        } else if (this.state.content === 'ImplementData') {
            return (
                <ImplementData data={this.state.db} classList={this.state.classList}/>
            );

        } else if (this.state.content === 'Compile data') {
            return (
                <CompileData data={this.state.db} getModal={this.state.getModal} classList={this.state.classList}/>
            );

        } else if (this.state.content === 'Prepare update') {
            return (
                <PrepareUpdate data={this.state.db} getModal={this.state.getModal} classList={this.state.classList}/>
            );
        }
    }

    svg = () => {

        if (this.state.content === 'Emails sender') {
            return (
                <>
                    <svg className="header-icons gold" viewBox="0 0 20 20">
                        <path d="M18.64 2.634c-0.344 0.121-17.321 6.104-17.656 6.222-0.284 0.1-0.347 0.345-0.010 0.479 0.401 0.161 3.796 1.521 3.796 1.521v0l2.25 0.901c0 0 10.838-7.958 10.984-8.066 0.148-0.108 0.318 0.095 0.211 0.211s-7.871 8.513-7.871 8.513v0.002l-0.452 0.503 0.599 0.322c0 0 4.65 2.504 4.982 2.682 0.291 0.156 0.668 0.027 0.752-0.334 0.099-0.426 2.845-12.261 2.906-12.525 0.079-0.343-0.148-0.552-0.491-0.431zM7 17.162c0 0.246 0.139 0.315 0.331 0.141 0.251-0.229 2.85-2.561 2.85-2.561l-3.181-1.644v4.064z"></path>
                    </svg>
                </>
            );

        } else if (this.state.content === 'Phone numbers') {
            return (
                <>
                    <svg className="header-icons red" viewBox="0 0 20 20">
                        <path d="M17.256 12.253c-0.096-0.667-0.611-1.187-1.274-1.342-2.577-0.604-3.223-2.088-3.332-3.734-0.457-0.085-1.27-0.177-2.65-0.177s-2.193 0.092-2.65 0.177c-0.109 1.646-0.755 3.13-3.332 3.734-0.663 0.156-1.178 0.675-1.274 1.342l-0.497 3.442c-0.175 1.212 0.715 2.305 1.953 2.305h11.6c1.237 0 2.128-1.093 1.953-2.305l-0.497-3.442zM10 15.492c-1.395 0-2.526-1.12-2.526-2.5s1.131-2.5 2.526-2.5 2.526 1.12 2.526 2.5-1.132 2.5-2.526 2.5zM19.95 6c-0.024-1.5-3.842-3.999-9.95-4-6.109 0.001-9.927 2.5-9.95 4s0.021 3.452 2.535 3.127c2.941-0.381 2.76-1.408 2.76-2.876 0-1.024 2.392-1.271 4.655-1.271s4.654 0.247 4.655 1.271c0 1.468-0.181 2.495 2.76 2.876 2.513 0.325 2.558-1.627 2.535-3.127z"></path>
                    </svg>
                </>
            );

        } else if (this.state.content === 'Statistics') {
            return (
                <>
                    <svg className="header-icons orange" viewBox="0 0 20 20">
                        <path d="M0.69 11.331l1.363 0.338 1.026-1.611-1.95-0.482c-0.488-0.121-0.981 0.174-1.102 0.66-0.121 0.483 0.175 0.973 0.663 1.095zM18.481 11.592l-4.463 4.016-5.247-4.061c-0.1-0.076-0.215-0.133-0.338-0.162l-0.698-0.174-1.027 1.611 1.1 0.273 5.697 4.408c0.166 0.127 0.362 0.189 0.559 0.189 0.219 0 0.438-0.078 0.609-0.232l5.028-4.527c0.372-0.334 0.401-0.906 0.064-1.277s-0.911-0.4-1.284-0.064zM8.684 7.18l4.887 3.129c0.413 0.264 0.961 0.154 1.24-0.246l5.027-7.242c0.286-0.412 0.183-0.977-0.231-1.26-0.414-0.285-0.979-0.182-1.265 0.23l-4.528 6.521-4.916-3.147c-0.204-0.131-0.451-0.174-0.688-0.123-0.236 0.053-0.442 0.197-0.571 0.4l-7.497 11.767c-0.27 0.422-0.144 0.983 0.28 1.25 0.15 0.096 0.319 0.141 0.486 0.141 0.301 0 0.596-0.149 0.768-0.42l7.008-11z"></path>
                    </svg>
                </>
            );

        } else if (this.state.content === 'Calculator') {
            return (
                <>
                    <svg className="header-icons green" viewBox="0 0 20 20">
                        <path d="M14.6 1h-9.202c-0.769 0-1.398 0.629-1.398 1.4v15.2c0 0.77 0.629 1.4 1.398 1.4h9.202c0.769 0 1.4-0.631 1.4-1.4v-15.2c0-0.771-0.631-1.4-1.4-1.4zM7 12c0.689 0 1.25 0.447 1.25 1s-0.561 1-1.25 1c-0.69 0-1.25-0.447-1.25-1s0.56-1 1.25-1zM5.75 10c0-0.553 0.56-1 1.25-1s1.25 0.447 1.25 1-0.561 1-1.25 1c-0.69 0-1.25-0.447-1.25-1zM7 15c0.689 0 1.25 0.447 1.25 1s-0.561 1-1.25 1c-0.69 0-1.25-0.447-1.25-1s0.56-1 1.25-1zM10 12c0.689 0 1.25 0.447 1.25 1s-0.561 1-1.25 1c-0.69 0-1.25-0.447-1.25-1s0.56-1 1.25-1zM8.75 10c0-0.553 0.56-1 1.25-1s1.25 0.447 1.25 1-0.561 1-1.25 1c-0.69 0-1.25-0.447-1.25-1zM10 15c0.689 0 1.25 0.447 1.25 1s-0.561 1-1.25 1c-0.69 0-1.25-0.447-1.25-1s0.56-1 1.25-1zM13 12c0.689 0 1.25 0.447 1.25 1s-0.561 1-1.25 1c-0.69 0-1.25-0.447-1.25-1s0.56-1 1.25-1zM11.75 10c0-0.553 0.56-1 1.25-1s1.25 0.447 1.25 1-0.561 1-1.25 1c-0.69 0-1.25-0.447-1.25-1zM13 15c0.689 0 1.25 0.447 1.25 1s-0.561 1-1.25 1c-0.69 0-1.25-0.447-1.25-1s0.56-1 1.25-1zM5 7v-3h10v3h-10z"></path>
                    </svg>
                </>
            );

        } else if (this.state.content === 'Print') {
            return (
                <>
                    <svg className="header-icons blue" viewBox="0 0 24 24">
                        <path d="M18 3v3.984h-12v-3.984h12zM18.984 12q0.422 0 0.727-0.281t0.305-0.703-0.305-0.727-0.727-0.305-0.703 0.305-0.281 0.727 0.281 0.703 0.703 0.281zM15.984 18.984v-4.969h-7.969v4.969h7.969zM18.984 8.016q1.219 0 2.109 0.891t0.891 2.109v6h-3.984v3.984h-12v-3.984h-3.984v-6q0-1.219 0.891-2.109t2.109-0.891h13.969z"></path>
                    </svg>
                </>
            );

        } else if (this.state.content === 'Search') {
            return (
                <>
                    <svg className="header-icons gold" viewBox="0 0 24 24">
                        <path d="M9.516 14.016q1.875 0 3.188-1.313t1.313-3.188-1.313-3.188-3.188-1.313-3.188 1.313-1.313 3.188 1.313 3.188 3.188 1.313zM15.516 14.016l4.969 4.969-1.5 1.5-4.969-4.969v-0.797l-0.281-0.281q-1.781 1.547-4.219 1.547-2.719 0-4.617-1.875t-1.898-4.594 1.898-4.617 4.617-1.898 4.594 1.898 1.875 4.617q0 0.984-0.469 2.227t-1.078 1.992l0.281 0.281h0.797z"></path>
                    </svg>
                </>
            );

        } else if (this.state.content === 'User account') {
            return (
                <>
                    <svg className="header-icons orange" viewBox="0 0 24 24">
                        <path d="M12 14.016q2.531 0 5.273 1.102t2.742 2.883v2.016h-16.031v-2.016q0-1.781 2.742-2.883t5.273-1.102zM12 12q-1.641 0-2.813-1.172t-1.172-2.813 1.172-2.836 2.813-1.195 2.813 1.195 1.172 2.836-1.172 2.813-2.813 1.172z"></path>
                    </svg>
                </>
            );

        } else if (this.state.content === 'ImplementData') {
            return (
                <>
                    <svg className="header-icons green" viewBox="0 0 32 32">
                        <path d="M7.903 7.023c0 0.55 0 1.993 0 1.993h14.014c0 0 0-1.443 0-1.993s-0.445-0.997-0.996-0.997h-2.99c0 0 0.034-1.138 0.034-2.882 0-1.619-1.404-3.098-3.086-3.098s-2.978 1.406-2.978 3.089c0 1.619-0.012 2.891-0.012 2.891h-2.989c-0.551 0-0.997 0.446-0.997 0.997zM14.879 3.037c0.55 0 0.997 0.446 0.997 0.996 0 0.551-0.447 0.997-0.997 0.997s-0.997-0.446-0.997-0.997c0-0.55 0.447-0.996 0.997-0.996zM23.911 6.026v9.901c0 0 0.86-0.949 1.992-1.404v-9.493c0-1.101-0.955-1.993-2.055-1.993h-4.921v1.993h3.986c0.551 0 0.998 0.446 0.998 0.996zM12.823 30.006h-5.917c-0.55 0-0.996-0.445-0.996-0.996v-22.984c0-0.55 0.446-0.996 0.996-0.996h4.049v-1.993h-5.045c-1.101 0-1.993 0.893-1.993 1.993v24.976c0 1.101 0.892 1.994 1.993 1.994h9.081c-0.39-0.658-1.087-1.418-2.168-1.994zM23.911 29.010c0 0.551-0.447 0.996-0.997 0.996h-2.729c-0.502 0.672-0.975 1.34-1.41 1.994h5.074c1.1 0 2.055-0.893 2.055-1.994v-6.129c-0.66 0.543-1.328 1.156-1.992 1.83v3.303zM28.083 20.926c-1.123-2.496-0.48-4.523-0.32-6.863-6.579 3.275-10.751 13.103-10.751 13.103l-2.567-4.836-5.295 3.119c2.247 0.779 5.456 3.275 8.184 6.551 1.924-3.432 7.861-10.449 10.749-11.074z"></path>
                    </svg>
                </>
            );

        } else if (this.state.content === 'Compile data') {
            return (
                <>
                    <svg className="header-icons gold" viewBox="0 0 32 32">
                        <path d="M25.995 19.068h-1.324c-0.215 0.779-0.523 1.518-0.918 2.203l1.224 1.223c0.783 0.783 0.783 2.053 0 2.836l-0.709 0.709c-0.783 0.783-2.053 0.783-2.836 0l-1.232-1.231c-0.683 0.389-1.419 0.692-2.194 0.903v1.284c0 1.107-0.897 2.005-2.005 2.005h-1.002c-1.107 0-2.006-0.897-2.006-2.005v-1.284c-0.774-0.211-1.511-0.515-2.194-0.903l-1.231 1.231c-0.782 0.783-2.052 0.783-2.835 0l-0.71-0.709c-0.783-0.783-0.783-2.053 0-2.836l1.224-1.223c-0.395-0.686-0.703-1.424-0.919-2.203h-1.323c-1.108 0-2.005-0.897-2.005-2.004v-1.003c0-1.107 0.897-2.005 2.005-2.005h1.308c0.207-0.771 0.503-1.505 0.887-2.186l-1.177-1.176c-0.783-0.783-0.783-2.053 0-2.836l0.709-0.708c0.783-0.783 2.053-0.783 2.835 0l1.153 1.153c0.706-0.411 1.468-0.731 2.272-0.95v-1.348c0.001-1.108 0.9-2.005 2.007-2.005h1.002c1.107 0 2.005 0.897 2.005 2.005v1.347c0.806 0.22 1.567 0.54 2.272 0.951l1.153-1.153c0.783-0.783 2.053-0.783 2.836 0l0.709 0.708c0.783 0.783 0.783 2.053 0 2.836l-1.176 1.176c0.384 0.681 0.68 1.415 0.888 2.187h1.308c1.107 0 2.005 0.898 2.005 2.005v1.003c-0.001 1.106-0.898 2.003-2.006 2.003zM15.5 11.080c-3.045 0-5.514 2.469-5.514 5.514s2.469 5.514 5.514 5.514 5.514-2.469 5.514-5.514-2.469-5.514-5.514-5.514zM15.5 19.037c-1.384 0-2.507-1.121-2.507-2.506 0-1.384 1.123-2.506 2.507-2.506s2.506 1.122 2.506 2.506c0 1.385-1.122 2.506-2.506 2.506z"></path>
                    </svg>
                </>
            );

        } else if (this.state.content === 'Prepare update') {
            return (
                <>
                    <svg className="header-icons orange" viewBox="0 0 32 32">
                        <path d="M7.929 15.586l6.364-6.364 3.203 3.203c-0.266 0.557-0.174 1.241 0.288 1.702 0.461 0.462 1.146 0.554 1.702 0.289l3.291 3.291-6.363 6.364-8.485-8.485zM19.905 12.006c-0.461-0.461-1.146-0.554-1.702-0.288l-3.203-3.203 4.949-4.949c0.781-0.781 2.048-0.781 2.828 0l5.658 5.656c0.78 0.781 0.78 2.048 0 2.828l-4.95 4.95-3.292-3.291c0.266-0.558 0.174-1.242-0.288-1.703zM8.636 29.021l-5.657-5.656 5.657-5.657 5.657 5.657-5.657 5.656zM7.266 23.319l-1.414-1.414-1.459 1.459 1.415 1.414 1.458-1.459zM10.094 26.148l-1.414-1.414-1.458 1.458 1.414 1.414 1.458-1.458z"></path>
                    </svg>
                </>
            );
        }
    }

    dragElement(elmt) {

        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (elmt.querySelector('.modal-title')) {
            elmt.querySelector('.modal-title').onmousedown = dragMouseDown;
        } else {
            elmt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {

            e = e || window.event;
            e.preventDefault();

            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;

            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {

            e = e || window.event;
            e.preventDefault();

            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            elmt.children[0].style.top = (elmt.children[0].offsetTop - pos2) + "px";
            elmt.children[0].style.left = (elmt.children[0].offsetLeft - pos1) + "px";
        }

        function closeDragElement() {

            document.onmouseup = null;
            document.onmousemove = null;
        }
    }


    componentDidMount() {

        let modal = document.querySelector('.modal-SimpleModal'),
            width = modal.scrollWidth,
            height = modal.scrollHeight;
        modal.style.top = 'calc(50vh - ' + (height/2) + 'px)';
        modal.style.left = 'calc(50vw - ' + (width/2) + 'px)';
        this.dragElement(modal);

        document.onkeyup = (e) => {
            if (e.code === 'Escape') {
                let closeModal = document.querySelector('#close-modal');
                if (closeModal) {
                    closeModal.click();
                }
            }
        }
    }

    render() {

        return (
            <div id={this.state.id} className={this.state.classList + ' modal-' + this.state.content.replaceAll(' ', '-').toLowerCase()}>
                <div className={this.state.db.settings.theme + ' bg color modal-title'}>
                    <h3 className='flex jc-start items-center'>
                        {this.svg()}
                        {(this.state.content === 'ImplementData') ? 'Implement Data' : this.state.content}
                    </h3>
                    {(this.state.content !== 'Compile data' && this.state.content !== 'Prepare update') &&
                        <span id='close-modal' className='hover headerSoloIcon flex center' onClick={(e) => this.state.getModal('none', null)}>
                            <svg className='red header-icons' viewBox="0 0 24 24">
                                <path d="M18.984 6.422l-5.578 5.578 5.578 5.578-1.406 1.406-5.578-5.578-5.578 5.578-1.406-1.406 5.578-5.578-5.578-5.578 1.406-1.406 5.578 5.578 5.578-5.578z"></path>
                            </svg>
                        </span>
                    }
                </div>
                <div className={this.state.db.settings.theme + ' bg-2 color flex column modal-content'} id={this.state.content.replaceAll(' ', '-').toLowerCase()}>
                    {this.html()}
                </div>
            </div>
        );
    }
}

export default SimpleModal;