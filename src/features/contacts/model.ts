import { ContactField, type PartialContactDetails } from 'expo-contacts';

export const CONTACT_FIELDS = [
  ContactField.FULL_NAME,
  ContactField.PHONES,
  ContactField.EMAILS,
  // Expo Contacts 57's iOS thumbnail mapper reads imageData internally.
  // Fetch IMAGE with THUMBNAIL so that native access is always available.
  ContactField.IMAGE,
  ContactField.THUMBNAIL,
] as const;

export type DeviceContact = PartialContactDetails<typeof CONTACT_FIELDS>;

export type DevicePhone = DeviceContact['phones'][number];

export type SharedElementFrame = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ContactIdentitySnapshot = {
  contactId: string;
  initial: string;
  name: string;
  thumbnail?: string;
};

export type ContactSharedTransitionSource = {
  avatarFrame: SharedElementFrame;
  nameFrame: SharedElementFrame;
};

export type ContactHeaderItem = {
  id: string;
  type: 'header';
  letter: string;
};

export type ContactRowItem = {
  id: string;
  type: 'contact';
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
