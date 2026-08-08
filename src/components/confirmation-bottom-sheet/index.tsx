import React from 'react';
import { ActivityIndicator, StyleSheet, useWindowDimensions, View } from 'react-native';
import { PressableScale } from 'pressto';

//import constants
import { colors } from '@/constants';

//import components
import TextComponent from '../core-components/text-component';
import ConfirmationBottomSheetHost from './confirmation-bottom-sheet-host';

type ConfirmationBottomSheetProps = {
  isPresented: boolean;
  description: string;
  primaryTitle: string;
  secondaryTitle?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onDidDismiss: () => void;
  onDismissRequest: () => void;
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
  onDidDismiss,
  onDismissRequest,
}: ConfirmationBottomSheetProps) => {
  const { width } = useWindowDimensions();

  return (
    <ConfirmationBottomSheetHost
      isDismissEnabled={!isLoading}
      isPresented={isPresented}
      onDidDismiss={onDidDismiss}
      onDismissRequest={onDismissRequest}
    >
      <View style={[styles.content, { width }]} testID={'confirmation-bottom-sheet'}>
        <TextComponent color={colors.baseWhite} styleProfile={'large2'} text={description} textAlign={'center'} />

        <View style={styles.actionsContainer}>
          <PressableScale
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
          </PressableScale>

          {secondaryTitle && secondaryTitle.trim() && (
            <PressableScale
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
            </PressableScale>
          )}
        </View>
      </View>
    </ConfirmationBottomSheetHost>
  );
};

export default React.memo(ConfirmationBottomSheet);

const styles = StyleSheet.create({
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
  disabled: {
    opacity: 0.5,
  },
});
