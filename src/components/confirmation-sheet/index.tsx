//import components
import BottomSheet from '../bottom-sheet';
import ConfirmationSheetContent from './content';

//import types
import type { ConfirmationSheetProps } from './types';

/**
 * Displays confirmation actions inside the shared native bottom sheet.
 */
const ConfirmationSheet = ({
  isPresented,
  isLoading,
  description,
  primaryTitle,
  secondaryTitle,
  onConfirm,
  onDidDismiss,
  onDismissRequest,
}: ConfirmationSheetProps) => {
  return (
    <BottomSheet
      isDismissEnabled={!isLoading}
      isPresented={isPresented}
      onDidDismiss={onDidDismiss}
      onDismissRequest={onDismissRequest}
    >
      <ConfirmationSheetContent
        description={description}
        isLoading={isLoading}
        primaryTitle={primaryTitle}
        secondaryTitle={secondaryTitle}
        onConfirm={onConfirm}
        onDismissRequest={onDismissRequest}
      />
    </BottomSheet>
  );
};

export default ConfirmationSheet;
