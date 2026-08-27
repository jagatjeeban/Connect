//import types
import type { ThemePreference } from '@/themes/types';

export type AppStateData = {
  favoriteContactIds: string[];
  theme: ThemePreference;
  onboardingStatus: boolean;
};

type AppStateActions = {
  addFavorite: (contactId: string) => void;
  toggleFavorite: (contactId: string) => void;
  removeFavorite: (contactId: string) => void;
  setTheme: (theme: ThemePreference) => void;
  setOnboardingStatus: (status: boolean) => void;
  reset: () => void;
};

export type AppState = AppStateData & AppStateActions;
