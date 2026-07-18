import Stack from 'expo-router/stack';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

//import components
import { AppToaster } from '@/components';

//import providers
import { ContactSharedTransitionProvider } from '@/features/contacts/contact-shared-transition';
import AppQueryProvider from '@/providers/app-query-provider';

/**
 * Defines the application root stack and delegates primary navigation to the tabs group.
 */
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <AppQueryProvider>
        <ContactSharedTransitionProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name={'(tabs)'} />
          </Stack>
        </ContactSharedTransitionProvider>
        <AppToaster />
      </AppQueryProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
