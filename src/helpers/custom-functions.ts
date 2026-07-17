//import types
import type { ContactListItem, DeviceContact, DevicePhone, PreparedContacts } from '@/features/contacts/model';

const UNKNOWN_SECTION = '#';
const APPLE_CONTACT_LABEL_PATTERN = /^_\$!<([^>]+)>!\$_$/;
const APPLE_CONTACT_LABEL_OVERRIDES: Readonly<Record<string, string>> = {
  HomeFAX: 'Home Fax',
  WorkFAX: 'Work Fax',
  OtherFAX: 'Other Fax',
  iPhone: 'iPhone',
  iCloud: 'iCloud',
};

/**
 * Returns a contact's trimmed display name with a fallback for unnamed contacts.
 *
 * @param contact - Device contact whose name should be displayed.
 * @returns The contact's display name.
 */
export const getContactName = (contact: DeviceContact): string => contact.fullName?.trim() || 'Unnamed contact';

/**
 * Returns the uppercase initial used when a contact has no thumbnail.
 *
 * @param name - Contact display name.
 * @returns The first character of the trimmed name, or `#` when unavailable.
 */
export const getContactInitial = (name: string): string =>
  Array.from(name.trim())[0]?.toLocaleUpperCase() ?? UNKNOWN_SECTION;

/**
 * Removes contacts phone entries that resolve to the same numeric value.
 *
 * @param phones - Phone entries returned by the device contacts API.
 * @returns Phone entries with blank and duplicate numbers removed.
 */
export const getUniqueContactPhones = (phones: readonly DevicePhone[]): DevicePhone[] => {
  const seenNumbers = new Set<string>();

  return phones.filter((phone) => {
    const normalizedNumber = phone.number?.replace(/\D/g, '') ?? '';

    if (!normalizedNumber || seenNumbers.has(normalizedNumber)) {
      return false;
    }

    seenNumbers.add(normalizedNumber);
    return true;
  });
};

/**
 * Formats an optional contact field label for display.
 *
 * @param label - Label returned by the device contacts API.
 * @param fallback - Text used when the label is unavailable.
 * @returns A readable label with native Apple tokens normalized for display.
 */
export const formatContactLabel = (label?: string, fallback: string = 'Phone'): string => {
  const rawLabel = label?.trim();
  const appleLabelToken = rawLabel?.match(APPLE_CONTACT_LABEL_PATTERN)?.[1];
  const normalizedLabel = appleLabelToken
    ? (APPLE_CONTACT_LABEL_OVERRIDES[appleLabelToken] ?? appleLabelToken)
    : rawLabel || fallback;

  if (normalizedLabel === 'iPhone' || normalizedLabel === 'iCloud') {
    return normalizedLabel;
  }

  const [firstCharacter, ...remainingCharacters] = Array.from(normalizedLabel);

  return `${firstCharacter?.toLocaleUpperCase() ?? ''}${remainingCharacters.join('')}`;
};

/**
 * Builds the plain-text payload used by the native contact share sheet.
 *
 * @param contact - Contact whose available details should be shared.
 * @returns The contact name followed by phone numbers and email addresses.
 */
export const buildContactShareMessage = (contact: DeviceContact): string => {
  const phoneLines = getUniqueContactPhones(contact.phones).map(
    (phone) => `${formatContactLabel(phone.label)}: ${phone.number?.trim() ?? ''}`,
  );
  const emailLines = contact.emails
    .filter((email) => Boolean(email.address?.trim()))
    .map((email) => `${formatContactLabel(email.label, 'Email')}: ${email.address?.trim() ?? ''}`);

  return [getContactName(contact), ...phoneLines, ...emailLines].join('\n');
};

/**
 * Resolves stored contact records that are currently marked as favorites.
 *
 * @param contacts - Contacts available in the application store.
 * @param favoriteContactIds - Contact IDs marked as favorites.
 * @returns Favorite contacts in their original contact-list order.
 */
export const getFavoriteContacts = (
  contacts: readonly DeviceContact[],
  favoriteContactIds: readonly string[],
): DeviceContact[] => {
  const favoriteIds = new Set(favoriteContactIds);
  return contacts.filter((contact) => favoriteIds.has(contact.id));
};

/**
 * Resolves the alphabetical section used to group a contact.
 *
 * @param contact - Device contact to categorize.
 * @returns An uppercase initial, or `#` when the name has no leading letter.
 */
export const getContactSectionLetter = (contact: DeviceContact): string => {
  const firstCharacter = Array.from(contact.fullName?.trim() ?? '')[0];

  if (!firstCharacter || !/^\p{L}$/u.test(firstCharacter)) {
    return UNKNOWN_SECTION;
  }

  return firstCharacter.toLocaleUpperCase();
};

/**
 * Sorts contact section letters while keeping the fallback `#` section last.
 *
 * @param firstLetter - First section letter to compare.
 * @param secondLetter - Second section letter to compare.
 * @returns A locale-aware comparison value suitable for `Array.sort`.
 */
export const compareContactSectionLetters = (firstLetter: string, secondLetter: string): number => {
  if (firstLetter === UNKNOWN_SECTION) return 1;
  if (secondLetter === UNKNOWN_SECTION) return -1;

  return firstLetter.localeCompare(secondLetter, undefined, {
    sensitivity: 'base',
  });
};

/**
 * Converts device contacts into the flattened data required by the contacts list.
 *
 * The result includes section headers, sticky-header indexes, scrubber letters,
 * and a lookup used to scroll directly to a section.
 *
 * @param contacts - Contacts to sort and group alphabetically.
 * @returns Prepared list and scrubber data without mutating the input array.
 */
export const buildAlphabetizedContactsList = (contacts: readonly DeviceContact[]): PreparedContacts => {
  //sorts a copy so callers retain their original contact order
  const sortedContacts = [...contacts].sort((firstContact, secondContact) =>
    getContactName(firstContact).localeCompare(getContactName(secondContact), undefined, {
      sensitivity: 'base',
    }),
  );

  //groups contacts by their resolved alphabetical section
  const groupedContacts = new Map<string, DeviceContact[]>();

  for (const contact of sortedContacts) {
    const letter = getContactSectionLetter(contact);
    const sectionContacts = groupedContacts.get(letter) ?? [];
    sectionContacts.push(contact);
    groupedContacts.set(letter, sectionContacts);
  }

  //builds ordered scrubber and flattened-list metadata
  const scrubberLetters = [...groupedContacts.keys()].sort(compareContactSectionLetters);
  const listItems: ContactListItem[] = [];
  const stickyHeaderIndices: number[] = [];
  const letterToHeaderIndex: Record<string, number> = {};

  //flattens each section into one header followed by its contacts
  for (const letter of scrubberLetters) {
    const headerIndex = listItems.length;
    stickyHeaderIndices.push(headerIndex);
    letterToHeaderIndex[letter] = headerIndex;
    listItems.push({
      id: `header:${letter}`,
      type: 'header',
      letter,
    });

    for (const contact of groupedContacts.get(letter) ?? []) {
      listItems.push({
        id: `contact:${contact.id}`,
        type: 'contact',
        letter,
        contact,
      });
    }
  }

  return {
    listItems,
    stickyHeaderIndices,
    scrubberLetters,
    letterToHeaderIndex,
  };
};
