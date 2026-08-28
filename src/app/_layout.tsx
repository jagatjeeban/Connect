import { DarkTheme, ThemeProvider } from 'expo-router';
import Stack from 'expo-router/stack';
import type { Theme } from 'expo-router/react-navigation';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

//import constants
import { colors } from '@/constants';

//import components
import { AppToaster } from '@/components';

//import providers
import AppQueryProvider from '@/providers/app-query-provider';

//import store
import { useAppStore } from '@/store/use-app-store';

//constants
const APP_NAVIGATION_THEME: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.backgroundColor,
    card: colors.backgroundColor,
  },
};

/**
 * Defines the application root stack and delegates primary navigation to the tabs group.
 */
export default function RootLayout() {
  //store selectors
  const onboardingStatus = useAppStore((state) => state.onboardingStatus);

  return (
    <GestureHandlerRootView style={styles.container}>
      <AppQueryProvider>
        <ThemeProvider value={APP_NAVIGATION_THEME}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Protected guard={!onboardingStatus}>
              <Stack.Screen name={'index'} />
            </Stack.Protected>
            <Stack.Protected guard={onboardingStatus}>
              <Stack.Screen name={'(tabs)'} />
            </Stack.Protected>
          </Stack>
        </ThemeProvider>
        <AppToaster />
      </AppQueryProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
});
