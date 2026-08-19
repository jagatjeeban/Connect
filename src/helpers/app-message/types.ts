type AppMessageVariant = 'default' | 'success' | 'info' | 'warning' | 'error';

type AppMessageAction = {
  label: string;
  onPress: () => void;
};

export type AppMessageId = string | number;

export type AppMessageOptions = {
  action?: AppMessageAction;
  description?: string;
  duration?: number;
  id?: AppMessageId;
  variant?: AppMessageVariant;
};
