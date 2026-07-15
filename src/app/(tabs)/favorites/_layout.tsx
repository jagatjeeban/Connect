import { colors } from '@/constants';
import Stack from 'expo-router/stack';

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
