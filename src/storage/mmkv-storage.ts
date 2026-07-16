import { createMMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';

/**
 * Shared MMKV instance used for application persistence.
 */
export const mmkv = createMMKV({
  id: 'connect-app-storage',
});

/**
 * Adapts MMKV to the storage interface required by Zustand persistence.
 */
export const zustandMMKVStorage: StateStorage = {
  //writes a serialized Zustand value
  setItem: (name, value) => {
    mmkv.set(name, value);
  },

  //reads a serialized Zustand value
  getItem: (name) => {
    return mmkv.getString(name) ?? null;
  },

  //removes a persisted Zustand value
  removeItem: (name) => {
    mmkv.remove(name);
  },
};
