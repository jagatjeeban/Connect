//import types
import type { ThemePreference } from '@/themes/types';

export type AppStateData = {
  favoriteContactIds: string[];
  theme: ThemePreference;
};

type AppStateActions = {
  addFavorite: (contactId: string) => void;
  toggleFavorite: (contactId: string) => void;
  removeFavorite: (contactId: string) => void;
  setTheme: (theme: ThemePreference) => void;
  reset: () => void;
};

export type AppState = AppStateData & AppStateActions;
