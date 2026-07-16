import Stack from 'expo-router/stack';

/**
 * Defines the application root stack and delegates primary navigation to the tabs group.
 */
export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name={'(tabs)'} />
    </Stack>
  );
}
