import { Linking, Platform } from "react-native";
import Share from "react-native-share";
import base64 from "react-native-base64";
import { showMessage } from "react-native-flash-message";

//import constants
import { Strings } from "../constants";

//import custom functions
import { generateVCardString, getUcFirstLetter } from "./customFun";

/**
 * function to get the sorted contacts list in alphabetical order
 * @param {Array<Object>} list Raw contacts list
 * @returns {Array<Object>} Sorted contacts list
 */
export const sortContacts = (list) => {
    let sortedList = list
        .slice()
        .sort((a, b) => a?.displayName?.localeCompare(b?.displayName));
    return sortedList;
};

/**
 * Builds a flat contact list with section header rows and their sticky indices.
 *
 * @param {Array<Object>} [contactList=[]] Contact list to sort and group.
 * @returns {{
 *  listItems: Array<Object>,
 *  stickyHeaderIndices: Array<number>,
 *  scrubberLetters: Array<string>,
 *  letterToHeaderIndex: Record<string, number>
 * }}
 */
export const buildAlphabetizedContactsList = (contactList = []) => {
    const sortedContacts = sortContacts(contactList);
    const listItems = [];
    const stickyHeaderIndices = [];
    const scrubberLetters = [];
    const letterToHeaderIndex = {};
    let activeLetter = null;

    for (let index = 0; index < sortedContacts.length; index += 1) {
        const contact = sortedContacts[index];
        const letter = getUcFirstLetter(contact?.displayName);

        if (activeLetter !== letter) {
            activeLetter = letter;
            stickyHeaderIndices.push(listItems.length);
            if (letter) {
                scrubberLetters.push(letter);
                letterToHeaderIndex[letter] = listItems.length;
            }
            listItems.push({
                type: "header",
                id: `header-${letter || "blank"}-${stickyHeaderIndices.length - 1}`,
                letter,
            });
        }

        listItems.push({
            type: "contact",
            id: `contact-${contact?.recordID || index}`,
            letter,
            contact,
        });
    }

    return {
        listItems,
        stickyHeaderIndices,
        scrubberLetters,
        letterToHeaderIndex,
    };
};

/**
 * function to open the default calling app
 * @param {string} phoneNumber Phone Number
 * @returns
 */
export const openCallApp = async (phoneNumber) => {
    if (__DEV__) {
        return;
    }
    if (!phoneNumber) {
        showMessage({
            message: "Invalid phone number!",
            type: "danger",
            icon: "danger",
        });
        return;
    }
    try {
        const url = `tel:${phoneNumber.replace(/\s+/g, "")}`;
        const supported = await Linking.canOpenURL(url);
        if (!supported) {
            showMessage({
                message: "Calling is not supported for this contact!",
                icon: "danger",
            });
            return;
        }
        await Linking.openURL(url);
    } catch (error) {
        showMessage({
            message: Strings.ErrMsg,
            type: "danger",
            icon: "info",
        });
    }
};

/**
 * function to open the default mail app
 * @param {string} mailId Email Id
 * @returns
 */
export const openMailApp = async (mailId) => {
    if (!mailId) {
        showMessage({
            message: "Invalid email Id",
            icon: "info",
        });
        return;
    }
    try {
        const url = `mailto:${mailId}`;
        const supported = await Linking.canOpenURL(url);
        if (!supported) {
            showMessage({
                message: "Mailing is not supported for this contact!",
                icon: "danger",
            });
            return;
        }
        await Linking.openURL(url);
    } catch (error) {
        showMessage({
            message: Strings.ErrMsg,
            type: "danger",
            icon: "info",
        });
    }
};

/**
 * function to open the default messaging app
 * @param {string} phoneNumber Phone number
 * @returns
 */
export const openMessagingApp = async (phoneNumber) => {
  if (!phoneNumber) {
    showMessage({
      message: "Invalid phone number!",
      icon: "info",
    });
    return;
  }

  const trimmedPhoneNumber = String(phoneNumber).trim();
  const hasLeadingPlus = trimmedPhoneNumber.startsWith("+");
  const digitsOnlyPhoneNumber = trimmedPhoneNumber.replace(/\D/g, "");
  const normalizedPhoneNumber = `${
    hasLeadingPlus ? "+" : ""
  }${digitsOnlyPhoneNumber}`;

  if (!digitsOnlyPhoneNumber) {
    showMessage({
      message: "Invalid phone number!",
      icon: "info",
    });
    return;
  }

  const messagingUrls =
    Platform.OS === "android"
      ? [
          `smsto:${normalizedPhoneNumber}`,
          `sms:${normalizedPhoneNumber}`,
        ]
      : [`sms:${normalizedPhoneNumber}`];

  try {
    for (let index = 0; index < messagingUrls.length; index += 1) {
      const url = messagingUrls[index];

      try {
        const supported = await Linking.canOpenURL(url);

        if (supported) {
          await Linking.openURL(url);
          return;
        }
      } catch (supportCheckError) {
        console.log("Messaging support check Err", supportCheckError);
      }
    }

    for (let index = 0; index < messagingUrls.length; index += 1) {
      const url = messagingUrls[index];

      try {
        await Linking.openURL(url);
        return;
      } catch (openUrlError) {
        console.log("Messaging URL open Err", openUrlError);
      }
    }

    showMessage({
      message: "Messaging is not supported for this contact!",
      icon: "danger",
    });
  } catch (error) {
    showMessage({
      message: Strings.ErrMsg,
            type: "danger",
            icon: "info",
        });
    }
};

/**
 * function to share any contact outside of the app
 * @param {Object} contactInfo Contact object from the device contacts list.
 */
export const shareContact = async (contactInfo) => {
    try {
        const vCardString = generateVCardString(contactInfo);
        const vCardBase64 = base64.encode(vCardString);
        const vCardDataUrl = `data:text/vcard;base64,${vCardBase64}`;
        await Share.open({
            url: vCardDataUrl,
            type: "text/vcard",
            title: "Share Contact",
            message: `Hi, sharing ${getDisplayName(
                contactInfo
            )}'s contact details with you here. You can save this card and use it whenever needed.`,
            fileName: `${getDisplayName(contactInfo)}.vcf`,
        });
    } catch (error) {
        console.log("Contact Sharing Err", error);
    }
};

/**
 * Builds a display-friendly contact name based on the current platform.
 * On Android it prefers the native `displayName`, while on iOS it combines
 * `givenName` and `familyName` and falls back to `displayName` if needed.
 *
 * @param {Object} contact Contact object from the device contacts list.
 * @returns {string} A normalized display name string for UI rendering.
 */
export const getDisplayName = (contact) => {
    if (Platform.OS === "android") {
        return contact?.displayName || "";
    }

    const iosName = [contact?.givenName, contact?.familyName]
        .filter(Boolean)
        .join(" ")
        .trim();
    return iosName || contact?.displayName || "";
};

/**
 * Maps raw contact records into the lightweight shape used by list UIs.
 *
 * @param {Array<Object>} [contactList=[]] Raw contacts array to transform.
 * @returns {Array<Object>} Array of simplified contact objects containing
 * `recordID`, `displayName`, and `thumbnailPath`.
 */
export const mapDisplayContacts = (contactList = []) => {
    return contactList.map((item) => ({
        recordID: item?.recordID,
        displayName: getDisplayName(item),
        thumbnailPath: item?.thumbnailPath,
    }));
};
