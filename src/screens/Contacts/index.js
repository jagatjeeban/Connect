import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Contact from "react-native-contacts";
import { useDispatch, useSelector } from "react-redux";
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from "react-native-permissions";
import { showMessage } from "react-native-flash-message";

//import constants
import { Colors, FontFamily, Strings } from "../../common/constants";

//import common functions
import { mapDisplayContacts } from "../../common/helper/commonFun";

//import svgs
import SvgPlus from "../../assets/icons/svg/plus.svg";

//import components
import { ContactsList, HomeHeader } from "../../components";

//import custom functions

//import redux actions
import { storeContacts } from "../../store/dashSlice";

//import helper hooks
import { useResponsive, useSearchFilter } from "../../common/helper/hooks";

const Contacts = ({ navigation }) => {
  //hooks
  const dispatch = useDispatch();
  const { rh } = useResponsive();

  //store events
  const storedContacts = useSelector((state) => state.dash.contacts);

  //refs
  const hasLoadedInitialContacts = useRef(storedContacts.length > 0);

  //states
  const [contacts, setContacts] = useState(() =>
    mapDisplayContacts(storedContacts)
  );
  const [loaderStatus, setLoaderStatus] = useState(false);
  const [isGranted, setIsGranted] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  //filtered contacts based on the search input
  const filteredContacts = useSearchFilter(
    contacts,
    "displayName",
    searchInput
  );

  //function to navigate to the contact details
  const navigateToDetails = (contactItem) => {
    if (!contactItem?.recordID) {
      return;
    }
    const selectedContact = storedContacts.find(
      (contact) => contact?.recordID === contactItem?.recordID
    );
    if (!selectedContact) {
      return;
    }
    navigation.navigate("ContactDetails", { info: selectedContact });
  };

  //function to get all the contacts
  const getAllContacts = useCallback(() => {
    setLoaderStatus(true);
    Contact.getAll()
      .then((contactList) => {
        const newList =
          contactList?.filter((item) => item?.phoneNumbers?.length > 0) || [];
        dispatch(storeContacts(newList));
        const displayList = mapDisplayContacts(newList);
        setContacts(displayList);
      })
      .catch((e) => {
        console.log("Contact fetch Err", e);
        showMessage({
          message: Strings.ErrMsg,
          type: "danger",
          icon: "info",
        });
      })
      .finally(() => {
        setLoaderStatus(false);
      });
  }, [dispatch]);

  //function to open the settings alert
  const openSettingAlert = useCallback(() => {
    Alert.alert(
      "Connect would like to view your contacts",
      "Contacts access was denied. Please enable it from settings to continue.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Open Settings",
          onPress: async () => await openSettings("application"),
        },
      ]
    );
  }, []);

  //function to request permission to read contacts
  const requestContactsPermission = useCallback(async () => {
    const CONTACTS_PERMISSION =
      Platform.OS === "ios"
        ? PERMISSIONS.IOS.CONTACTS
        : PERMISSIONS.ANDROID.READ_CONTACTS;
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
  }, [openSettingAlert]);

  //request contacts permission on mount
  useEffect(() => {
    requestContactsPermission();
  }, [requestContactsPermission]);

  useEffect(() => {
    if (storedContacts) {
      setContacts(mapDisplayContacts(storedContacts));
    }
  }, [storedContacts]);

  //get all the contacts only for the initial empty-state load after permission is granted
  useEffect(() => {
    if (!isGranted || hasLoadedInitialContacts.current) {
      return;
    }

    hasLoadedInitialContacts.current = true;
    getAllContacts();
  }, [getAllContacts, isGranted]);

  //function to handle the navigation to select contacts screen
  const handleNavigationToSelectContacts = (type) => {
    navigation.navigate("SelectContacts", { type, contacts });
  };

  return (
    <View style={styles.safeAreaView}>
      <HomeHeader
        placeholder={"Search contacts"}
        menuBtn
        selectEvent={handleNavigationToSelectContacts}
        selectAllEvent={() => handleNavigationToSelectContacts("all")}
        searchEvent={setSearchInput}
      />
      {!isGranted ? (
        <View style={styles.permissionStateContainer}>
          <Text style={styles.requireAccessTextStyle}>
            {Strings.RequireAccess}
          </Text>
          <TouchableOpacity
            onPress={() => requestContactsPermission()}
            style={styles.accessGrantBtn}
          >
            <Text style={styles.grantPermissionText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ContactsList
          contacts={filteredContacts}
          loaderStatus={loaderStatus}
          onClickContact={navigateToDetails}
          searchText={searchInput}
          totalContactsCount={contacts.length}
        />
      )}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigation.navigate("CreateContact")}
        style={[styles.addContactBtn, { bottom: rh(20) }]}
      >
        <SvgPlus />
      </TouchableOpacity>
    </View>
  );
};

export default Contacts;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  accessGrantBtn: {
    marginTop: 20,
    backgroundColor: Colors.Primary_Light,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  addContactBtn: {
    position: "absolute",
    right: 20,
    backgroundColor: Colors.Primary_Light,
    padding: 17,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
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
    borderColor: Colors.Base_Grey,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userName: {
    color: Colors.Base_White,
    fontSize: 18,
    fontWeight: "500",
    fontFamily: FontFamily.OutfitMedium,
  },
  userEmail: {
    color: Colors.Base_Medium_Grey,
    fontSize: 14,
    fontFamily: FontFamily.OutfitRegular,
    marginTop: 5,
  },
  activeUser: {
    backgroundColor: Colors.Primary_Light,
    borderRadius: 6,
    paddingVertical: 7,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  lineSeparator: {
    height: 1,
    backgroundColor: Colors.Base_Grey,
    marginVertical: 20,
  },
  addAccountBtn: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: Colors.Primary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingVertical: 15,
  },
  bottomSheetContainer: {
    flex: 1,
    marginHorizontal: 20,
    justifyContent: "space-between",
  },
  requireAccessTextStyle: {
    fontSize: 20,
    fontFamily: FontFamily.OutfitRegular,
    color: Colors.Base_Medium_Grey,
  },
  permissionStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  grantPermissionText: {
    color: Colors.Primary,
    fontSize: 17,
    fontFamily: FontFamily.OutfitMedium,
  },
});
