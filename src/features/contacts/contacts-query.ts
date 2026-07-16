import { queryOptions, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query';

//import services
import { loadDeviceContact, loadDeviceContacts } from '@/features/contacts/contacts-service';

//import types
import type { DeviceContact } from '@/features/contacts/model';

//query keys
export const contactsQueryKeys = {
  all: ['contacts'] as const,
  collection: ['contacts', 'collection'] as const,
  details: ['contacts', 'detail'] as const,

  //builds the cache key for one native contact
  detail: (contactId: string) => [...contactsQueryKeys.details, contactId] as const,
};

//shared device-query behavior that leaves TanStack's garbage collection at its default
const DEVICE_QUERY_OPTIONS = {
  networkMode: 'always',
  retry: false,
  staleTime: Infinity,
} as const;

// Loads the device contacts displayed by the application.
const loadVisibleDeviceContacts = async (): Promise<DeviceContact[]> => {
  const contacts = await loadDeviceContacts();
  return contacts.filter((contact) => contact.phones.length > 0);
};

/**
 * Reads the shared device-contacts collection.
 *
 * @param enabled - Whether the native contacts query is allowed to run.
 * @returns The TanStack Query result for the contacts collection.
 */
export const useContactsQuery = (enabled: boolean = true) =>
  useQuery(
    queryOptions({
      queryKey: contactsQueryKeys.collection,
      queryFn: loadVisibleDeviceContacts,
      enabled,
      ...DEVICE_QUERY_OPTIONS,
    }),
  );

/**
 * Reads one contact, seeding its cache from the collection when available.
 *
 * @param contactId - Native contact identifier from the route.
 * @returns The TanStack Query result for the requested contact.
 */
export const useContactQuery = (contactId?: string) => {
  const queryClient = useQueryClient();
  const resolvedContactId = contactId ?? '';

  return useQuery(
    queryOptions({
      queryKey: contactsQueryKeys.detail(resolvedContactId),
      queryFn: () => loadDeviceContact(resolvedContactId),
      enabled: Boolean(contactId),
      initialData: () =>
        queryClient
          .getQueryData<DeviceContact[]>(contactsQueryKeys.collection)
          ?.find((contact) => contact.id === resolvedContactId),
      initialDataUpdatedAt: () => queryClient.getQueryState(contactsQueryKeys.collection)?.dataUpdatedAt,
      ...DEVICE_QUERY_OPTIONS,
    }),
  );
};

/**
 * Invalidates only the contacts collection so it can be canonically reloaded and sorted.
 *
 * @param queryClient - Query client that owns the contacts cache.
 */
export const invalidateContactsCollection = (queryClient: QueryClient): Promise<void> =>
  queryClient.invalidateQueries({
    queryKey: contactsQueryKeys.collection,
    exact: true,
  });

/**
 * Invalidates every collection and detail query backed by device contacts.
 *
 * @param queryClient - Query client that owns the contacts cache.
 */
export const invalidateContactQueries = (queryClient: QueryClient): Promise<void> =>
  queryClient.invalidateQueries({ queryKey: contactsQueryKeys.all });

/**
 * Inserts or replaces one contact in collection and detail query caches.
 *
 * @param queryClient - Query client that owns the contacts cache.
 * @param contact - Refreshed contact returned by the device API.
 */
export const upsertContactQueryData = (queryClient: QueryClient, contact: DeviceContact): void => {
  queryClient.setQueryData<DeviceContact[]>(contactsQueryKeys.collection, (contacts) => {
    if (!contacts) return contacts;

    const containsContact = contacts.some((storedContact) => storedContact.id === contact.id);

    if (contact.phones.length === 0) {
      return containsContact ? contacts.filter((storedContact) => storedContact.id !== contact.id) : contacts;
    }

    if (!containsContact) {
      return [...contacts, contact];
    }

    return contacts.map((storedContact) => (storedContact.id === contact.id ? contact : storedContact));
  });

  queryClient.setQueryData(contactsQueryKeys.detail(contact.id), contact);
};

/**
 * Removes one contact from the collection and clears its detail query.
 *
 * @param queryClient - Query client that owns the contacts cache.
 * @param contactId - Native identifier of the deleted contact.
 */
export const removeContactQueryData = (queryClient: QueryClient, contactId: string): void => {
  queryClient.setQueryData<DeviceContact[]>(contactsQueryKeys.collection, (contacts) =>
    contacts?.filter((contact) => contact.id !== contactId),
  );
  queryClient.removeQueries({ queryKey: contactsQueryKeys.detail(contactId), exact: true });
};
