/*
========================================================
========================= Mapper =======================
========================================================
 */

export function mapper(i = 0, j = 0) {

    return {
        "fixed": {
            "email": '.customer-form[data-key="fixed"] .customer-form-input[name="email"]',
            "birthdate": '.customer-form[data-key="fixed"] .customer-form-input[name="birthdate"]',
            "nationality": '.customer-form[data-key="fixed"] .customer-form-input[name="nationality"]',
            "lastname": '.customer-form[data-key="fixed"] .customer-form-input[name="lastname"]',
            "use_name": '.customer-form[data-key="fixed"] .customer-form-input[name="use_name"]',
            "country": '.customer-form[data-key="fixed"] .customer-form-input[name="country"]',
            "native_country": '.customer-form[data-key="fixed"] .customer-form-input[name="native_country"]',
            "firstname":'.customer-form[data-key="fixed"] .customer-form-input[name="firstname"]',
            "product":"card",
            "puk": null,
            "sex": '.customer-form[data-key="fixed"] .customer-form-input[name="sex"]:checked',
            "native_city": '.customer-form[data-key="fixed"] .customer-form-input[name="native_city"]'
        },
        "traveler": {
            "activate": false,
            "activation_datetime": "",
            "cloud": false,
            "password": "",
            "accepted_terms": false,
            "language": '.customer-form[data-key="traveler"] .customer-form-input[name="language"]',
            "avatar": false,
            "accessibility": false,
            "dark_mode": false,
            "ice": {
                "trusted_third_party": {
                    "lastname": '.customer-form[data-key="ice"] .customer-form-input[name="trustedthirdparty.lastname"]',
                    "firstname": '.customer-form[data-key="ice"] .customer-form-input[name="trustedthirdparty.firstname"]',
                    "phone_prefix": '.customer-form[data-key="ice"] .customer-form-input[name="trustedthirdparty.phone_prefix"]',
                    "phone": '.customer-form[data-key="ice"] .customer-form-input[name="trustedthirdparty.phone"]',
                    "mobile_prefix": '.customer-form[data-key="ice"] .customer-form-input[name="trustedthirdparty.mobile_prefix"]',
                    "mobile": '.customer-form[data-key="ice"] .customer-form-input[name="trustedthirdparty.mobile"]',
                    "email": '.customer-form[data-key="ice"] .customer-form-input[name="trustedthirdparty.email"]'
                },
                "ice1": {
                    "lastname": '.customer-form[data-key="ice"] .customer-form-input[name="ice1.lastname"]',
                    "firstname": '.customer-form[data-key="ice"] .customer-form-input[name="ice1.firstname"]',
                    "relationship": '.customer-form[data-key="ice"] .customer-form-input[name="ice1.relationship"]',
                    "phone_prefix": '.customer-form[data-key="ice"] .customer-form-input[name="ice1.phone_prefix"]',
                    "phone": '.customer-form[data-key="ice"] .customer-form-input[name="ice1.phone"]',
                    "mobile_prefix": '.customer-form[data-key="ice"] .customer-form-input[name="ice1.mobile_prefix"]',
                    "mobile": '.customer-form[data-key="ice"] .customer-form-input[name="ice1.mobile"]',
                    "email": '.customer-form[data-key="ice"] .customer-form-input[name="ice1.email"]'
                },
                "ice2": {
                    "lastname": '.customer-form[data-key="ice"] .customer-form-input[name="ice2.lastname"]',
                    "firstname": '.customer-form[data-key="ice"] .customer-form-input[name="ice2.firstname"]',
                    "relationship": '.customer-form[data-key="ice"] .customer-form-input[name="ice2.relationship"]',
                    "phone_prefix": '.customer-form[data-key="ice"] .customer-form-input[name="ice2.phone_prefix"]',
                    "phone": '.customer-form[data-key="ice"] .customer-form-input[name="ice2.phone"]',
                    "mobile_prefix": '.customer-form[data-key="ice"] .customer-form-input[name="ice2.mobile_prefix"]',
                    "mobile": '.customer-form[data-key="ice"] .customer-form-input[name="ice2.mobile"]',
                    "email": '.customer-form[data-key="ice"] .customer-form-input[name="ice2.email"]'
                },
                "local1": {
                    "organization": '.customer-form[data-key="ice"] .customer-form-input[name="local1.organization"]',
                    "contact_lastname": '.customer-form[data-key="ice"] .customer-form-input[name="local1.contact_lastname"]',
                    "contact_firstname": '.customer-form[data-key="ice"] .customer-form-input[name="local1.contact_firstname"]',
                    "phone_prefix": '.customer-form[data-key="ice"] .customer-form-input[name="local1.phone_prefix"]',
                    "phone": '.customer-form[data-key="ice"] .customer-form-input[name="local1.phone"]',
                    "mobile_prefix": '.customer-form[data-key="ice"] .customer-form-input[name="local1.mobile_prefix"]',
                    "mobile": '.customer-form[data-key="ice"] .customer-form-input[name="local1.mobile"]',
                    "email": '.customer-form[data-key="ice"] .customer-form-input[name="local1.email"]',
                    "validity_date": '.customer-form[data-key="ice"] .customer-form-input[name="local1.validity_date"]',
                    "information": '.customer-form[data-key="ice"] .customer-form-input[name="local1.information"]'
                },
                "local2": {
                    "organization": '.customer-form[data-key="ice"] .customer-form-input[name="local2.organization"]',
                    "contact_lastname": '.customer-form[data-key="ice"] .customer-form-input[name="local2.contact_lastname"]',
                    "contact_firstname": '.customer-form[data-key="ice"] .customer-form-input[name="local2.contact_firstname"]',
                    "phone_prefix": '.customer-form[data-key="ice"] .customer-form-input[name="local2.phone_prefix"]',
                    "phone": '.customer-form[data-key="ice"] .customer-form-input[name="local2.phone"]',
                    "mobile_prefix": '.customer-form[data-key="ice"] .customer-form-input[name="local2.mobile_prefix"]',
                    "mobile": '.customer-form[data-key="ice"] .customer-form-input[name="local2.mobile"]',
                    "email": '.customer-form[data-key="ice"] .customer-form-input[name="local2.email"]',
                    "validity_date": '.customer-form[data-key="ice"] .customer-form-input[name="local2.validity_date"]',
                    "information": '.customer-form[data-key="ice"] .customer-form-input[name="local2.information"]'
                },
                "doctor": {
                    "lastname": '.customer-form[data-key="ice"] .customer-form-input[name="doctor.lastname"]',
                    "firstname": '.customer-form[data-key="ice"] .customer-form-input[name="doctor.firstname"]',
                    "phone_prefix": '.customer-form[data-key="ice"] .customer-form-input[name="doctor.phone_prefix"]',
                    "phone": '.customer-form[data-key="ice"] .customer-form-input[name="doctor.phone"]',
                    "email": '.customer-form[data-key="ice"] .customer-form-input[name="doctor.email"]'
                },
                "insurance": {
                    "organization": '.customer-form[data-key="ice"] .customer-form-input[name="insurance.organization"]',
                    "contract_number": '.customer-form[data-key="ice"] .customer-form-input[name="insurance.contract_number"]',
                    "phone_prefix": '.customer-form[data-key="ice"] .customer-form-input[name="insurance.phone_prefix"]',
                    "phone": '.customer-form[data-key="ice"] .customer-form-input[name="insurance.phone"]',
                    "email": '.customer-form[data-key="ice"] .customer-form-input[name="insurance.email"]'
                }
            },
            "doctor": {
                "regular": {
                    "language": '.customer-form[data-key="doctor"] .customer-form-input[name="regular.language"]',
                    "lastname": '.customer-form[data-key="doctor"] .customer-form-input[name="regular.lastname"]',
                    "firstname": '.customer-form[data-key="doctor"] .customer-form-input[name="regular.firstname"]',
                    "phone_prefix": '.customer-form[data-key="doctor"] .customer-form-input[name="regular.phone_prefix"]',
                    "phone": '.customer-form[data-key="doctor"] .customer-form-input[name="regular.phone"]',
                    "email": '.customer-form[data-key="doctor"] .customer-form-input[name="regular.email"]',
                    "address": '.customer-form[data-key="doctor"] .customer-form-input[name="regular.address"]',
                    "city": '.customer-form[data-key="doctor"] .customer-form-input[name="regular.city"]',
                    "zip_code": '.customer-form[data-key="doctor"] .customer-form-input[name="regular.zip_code"]',
                    "country": '.customer-form[data-key="doctor"] .customer-form-input[name="regular.country"]'
                },
                "specialist1": {
                    "speciality": '.customer-form[data-key="doctor"] .customer-form-input[name="specialist1.speciality"]',
                    "language": '.customer-form[data-key="doctor"] .customer-form-input[name="specialist1.language"]',
                    "lastname": '.customer-form[data-key="doctor"] .customer-form-input[name="specialist1.lastname"]',
                    "firstname": '.customer-form[data-key="doctor"] .customer-form-input[name="specialist1.firstname"]',
                    "phone_prefix": '.customer-form[data-key="doctor"] .customer-form-input[name="specialist1.phone_prefix"]',
                    "phone": '.customer-form[data-key="doctor"] .customer-form-input[name="specialist1.phone"]',
                    "email": '.customer-form[data-key="doctor"] .customer-form-input[name="specialist1.email"]',
                    "address": '.customer-form[data-key="doctor"] .customer-form-input[name="specialist1.address"]',
                    "city": '.customer-form[data-key="doctor"] .customer-form-input[name="specialist1.city"]',
                    "zip_code": '.customer-form[data-key="doctor"] .customer-form-input[name="specialist1.zip_code"]',
                    "country": '.customer-form[data-key="doctor"] .customer-form-input[name="specialist1.country"]'
                },
                "specialist2": {
                    "speciality": '.customer-form[data-key="doctor"] .customer-form-input[name="specialist2.speciality"]',
                    "language": '.customer-form[data-key="doctor"] .customer-form-input[name="specialist2.language"]',
                    "lastname": '.customer-form[data-key="doctor"] .customer-form-input[name="specialist2.lastname"]',
                    "firstname": '.customer-form[data-key="doctor"] .customer-form-input[name="specialist2.firstname"]',
                    "phone_prefix": '.customer-form[data-key="doctor"] .customer-form-input[name="specialist2.phone_prefix"]',
                    "phone": '.customer-form[data-key="doctor"] .customer-form-input[name="specialist2.phone"]',
                    "email": '.customer-form[data-key="doctor"] .customer-form-input[name="specialist2.email"]',
                    "address": '.customer-form[data-key="doctor"] .customer-form-input[name="specialist2.address"]',
                    "city": '.customer-form[data-key="doctor"] .customer-form-input[name="specialist2.city"]',
                    "zip_code": '.customer-form[data-key="doctor"] .customer-form-input[name="specialist2.zip_code"]',
                    "country": '.customer-form[data-key="doctor"] .customer-form-input[name="specialist2.country"]'
                },
                "specialist3": {
                    "speciality": '.customer-form[data-key="doctor"] .customer-form-input[name="specialist3.speciality"]',
                    "language": '.customer-form[data-key="doctor"] .customer-form-input[name="specialist3.language"]',
                    "lastname": '.customer-form[data-key="doctor"] .customer-form-input[name="specialist3.lastname"]',
                    "firstname": '.customer-form[data-key="doctor"] .customer-form-input[name="specialist3.firstname"]',
                    "phone_prefix": '.customer-form[data-key="doctor"] .customer-form-input[name="specialist3.phone_prefix"]',
                    "phone": '.customer-form[data-key="doctor"] .customer-form-input[name="specialist3.phone"]',
                    "email": '.customer-form[data-key="doctor"] .customer-form-input[name="specialist3.email"]',
                    "address": '.customer-form[data-key="doctor"] .customer-form-input[name="specialist3.address"]',
                    "city": '.customer-form[data-key="doctor"] .customer-form-input[name="specialist3.city"]',
                    "zip_code": '.customer-form[data-key="doctor"] .customer-form-input[name="specialist3.zip_code"]',
                    "country": '.customer-form[data-key="doctor"] .customer-form-input[name="specialist3.country"]'
                }
            },
            "exams": [
                {
                    "date": '.customer-form[data-key="exams"] .sub-contents[data-child="' + i + '"] .customer-form-input[name="date.date"]',
                    "type": '.customer-form[data-key="exams"] .sub-contents[data-child="' + i + '"] .customer-form-input[name="type"]',
                    "nature": '.customer-form[data-key="exams"] .sub-contents[data-child="' + i + '"] .customer-form-input[name="nature"]',
                    "observations": '.customer-form[data-key="exams"] .sub-contents[data-child="' + i + '"] .customer-form-input[name="observations"]',
                    "documents": {
                        "video": '.customer-form[data-key="exams"] .sub-contents[data-child="' + i + '"] .exam-documents-video-list-' + i + ' .file-li',
                        "pdf": '.customer-form[data-key="exams"] .sub-contents[data-child="' + i + '"] .exam-documents-pdf-list-' + i + ' .file-li',
                        "dicom": '.customer-form[data-key="exams"] .sub-contents[data-child="' + i + '"] .exam-documents-dicom-list-' + i + ' .file-li'
                    }
                }
            ],
            "treatments": [
                {
                    "pathology": '.customer-form[data-key="treatments"] .sub-contents[data-child="' + i + '"] .customer-form-input[name="pathology"]',
                    "date": '.customer-form[data-key="treatments"] .sub-contents[data-child="' + i + '"] .customer-form-input[name="date.date"]',
                    "observations": '.customer-form[data-key="treatments"] .sub-contents[data-child="' + i + '"] .customer-form-input[name="observations"]',
                    "drugs": [
                        {
                            "usual_name": '.customer-form[data-key="treatments"] .sub-contents[data-child="' + i + '"] .drug-list-item[data-key"' + j + '"] .customer-form-input[name="usual_name"]',
                            "dci": '.customer-form[data-key="treatments"] .sub-contents[data-child="' + i + '"] .drug-list-item[data-key"' + j + '"] .customer-form-input[name="dci"]',
                            "dosage": '.customer-form[data-key="treatments"] .sub-contents[data-child="' + i + '"] .drug-list-item[data-key"' + j + '"] .customer-form-input[name="dosage"]'
                        }
                    ],
                    "documents": {
                        "pdf": '.customer-form[data-key="treatments"] .sub-contents[data-child="' + i + '"] .treatment-documents-pdf-list-' + i + ' .file-li'
                    }
                }
            ],
            "health": {
                "chronic_pathologies": '.customer-form[data-key="health"] .customer-form-input[name="chronic_pathologies"]',
                "intolerances_medicated": '.customer-form[data-key="health"] .customer-form-input[name="intolerances_medicated"]',
                "vaccines": '.customer-form[data-key="health"] .customer-form-input[name="vaccines"]',
                "hypersensitivity_to_excipients": '.customer-form[data-key="health"] .customer-form-input[name="hypersensitivity_to_excipients"]',
                "antecedents": {
                    "surgical": '.customer-form[data-key="health"] .customer-form-input[name="antecedents.surgical"]',
                    "medicinal": '.customer-form[data-key="health"] .customer-form-input[name="antecedents.medicinal"]',
                    "obstetrics": '.customer-form[data-key="health"] .customer-form-input[name="antecedents.obstetrics"]',
                    "family": '.customer-form[data-key="health"] .customer-form-input[name="antecedents.family"]'
                },
                "allergies": {
                    "medicinal": '.customer-form[data-key="health"] .customer-form-input[name="allergies.medicinal"]',
                    "food": '.customer-form[data-key="health"] .customer-form-input[name="allergies.food"]',
                    "respiratory": '.customer-form[data-key="health"] .customer-form-input[name="allergies.respiratory"]',
                    "topicals": '.customer-form[data-key="health"] .customer-form-input[name="allergies.topicals"]'
                }
            },
            "address_1": '.customer-form[data-key="traveler"] .customer-form-input[name="address_1"]',
            "address_2": '.customer-form[data-key="traveler"] .customer-form-input[name="address_2"]',
            "address_3": '.customer-form[data-key="traveler"] .customer-form-input[name="address_3"]',
            "zip_code": '.customer-form[data-key="traveler"] .customer-form-input[name="zip_code"]',
            "city": '.customer-form[data-key="traveler"] .customer-form-input[name="city"]',
            "country": '.customer-form[data-key="traveler"] .customer-form-input[name="country"]',
            "blood_group": '.customer-form[data-key="traveler"] .customer-form-input[name="blood_group"]',
            "weight": '.customer-form[data-key="traveler"] .customer-form-input[name="weight"]',
            "height": '.customer-form[data-key="traveler"] .customer-form-input[name="height"]',
            "bmi": '.customer-form[data-key="traveler"] .customer-form-input[name="bmi"]',
            "handicap": '.customer-form[data-key="traveler"] .customer-form-input[name="handicap"]',
            "phone_prefix": '.customer-form[data-key="traveler"] .customer-form-input[name="phone_prefix"]',
            "phone": '.customer-form[data-key="traveler"] .customer-form-input[name="phone"]',
            "mobile_prefix": '.customer-form[data-key="traveler"] .customer-form-input[name="mobile_prefix"]',
            "mobile": '.customer-form[data-key="traveler"] .customer-form-input[name="mobile"]',
            "state": '.customer-form[data-key="traveler"] .customer-form-input[name="state"]',
            "children": '.customer-form[data-key="traveler"] .customer-form-input[name="children"]',
            "family_situation": '.customer-form[data-key="traveler"] .customer-form-input[name="family_situation"]',
            "certificate": {
                "firstname": "",
                "lastname": "",
                "organisation": ""
            }
        }
    }
}

