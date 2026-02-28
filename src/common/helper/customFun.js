import vCard from 'vcards-js';

/**
 * function to get the first character of a string in uppercase
 * @param {string} string 
 * @returns {string}
 */
export const getUcFirstLetter = (string) => {
    if (string && string !== '') {
        return string?.charAt(0)?.toUpperCase();
    } else {
        return string;
    }
}

/**
 * function to get a string with its first character in uppercase
 * @param {string} string 
 * @returns {string}
 */
export const getUcFirstLetterString = (string) => {
    if (string && string !== '') {
        return string?.charAt(0)?.toUpperCase() + string?.slice(1);
    } else {
        return string;
    }
}

/**
 * function to generate the vCard string for contact sharing
 * @param {Object} contactInfo Contact details
 * @returns {string}
 */
export const generateVCardString = (contactInfo) => {
    const contact = vCard();

    contact.firstName = contactInfo?.givenName;
    contact.middleName = contactInfo?.middleName;
    contact.lastName = contactInfo?.familyName;
    contactInfo?.phoneNumbers.forEach((item, index) => {
        if (item?.label === 'main' || item?.label === 'mobile' || item?.label === 'other') {
            contact.cellPhone = contactInfo?.phoneNumbers[index]?.number;
        }
        if (item?.label === 'home') {
            contact.homePhone = contactInfo?.phoneNumbers[index]?.number;
        }
        if (item?.label === 'work') {
            contact.workPhone = contactInfo?.phoneNumbers[index]?.number;
        }
    });
    contactInfo?.emailAddresses.forEach((item, index) => {
        if (item?.label === 'work') {
            contact.workEmail = contactInfo?.emailAddresses[index]?.email;
        } else {
            contact.email = contactInfo?.emailAddresses[index]?.email;
        }
    });

    const vCardString = contact?.getFormattedString();
    return vCardString;
}