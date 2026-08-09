import { Host } from '@expo/ui';
import { BottomSheet, Group, RNHostView } from '@expo/ui/swift-ui';
import {
  interactiveDismissDisabled,
  presentationBackground,
  presentationDragIndicator,
} from '@expo/ui/swift-ui/modifiers';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

//import constants
import { colors } from '@/constants';

//import types
import type { ConfirmationBottomSheetHostProps } from './types';

/**
 * Hosts confirmation content in a SwiftUI sheet with a true dismissal-completion callback.
 */
const ConfirmationBottomSheetHost = ({
  children,
  isDismissEnabled,
  isPresented,
  onDidDismiss,
  onDismissRequest,
}: ConfirmationBottomSheetHostProps) => {
  const { width } = useWindowDimensions();

  //synchronizes interactive native dismissals with React state
  const handlePresentedChange = (presented: boolean) => {
    if (!presented) {
      onDismissRequest();
    }
  };

  return (
    <Host pointerEvents={'none'} style={[styles.host, { width }]}>
      <BottomSheet
        fitToContents
        isPresented={isPresented}
        onDismiss={onDidDismiss}
        onIsPresentedChange={handlePresentedChange}
      >
        <Group
          modifiers={[
            presentationDragIndicator('hidden'),
            interactiveDismissDisabled(!isDismissEnabled),
            presentationBackground(colors.backgroundLight),
          ]}
        >
          <RNHostView matchContents>
            <View style={styles.contentContainer}>
              <View style={styles.dragIndicator} />
              {children}
            </View>
          </RNHostView>
        </Group>
      </BottomSheet>
    </Host>
  );
};

export default ConfirmationBottomSheetHost;

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
  },
  contentContainer: {
    alignItems: 'center',
    paddingTop: 5,
  },
  dragIndicator: {
    width: 32,
    height: 5,
    marginBottom: 6,
    borderRadius: 3,
    backgroundColor: colors.baseMediumGrey,
  },
});
