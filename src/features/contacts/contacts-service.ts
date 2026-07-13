import {
  Contact,
  ContactsSortOrder,
  getPermissionsAsync,
  requestPermissionsAsync,
} from "expo-contacts";

import {
  CONTACT_FIELDS,
  type DeviceContact,
} from "@/features/contacts/model";

export async function loadDeviceContacts(): Promise<DeviceContact[]> {
  let permission = await getPermissionsAsync();

  if (permission.status === "undetermined") {
    permission = await requestPermissionsAsync();
  }

  if (permission.status !== "granted") {
    return [];
  }

  return Contact.getAllDetails(CONTACT_FIELDS, {
    sortOrder: ContactsSortOrder.GivenName,
  });
}
