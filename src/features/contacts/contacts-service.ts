import {
  Contact,
  ContactsSortOrder,
  getPermissionsAsync,
  requestPermissionsAsync,
  type ContactsPermissionResponse,
} from 'expo-contacts';

//import types
import { CONTACT_FIELDS, type DeviceContact } from '@/features/contacts/model';

/**
 * Resolves the current contacts permission, requesting access when possible.
 *
 * @returns The latest contacts permission response.
 */
export async function requestDeviceContactsPermission(): Promise<ContactsPermissionResponse> {
  const permission = await getPermissionsAsync();

  if (!permission.granted && permission.canAskAgain) {
    return requestPermissionsAsync();
  }

  return permission;
}

/**
 * Loads the device contacts using the fields required by the application.
 *
 * @returns Device contacts sorted by given name, or an empty list without permission.
 */
export async function loadDeviceContacts(): Promise<DeviceContact[]> {
  let permission = await getPermissionsAsync();

  if (permission.status === 'undetermined') {
    permission = await requestPermissionsAsync();
  }

  if (permission.status !== 'granted') {
    return [];
  }

  return Contact.getAllDetails(CONTACT_FIELDS, {
    sortOrder: ContactsSortOrder.GivenName,
  });
}

/**
 * Presents the native create-contact form.
 *
 * @returns Whether the user created a contact.
 */
export async function createDeviceContact(): Promise<boolean> {
  return Contact.presentCreateForm();
}

/**
 * Loads one device contact by identifier.
 *
 * @param contactId - Native contact identifier.
 * @returns The requested contact details.
 */
export async function loadDeviceContact(contactId: string): Promise<DeviceContact> {
  return new Contact(contactId).getDetails(CONTACT_FIELDS);
}

/**
 * Presents the native edit form and returns the refreshed contact when saved.
 *
 * @param contactId - Native contact identifier.
 * @returns The updated contact, or `null` when the user cancels.
 */
export async function editDeviceContact(contactId: string): Promise<DeviceContact | null> {
  const contact = new Contact(contactId);
  const wasUpdated = await contact.editWithForm();

  if (!wasUpdated) {
    return null;
  }

  return contact.getDetails(CONTACT_FIELDS);
}

/**
 * Deletes one contact from the device.
 *
 * @param contactId - Native contact identifier.
 */
export async function deleteDeviceContact(contactId: string): Promise<void> {
  await new Contact(contactId).delete();
}
