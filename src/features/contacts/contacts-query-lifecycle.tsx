import { focusManager, useQueryClient } from '@tanstack/react-query';
import { addContactsChangeListener } from 'expo-contacts';
import { useEffect } from 'react';
import { AppState, Platform, type AppStateStatus } from 'react-native';

//import helpers/services
import { invalidateContactQueries } from '@/features/contacts/contacts-query';

/**
 * Synchronizes native application and contact lifecycle events with the contacts query cache.
 */
const ContactsQueryLifecycle = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (Platform.OS === 'web') return;

    let currentAppState: AppStateStatus = AppState.currentState;
    focusManager.setFocused(currentAppState === 'active');

    //invalidates device data after the application returns to the foreground
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      const didReturnToForeground = currentAppState !== 'active' && nextAppState === 'active';
      currentAppState = nextAppState;
      focusManager.setFocused(nextAppState === 'active');

      if (didReturnToForeground) {
        void invalidateContactQueries(queryClient);
      }
    };

    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);
    const contactsSubscription = addContactsChangeListener(() => {
      void invalidateContactQueries(queryClient);
    });

    return () => {
      appStateSubscription.remove();
      contactsSubscription.remove();
      focusManager.setFocused(undefined);
    };
  }, [queryClient]);

  return null;
};

export default ContactsQueryLifecycle;
