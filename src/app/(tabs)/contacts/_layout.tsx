import Stack from 'expo-router/stack';

//import constants
import { colors } from '@/constants';

//import helpers
import { getContactDetailsAnimation, useContactSharedTransition } from '@/features/contacts/contact-shared-transition';

/**
 * Configures the contacts stack and its shared background.
 */
const ContactsLayout = () => {
  //hooks
  const { phase: sharedTransitionPhase } = useContactSharedTransition();

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
          animation: getContactDetailsAnimation(sharedTransitionPhase),
        }}
      />
    </Stack>
  );
};

export default ContactsLayout;
