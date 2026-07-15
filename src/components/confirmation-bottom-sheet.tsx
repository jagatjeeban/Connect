import { BottomSheet, Host, RNHostView } from '@expo/ui';
import { ActivityIndicator, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

//import components
import TextComponent from './core-components/text-component';

//import constants
import { colors } from '@/constants';

type ConfirmationBottomSheetProps = {
  isPresented: boolean;
  description: string;
  primaryTitle: string;
  secondaryTitle: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
};

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
    <Host colorScheme='dark' seedColor={colors.primary} style={styles.host}>
      <BottomSheet isPresented={isPresented} onDismiss={onDismiss} showDragIndicator testID='confirmation-bottom-sheet'>
        <RNHostView matchContents>
          <View style={[styles.content, { width }]}>
            <TextComponent color={colors.baseWhite} styleProfile='large2' text={description} textAlign='center' />

            <View style={styles.actionsContainer}>
              <Pressable
                accessibilityLabel={primaryTitle}
                accessibilityRole='button'
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
                    styleProfile='large1'
                    text={primaryTitle}
                    textAlign='center'
                  />
                )}
              </Pressable>

              <Pressable
                accessibilityLabel={secondaryTitle}
                accessibilityRole='button'
                disabled={isLoading}
                onPress={onDismiss}
                style={({ pressed }) => [
                  styles.actionButton,
                  styles.cancelButton,
                  pressed && styles.pressed,
                  isLoading && styles.disabled,
                ]}
              >
                <TextComponent color={colors.primary} styleProfile='large1' text={secondaryTitle} textAlign='center' />
              </Pressable>
            </View>
          </View>
        </RNHostView>
      </BottomSheet>
    </Host>
  );
};

export default ConfirmationBottomSheet;

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 100,
  },
  content: {
    minHeight: 250,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 36,
    justifyContent: 'center',
    gap: 28,
    // backgroundColor: colors.backgroundLight,
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
