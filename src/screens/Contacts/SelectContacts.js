import { View, StyleSheet, InteractionManager } from 'react-native';
import React, { useRef, useState, useEffect, useCallback, startTransition } from 'react';
import { useIsFocused } from '@react-navigation/native';

//import constants
import { Strings, Colors, FontFamily } from '../../common/constants';

//import components
import { PageHeader, ContactsList } from '../../components';

//import helper hooks
import { useSearchFilter } from '../../common/helper/hooks';

const buildSelectableContacts = (contactList = [], shouldSelectAll = false) => {
  const nextContacts = contactList.slice();
  const nextSelectedIds = new Set();

  if (!shouldSelectAll) {
    return {
      nextContacts,
      nextSelectedIds,
      nextSelectedCount: 0
    };
  }

  for (let index = 0; index < nextContacts.length; index += 1) {
    const recordId = nextContacts[index]?.recordID;
    if (recordId) {
      nextSelectedIds.add(recordId);
    }
  }

  return {
    nextContacts,
    nextSelectedIds,
    nextSelectedCount: nextSelectedIds.size
  };
};

const SelectContacts = ({ navigation, route }) => {

  //hooks
  const isFocused = useIsFocused();

  //states
  const [contacts, setContacts] = useState([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const [loaderStatus, setLoaderStatus] = useState(false);
  const [selectionVersion, setSelectionVersion] = useState(0);
  const [searchInput, setSearchInput] = useState('');

  //refs
  const selectedContactIdsRef = useRef(new Set());
  const filteredContacts = useSearchFilter(contacts, 'displayName', searchInput);

  //funtion to select contacts
  const selectContacts = (id, value) => {
    if (!id) return;

    const selectedIds = selectedContactIdsRef.current;
    const isSelected = selectedIds.has(id);
    if (isSelected === value) return;

    if (value) {
      selectedIds.add(id);
    } else {
      selectedIds.delete(id);
    }

    setSelectedCount(selectedIds.size);
    setSelectionVersion(prevVersion => prevVersion + 1);
  }

  //function to get the contacts list
  const getContactList = useCallback(() => {
    setLoaderStatus(true);
    const routeContacts = Array.isArray(route?.params?.contacts) ? route?.params?.contacts : [];
    const shouldSelectAll = route?.params?.type !== undefined;

    const interactionTask = InteractionManager.runAfterInteractions(() => {
      const { nextContacts, nextSelectedIds, nextSelectedCount } = buildSelectableContacts(routeContacts, shouldSelectAll);

      selectedContactIdsRef.current = nextSelectedIds;

      startTransition(() => {
        setContacts(nextContacts);
        setSelectedCount(nextSelectedCount);
        setSelectionVersion(prevVersion => prevVersion + 1);
        setLoaderStatus(false);
      });
    });

    return () => interactionTask.cancel();
  }, [route?.params?.contacts, route?.params?.type]);

  useEffect(() => {
    if (!isFocused) return;

    return getContactList();
  }, [getContactList, isFocused]);

  return (
    <View style={styles.safeAreaView}>
      <PageHeader
        headerTitle={selectedCount > 0 ? `${selectedCount} selected` : Strings.SelectContacts}
        backBtn
        iconArr={selectedCount > 0 ? ['search', 'trash', 'share'] : ['search']}
        navigation={navigation}
        searchEvent={setSearchInput}
      />
      <ContactsList
        contacts={filteredContacts}
        loaderStatus={loaderStatus}
        isSelectEvent
        selectedContactIds={selectedContactIdsRef.current}
        selectionVersion={selectionVersion}
        searchText={searchInput}
        totalContactsCount={contacts.length}
        onClickContact={(contact) => selectContacts(contact?.recordID, !selectedContactIdsRef.current.has(contact?.recordID))}
      />
    </View>
  )
}

export default SelectContacts;

export const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1
  },
  contactNameText: {
    color: Colors.Base_White,
    fontSize: 18,
    fontFamily: FontFamily.OutfitRegular,
    marginLeft: 20,
    width: '78%',
  },
  contactImg: {
    width: 44,
    height: 44,
    borderRadius: 10
  },
  defaultContactImg: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: Colors.Primary_Light
  },
  contactFirstLetter: {
    color: Colors.Primary,
    fontSize: 20,
    fontFamily: FontFamily.OutfitMedium
  },
  contactInitialText: {
    color: Colors.Base_Medium_Grey,
    fontSize: 20,
    fontWeight: '500',
    fontFamily: FontFamily.OutfitMedium,
    marginTop: 20,
    width: 40,
  },
  contactItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    width: "100%"
  },
  contactGroupContainer: {
    flexDirection: 'row',
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  loaderContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: '90%',
  },
  listFooter: {
    height: Platform.OS === 'android' ? 230 : 200,
  },
})