export function required(customer) {

    let req = {
        "fixed": {
            "email": "",
            "birthdate": "",
            "nationality": "",
            "lastname": "",
            "use_name": "",
            "country": "",
            "native_country": "",
            "firstname": "",
            "sex": "",
            "native_city": ""
        },
        "traveler": {
            "address_1": "",
            "zip_code": "",
            "city": "",
            "country": "",
            "blood_group": "",
            "weight": "",
            "height": "",
            "bmi": "",
            "phone_prefix": "",
            "phone": "",
            "mobile_prefix": "",
            "mobile": "",
            "state": "",
            "children": "",
            "family_situation": ""
        }
    }

    let checks = [],
        fixed = req.fixed,
        traveler = req.traveler

    for (const key in fixed) {
        if (typeof fixed[key] !== 'object' && customer.fixed[key].length < 1) {
            checks.push('strict > ' + key.replaceAll('_', ' '))
        }
    }

    for (const key in traveler) {
        if (typeof traveler[key] !== 'object' && customer.traveler[key].length < 1) {
            checks.push('traveler > ' + key.replaceAll('_', ' '))
        } else {
            let obj = traveler[key];
            for (const objKey in obj) {
                if (customer.traveler[key][objKey].length < 1) {
                    checks.push('traveler > ' + key.replaceAll('_', ' ') + ' > ' + objKey.replaceAll('_', ' '))
                }
            }
        }
    }
    
    let exams = customer.traveler.exams;
    for (let i = 0; i < exams.length; i++) {
        let exam = exams[i];
        for (const examKey in exam) {
            if (!examKey.includes['documents'] && exam[examKey].length < 1) {
                checks.push('traveler > exams > exams ' + (i+1) + ' > ' + examKey.replaceAll('_', ' '))
            }
        }
    }

    let treatments = customer.traveler.treatments;
    for (let i = 0; i < treatments.length; i++) {
        let treatment = treatments[i];
        for (const treatmentKey in treatment) {
            if (!treatmentKey.includes['documents', 'drugs'] && treatment[treatmentKey].length < 1) {
                checks.push('traveler > treatments > treatment ' + (i+1) + ' > ' + treatmentKey.replaceAll('_', ' '))
            }
        }
    }

    return checks;
}