import { View, Text, TouchableOpacity, StyleSheet, FlatList, Platform, ActivityIndicator, RefreshControl, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react';
import FastImage from 'react-native-fast-image';
import Contact from 'react-native-contacts';
import { useDispatch, useSelector } from 'react-redux';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import { PressableScale } from 'pressto';

//import constants
import { Colors, FontFamily, Strings } from '../../common/constants';

//import common functions
import { sortContacts, mapDisplayContacts } from '../../common/helper/commonFun';

//import svgs
import SvgPlus from '../../assets/icons/svg/plus.svg';

//import components
import { HomeHeader } from '../../components';

//import custom functions
import { getUcFirstLetter } from '../../common/helper/customFun';

//import redux actions
import { storeContacts } from '../../store/dashSlice';

//import helper hooks
import { useResponsive } from '../../common/helper/hooks';

//contact item component
const ContactItem = ({ item, index, onClickEvent }) => {
  return (
    <TouchableOpacity key={index} activeOpacity={0.7} onPress={() => onClickEvent?.(item)} style={styles.contactItemContainer}>
      {item?.thumbnailPath !== '' ?
        <FastImage source={{ uri: item?.thumbnailPath, priority: 'high' }} style={styles.contactImg} />
        :
        <View style={styles.defaultContactImg}>
          <Text style={styles.contactFirstLetter}>{getUcFirstLetter(item?.displayName)}</Text>
        </View>
      }
      <Text style={styles.contactNameText}>{item?.displayName}</Text>
    </TouchableOpacity>
  )
}

const Contacts = ({ navigation }) => {

  //hooks
  const dispatch = useDispatch();
  const { rh } = useResponsive();

  //store events
  const storedContacts = useSelector((state) => state.dash.contacts);

  //refs
  const hasLoadedInitialContacts = useRef(storedContacts.length > 0);

  //states
  const [contacts, setContacts] = useState(() => mapDisplayContacts(storedContacts));
  const [filteredContacts, setFilteredContacts] = useState(() => mapDisplayContacts(storedContacts));
  const [sortedContacts, setSortedContacts] = useState([]);
  const [uniqueLetters, setUniqueLetters] = useState([]);
  const [loaderStatus, setLoaderStatus] = useState(false);
  const [isGranted, setIsGranted] = useState(false);

  //function to navigate to the contact details
  const navigateToDetails = (contactItem) => {
    if (!contactItem?.recordID) return;
    const selectedContact = storedContacts.find(contact => contact?.recordID === contactItem?.recordID);
    if (!selectedContact) return;
    navigation.navigate('ContactDetails', { info: selectedContact })
  }

  //component to render the contact item
  const RenderContactItem = ({ item, index }) => {
    return (
      <ContactItem
        item={item}
        index={index}
        onClickEvent={() => navigateToDetails(item)}
      />
    )
  }

  //contacts group item component
  const ContactGroupItem = ({ item: letter, index }) => {
    const filteredContacts = sortedContacts.filter(contact => getUcFirstLetter(contact?.displayName) === letter);
    return (
      <View key={index} style={styles.contactGroupContainer}>
        <Text style={styles.contactInitialText}>{letter}</Text>
        <FlatList
          data={filteredContacts}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          renderItem={RenderContactItem}
          keyExtractor={(item) => item?.recordID}
        />
      </View>
    )
  }

  //function to get all the contacts
  const getAllContacts = () => {
    setLoaderStatus(true);
    Contact.getAll()
      .then((contactList) => {
        const newList = contactList?.filter(item => item?.phoneNumbers?.length > 0) || [];
        dispatch(storeContacts(newList));
        const displayList = mapDisplayContacts(newList);
        setContacts(displayList);
        setFilteredContacts(displayList);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoaderStatus(false);
      })
  }

  //function to open the settings alert
  const openSettingAlert = () => {
    Alert.alert(
      'Connect would like to view your contacts',
      'Contacts access was denied. Please enable it from settings to continue.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: async () => await openSettings('application') }
      ]
    )
  }

  //function to request permission to read contacts
  const requestContactsPermission = async () => {
    const CONTACTS_PERMISSION = Platform.OS === "ios" ? PERMISSIONS.IOS.CONTACTS : PERMISSIONS.ANDROID.READ_CONTACTS;
    const current = await check(CONTACTS_PERMISSION);
    if (current === RESULTS.GRANTED) {
      setIsGranted(true);
      return;
    }
    if (current === RESULTS.BLOCKED) {
      // user denied + "Don't ask again" (Android) or denied in settings (iOS)
      openSettingAlert();
      setIsGranted(false);
      return;
    }
    const next = await request(CONTACTS_PERMISSION);
    setIsGranted(next === RESULTS.GRANTED);
  }

  useEffect(() => {
    requestContactsPermission();
  }, []);

  useEffect(() => {
    const displayList = mapDisplayContacts(storedContacts);
    setContacts(displayList);
    setFilteredContacts(displayList);
  }, [storedContacts]);

  //get all the contacts only for the initial empty-state load after permission is granted
  useEffect(() => {
    if (!isGranted || hasLoadedInitialContacts.current) return;

    hasLoadedInitialContacts.current = true;
    getAllContacts();
  }, [isGranted]);

  //function to sort the contacts arrays in alphabetical order
  useEffect(() => {
    setSortedContacts(sortContacts(filteredContacts));
  }, [filteredContacts]);

  //function to extract unique first letters from the sorted contacts array
  useEffect(() => {
    setUniqueLetters([...new Set(sortedContacts.map(contact => getUcFirstLetter(contact?.displayName)))]);
  }, [sortedContacts]);

  //function to search contacts
  const searchEvent = (req) => {
    if (req === '') {
      setFilteredContacts(contacts);
    } else {
      setFilteredContacts(contacts.filter(item => item?.displayName?.toLowerCase()?.includes(req?.toLowerCase())));
    }
  }

  //function to handle the navigation to select contacts screen
  const handleNavigationToSelectContacts = (type) => {
    if (type === 'all') {
      navigation.navigate('SelectContacts', { type: 'all', letters: uniqueLetters, contacts: sortedContacts });
    } else {
      navigation.navigate('SelectContacts', { letters: uniqueLetters, contacts: sortedContacts });
    }
  }

  return (
    <View style={styles.safeAreaView}>
      <HomeHeader
        placeholder={'Search contacts'}
        menuBtn
        selectEvent={handleNavigationToSelectContacts}
        selectAllEvent={() => handleNavigationToSelectContacts('all')}
        searchEvent={searchEvent}
      />
      {!isGranted ?
        <View style={styles.permissionStateContainer}>
          <Text style={styles.requireAccessTextStyle}>{Strings.RequireAccess}</Text>
          <TouchableOpacity onPress={() => requestContactsPermission()} style={styles.accessGrantBtn}>
            <Text style={styles.grantPermissionText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
        :
        loaderStatus ?
          <View style={styles.loaderContainer}>
            <ActivityIndicator size={'large'} color={Colors.Primary} />
          </View>
          :
          <FlatList
            data={uniqueLetters}
            nestedScrollEnabled={true}
            refreshControl={
              <RefreshControl
                refreshing={loaderStatus}
                onRefresh={getAllContacts}
                colors={[Colors.Primary]}
                progressBackgroundColor={Colors.Primary_Light}
              />
            }
            style={styles.contactsList}
            showsVerticalScrollIndicator={false}
            renderItem={ContactGroupItem}
            ListFooterComponent={<View style={styles.listFooter} />}
            keyExtractor={(_, index) => index.toString()}
          />
      }
      <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('CreateContact')} style={[styles.addContactBtn, { bottom: rh(20) }]}>
        <SvgPlus />
      </TouchableOpacity>
    </View>
  )
}

