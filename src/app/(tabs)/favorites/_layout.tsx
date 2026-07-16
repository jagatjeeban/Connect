import Stack from 'expo-router/stack';

//import constants
import { colors } from '@/constants';

/**
 * Configures the favorites stack and its shared background.
 */
export default function FavoritesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.backgroundColor },
      }}
    />
  );
}
