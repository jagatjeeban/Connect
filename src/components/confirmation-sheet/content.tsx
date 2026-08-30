import { PressableScale, PressablesConfig } from 'pressto';
import { ActivityIndicator, Platform, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

//import constants
import { colors } from '@/constants';

//import components
import TextComponent from '../core-components/text-component';

//import types
import type { ConfirmationSheetContentProps } from './types';

/**
 * Renders confirmation messaging and actions for the native sheet.
 */
const ConfirmationSheetContent = ({
  description,
  primaryTitle,
  secondaryTitle,
  isLoading = false,
  onConfirm,
  onDismissRequest,
}: ConfirmationSheetContentProps) => {
  //hooks
  const { width } = useWindowDimensions();
  const ButtonComponent = Platform.OS === 'android' ? Pressable : PressableScale;

  return (
    <View style={[styles.content, { width }]} testID={'confirmation-sheet'}>
      <TextComponent color={colors.baseWhite} styleProfile={'large2'} text={description} textAlign={'center'} />

      <PressablesConfig config={{ baseScale: 1, minScale: 1.05 }}>
        <View style={styles.actionsContainer}>
          <ButtonComponent
            accessibilityLabel={primaryTitle}
            accessibilityRole={'button'}
            disabled={isLoading}
            onPress={onConfirm}
            style={[styles.actionButton, styles.confirmButton, isLoading && styles.disabled]}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.baseWhite} />
            ) : (
              <TextComponent
                color={colors.baseWhite}
                styleProfile={'large1'}
                text={primaryTitle}
                textAlign={'center'}
              />
            )}
          </ButtonComponent>

          {secondaryTitle && secondaryTitle.trim() && (
            <ButtonComponent
              accessibilityLabel={secondaryTitle}
              accessibilityRole={'button'}
              disabled={isLoading}
              onPress={onDismissRequest}
              style={[styles.actionButton, styles.cancelButton, isLoading && styles.disabled]}
            >
              <TextComponent
                color={colors.primary}
                styleProfile={'large1'}
                text={secondaryTitle}
                textAlign={'center'}
              />
            </ButtonComponent>
          )}
        </View>
      </PressablesConfig>
    </View>
  );
};

export default ConfirmationSheetContent;

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'android' ? 20 : undefined,
    paddingTop: Platform.OS === 'ios' ? 20 : undefined,
    justifyContent: 'center',
    gap: 28,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    minHeight: 52,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  confirmButton: {
    backgroundColor: colors.baseRed,
  },
  cancelButton: {
    backgroundColor: colors.primaryLight,
  },
  disabled: {
    opacity: 0.5,
  },
});
