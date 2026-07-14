import {
  Contact,
  ContactField,
  getPermissionsAsync,
  requestPermissionsAsync,
} from "expo-contacts";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Linking,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

//import components
import { HomeHeader } from "@/components";
import TextComponent from "@/components/core-components/text-component";
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

const IOS_ADD_BUTTON_TAB_BAR_CLEARANCE = 24;

const Contacts = () => {
  //hooks
  const router = useRouter();
  const { rh } = useResponsive();
  const insets = useSafeAreaInsets();

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

  //opens the contact-details route for the selected contact
  const openContactDetails = useCallback(
    (contact: DeviceContact) => {
      router.push({
        pathname: "/contacts/[contactId]",
        params: { contactId: contact.id },
      });
    },
    [router],
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
          <TextComponent
            color={colors.baseMediumGrey}
            fontFamily={fontFamily.outfitRegular}
            styleProfile="large3"
            text={strings.requireAccess}
            textAlign="center"
          />
          <Pressable
            accessibilityRole="button"
            onPress={() => void requestContactsPermission()}
            style={styles.grantAccessButton}
          >
            <TextComponent
              color={colors.primary}
              styleProfile="large1"
              text="Grant Permission"
            />
          </Pressable>
        </View>
      ) : (
        <ContactsList
          contacts={filteredContacts}
          loaderStatus={loaderStatus}
          onClickContact={openContactDetails}
          searchText={searchInput}
          totalContactsCount={storedContacts.length}
        />
      )}

      <Pressable
        accessibilityLabel="Create contact"
        accessibilityRole="button"
        onPress={() => void createContact()}
        style={[
          styles.addContactButton,
          {
            bottom:
              process.env.EXPO_OS === "ios"
                ? insets.bottom + IOS_ADD_BUTTON_TAB_BAR_CLEARANCE
                : rh(10),
          },
        ]}
      >
        <SvgPlus />
      </Pressable>
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
  grantAccessButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    backgroundColor: colors.primaryLight,
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
