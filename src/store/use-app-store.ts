import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { DeviceContact } from "@/features/contacts/model";
import { zustandMMKVStorage } from "@/storage/mmkv-storage";

type ThemePreference = "system" | "light" | "dark";

interface AppStateData {
  favoriteContactIds: string[];
  contacts: DeviceContact[];
  theme: ThemePreference;
}

interface AppStateActions {
  toggleFavorite: (contactId: string) => void;
  setTheme: (theme: ThemePreference) => void;
  setContacts: (contacts: DeviceContact[]) => void;
  reset: () => void;
}

type AppState = AppStateData & AppStateActions;

const initialState: AppStateData = {
  favoriteContactIds: [],
  contacts: [],
  theme: "system",
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,

      toggleFavorite: (contactId) =>
        set((state) => ({
          favoriteContactIds: state.favoriteContactIds.includes(contactId)
            ? state.favoriteContactIds.filter((id) => id !== contactId)
            : [...state.favoriteContactIds, contactId],
        })),

      setTheme: (theme) => {
        set({ theme });
      },

      setContacts: (contacts) => {
        set({ contacts });
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: "connect-app-state",
      storage: createJSONStorage(() => zustandMMKVStorage),
      version: 1,

      // Persist only durable values. Actions are never persisted.
      partialize: (state) => ({
        favoriteContactIds: state.favoriteContactIds,
        theme: state.theme,
      }),
    },
  ),
);
