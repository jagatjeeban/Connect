import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

//import storage
import { zustandMMKVStorage } from '@/storage/mmkv-storage';

//import types
import type { AppState } from './types';

//import migrate app state function
import { migrateAppState } from './migrate-app-state';

//import app state configs
import { APP_STATE_VERSION, APP_STORAGE_NAME, initialState } from './app-state-config';

/**
 * Provides application favorites and durable preference state.
 */
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,

      //adds a contact identifier when it is not already favorited
      addFavorite: (contactId) => {
        set((state) => ({
          favoriteContactIds: state.favoriteContactIds.includes(contactId)
            ? state.favoriteContactIds
            : [...state.favoriteContactIds, contactId],
        }));
      },

      //toggles a contact identifier in the favorites collection
      toggleFavorite: (contactId) => {
        set((state) => ({
          favoriteContactIds: state.favoriteContactIds.includes(contactId)
            ? state.favoriteContactIds.filter((id) => id !== contactId)
            : [...state.favoriteContactIds, contactId],
        }));
      },

      //removes a contact identifier from the favorites collection
      removeFavorite: (contactId) => {
        set((state) => ({
          favoriteContactIds: state.favoriteContactIds.filter((favoriteContactId) => favoriteContactId !== contactId),
        }));
      },

      //stores the selected theme preference
      setTheme: (theme) => set({ theme }),

      //stores the onboarding status
      setOnboardingStatus: (status) => set({ onboardingStatus: status }),

      //restores the complete store to its initial values
      reset: () => set(initialState),
    }),
    {
      name: APP_STORAGE_NAME,
      storage: createJSONStorage(() => zustandMMKVStorage),
      version: APP_STATE_VERSION,
      migrate: migrateAppState,

      //persists only durable values because actions are never persisted
      partialize: (state) => ({
        favoriteContactIds: state.favoriteContactIds,
        theme: state.theme,
        onboardingStatus: state.onboardingStatus,
      }),
    },
  ),
);
