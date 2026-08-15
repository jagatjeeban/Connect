export type ConfirmationSheetContentProps = {
  description: string;
  primaryTitle: string;
  secondaryTitle?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onDismissRequest: () => void;
};

export type ConfirmationSheetProps = ConfirmationSheetContentProps & {
  isPresented: boolean;
  onDidDismiss: () => void;
};
