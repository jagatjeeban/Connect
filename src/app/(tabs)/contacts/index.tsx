import {
  Contact,
  ContactField,
  getPermissionsAsync,
  requestPermissionsAsync,
} from "expo-contacts";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

//import components
import { HomeHeader } from "@/components";
import ContactsList from "@/features/contacts/components/contacts-list";

//import constants
import { colors, fontFamily, strings } from "@/constants";

//import hooks
import { useResponsive, useSearchFilter } from "@/hooks";

//import services
import { loadDeviceContacts } from "@/features/contacts/contacts-service";

//import store
import { useAppStore } from "@/store/use-app-store";

//import types
import type { DeviceContact } from "@/features/contacts/model";

//import svgs
import SvgPlus from "@/assets/icons/plus.svg";

const Contacts = () => {
  //hooks
  const { rh } = useResponsive();

  //store events
  const storedContacts = useAppStore((state) => state.contacts);
  const setStoredContacts = useAppStore((state) => state.setContacts);

  //refs
  const hasLoadedInitialContacts = useRef(storedContacts.length > 0);

  //states
  const [loaderStatus, setLoaderStatus] = useState(false);
  const [isGranted, setIsGranted] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  //filters contacts based on the current search input
  const filteredContacts = useSearchFilter(
    storedContacts,
    ContactField.FULL_NAME,
    searchInput,
  );

  //shows an alert that can open the app's system settings
  const openSettingsAlert = useCallback(() => {
    Alert.alert(
      "Connect would like to view your contacts",
      "Contacts access was denied. Please enable it from settings to continue.",
      [
        { text: strings.cancel, style: "cancel" },
        {
          text: "Open Settings",
          onPress: () => {
            void Linking.openSettings();
          },
        },
      ],
    );
  }, []);

  //loads contacts that contain at least one phone number
  const getAllContacts = useCallback(async () => {
    setLoaderStatus(true);

    try {
      const contactList = await loadDeviceContacts();
      const contactsWithPhoneNumbers = contactList.filter(
        (contact) => contact.phones.length > 0,
      );
      setStoredContacts(contactsWithPhoneNumbers);
    } catch (error) {
      console.error("Contact fetch error", error);
      Alert.alert("Unable to load contacts", strings.errorMessage);
    } finally {
      setLoaderStatus(false);
    }
  }, [setStoredContacts]);

  //requests contact access or directs blocked users to system settings
  const requestContactsPermission = useCallback(async () => {
    try {
      let permission = await getPermissionsAsync();

      if (!permission.granted && permission.canAskAgain) {
        permission = await requestPermissionsAsync();
      }

      setIsGranted(permission.granted);

      if (!permission.granted && !permission.canAskAgain) {
        openSettingsAlert();
      }
    } catch (error) {
      console.error("Contacts permission error", error);
      setIsGranted(false);
      Alert.alert("Unable to request permission", strings.errorMessage);
    }
  }, [openSettingsAlert]);

  //opens the native contact form for the selected contact
  const openContactDetails = useCallback(
    async (contact: DeviceContact) => {
      try {
        const wasUpdated = await new Contact(contact.id).editWithForm();

        if (wasUpdated) {
          await getAllContacts();
        }
      } catch (error) {
        console.error("Contact details error", error);
        Alert.alert("Unable to open contact", strings.errorMessage);
      }
    },
    [getAllContacts],
  );

  //opens the native create-contact form and refreshes after a successful save
  const createContact = useCallback(async () => {
    try {
      const wasCreated = await Contact.presentCreateForm();

      if (wasCreated && isGranted) {
        await getAllContacts();
      }
    } catch (error) {
      console.error("Create contact error", error);
      Alert.alert("Unable to create contact", strings.errorMessage);
    }
  }, [getAllContacts, isGranted]);

  //requests contact permission when the screen first mounts
  useEffect(() => {
    void requestContactsPermission();
  }, [requestContactsPermission]);

  //loads contacts once after permission is granted and the store is empty
  useEffect(() => {
    if (!isGranted || hasLoadedInitialContacts.current) return;

    hasLoadedInitialContacts.current = true;
    void getAllContacts();
  }, [getAllContacts, isGranted]);

  return (
    <View style={styles.container}>
      <HomeHeader
        placeholder="Search contacts"
        menuBtn
        searchEvent={setSearchInput}
      />

      {!isGranted ? (
        <View style={styles.permissionStateContainer}>
          <Text style={styles.requireAccessText}>{strings.requireAccess}</Text>
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.7}
            onPress={() => void requestContactsPermission()}
            style={styles.grantAccessButton}
          >
            <Text style={styles.grantPermissionText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ContactsList
          contacts={filteredContacts}
          loaderStatus={loaderStatus}
          onClickContact={(contact) => void openContactDetails(contact)}
          searchText={searchInput}
          totalContactsCount={storedContacts.length}
        />
      )}

      <TouchableOpacity
        accessibilityLabel="Create contact"
        accessibilityRole="button"
        activeOpacity={0.7}
        onPress={() => void createContact()}
        style={[styles.addContactButton, { bottom: rh(20) }]}
      >
        <SvgPlus />
      </TouchableOpacity>
    </View>
  );
};

export default Contacts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  permissionStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  requireAccessText: {
    color: colors.baseMediumGrey,
    fontSize: 20,
    fontFamily: fontFamily.outfitRegular,
    textAlign: "center",
  },
  grantAccessButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    backgroundColor: colors.primaryLight,
  },
  grantPermissionText: {
    color: colors.primary,
    fontSize: 17,
    fontFamily: fontFamily.outfitMedium,
  },
  addContactButton: {
    position: "absolute",
    right: 20,
    padding: 17,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: colors.primaryLight,
  },
});
