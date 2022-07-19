// Node
import React from 'react';
import ReactDOM from 'react-dom';
// App performance
import reportWebVitals from './reportWebVitals';
// Common modules
import Aside from "./common/Aside/Aside";
import RightAside from "./common/RightAside/RightAside";
import Header from "./common/Header/Header";
import Footer from "./common/Footer/Footer";
// Pages
import Main from './pages/Main/Main';
import Modal from './pages/Modals/Modal';
import Default from "./pages/Default/Default";
// Jsons
import Todo from '../src/pages/Modals/Templates/todo.json';
import NewProject from "./pages/Modals/Templates/NewProject";


const view = document.body.dataset.view;
const modal = document.body.dataset.modal;

if (view) {

    const ipc = window.require('electron').ipcRenderer;
    const dbModel = {
        'settings': 'settings',
        'user': 'user',
        'admins': 'admins',
        'legals': 'legals',
        'cards': 'cards',
        'operational_centers': 'operational_centers',
        'prints': 'prints',
        'patients': 'patients'
    };

    ipc.on('actionReply', function (event, mess) {

        /**
         * Create React App component.
         * @class App
         * @returns {string} - Returns the compiled React component
         */

        class App extends React.Component {

            /**
             * Append scripts after React mounting. Here is append utils.js which is the Gate between Electron and React
             * @method
             * @returns {void}
             */

            componentDidMount() {

                if (!document.querySelector('#localhost-main')) {
                    let scripts = (document.body.dataset.view !== 'newProject')
                        ? [
                            "./assets/js/modals.js",
                            "./assets/js/terminal.js",
                            "./assets/js/draggables.js",
                            "./assets/js/utils.js"
                        ]

                        : [
                            "./assets/js/modals.js",
                            "./assets/js/utils.js"
                        ];

                    for (let i = 0; i < scripts.length; i++) {

                        let script = scripts[i],
                            elmt = document.createElement("script");
                        elmt.src = script;
                        elmt.className = 'scripts'
                        document.body.appendChild(elmt);
                    }
                }

                setTimeout(() => {

                    let leftWins = mess.settings.windows.left;
                    if (leftWins !== null && document.querySelector('[aria-label="' + leftWins + '"]')) {
                        document.querySelector('[aria-label="' + leftWins + '"]').click();
                    }

                    let rightWins = mess.settings.windows.right;
                    if (rightWins !== null && document.querySelector('[aria-label="' + rightWins + '"]')) {
                        document.querySelector('[aria-label="' + rightWins + '"]').click();
                    }

                    let bottomWins = mess.settings.windows.bottom;
                    if (bottomWins !== null && document.querySelector('[aria-label="' + bottomWins + '"]')) {
                        document.querySelector('[aria-label="' + bottomWins + '"]').click();
                    }

                }, 1000);
            }

            /**
             * Render method.
             * @method
             * @returns {object} - Returns the compiled React component
             */

            render() {

                let db = mess,
                    mode = document.body.dataset.action;
                db.mode = mode;
                db.todo = Todo[mode];
                db.projects = db.patients;

                for (const dbKey in db) {
                    localStorage.setItem(dbKey, JSON.stringify(db[dbKey]));
                }

                localStorage.setItem('fixed', JSON.stringify({
                    "firstname":"",
                    "lastname": "",
                    "use_name": "",
                    "sex": "M",
                    "email": "",
                    "birthdate": "",
                    "nationality": "",
                    "country": "",
                    "native_country": "",
                    "native_city": ""
                }));
                localStorage.setItem('traveler', JSON.stringify({
                    "language": "",
                    "avatar": false,
                    "address_1": "",
                    "address_2": "",
                    "address_3": "",
                    "zip_code": "",
                    "city": "",
                    "country": "",
                    "blood_group": "",
                    "weight": "",
                    "height": "",
                    "bmi": "",
                    "handicap": false,
                    "phone_prefix": "",
                    "phone": "",
                    "mobile_prefix": "",
                    "mobile": "",
                    "state": "",
                    "children": 0,
                    "family_situation": ""
                }));
                localStorage.setItem('ice', JSON.stringify({
                    "trusted_third_party": {
                        "lastname": "",
                        "firstname": "",
                        "phone_prefix": "",
                        "phone": "",
                        "mobile_prefix": "",
                        "mobile": "",
                        "email": ""
                    },
                    "ice1": {
                        "lastname": "",
                        "firstname": "",
                        "relationship": "",
                        "phone_prefix": "",
                        "phone": "",
                        "mobile_prefix": "",
                        "mobile": "",
                        "email": ""
                    },
                    "ice2": {
                        "lastname": "",
                        "firstname": "",
                        "relationship": "",
                        "phone_prefix": "",
                        "phone": "",
                        "mobile_prefix": "",
                        "mobile": "",
                        "email": ""
                    },
                    "local1": {
                        "organization": "",
                        "contact_lastname": "",
                        "contact_firstname": "",
                        "phone_prefix": "",
                        "phone": "",
                        "mobile_prefix": "",
                        "mobile": "",
                        "email": "",
                        "validity_date": "",
                        "information": ""
                    },
                    "local2": {
                        "organization": "",
                        "contact_lastname": "",
                        "contact_firstname": "",
                        "phone_prefix": "",
                        "phone": "",
                        "mobile_prefix": "",
                        "mobile": "",
                        "email": "",
                        "validity_date": "",
                        "information": ""
                    },
                    "doctor": {
                        "lastname": "",
                        "firstname": "",
                        "phone_prefix": "",
                        "phone": "",
                        "email": ""
                    },
                    "insurance": {
                        "organization": "",
                        "contract_number": "",
                        "phone_prefix": "",
                        "phone": "",
                        "email": ""
                    }
                }));
                localStorage.setItem('health', JSON.stringify({
                    "chronic_pathologies": "",
                    "intolerances_medicated": "",
                    "vaccines": "",
                    "hypersensitivity_to_excipients": "",
                    "antecedents": {
                        "surgical": "",
                        "medicinal": "",
                        "obstetrics": "",
                        "family": ""
                    },
                    "allergies": {
                        "medicinal": "",
                        "food": "",
                        "respiratory": "",
                        "topicals": ""
                    }
                }));
                localStorage.setItem('exams', JSON.stringify([
                    {
                        "date": "",
                        "type": "",
                        "nature": "",
                        "observations": "",
                        "documents": {
                            "video": [],
                            "pdf": [],
                            "dicom": []
                        }
                    }
                ]));
                localStorage.setItem('treatments', JSON.stringify([
                    {
                        "pathology": "",
                        "date": "",
                        "observations": "",
                        "drugs": [
                            {
                                "usual_name": "",
                                "dci": "",
                                "dosage": ""
                            }
                        ],
                        "documents": {
                            "pdf": []
                        }
                    }
                ]));
                localStorage.setItem('doctor', JSON.stringify({
                    "regular": {
                        "language": "",
                        "lastname": "",
                        "firstname": "",
                        "phone_prefix": "",
                        "phone": "",
                        "email": "",
                        "address": "",
                        "city": "",
                        "zip_code": "",
                        "country": ""
                    },
                    "specialist1": {
                        "speciality": "",
                        "language": "",
                        "lastname": "",
                        "firstname": "",
                        "phone_prefix": "+0",
                        "phone": "",
                        "email": "",
                        "address": "",
                        "city": "",
                        "zip_code": "",
                        "country": ""
                    },
                    "specialist2": {
                        "speciality": "",
                        "language": "",
                        "lastname": "",
                        "firstname": "",
                        "phone_prefix": "+0",
                        "phone": "",
                        "email": "",
                        "address": "",
                        "city": "",
                        "zip_code": "",
                        "country": ""
                    },
                    "specialist3": {
                        "speciality": "",
                        "language": "",
                        "lastname": "",
                        "firstname": "",
                        "phone_prefix": "+0",
                        "phone": "",
                        "email": "",
                        "address": "",
                        "city": "",
                        "zip_code": "",
                        "country": ""
                    }
                }));
                localStorage.setItem('certificate', JSON.stringify({
                    "firstname": "",
                    "lastname": "",
                    "organisation": ""
                }));
                localStorage.setItem('customer', JSON.stringify({
                    "fixed": {
                        "email": "",
                        "birthdate": "",
                        "nationality": "",
                        "lastname": "",
                        "use_name": "",
                        "country": "",
                        "native_country": "",
                        "firstname":"",
                        "product":"",
                        "puk": "",
                        "sex": "M",
                        "native_city": ""
                    },
                    "traveler": {
                        "activate": false,
                        "activation_datetime": "",
                        "cloud": false,
                        "password": "",
                        "accepted_terms": false,
                        "language": "",
                        "avatar": false,
                        "accessibility": false,
                        "dark_mode": false,
                        "ice": {
                            "trusted_third_party": {
                                "lastname": "",
                                "firstname": "",
                                "phone_prefix": "",
                                "phone": "",
                                "mobile_prefix": "",
                                "mobile": "",
                                "email": ""
                            },
                            "ice1": {
                                "lastname": "",
                                "firstname": "",
                                "relationship": "",
                                "phone_prefix": "",
                                "phone": "",
                                "mobile_prefix": "",
                                "mobile": "",
                                "email": ""
                            },
                            "ice2": {
                                "lastname": "",
                                "firstname": "",
                                "relationship": "",
                                "phone_prefix": "",
                                "phone": "",
                                "mobile_prefix": "",
                                "mobile": "",
                                "email": ""
                            },
                            "local1": {
                                "organization": "",
                                "contact_lastname": "",
                                "contact_firstname": "",
                                "phone_prefix": "",
                                "phone": "",
                                "mobile_prefix": "",
                                "mobile": "",
                                "email": "",
                                "validity_date": "",
                                "information": ""
                            },
                            "local2": {
                                "organization": "",
                                "contact_lastname": "",
                                "contact_firstname": "",
                                "phone_prefix": "",
                                "phone": "",
                                "mobile_prefix": "",
                                "mobile": "",
                                "email": "",
                                "validity_date": "",
                                "information": ""
                            },
                            "doctor": {
                                "lastname": "",
                                "firstname": "",
                                "phone_prefix": "",
                                "phone": "",
                                "email": ""
                            },
                            "insurance": {
                                "organization": "",
                                "contract_number": "",
                                "phone_prefix": "",
                                "phone": "",
                                "email": ""
                            }
                        },
                        "doctor": {
                            "regular": {
                                "language": "",
                                "lastname": "",
                                "firstname": "",
                                "phone_prefix": "",
                                "phone": "",
                                "email": "",
                                "address": "",
                                "city": "",
                                "zip_code": "",
                                "country": ""
                            },
                            "specialist1": {
                                "speciality": "",
                                "language": "",
                                "lastname": "",
                                "firstname": "",
                                "phone_prefix": "+0",
                                "phone": "",
                                "email": "",
                                "address": "",
                                "city": "",
                                "zip_code": "",
                                "country": ""
                            },
                            "specialist2": {
                                "speciality": "",
                                "language": "",
                                "lastname": "",
                                "firstname": "",
                                "phone_prefix": "+0",
                                "phone": "",
                                "email": "",
                                "address": "",
                                "city": "",
                                "zip_code": "",
                                "country": ""
                            },
                            "specialist3": {
                                "speciality": "",
                                "language": "",
                                "lastname": "",
                                "firstname": "",
                                "phone_prefix": "+0",
                                "phone": "",
                                "email": "",
                                "address": "",
                                "city": "",
                                "zip_code": "",
                                "country": ""
                            }
                        },
                        "notes": [],
                        "exams": [],
                        "treatments": [],
                        "travels": [],
                        "health": {
                            "chronic_pathologies": "",
                            "intolerances_medicated": "",
                            "vaccines": "",
                            "hypersensitivity_to_excipients": "",
                            "antecedents": {
                                "surgical": "",
                                "medicinal": "",
                                "obstetrics": "",
                                "family": ""
                            },
                            "allergies": {
                                "medicinal": "",
                                "food": "",
                                "respiratory": "",
                                "topicals": ""
                            }
                        },
                        "address_1": "",
                        "address_2": "",
                        "address_3": "",
                        "zip_code": "",
                        "city": "",
                        "country": "",
                        "blood_group": "",
                        "weight": "",
                        "height": "",
                        "bmi": "",
                        "handicap": false,
                        "phone_prefix": "",
                        "phone": "",
                        "mobile_prefix": "",
                        "mobile": "",
                        "state": "",
                        "children": 0,
                        "family_situation": "",
                        "certificate": {
                            "firstname": "",
                            "lastname": "",
                            "organisation": ""
                        }
                    }
                }));
                localStorage.setItem('mode', mode);

                const processingRender = () => {

                    // Render process
                    if (view === 'main') {

                        return (
                            <>
                                <Header classList='bg-2 color border-color' data={db}/>
                                <Main classList='bg color border-color' data={db}/>
                                <Aside classList='bg-2 color border-color' data={db}/>
                                <RightAside classList='bg-2 color border-color' data={db}/>
                                <Footer classList='bg-2 color border-color' data={db}/>
                            </>
                        );

                    } else if (view === 'modal') {

                        return (
                            <Modal className={db.settings.theme + ' bg-2 color border-color'} type={modal} data={db}/>
                        );

                    } else if (view === 'newProject') {

                        return (
                            <NewProject className={db.settings.theme + ' bg-2 color border-color'} type={modal} data={db}/>
                        );

                    } else {

                        return (
                            <Default/>
                        );
                    }
                }

                return processingRender();
            }
        }

        ReactDOM.render(
            <React.StrictMode>
                <App/>
            </React.StrictMode>,
            document.querySelector('#container')
        );

        // If you want to start measuring performance in your app, pass a function
        // to log results (for example: reportWebVitals(console.log))
        // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
        reportWebVitals();
    });
    ipc.send('invokeActionDB', ['read', dbModel]);

} else {

    ReactDOM.render(
        <React.StrictMode>
            <Default />
        </React.StrictMode>,
        document.querySelector('#container')
    );

    // If you want to start measuring performance in your app, pass a function
    // to log results (for example: reportWebVitals(console.log))
    // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
    reportWebVitals();
}
