import { Pressable, StyleSheet, Text } from 'react-native';

//import constants
import { colors, fontFamily, fontSize } from '@/constants';

type AppMessageActionButtonProps = {
  label: string;
  onPress: () => void;
};

/**
 * Renders a themed, accessible action inside an app message.
 */
const AppMessageActionButton = ({ label, onPress }: AppMessageActionButtonProps) => (
  <Pressable
    accessibilityLabel={label}
    accessibilityRole={'button'}
    hitSlop={4}
    onPress={onPress}
    style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
  >
    <Text allowFontScaling style={styles.label}>
      {label}
    </Text>
  </Pressable>
);

export default AppMessageActionButton;

const styles = StyleSheet.create({
  button: {
    minWidth: 64,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 22,
    backgroundColor: colors.primary,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  label: {
    color: colors.baseWhite,
    fontFamily: fontFamily.outfitSemiBold,
    fontSize: fontSize.xxNormal,
    lineHeight: 20,
  },
});
