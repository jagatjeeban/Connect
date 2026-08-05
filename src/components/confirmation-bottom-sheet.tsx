import { BottomSheet, BottomSheetView } from '@expo/ui/community/bottom-sheet';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

//import constants
import { colors } from '@/constants';

//import components
import TextComponent from './core-components/text-component';

type ConfirmationBottomSheetProps = {
  isPresented: boolean;
  description: string;
  primaryTitle: string;
  secondaryTitle?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
};

/**
 * Displays a native bottom sheet for destructive or irreversible confirmations.
 */
const ConfirmationBottomSheet = ({
  isPresented,
  description,
  primaryTitle,
  secondaryTitle,
  isLoading = false,
  onConfirm,
  onDismiss,
}: ConfirmationBottomSheetProps) => {
  const { width } = useWindowDimensions();

  if (!isPresented) {
    return null;
  }

  return (
    <BottomSheet
      backgroundStyle={styles.sheetBackground}
      enableDynamicSizing
      enablePanDownToClose
      index={0}
      onDismiss={onDismiss}
    >
      <BottomSheetView>
        <View style={[styles.content, { width }]} testID={'confirmation-bottom-sheet'}>
          <TextComponent color={colors.baseWhite} styleProfile={'large2'} text={description} textAlign={'center'} />

          <View style={styles.actionsContainer}>
            <Pressable
              accessibilityLabel={primaryTitle}
              accessibilityRole={'button'}
              disabled={isLoading}
              onPress={onConfirm}
              style={({ pressed }) => [
                styles.actionButton,
                styles.confirmButton,
                pressed && styles.pressed,
                isLoading && styles.disabled,
              ]}
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
            </Pressable>

            {secondaryTitle && secondaryTitle.trim() && (
              <Pressable
                accessibilityLabel={secondaryTitle}
                accessibilityRole={'button'}
                disabled={isLoading}
                onPress={onDismiss}
                style={({ pressed }) => [
                  styles.actionButton,
                  styles.cancelButton,
                  pressed && styles.pressed,
                  isLoading && styles.disabled,
                ]}
              >
                <TextComponent
                  color={colors.primary}
                  styleProfile={'large1'}
                  text={secondaryTitle}
                  textAlign={'center'}
                />
              </Pressable>
            )}
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default React.memo(ConfirmationBottomSheet);

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: colors.backgroundLight,
  },
  content: {
    minHeight: 250,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 36,
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
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.5,
  },
});
