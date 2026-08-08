import Stack from 'expo-router/stack';

//import constants
import { colors } from '@/constants';

/**
 * Configures the contacts stack and its background.
 */
const ContactsLayout = () => (
  <Stack
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: colors.backgroundColor },
    }}
  />
);

export default ContactsLayout;
