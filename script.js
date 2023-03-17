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
    const agreementData = getAgreementData(agreementId);
    hydrate(agreementData);
}



/* ==========================================================================
   Get Agreement Data
   ========================================================================== */

function getAgreementData(agreementId) {
    if (!agreementId) {
        return getAgreementTemplateData();
    }

    return getAgreementDataFromStorage(agreementId);
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
        [MODEL_PROPERTY.EMPLOYEE_NAME]: 'Anna Bentsson',
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
   Get Agreement Data From Storage
   ========================================================================== */

function getAgreementDataFromStorage(agreementId) {
    return {};
}



/* ==========================================================================
   Hydrate
   ========================================================================== */

function hydrate(employmentAgreementData) {

    for (const [key, value] of Object.entries(employmentAgreementData)) {

        const element = document.querySelector(SELECTOR[key]);
        if (!element) {
            console.log('Could not hydrate element (not found):', key);
            continue;
        }

        // TODO: if element is input, then, element.value = value
        element.innerText = value;
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
