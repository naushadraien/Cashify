import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

export const safeAsyncStorage = {
  setItem: async (key: string, value: unknown): Promise<void> => {
    if (value === null || value === undefined) return;
    try {
      const stringifiedValue =
        typeof value === "string" ? value : JSON.stringify(value);
      await AsyncStorage.setItem(key, stringifiedValue);
    } catch (error) {
      console.error(`Error setting ${key} to AsyncStorage:`, error);
    }
  },

  getItem: async <T = unknown>(key: string): Promise<T | null> => {
    try {
      const item = await AsyncStorage.getItem(key);
      if (!item) return null;
      try {
        return JSON.parse(item);
      } catch {
        return item as unknown as T;
      }
    } catch (error) {
      console.error(`Error getting ${key} from AsyncStorage:`, error);
      return null;
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  },

  clearStorage: async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  },
};

export const safeSecureStore = {
  setItem: async (key: string, value: unknown): Promise<void> => {
    if (value === null || value === undefined) return;
    try {
      const stringifiedValue =
        typeof value === "string" ? value : JSON.stringify(value);
      await SecureStore.setItemAsync(key, stringifiedValue);
    } catch (error) {
      console.error(`Error setting ${key} to SecureStore:`, error);
    }
  },

  getItem: async <T = unknown>(key: string): Promise<T | null> => {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (!item) return null;
      try {
        return JSON.parse(item) as T;
      } catch {
        return item as unknown as T;
      }
    } catch (error) {
      console.error(`Error getting ${key} from SecureStore:`, error);
      return null;
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`Error removing ${key} from SecureStore:`, error);
    }
  },

  isAvailable: async (): Promise<boolean> => {
    try {
      return await SecureStore.isAvailableAsync();
    } catch (error) {
      console.error("Error checking SecureStore availability:", error);
      return false;
    }
  },
};
