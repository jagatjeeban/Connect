import { useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

//import constants
import { colors, strings } from '@/constants';

//import components
import { ConfirmationBottomSheet } from '@/components';
import ContactDetailsContent from '@/features/contacts/components/contact-details-content';

//import store
import { useAppStore } from '@/store/use-app-store';

//import helpers/services
import { openEmail, openPhoneCall, openTextMessage, shareText } from '@/helpers/commonFun';
import { buildContactShareMessage, getUniqueContactPhones } from '@/helpers/customFun';
import {
  invalidateContactQueries,
  invalidateContactsCollection,
  removeContactQueryData,
  upsertContactQueryData,
  useContactQuery,
} from '@/features/contacts/contacts-query';
import { deleteDeviceContact, presentEditContactForm } from '@/features/contacts/contacts-service';

/**
 * Displays one device contact and coordinates its native actions.
 */
const ContactDetails = () => {
  //hooks
  const router = useRouter();
  const queryClient = useQueryClient();
  const { contactId } = useLocalSearchParams<{ contactId?: string }>();

  //store events
  const favoriteContactIds = useAppStore((state) => state.favoriteContactIds);
  const toggleFavorite = useAppStore((state) => state.toggleFavorite);
  const removeFavorite = useAppStore((state) => state.removeFavorite);

  //states
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteSheetPresented, setIsDeleteSheetPresented] = useState(false);

  //queries
  const contactQuery = useContactQuery(contactId);
  const contact = contactQuery.data;
  const hasLoadError = Boolean(contactId && contactQuery.isError);
  const isLoading = Boolean(contactId && contactQuery.isPending);
  const phones = useMemo(() => getUniqueContactPhones(contact?.phones ?? []), [contact?.phones]);
  const primaryPhoneNumber = phones[0]?.number?.trim();
  const primaryEmailAddress = contact?.emails.find((email) => Boolean(email.address?.trim()))?.address?.trim();
  const isFavorite = contact ? favoriteContactIds.includes(contact.id) : false;

  //returns to the previous route or falls back to the contacts list
  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/contacts');
  }, [router]);

  //reports a failed native contact action to the user
  const showActionError = useCallback((label: string, error: unknown) => {
    console.error(`${label} error`, error);
    Alert.alert(strings.unableCompleteAction, strings.errorMessage);
  }, []);

  //toggles the current contact's favorite status
  const handleToggleFavorite = useCallback(() => {
    if (contact) {
      toggleFavorite(contact.id);
    }
  }, [contact, toggleFavorite]);

  //opens the dialer for the contact's primary phone number
  const handleCall = useCallback(() => {
    if (!primaryPhoneNumber) return;

    void openPhoneCall(primaryPhoneNumber).catch((error: unknown) => {
      showActionError('Contact call', error);
    });
  }, [primaryPhoneNumber, showActionError]);

  //opens messaging for the contact's primary phone number
  const handleMessage = useCallback(() => {
    if (!primaryPhoneNumber) return;

    void openTextMessage(primaryPhoneNumber).catch((error: unknown) => {
      showActionError('Contact message', error);
    });
  }, [primaryPhoneNumber, showActionError]);

  //opens email for the contact's primary email address
  const handleEmail = useCallback(() => {
    if (!primaryEmailAddress) return;

    void openEmail(primaryEmailAddress).catch((error: unknown) => {
      showActionError('Contact email', error);
    });
  }, [primaryEmailAddress, showActionError]);

  //opens the native share sheet with the current contact details
  const handleShare = useCallback(() => {
    if (!contact) return;

    void shareText(buildContactShareMessage(contact)).catch((error: unknown) => {
      showActionError('Contact share', error);
    });
  }, [contact, showActionError]);

  //opens the native edit form and stores the refreshed contact
  const handleEdit = useCallback(() => {
    if (!contact || isEditing) return;

    //edits and reloads the selected device contact
    const editContact = async () => {
      setIsEditing(true);

      try {
        const updatedContact = await presentEditContactForm(contact.id);

        if (!updatedContact) return;

        upsertContactQueryData(queryClient, updatedContact);
        void invalidateContactsCollection(queryClient);
      } catch (error) {
        console.error('Contact edit error', error);
        Alert.alert(strings.unableEditContact, strings.errorMessage);
      } finally {
        setIsEditing(false);
      }
    };

    void editContact();
  }, [contact, isEditing, queryClient]);

  //closes the deletion sheet when no delete operation is active
  const handleDismissDeleteSheet = useCallback(() => {
    if (!isDeleting) {
      setIsDeleteSheetPresented(false);
    }
  }, [isDeleting]);

  //deletes the selected device contact and returns to the list
  const handleDelete = useCallback(() => {
    if (!contact || isDeleting) return;

    //deletes the contact while coordinating screen state
    const deleteContact = async () => {
      setIsDeleting(true);

      try {
        await deleteDeviceContact(contact.id);
        removeContactQueryData(queryClient, contact.id);
        removeFavorite(contact.id);
        setIsDeleteSheetPresented(false);
        handleBack();
        void invalidateContactQueries(queryClient);
      } catch (error) {
        console.error('Contact delete error', error);
        Alert.alert(strings.unableDeleteContact, strings.errorMessage);
      } finally {
        setIsDeleting(false);
      }
    };

    void deleteContact();
  }, [contact, handleBack, isDeleting, queryClient, removeFavorite]);

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
