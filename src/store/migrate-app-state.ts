import { APP_STATE_VERSION, initialState } from './app-state-config';

//import types
import type { AppStateData } from './types';

//function to migrate persisted app data while defaulting invalid fields
export const migrateAppState = (persistedState: unknown, version: number): AppStateData => {
  const persistedData =
    typeof persistedState === 'object' && persistedState !== null ? (persistedState as Partial<AppStateData>) : {};
  const favoriteContactIds = Array.isArray(persistedData.favoriteContactIds)
    ? persistedData.favoriteContactIds.filter((contactId): contactId is string => typeof contactId === 'string')
    : initialState.favoriteContactIds;
  const theme =
    persistedData.theme === 'light' || persistedData.theme === 'dark' || persistedData.theme === 'system'
      ? persistedData.theme
      : initialState.theme;
  const onboardingStatus =
    version < APP_STATE_VERSION
      ? true
      : typeof persistedData.onboardingStatus === 'boolean'
        ? persistedData.onboardingStatus
        : initialState.onboardingStatus;

  return {
    favoriteContactIds,
    theme,
    onboardingStatus,
  };
};
