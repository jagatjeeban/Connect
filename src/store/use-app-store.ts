import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

//import storage
import { zustandMMKVStorage } from '@/storage/mmkv-storage';

//import types
import type { DeviceContact } from '@/features/contacts/model';

type ThemePreference = 'system' | 'light' | 'dark';

interface AppStateData {
  favoriteContactIds: string[];
  contacts: DeviceContact[];
  theme: ThemePreference;
}

interface AppStateActions {
  toggleFavorite: (contactId: string) => void;
  setTheme: (theme: ThemePreference) => void;
  setContacts: (contacts: DeviceContact[]) => void;
  upsertContact: (contact: DeviceContact) => void;
  removeContact: (contactId: string) => void;
  reset: () => void;
}

type AppState = AppStateData & AppStateActions;

const initialState: AppStateData = {
  favoriteContactIds: [],
  contacts: [],
  theme: 'system',
};

/**
 * Provides application contacts, favorites, and durable preference state.
 */
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,

      //toggles a contact identifier in the favorites collection
      toggleFavorite: (contactId) =>
        set((state) => ({
          favoriteContactIds: state.favoriteContactIds.includes(contactId)
            ? state.favoriteContactIds.filter((id) => id !== contactId)
            : [...state.favoriteContactIds, contactId],
        })),

      //stores the selected theme preference
      setTheme: (theme) => {
        set({ theme });
      },

      //replaces the in-memory device contacts collection
      setContacts: (contacts) => {
        set({ contacts });
      },

      //inserts or replaces one contact by identifier
      upsertContact: (contact) =>
        set((state) => {
          const contactIndex = state.contacts.findIndex((storedContact) => storedContact.id === contact.id);

          if (contactIndex === -1) {
            return { contacts: [...state.contacts, contact] };
          }

          return {
            contacts: state.contacts.map((storedContact, index) => (index === contactIndex ? contact : storedContact)),
          };
        }),

      //removes one contact and its favorite association
      removeContact: (contactId) =>
        set((state) => ({
          contacts: state.contacts.filter((contact) => contact.id !== contactId),
          favoriteContactIds: state.favoriteContactIds.filter((favoriteContactId) => favoriteContactId !== contactId),
        })),

      //restores the complete store to its initial values
      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'connect-app-state',
      storage: createJSONStorage(() => zustandMMKVStorage),
      version: 1,

      //persists only durable values because actions are never persisted
      partialize: (state) => ({
        favoriteContactIds: state.favoriteContactIds,
        theme: state.theme,
      }),
    },
  ),
);
