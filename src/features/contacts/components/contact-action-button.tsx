import { PressableScale } from 'pressto';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

//import constants
import { colors } from '@/constants';

//import components
import { TextComponent } from '@/components';

type ContactActionButtonProps = {
  icon: ReactNode;
  label: string;
  disabled?: boolean;
  onPress: () => void;
};

/**
 * Displays one labeled action in the contact-details action row.
 */
const ContactActionButton = ({ icon, label, disabled = false, onPress }: ContactActionButtonProps) => {
  return (
    <PressableScale
      rippleColor={'transparent'}
      accessibilityLabel={label}
      accessibilityRole={'button'}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[styles.container, disabled && styles.disabled]}
    >
      <View style={styles.iconContainer}>{icon}</View>
      <TextComponent color={colors.baseWhite} styleProfile={'large1'} text={label} textAlign={'center'} />
    </PressableScale>
  );
};

export default ContactActionButton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
    backgroundColor: colors.primaryLight,
  },
  disabled: {
    opacity: 0.4,
  },
});
