import Stack from 'expo-router/stack';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

//import components
import { AppToaster } from '@/components';

//import providers
import AppQueryProvider from '@/providers/app-query-provider';

/**
 * Defines the application root stack and delegates primary navigation to the tabs group.
 */
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <AppQueryProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name={'(tabs)'} />
        </Stack>
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
