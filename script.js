/* ==========================================================================
   Constants
   ========================================================================== */

const STORAGE_KEY = 'data';

const PARAM = {
    AGREEMENT_ID: 'id'
}

const MODEL_PROPERTY = {
    EMPLOYEE_NAME: 'EMPLOYEE_NAME',
    EMPLOYEE_SOCIAL_SECURITY_NUMBER: 'EMPLOYEE_SOCIAL_SECURITY_NUMBER',
    EMPLOYEE_ADDRESS: 'EMPLOYEE_ADDRESS',
    EMPLOYEE_POSTAL_NUMBER: 'EMPLOYEE_POSTAL_NUMBER',
    EMPLOYEE_CITY: 'EMPLOYEE_CITY',
    EMPLOYMENT_BEGINS: 'EMPLOYMENT_BEGINS',
    EMPLOYMENT_ROLE: 'EMPLOYMENT_ROLE',
    SALARY_INITIAL_AMOUNT: 'SALARY_INITIAL_AMOUNT',
    SALARY_ACCOUNT_BANK_NAME: 'SALARY_ACCOUNT_BANK_NAME',
    SALARY_ACCOUNT_NUMBER: 'SALARY_ACCOUNT_NUMBER'
}

const SELECTOR = Object.fromEntries(Object.entries(MODEL_PROPERTY).map(([k, v]) => [k, `.${pascalToHyphens(v)}`]));



/* ==========================================================================
   Load Handler
   ========================================================================== */

document.addEventListener('DOMContentLoaded', loadAgreement);



/* ==========================================================================
   Load Agreement
   ========================================================================== */

function loadAgreement() {
    const agreementId = getAgreementId();
    const [agreementData, agreementTemplateData] = getAgreementData(agreementId);
    hydrate(agreementData, agreementTemplateData);
}



/* ==========================================================================
   Get Agreement Data
   ========================================================================== */

function getAgreementData(agreementId) {
    if (!agreementId) {
        return [getAgreementTemplateData(), getAgreementTemplateData()];
    }

    return [getAgreementDataFromStorage(agreementId), getAgreementTemplateData()];
}



/* ==========================================================================
   Get Agreement Id
   ========================================================================== */

function getAgreementId() {
    const urlObject = new URL(location);
    return (new URLSearchParams(urlObject.search)).get(PARAM.AGREEMENT_ID);
}



/* ==========================================================================
   Get Agreement Template Data
   ========================================================================== */

function getAgreementTemplateData() {
    return {
        [MODEL_PROPERTY.EMPLOYEE_NAME]: 'Anna Bengtsson',
        [MODEL_PROPERTY.EMPLOYEE_SOCIAL_SECURITY_NUMBER]: '990102-1234',
        [MODEL_PROPERTY.EMPLOYEE_ADDRESS]: 'Cykelstigen 1',
        [MODEL_PROPERTY.EMPLOYEE_POSTAL_NUMBER]: '123 45',
        [MODEL_PROPERTY.EMPLOYEE_CITY]: 'Diplomatstaden',
        [MODEL_PROPERTY.EMPLOYMENT_BEGINS]: '1 jan 2024',
        [MODEL_PROPERTY.EMPLOYMENT_ROLE]: 'Designer',
        [MODEL_PROPERTY.SALARY_INITIAL_AMOUNT]: '23 400',
        [MODEL_PROPERTY.SALARY_ACCOUNT_BANK_NAME]: 'Nordea',
        [MODEL_PROPERTY.SALARY_ACCOUNT_NUMBER]: '1234-1, 3232 765-0',
    };
}



/* ==========================================================================
   Crate New Agreement
   ========================================================================== */

function createNewAgreement() {
    const agreementId = crypto.randomUUID();
    location.assign(`/edit.html?id=${agreementId}`);
}



/* ==========================================================================
   Save Form
   ========================================================================== */

function saveForm() {

    // TODO: VALIDATE!

    const agreementId = getAgreementId();
    const agreementData = extractAgreementDataFromForm();
    saveAgreementToStorage(agreementId, agreementData);

    location.assign(`/index.html?id=${agreementId}`);
}



/* ==========================================================================
   Extract Agreement Data From Form
   ========================================================================== */

function extractAgreementDataFromForm() {
    const data = {};
    for (const [key, value] of Object.entries(SELECTOR)) {
        const input = document.querySelector(value);

        if (!input) {
            console.log('Could not find input', value);
            continue;
        }

        data[key] = input.value;
    }

    return data;
}



/* ==========================================================================
   Get Agreement Data From Storage
   ========================================================================== */

function saveAgreementToStorage(agreementId, agreementData) {
    const db = DB.get();
    db[agreementId] = agreementData;
    DB.set(db);
}



/* ==========================================================================
   Get Agreement Data From Storage
   ========================================================================== */

function getAgreementDataFromStorage(agreementId) {
    const db = DB.get();
    const agreement = db[agreementId];
    return agreement || {};
}



/* ==========================================================================
   Hydrate
   ========================================================================== */

function hydrate(employmentAgreementData, employmentAgreementTemplateData) {

    // If employmentAgreementData is empty, loop will not run
    // This happens when edit new agreement. Only template data
    // is avaiable

    for (const [key, value] of Object.entries(employmentAgreementData)) {

        const element = document.querySelector(SELECTOR[key]);
        if (!element) {
            console.log('Could not hydrate element (not found):', key);
            continue;
        }

        if (element.tagName === 'INPUT') {
            element.value = value;
            element.setAttribute('value', value);
            element.placeholder = employmentAgreementTemplateData[key];
        } else {
            element.innerText = value;
        }

    }
}



/* ==========================================================================
   Pascal To Hyphens
   ========================================================================== */

function pascalToHyphens(pascal) {
    // SimpleConfirm => simple-confirm
    // SIMPLE_CONFIRM => simple-confirm
    return pascal.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase().replaceAll('_', '-');
};



/* ==========================================================================
   Print Modifier
   ========================================================================== */

window.addEventListener('beforeprint', event => {
    document.documentElement.classList.add('print');
});

window.addEventListener('afterprint', event => {
    document.documentElement.classList.remove('print');
});



/* ==========================================================================
   DB
   ========================================================================== */

const DB = {
    get: () => JSON.parse(localStorage.getItem(STORAGE_KEY)) || {},
    set: data => localStorage.setItem(STORAGE_KEY, JSON.stringify(data || {}))
}
