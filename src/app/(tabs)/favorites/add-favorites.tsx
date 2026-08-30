import { ContactField } from 'expo-contacts';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

//import constants
import { colors, strings } from '@/constants';

//import components
import { PageHeader } from '@/components';
import ContactsList from '@/features/contacts/components/contacts-list';

//import hooks
import { useSearchFilter } from '@/hooks';

//import store
import { useAppStore } from '@/store/use-app-store';

//import helpers/services
import { useContactsQuery } from '@/features/contacts/contacts-query';

//import types
import { EMPTY_CONTACTS, type DeviceContact } from '@/features/contacts/model';

/**
 * Displays searchable device contacts and toggles their favorite selection state.
 */
const AddFavorites = () => {
  //queries
  const contactsQuery = useContactsQuery();
  const contacts = contactsQuery.data ?? EMPTY_CONTACTS;

  //store selectors/actions
  const favoriteContactIds = useAppStore((state) => state.favoriteContactIds);
  const toggleFavorite = useAppStore((state) => state.toggleFavorite);

  //states
  const [searchInput, setSearchInput] = useState('');

  //filters contacts based on the current search input
  const filteredContacts = useSearchFilter(contacts, ContactField.FULL_NAME, searchInput);

  //provides constant-time selection checks to the contact rows
  const selectedContactIds = useMemo(() => new Set(favoriteContactIds), [favoriteContactIds]);

  //toggles the selected contact in durable favorites state
  const handleContactSelection = useCallback(
    (contact: DeviceContact) => {
      toggleFavorite(contact.id);
    },
    [toggleFavorite],
  );

  //clears the active contact search
  const handleSearchClear = useCallback(() => {
    setSearchInput('');
  }, []);

  return (
    <View style={styles.mainContainer}>
      <PageHeader
        backBtn
        placeholder={strings.searchContacts}
        headerTitle={strings.addToFavorites}
        iconArr={['search']}
        searchEvent={setSearchInput}
      />
      <ContactsList
        contacts={filteredContacts}
        loaderStatus={contactsQuery.isPending}
        isSelectEvent
        isScrubberVisible={false}
        selectedContactIds={selectedContactIds}
        onClearSearch={handleSearchClear}
        onClickContact={handleContactSelection}
        searchText={searchInput}
        totalContactsCount={contacts.length}
      />
    </View>
  );
};

export default AddFavorites;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
});
