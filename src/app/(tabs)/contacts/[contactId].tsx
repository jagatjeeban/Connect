import { Contact } from "expo-contacts";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

//import components
import { ConfirmationBottomSheet } from "@/components";
import ContactDetailsContent from "@/features/contacts/components/contact-details-content";

//import constants
import { colors, strings } from "@/constants";

//import helpers
import {
  openEmail,
  openPhoneCall,
  openTextMessage,
  shareText,
} from "@/helpers/commonFun";
import {
  buildContactShareMessage,
  getUniqueContactPhones,
} from "@/helpers/customFun";

//import store
import { useAppStore } from "@/store/use-app-store";

//import types
import {
  CONTACT_FIELDS,
  type DeviceContact,
} from "@/features/contacts/model";

const ContactDetails = () => {
  //hooks
  const router = useRouter();
  const { contactId } = useLocalSearchParams<{ contactId?: string }>();

  //refs
  const deletedContactIdRef = useRef<string | null>(null);

  //store events
  const storedContact = useAppStore((state) =>
    state.contacts.find((contact) => contact.id === contactId),
  );
  const favoriteContactIds = useAppStore((state) => state.favoriteContactIds);
  const toggleFavorite = useAppStore((state) => state.toggleFavorite);
  const upsertContact = useAppStore((state) => state.upsertContact);
  const removeContact = useAppStore((state) => state.removeContact);

  //states
  const [loadedContact, setLoadedContact] = useState<DeviceContact>();
  const [isLoading, setIsLoading] = useState(!storedContact);
  const [hasLoadError, setHasLoadError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteSheetPresented, setIsDeleteSheetPresented] = useState(false);

  const contact =
    storedContact ??
    (loadedContact?.id === contactId ? loadedContact : undefined);
  const phones = useMemo(
    () => getUniqueContactPhones(contact?.phones ?? []),
    [contact?.phones],
  );
  const primaryPhoneNumber = phones[0]?.number?.trim();
  const primaryEmailAddress = contact?.emails
    .find((email) => Boolean(email.address?.trim()))
    ?.address?.trim();
  const isFavorite = contact
    ? favoriteContactIds.includes(contact.id)
    : false;

  //loads contact details when the route is opened outside the populated list
  useEffect(() => {
    let isMounted = true;

    if (deletedContactIdRef.current === contactId) {
      return () => {
        isMounted = false;
      };
    }

    if (!contactId) {
      setLoadedContact(undefined);
      setIsLoading(false);
      setHasLoadError(false);
      return () => {
        isMounted = false;
      };
    }

    if (storedContact) {
      setLoadedContact(storedContact);
      setIsLoading(false);
      setHasLoadError(false);
      return () => {
        isMounted = false;
      };
    }

    const loadContact = async () => {
      setIsLoading(true);
      setHasLoadError(false);

      try {
        const contactDetails = await new Contact(contactId).getDetails(
          CONTACT_FIELDS,
        );

        if (!isMounted) return;

        setLoadedContact(contactDetails);
        upsertContact(contactDetails);
      } catch (error) {
        if (
          !isMounted ||
          deletedContactIdRef.current === contactId
        ) {
          return;
        }

        console.error("Contact details load error", error);
        setLoadedContact(undefined);
        setHasLoadError(true);
      } finally {
        if (
          isMounted &&
          deletedContactIdRef.current !== contactId
        ) {
          setIsLoading(false);
        }
      }
    };

    void loadContact();

    return () => {
      isMounted = false;
    };
  }, [contactId, storedContact, upsertContact]);

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/contacts");
  }, [router]);

  const showActionError = useCallback((label: string, error: unknown) => {
    console.error(`${label} error`, error);
    Alert.alert(strings.unableCompleteAction, strings.errorMessage);
  }, []);

  const handleToggleFavorite = useCallback(() => {
    if (contact) {
      toggleFavorite(contact.id);
    }
  }, [contact, toggleFavorite]);

  const handleCall = useCallback(() => {
    if (!primaryPhoneNumber) return;

    void openPhoneCall(primaryPhoneNumber).catch((error: unknown) => {
      showActionError("Contact call", error);
    });
  }, [primaryPhoneNumber, showActionError]);

  const handleMessage = useCallback(() => {
    if (!primaryPhoneNumber) return;

    void openTextMessage(primaryPhoneNumber).catch((error: unknown) => {
      showActionError("Contact message", error);
    });
  }, [primaryPhoneNumber, showActionError]);

  const handleEmail = useCallback(() => {
    if (!primaryEmailAddress) return;

    void openEmail(primaryEmailAddress).catch((error: unknown) => {
      showActionError("Contact email", error);
    });
  }, [primaryEmailAddress, showActionError]);

  const handleShare = useCallback(() => {
    if (!contact) return;

    void shareText(buildContactShareMessage(contact)).catch(
      (error: unknown) => {
        showActionError("Contact share", error);
      },
    );
  }, [contact, showActionError]);

  const handleEdit = useCallback(() => {
    if (!contact || isEditing) return;

    const editContact = async () => {
      setIsEditing(true);

      try {
        const nativeContact = new Contact(contact.id);
        const wasUpdated = await nativeContact.editWithForm();

        if (!wasUpdated) return;

        const updatedContact = await nativeContact.getDetails(CONTACT_FIELDS);
        setLoadedContact(updatedContact);
        upsertContact(updatedContact);
      } catch (error) {
        console.error("Contact edit error", error);
        Alert.alert(strings.unableEditContact, strings.errorMessage);
      } finally {
        setIsEditing(false);
      }
    };

    void editContact();
  }, [contact, isEditing, upsertContact]);

  const handleDismissDeleteSheet = useCallback(() => {
    if (!isDeleting) {
      setIsDeleteSheetPresented(false);
    }
  }, [isDeleting]);

  const handleDelete = useCallback(() => {
    if (!contact || isDeleting) return;

    const deleteContact = async () => {
      setIsDeleting(true);

      try {
        await new Contact(contact.id).delete();
        deletedContactIdRef.current = contact.id;
        setIsDeleteSheetPresented(false);
        removeContact(contact.id);
        handleBack();
      } catch (error) {
        console.error("Contact delete error", error);
        Alert.alert(strings.unableDeleteContact, strings.errorMessage);
      } finally {
        setIsDeleting(false);
      }
    };

    void deleteContact();
  }, [contact, handleBack, isDeleting, removeContact]);

  return (
    <View style={styles.container}>
      <ContactDetailsContent
        contact={contact}
        hasLoadError={hasLoadError}
        isEditing={isEditing}
        isFavorite={isFavorite}
        isLoading={isLoading}
        onBack={handleBack}
        onCall={handleCall}
        onDelete={() => setIsDeleteSheetPresented(true)}
        onEdit={handleEdit}
        onEmail={primaryEmailAddress ? handleEmail : undefined}
        onMessage={handleMessage}
        onShare={handleShare}
        onToggleFavorite={handleToggleFavorite}
        phones={phones}
      />

      <ConfirmationBottomSheet
        description={strings.deleteNumberText}
        isLoading={isDeleting}
        isPresented={isDeleteSheetPresented}
        onConfirm={handleDelete}
        onDismiss={handleDismissDeleteSheet}
        primaryTitle={isDeleting ? strings.deleting : strings.yesDelete}
        secondaryTitle={strings.noKeep}
      />
    </View>
  );
};

export default ContactDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
});
