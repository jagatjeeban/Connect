import { ContactField } from 'expo-contacts';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, LayoutAnimation, type ListRenderItemInfo, StyleSheet, View } from 'react-native';

//import constants
import { colors, strings } from '@/constants';

//import components
import { HomeHeader } from '@/components';
import EmptyState from '@/features/favorites/components/empty-state';
import FavoriteContactItem from '@/features/favorites/components/favorite-contact-item';
import FavoritesHeader from '@/features/favorites/components/favorites-header';

//import hooks
import { useSearchFilter } from '@/hooks';

//import store
import { useAppStore } from '@/store/use-app-store';

//import helpers/services
import { useContactsQuery } from '@/features/contacts/contacts-query';
import { showAppMessage } from '@/helpers/app-message';
import { getContactName, getFavoriteContacts } from '@/helpers/custom-functions';

//import types
import type { DeviceContact } from '@/features/contacts/model';

//constants
const EMPTY_CONTACTS: DeviceContact[] = [];

//function to create a stable removal-message identifier for one contact
const getFavoriteRemovalMessageId = (contactId: string): string => `favorite-removed-${contactId}`;

/**
 * Displays searchable favorite contacts in a compact grid.
 */
const Favorites = () => {
  //hooks
  const router = useRouter();

  //queries
  const { data: contacts = EMPTY_CONTACTS } = useContactsQuery();

  //store events
  const favoriteContactIds = useAppStore((state) => state.favoriteContactIds);
  const addFavorite = useAppStore((state) => state.addFavorite);
  const removeFavorite = useAppStore((state) => state.removeFavorite);

  //states
  const [searchInput, setSearchInput] = useState('');

  //resolves the stored contacts that are marked as favorites
  const favoriteContacts = useMemo(() => {
    return getFavoriteContacts(contacts, favoriteContactIds);
  }, [contacts, favoriteContactIds]);

  const filteredContacts = useSearchFilter(favoriteContacts, ContactField.FULL_NAME, searchInput);

  const hasSearchQuery = searchInput.trim().length > 0;
  const showSearchEmptyState = filteredContacts.length === 0 && hasSearchQuery && favoriteContacts.length > 0;

  // Add-favorites navigation will be implemented with its dedicated route.
  const handleAddFavorite = useCallback(() => undefined, []);

  //opens the contact-details route for the selected contact
  const openContactDetails = useCallback(
    (contact: DeviceContact) => {
      router.push({
        pathname: '/contacts/[contactId]',
        params: { contactId: contact.id },
      });
    },
    [router],
  );

  //removes a favorite and offers an idempotent undo action
  const handleRemoveFavorite = useCallback(
    (contact: DeviceContact) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      removeFavorite(contact.id);

      showAppMessage(strings.removedFromFavorites, {
        action: {
          label: strings.undo,
          onPress: () => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            addFavorite(contact.id);
          },
        },
        description: getContactName(contact),
        id: getFavoriteRemovalMessageId(contact.id),
      });
    },
    [addFavorite, removeFavorite],
  );

  // Renders one favorite in the four-column grid.
  const renderFavoriteContact = useCallback(
    ({ item }: ListRenderItemInfo<DeviceContact>) => (
      <FavoriteContactItem item={item} onPress={openContactDetails} onRemoveFavorite={handleRemoveFavorite} />
    ),
    [handleRemoveFavorite, openContactDetails],
  );

  return (
    <View style={styles.container}>
      <HomeHeader menuBtn={false} placeholder={strings.searchContacts} searchEvent={setSearchInput} />
      <FavoritesHeader onPressAdd={handleAddFavorite} />
      <FlatList
        contentInsetAdjustmentBehavior={'automatic'}
        contentContainerStyle={[styles.listContent, filteredContacts.length === 0 && styles.emptyListContent]}
        data={filteredContacts}
        keyboardShouldPersistTaps={'handled'}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<EmptyState isSearchResultState={showSearchEmptyState} />}
        numColumns={4}
        renderItem={renderFavoriteContact}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Favorites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingBottom: 130,
  },
  emptyListContent: {
    paddingHorizontal: 0,
  },
});
