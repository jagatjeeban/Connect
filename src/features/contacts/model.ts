import {
  ContactField,
  type PartialContactDetails,
} from "expo-contacts";

export const CONTACT_FIELDS = [
  ContactField.FULL_NAME,
  ContactField.PHONES,
  ContactField.EMAILS,
  ContactField.THUMBNAIL,
] as const;

export type DeviceContact = PartialContactDetails<typeof CONTACT_FIELDS>;

export type ContactHeaderItem = {
  id: string;
  type: "header";
  letter: string;
};

export type ContactRowItem = {
  id: string;
  type: "contact";
  letter: string;
  contact: DeviceContact;
};

export type ContactListItem = ContactHeaderItem | ContactRowItem;

export type PreparedContacts = {
  listItems: ContactListItem[];
  stickyHeaderIndices: number[];
  scrubberLetters: string[];
  letterToHeaderIndex: Record<string, number>;
};
