import { FlashList, type FlashListRef, type ListRenderItemInfo } from '@shopify/flash-list';
import { ContactField } from 'expo-contacts';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, LayoutAnimation, StyleSheet, View } from 'react-native';

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
 * Displays searchable favorite contacts in a balanced masonry gallery.
 */
const Favorites = () => {
  //hooks
  const router = useRouter();

  //refs
  const favoritesListRef = useRef<FlashListRef<DeviceContact>>(null);

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
      Keyboard.dismiss();
      router.push({
        pathname: '/contacts/[contactId]',
        params: { contactId: contact.id },
      });
    },
    [router],
  );

  //clears the active favorites search
  const handleSearchClear = useCallback(() => {
    setSearchInput('');
  }, []);

  //prepares FlashList recycling before animating one favorite insertion or removal
  const prepareFavoriteLayoutAnimation = useCallback(() => {
    favoritesListRef.current?.prepareForLayoutAnimationRender();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, []);

  //removes a favorite and offers an idempotent undo action
  const handleRemoveFavorite = useCallback(
    (contact: DeviceContact) => {
      prepareFavoriteLayoutAnimation();
      removeFavorite(contact.id);

      showAppMessage(strings.removedFromFavorites, {
        action: {
          label: strings.undo,
          onPress: () => {
            prepareFavoriteLayoutAnimation();
            addFavorite(contact.id);
          },
        },
        description: getContactName(contact),
        id: getFavoriteRemovalMessageId(contact.id),
      });
    },
    [addFavorite, prepareFavoriteLayoutAnimation, removeFavorite],
  );

  //renders one favorite in the two-column masonry gallery
  const renderFavoriteContact = useCallback(
    ({ item }: ListRenderItemInfo<DeviceContact>) => (
      <FavoriteContactItem item={item} onPress={openContactDetails} onRemoveFavorite={handleRemoveFavorite} />
    ),
    [handleRemoveFavorite, openContactDetails],
  );

  //returns the masonry list to its beginning whenever the search query changes
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      favoritesListRef.current?.scrollToOffset({ animated: false, offset: 0 });
    });

    return () => cancelAnimationFrame(frame);
  }, [searchInput]);

  return (
    <View style={styles.container}>
      <HomeHeader placeholder={strings.searchContacts} searchEvent={setSearchInput} searchInput={searchInput} />
      <FavoritesHeader onPressAdd={handleAddFavorite} />
      <FlashList
        ref={favoritesListRef}
        contentInsetAdjustmentBehavior={'automatic'}
        contentContainerStyle={[styles.listContent, filteredContacts.length === 0 && styles.emptyListContent]}
        data={filteredContacts}
        keyboardDismissMode={'on-drag'}
        keyboardShouldPersistTaps={'handled'}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<EmptyState isSearchResultState={showSearchEmptyState} onClearSearch={handleSearchClear} />}
        masonry
        numColumns={2}
        optimizeItemArrangement
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
    paddingHorizontal: 10,
    paddingBottom: 140,
  },
  emptyListContent: {
    paddingHorizontal: 0,
  },
});
