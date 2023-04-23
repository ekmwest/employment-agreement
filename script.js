/* ==========================================================================
   Constants
   ========================================================================== */

const MODEL = {
    EMPLOYEE_NAME: 'EMPLOYEE_NAME',
    EMPLOYEE_SOCIAL_SECURITY_NUMBER: 'EMPLOYEE_SOCIAL_SECURITY_NUMBER',
    EMPLOYEE_ADDRESS: 'EMPLOYEE_ADDRESS',
    EMPLOYEE_POSTAL_NUMBER: 'EMPLOYEE_POSTAL_NUMBER',
    EMPLOYEE_CITY: 'EMPLOYEE_CITY',
    EMPLOYMENT_BEGINS: 'EMPLOYMENT_BEGINS',
    EMPLOYMENT_ROLE: 'EMPLOYMENT_ROLE',
    SALARY_INITIAL_AMOUNT: 'SALARY_INITIAL_AMOUNT',
    SALARY_ACCOUNT_BANK_NAME: 'SALARY_ACCOUNT_BANK_NAME',
    SALARY_ACCOUNT_NUMBER: 'SALARY_ACCOUNT_NUMBER',
    EMPLOYEE_NOTICE_PERIOD: 'EMPLOYEE_NOTICE_PERIOD',
    EMPLOYER_NOTICE_PERIOD: 'EMPLOYER_NOTICE_PERIOD'
}

const SELECTOR = Object.fromEntries(Object.entries(MODEL).map(([k, v]) => [k, `.${pascalToHyphens(v)}`]));

const STORAGE_KEY = 'agreement';



/* ==========================================================================
   Load Handlers
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const agreement = getAgreement();
    const defaultAgreement = getDefaultAgreement();
    hydrate(agreement, defaultAgreement);
});

window.addEventListener('beforeprint', event => {
    document.documentElement.classList.add('print');
});

window.addEventListener('afterprint', event => {
    document.documentElement.classList.remove('print');
});



/* ==========================================================================
   Agreement
   ========================================================================== */

function getAgreement() {
    if (isEmpty(getStoredAgreement())) {
        return getDefaultAgreement()
    }
    return getStoredAgreement();
}

function getStoredAgreement() {
    return Store.get();
}

function getDefaultAgreement() {
    return {
        [MODEL.EMPLOYEE_NAME]: 'Anna Bengtsson',
        [MODEL.EMPLOYEE_SOCIAL_SECURITY_NUMBER]: '990102-1234',
        [MODEL.EMPLOYEE_ADDRESS]: 'Cykelstigen 1',
        [MODEL.EMPLOYEE_POSTAL_NUMBER]: '123 45',
        [MODEL.EMPLOYEE_CITY]: 'Diplomatstaden',
        [MODEL.EMPLOYMENT_BEGINS]: '1 jan 2024',
        [MODEL.EMPLOYMENT_ROLE]: 'Designer',
        [MODEL.SALARY_INITIAL_AMOUNT]: '23 400',
        [MODEL.EMPLOYEE_NOTICE_PERIOD]: '1',
        [MODEL.EMPLOYER_NOTICE_PERIOD]: '1',
    };
}



/* ==========================================================================
   Form Functions
   ========================================================================== */

function saveForm() {
    const agreement = extractAgreementFromForm();
    Store.set(agreement);
    location.assign('/');
}

function resetForm() {
    Store.set(null);
    location.assign('/edit.html');
}

function extractAgreementFromForm() {

    // TODO: Validate

    const agreement = {};

    for (const [key, value] of Object.entries(SELECTOR)) {
        const input = document.querySelector(value);

        if (!input) {
            console.log('Could not find input', value);
            continue;
        }

        agreement[key] = input.value.trim();
    }

    return agreement;
}



/* ==========================================================================
   Hydrate
   ========================================================================== */

function hydrate(agreement, defaultAgreement) {

    for (const [key, value] of Object.entries(agreement)) {

        const element = document.querySelector(SELECTOR[key]);

        if (!element) {
            console.log('Could not hydrate element (not found):', key);
            continue;
        }

        if (element.tagName === 'INPUT') {
            element.value = value;
            element.setAttribute('value', value);
            element.setAttribute('placeholder', defaultAgreement[key]);
        } else {
            element.innerText = value;
        }
    }
}



/* ==========================================================================
   Helpers
   ========================================================================== */

function pascalToHyphens(pascal) {
    return pascal.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase().replaceAll('_', '-');
};

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}



/* ==========================================================================
   Store
   ========================================================================== */

const Store = {
    get: () => JSON.parse(localStorage.getItem(STORAGE_KEY)) || {},
    set: agreement => localStorage.setItem(STORAGE_KEY, JSON.stringify(agreement || {}))
}
