import { colors } from '@/constants';
import Stack from 'expo-router/stack';

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
