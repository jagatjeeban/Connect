import { createElement } from 'react';
import { toast } from 'sonner-native';

//import components
import AppMessageActionButton from '@/components/app-message-action-button';

//import types
import type { AppMessageId, AppMessageOptions } from './types';

//variables
let appMessageSequence = 0;

//function to create a stable identifier for an actionable message
const createAppMessageId = (): string => {
  appMessageSequence += 1;
  return `app-message-${Date.now()}-${appMessageSequence}`;
};

/**
 * Displays an app-owned message without exposing the underlying toast package to features.
 */
export const showAppMessage = (message: string, options: AppMessageOptions = {}): AppMessageId => {
  const { action, description, duration, variant = 'default' } = options;
  const id = options.id ?? createAppMessageId();
  const toastOptions = {
    action: action
      ? createElement(AppMessageActionButton, {
          label: action.label,
          onPress: () => {
            action.onPress();
            toast.dismiss(id);
          },
        })
      : undefined,
    description,
    duration,
    id,
  };

  switch (variant) {
    case 'success':
      return toast.success(message, toastOptions);
    case 'info':
      return toast.info(message, toastOptions);
    case 'warning':
      return toast.warning(message, toastOptions);
    case 'error':
      return toast.error(message, toastOptions);
    default:
      return toast(message, toastOptions);
  }
};

/**
 * Dismisses one app message or every visible message when no identifier is provided.
 */
export const dismissAppMessage = (id?: AppMessageId): void => {
  toast.dismiss(id);
};
