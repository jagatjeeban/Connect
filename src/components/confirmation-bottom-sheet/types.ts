import type { ReactNode } from 'react';

export type ConfirmationBottomSheetHostProps = {
  children: ReactNode;
  isDismissEnabled: boolean;
  isPresented: boolean;
  onDidDismiss: () => void;
  onDismissRequest: () => void;
};

export type ConfirmationBottomSheetProps = {
  isPresented: boolean;
  description: string;
  primaryTitle: string;
  secondaryTitle?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onDidDismiss: () => void;
  onDismissRequest: () => void;
};
