import type {
  ContactListItem,
  DeviceContact,
  PreparedContacts,
} from "@/features/contacts/model";

const UNKNOWN_SECTION = "#";

/**
 * Returns a contact's trimmed display name with a fallback for unnamed contacts.
 *
 * @param contact - Device contact whose name should be displayed.
 * @returns The contact's display name.
 */
export const getContactName = (contact: DeviceContact): string =>
  contact.fullName?.trim() || "Unnamed contact";

/**
 * Resolves the alphabetical section used to group a contact.
 *
 * @param contact - Device contact to categorize.
 * @returns An uppercase initial, or `#` when the name has no leading letter.
 */
export const getContactSectionLetter = (contact: DeviceContact): string => {
  const firstCharacter = Array.from(contact.fullName?.trim() ?? "")[0];

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
export const compareContactSectionLetters = (
  firstLetter: string,
  secondLetter: string,
): number => {
  if (firstLetter === UNKNOWN_SECTION) return 1;
  if (secondLetter === UNKNOWN_SECTION) return -1;

  return firstLetter.localeCompare(secondLetter, undefined, {
    sensitivity: "base",
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
export const buildAlphabetizedContactsList = (
  contacts: readonly DeviceContact[],
): PreparedContacts => {
  const sortedContacts = [...contacts].sort((firstContact, secondContact) =>
    getContactName(firstContact).localeCompare(
      getContactName(secondContact),
      undefined,
      {
        sensitivity: "base",
      },
    ),
  );
  const groupedContacts = new Map<string, DeviceContact[]>();

  for (const contact of sortedContacts) {
    const letter = getContactSectionLetter(contact);
    const sectionContacts = groupedContacts.get(letter) ?? [];
    sectionContacts.push(contact);
    groupedContacts.set(letter, sectionContacts);
  }

  const scrubberLetters = [...groupedContacts.keys()].sort(
    compareContactSectionLetters,
  );
  const listItems: ContactListItem[] = [];
  const stickyHeaderIndices: number[] = [];
  const letterToHeaderIndex: Record<string, number> = {};

  for (const letter of scrubberLetters) {
    const headerIndex = listItems.length;
    stickyHeaderIndices.push(headerIndex);
    letterToHeaderIndex[letter] = headerIndex;
    listItems.push({
      id: `header:${letter}`,
      type: "header",
      letter,
    });

    for (const contact of groupedContacts.get(letter) ?? []) {
      listItems.push({
        id: `contact:${contact.id}`,
        type: "contact",
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
