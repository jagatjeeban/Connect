import type { PressableStateCallbackType, StyleProp, ViewStyle } from 'react-native';
import { Pressable, StyleSheet } from 'react-native';

//import constants
import { colors, fontFamily, strings } from '@/constants';

//import components
import TextComponent from './core-components/text-component';

type SearchEmptyActionProps = {
  onPress: () => void;
};

//function to resolve visual feedback for the clear-search action
const getActionButtonStyle = ({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => [
  styles.actionButton,
  pressed && styles.actionButtonPressed,
];

/**
 * Displays a shared recovery action beneath a search empty state.
 */
const SearchEmptyAction = ({ onPress }: SearchEmptyActionProps) => {
  return (
    <Pressable
      accessibilityLabel={strings.clearSearch}
      accessibilityRole={'button'}
      onPress={onPress}
      style={getActionButtonStyle}
    >
      <TextComponent
        color={colors.primary}
        fontFamily={fontFamily.outfitMedium}
        styleProfile={'large1'}
        text={strings.clearSearch}
      />
    </Pressable>
  );
};

export default SearchEmptyAction;

const styles = StyleSheet.create({
  actionButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.baseGrey,
    backgroundColor: colors.primaryLight,
  },
  actionButtonPressed: {
    opacity: 0.72,
  },
});
