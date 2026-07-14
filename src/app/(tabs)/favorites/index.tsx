import { ContactField } from "expo-contacts";
import { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  type ListRenderItemInfo,
  StyleSheet,
  View,
} from "react-native";

//import components
import { HomeHeader } from "@/components";
import EmptyState from "@/features/favorites/components/empty-state";
import FavoriteContactItem from "@/features/favorites/components/favorite-contact-item";
import FavoritesHeader from "@/features/favorites/components/favorites-header";

//import constants
import { colors } from "@/constants";

//import helpers
import { getFavoriteContacts } from "@/helpers/customFun";

//import hooks
import { useSearchFilter } from "@/hooks";

//import store
import { useAppStore } from "@/store/use-app-store";

//import types
import type { DeviceContact } from "@/features/contacts/model";

const MAX_VISIBLE_FAVORITES = 6;

// Renders one favorite in the four-column grid.
const renderFavoriteContact = ({ item }: ListRenderItemInfo<DeviceContact>) => (
  <FavoriteContactItem item={item} />
);

const Favorites = () => {
  //store events
  const contacts = useAppStore((state) => state.contacts);
  const favoriteContactIds = useAppStore((state) => state.favoriteContactIds);

  //states
  const [searchInput, setSearchInput] = useState("");

  const favoriteContacts = useMemo(() => {
    return getFavoriteContacts(contacts, favoriteContactIds);
  }, [contacts, favoriteContactIds]);

  const filteredContacts = useSearchFilter(
    favoriteContacts,
    ContactField.FULL_NAME,
    searchInput,
  );

  const visibleContacts = useMemo(
    () => filteredContacts.slice(0, MAX_VISIBLE_FAVORITES),
    [filteredContacts],
  );
  const hasSearchQuery = searchInput.trim().length > 0;
  const showSearchEmptyState =
    visibleContacts.length === 0 &&
    hasSearchQuery &&
    favoriteContacts.length > 0;

  // Add-favorites navigation will be implemented with its dedicated route.
  const handleAddFavorite = useCallback(() => undefined, []);

  return (
    <View style={styles.container}>
      <HomeHeader
        menuBtn={false}
        placeholder={"Search contacts"}
        searchEvent={setSearchInput}
      />
      <FavoritesHeader onPressAdd={handleAddFavorite} />
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[
          styles.listContent,
          visibleContacts.length === 0 && styles.emptyListContent,
        ]}
        data={visibleContacts}
        initialNumToRender={MAX_VISIBLE_FAVORITES}
        keyboardShouldPersistTaps="handled"
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <EmptyState isSearchResultState={showSearchEmptyState} />
        }
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
