import { focusManager, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { AppState, Platform, type AppStateStatus } from 'react-native';

//import helpers/services
import { invalidateContactQueries } from '@/features/contacts/contacts-query';
import { subscribeToDeviceContactChanges } from '@/features/contacts/contacts-service';

/**
 * Synchronizes native application and contact lifecycle events with the contacts query cache.
 */
const ContactsQueryLifecycle = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (Platform.OS === 'web') return;

    let isMounted = true;
    let isStartingContactsSubscription = false;
    let contactsSubscription: Awaited<ReturnType<typeof subscribeToDeviceContactChanges>> = null;
    let currentAppState: AppStateStatus = AppState.currentState;
    focusManager.setFocused(currentAppState === 'active');

    //starts native observation only after the contacts permission check succeeds
    const startContactsSubscription = async () => {
      if (contactsSubscription || isStartingContactsSubscription) return;

      isStartingContactsSubscription = true;

      try {
        const subscription = await subscribeToDeviceContactChanges(() => {
          void invalidateContactQueries(queryClient);
        });

        if (!isMounted) {
          subscription?.remove();
          return;
        }

        contactsSubscription = subscription;
      } catch (error) {
        console.error('Contacts change listener error', error);
      } finally {
        isStartingContactsSubscription = false;
      }
    };

    //invalidates device data after the application returns to the foreground
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      const didReturnToForeground = currentAppState !== 'active' && nextAppState === 'active';
      currentAppState = nextAppState;
      focusManager.setFocused(nextAppState === 'active');

      if (didReturnToForeground) {
        void invalidateContactQueries(queryClient);
        void startContactsSubscription();
      }
    };

    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);
    void startContactsSubscription();

    return () => {
      isMounted = false;
      appStateSubscription.remove();
      contactsSubscription?.remove();
      focusManager.setFocused(undefined);
    };
  }, [queryClient]);

  return null;
};

export default ContactsQueryLifecycle;