export default Contacts;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1
  },
  accessGrantBtn: {
    marginTop: 20,
    backgroundColor: Colors.Primary_Light,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  addContactBtn: {
    position: "absolute",
    right: 20,
    backgroundColor: Colors.Primary_Light,
    padding: 17,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  pillsBarStyle: {
    backgroundColor: Colors.Base_Grey,
    marginVertical: 20,
    width: 72,
  },
  bottomSheet: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: 20,
    backgroundColor: Colors.Bg_Light,
    borderWidth: 1,
    borderColor: Colors.Base_Grey
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  userName: {
    color: Colors.Base_White,
    fontSize: 18,
    fontWeight: '500',
    fontFamily: FontFamily.OutfitMedium
  },
  userEmail: {
    color: Colors.Base_Medium_Grey,
    fontSize: 14,
    fontFamily: FontFamily.OutfitRegular,
    marginTop: 5
  },
  activeUser: {
    backgroundColor: Colors.Primary_Light,
    borderRadius: 6,
    paddingVertical: 7,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  lineSeparator: {
    height: 1,
    backgroundColor: Colors.Base_Grey,
    marginVertical: 20
  },
  addAccountBtn: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: Colors.Primary,
    alignItems: "center",
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 15
  },
  bottomSheetContainer: {
    flex: 1,
    marginHorizontal: 20,
    justifyContent: "space-between",
  },
  contactGroupContainer: {
    flexDirection: 'row',
  },
  contactItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  contactNameText: {
    color: Colors.Base_White,
    fontSize: 18,
    fontFamily: FontFamily.OutfitRegular,
    marginLeft: 20,
    width: '75%',
  },
  contactInitialText: {
    color: Colors.Base_Medium_Grey,
    fontSize: 20,
    fontWeight: '500',
    fontFamily: FontFamily.OutfitMedium,
    marginTop: 20,
    width: 40,
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
  requireAccessTextStyle: {
    fontSize: 20,
    fontFamily: FontFamily.OutfitRegular,
    color: Colors.Base_Medium_Grey
  },
  permissionStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grantPermissionText: {
    color: Colors.Primary,
    fontSize: 17,
    fontFamily: FontFamily.OutfitMedium,
  },
  loaderContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: '70%',
  },
  contactsList: {
    paddingLeft: 20,
  },
  listFooter: {
    height: Platform.OS === 'android' ? 230 : 200,
  },
})
