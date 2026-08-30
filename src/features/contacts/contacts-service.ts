import { Platform } from 'react-native';

import {
  addContactsChangeListener,
  Contact,
  ContactsSortOrder,
  getPermissionsAsync,
  requestPermissionsAsync,
  type ContactsPermissionResponse,
} from 'expo-contacts';
import { ContactTypes, presentFormAsync } from 'expo-contacts/legacy';

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
 * Subscribes to native contact changes only while contact access is granted.
 *
 * @param onContactsChange - Callback invoked after the device contacts change.
 * @returns The native subscription, or `null` when contact access is unavailable.
 */
export async function subscribeToDeviceContactChanges(
  onContactsChange: () => void,
): Promise<ReturnType<typeof addContactsChangeListener> | null> {
  const permission = await getPermissionsAsync();

  if (!permission.granted) {
    return null;
  }

  return addContactsChangeListener(onContactsChange);
}

/**
 * Loads the device contacts using the fields required by the application.
 *
 * @returns Device contacts sorted by given name, or an empty list without permission.
 */
export async function loadDeviceContacts(): Promise<DeviceContact[]> {
  const permission = await getPermissionsAsync();

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
export async function presentCreateContactForm(): Promise<boolean> {
  if (Platform.OS === 'ios') {
    const contactCount = await Contact.getCount();

    await presentFormAsync(null, { contactType: ContactTypes.Person, name: '' }, { isNew: true });
    return (await Contact.getCount()) > contactCount;
  }

  return Contact.presentCreateForm({});
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
export async function presentEditContactForm(contactId: string): Promise<DeviceContact | null> {
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
