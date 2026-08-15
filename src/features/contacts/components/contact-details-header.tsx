import { Stack } from 'expo-router';
import { Platform } from 'react-native';

//import constants
import { colors } from '@/constants';

//import material icons for android
import EditIcon from '@expo/material-symbols/edit.xml';
import StarIcon from '@expo/material-symbols/star.xml';

type ContactDetailsHeaderProps = {
  isFavorite: boolean;
  actionsDisabled?: boolean;
  onToggleFavorite: () => void;
  onEdit: () => void;
};

/**
 * Displays contact-details navigation, favorite, and edit actions.
 */
const ContactDetailsHeader = ({
  isFavorite,
  actionsDisabled = false,
  onToggleFavorite,
  onEdit,
}: ContactDetailsHeaderProps) => {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: Platform.OS === 'ios',
          headerBackVisible: true,
          headerBackButtonMenuEnabled: false,
          headerBackButtonDisplayMode: 'minimal',
          headerTintColor: colors.baseWhite,
          headerTitle: '',
          headerStyle: Platform.OS === 'android' ? { backgroundColor: colors.baseDarkBlack } : undefined,
        }}
      />
      <Stack.Toolbar placement={'right'}>
        <Stack.Toolbar.Button
          tintColor={isFavorite ? colors.primary : undefined}
          disabled={actionsDisabled}
          icon={Platform.OS === 'android' ? StarIcon : isFavorite ? 'star.fill' : 'star'}
          onPress={onToggleFavorite}
        />
        <Stack.Toolbar.Button
          disabled={actionsDisabled}
          separateBackground
          icon={Platform.OS === 'android' ? EditIcon : 'pencil'}
          onPress={onEdit}
        />
      </Stack.Toolbar>
    </>
  );
};

export default ContactDetailsHeader;
