import Stack from 'expo-router/stack';

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
    />
  );
};

export default ContactsLayout;
