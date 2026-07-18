import Stack from 'expo-router/stack';
import { Platform } from 'react-native';

//import constants
import { colors } from '@/constants';

/**
 * Configures the contacts stack and its shared background.
 */
const ContactsLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.backgroundColor },
      }}
    >
      <Stack.Screen
        name={'[contactId]'}
        options={{
          animation: Platform.OS === 'android' ? 'none' : 'default',
        }}
      />
    </Stack>
  );
};

export default ContactsLayout;
