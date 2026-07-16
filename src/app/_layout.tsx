import Stack from 'expo-router/stack';

//import components
import AppQueryProvider from '@/providers/app-query-provider';

/**
 * Defines the application root stack and delegates primary navigation to the tabs group.
 */
export default function RootLayout() {
  return (
    <AppQueryProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name={'(tabs)'} />
      </Stack>
    </AppQueryProvider>
  );
}
