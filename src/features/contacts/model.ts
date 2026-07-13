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
