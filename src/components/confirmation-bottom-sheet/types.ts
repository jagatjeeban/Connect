import type { ReactNode } from 'react';

export type ConfirmationBottomSheetHostProps = {
  children: ReactNode;
  isDismissEnabled: boolean;
  isPresented: boolean;
  onDidDismiss: () => void;
  onDismissRequest: () => void;
};
