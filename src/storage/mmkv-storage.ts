import { createMMKV } from "react-native-mmkv";
import type { StateStorage } from "zustand/middleware";

export const mmkv = createMMKV({
  id: "connect-app-storage",
});

export const zustandMMKVStorage: StateStorage = {
  setItem: (name, value) => {
    mmkv.set(name, value);
  },

  getItem: (name) => {
    return mmkv.getString(name) ?? null;
  },

  removeItem: (name) => {
    mmkv.remove(name);
  },
};
