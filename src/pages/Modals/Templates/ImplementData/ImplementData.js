import React from "react";
import './ImplementData.css';
import { mapper, required } from '../../../../Tools/Mapper';

class ImplementData extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            db: props.data,
            mode: props.data.mode,
            html: ''
        }
    }

    componentDidMount() {
        this.checkStatement();
    }

    checkStatement = () => {

        let map = mapper(),
            fixed = map.fixed,
            traveler = map.traveler,
            treatmentsModel = JSON.parse(localStorage.getItem('treatments')),
            examsModel = JSON.parse(localStorage.getItem('exams')),
            customer = JSON.parse(localStorage.getItem('customer')),
            user = JSON.parse(localStorage.getItem('user')),
            excepts = ['ice', 'doctor', 'health', 'exams', 'treatments', 'notes', 'travels', 'certificate'],
            exams = document.querySelectorAll('.exams-list-item'),
            treatments = document.querySelectorAll('.treatments-list-item')
        customer.fixed.product = 'card'

        for (const fixedKey in fixed) {
            if (fixedKey !== 'product' && fixedKey !== 'puk') {
                if (!document.querySelector(fixed[fixedKey]).classList.contains('not-validated')) {
                    customer.fixed[fixedKey] = document.querySelector(fixed[fixedKey]).value
                }
            }
        }

        for (const travelerKey in traveler) {
            if (!excepts.includes(travelerKey) && typeof traveler[travelerKey] === 'string' && traveler[travelerKey].length > 0) {
                let elmt = document.querySelector(traveler[travelerKey]);
                if (elmt && !elmt.classList.contains('not-validated')) {
                    customer.traveler[travelerKey] = elmt.value
                }
            }
        }

        for (const iceKey in traveler.ice) {
            for (const key in traveler.ice[iceKey]) {

                let elmt = document.querySelector(traveler.ice[iceKey][key]);
                if (elmt && !elmt.classList.contains('not-validated')) {
                    customer.traveler.ice[iceKey][key] = elmt.value
                }
            }
        }

        for (const docKey in traveler.doctor) {
            for (const key in traveler.doctor[docKey]) {

                let elmt = document.querySelector(traveler.doctor[docKey][key]);
                if (elmt && !elmt.classList.contains('not-validated')) {
                    customer.traveler.doctor[docKey][key] = elmt.value
                }
            }
        }

        for (const healthKey in traveler.health) {
            let elmt;
            if (healthKey === 'antecedents' || healthKey === 'allergies') {
                for (const subKey in traveler.health[healthKey]) {
                    elmt = document.querySelector(traveler.health[healthKey][subKey]);
                    if (elmt && !elmt.classList.contains('not-validated')) {
                        customer.traveler.health[healthKey][subKey] = elmt.value
                    }
                }
            } else {
                elmt = document.querySelector(traveler.health[healthKey]);
                if (elmt && !elmt.classList.contains('not-validated')) {
                    customer.traveler.health[healthKey] = elmt.value
                }
            }
        }

        for (let i = 0; i < exams.length; i++) {
            let exam = mapper(i)['traveler']['exams'][0],
                item = examsModel[0],
                stack = {},
                elmt;

            for (const itemKey in item) {
                if (itemKey !== 'documents') {
                    elmt = document.querySelector(exam[itemKey]);
                    if (elmt && !elmt.classList.contains('not-validated')) {
                        stack[itemKey] = elmt.value;
                    }
                } else {
                    let videos = document.querySelectorAll(exam[itemKey]['video']),
                        pdfs = document.querySelectorAll(exam[itemKey]['pdf']),
                        dicoms = document.querySelectorAll(exam[itemKey]['dicom'])

                    stack.documents = {'video': [], 'pdf': [], 'dicom': []};

                    for (let j = 0; j < videos.length; j++) {
                        let fileLi = videos[j];
                        stack[itemKey]['video'].push(fileLi.dataset.path)
                    }

                    for (let j = 0; j < pdfs.length; j++) {
                        let fileLi = pdfs[j];
                        stack[itemKey]['pdf'].push(fileLi.dataset.path)
                    }

                    for (let j = 0; j < dicoms.length; j++) {
                        let fileLi = dicoms[j];
                        stack[itemKey]['dicom'].push(fileLi.dataset.path)
                    }
                }
            }
            customer.traveler.exams.push(stack)
        }

        for (let i = 0; i < treatments.length; i++) {
            let treatment = mapper(i)['traveler']['treatments'][0],
                item = treatmentsModel[0],
                stack = {},
                elmt;
            for (const itemKey in item) {
                if (itemKey !== 'documents' && itemKey !== 'drugs') {
                    elmt = document.querySelector(treatment[itemKey]);
                    if (elmt && !elmt.classList.contains('not-validated')) {
                        stack[itemKey] = elmt.value;
                    }
                } else if (itemKey === 'drugs') {
                    let drugs = document.querySelectorAll('.customer-form[data-key="treatments"] .sub-contents[data-child="' + i + '"] .drug-list-item');
                    stack[itemKey] = [];
                    for (let j = 0; j < drugs.length; j++) {
                        let json = {};
                        json.usual_name = drugs[j].querySelector('.customer-form-input[name="usual_name"]').value;
                        json.dci = drugs[j].querySelector('.customer-form-input[name="dci"]').value;
                        json.dosage = drugs[j].querySelector('.customer-form-input[name="dosage"]').value;
                        stack[itemKey].push(json);
                    }
                } else {
                    let pdfs = document.querySelectorAll(treatment[itemKey]['pdf']);
                    stack.documents = {'pdf': []};

                    for (let j = 0; j < pdfs.length; j++) {
                        let fileLi = pdfs[j];
                        stack[itemKey]['pdf'].push(fileLi.dataset.path)
                    }
                }
            }
            customer.traveler.treatments.push(stack)
        }

        let checks = required(customer),
            settedDevice = (localStorage.key('selectedDevice'))
                ? JSON.parse(localStorage.getItem('selectedDevice'))
                : null,
            html = '<ul class="required-fields-ok"><li>All is ok.<br>Ready to ' + this.state.mode + ' Card</li></ul>';

        if (checks.length < 1) {

            if (settedDevice === null) {

                html = '<p class="required-title">You must choose a device in the available devices list before continue.</p>';

            } else {

                customer.traveler.certificate = {
                    "firstname": user.prenom,
                    "lastname": user.nom,
                    "organisation": user.fonction
                }

                html += '<div class="buttons"><button type="button" class="' + this.state.db.settings.theme + ' bg-2 color prepare-card" onclick="prepareCard(\'' + this.state.db.settings.theme + '\')">' + this.state.mode + ' Card</button></div>';
                customer.fixed.puk = (customer.fixed.puk.length < 1 && customer.traveler.activate === false)
                    ? this.getPuk(customer.fixed)
                    : customer.fixed.puk;

                localStorage.setItem('ready', JSON.stringify(customer));
            }

        } else {

            html = '<p class="required-title">These fields are required / bad fomated :</p><ul class="required-fields-nok"><li>' + checks.join('</li><li>') + '</li></ul>';
        }

        this.setState({html: html})
    }

    getPuk = (fixed) => {
        let penta = [
            fixed.firstname.slice(0,2),
            fixed.sex,
            fixed.birthdate.replaceAll('-', ''),
            fixed.lastname.slice(0,3)
        ];

        penta = penta.join('').toLowerCase();
        penta = penta.split('');
        penta = penta.sort((a, b) => 0.5 - Math.random());
        penta = penta.join('').toUpperCase();

        return penta;
    }

    ascii_to_hexa = (str) => {
        let arr1 = [];
        for (let i = 0; i < str.length; i ++) {
            let hex = Number(str.charCodeAt(i)).toString(16);
            arr1.push(hex);
        }
        return arr1.join('');
    }

    render() {

        return(
            <div
                id='devices-container'
            >
                <div
                    className={this.state.db.settings.theme + ' bg required-container'}
                    dangerouslySetInnerHTML={{__html: this.state.html}}
                />
            </div>
        );
    }
}

export default ImplementData;