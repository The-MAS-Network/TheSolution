import { encryptData, decryptData } from "@/utilities/encryption";
import { PersistStorage } from "zustand/middleware";

type StorageType = "localStorage" | "sessionStorage";

export const encryptedStore = <T>(
  storageType?: StorageType,
): PersistStorage<Readonly<T>> => {
  if (storageType === "localStorage") {
    return {
      setItem: (name, value) => {
        return localStorage.setItem(name, encryptData(value));
      },
      getItem: (name) => {
        const value = localStorage.getItem(name);
        if (value) return decryptData(value);
        else return null;
      },
      removeItem: (name) => {
        return localStorage.removeItem(name);
      },
    };
  } else {
    return {
      setItem: (name, value) => {
        return sessionStorage.setItem(name, encryptData(value));
      },
      getItem: (name) => {
        const value = sessionStorage.getItem(name);
        if (value) return decryptData(value);
        else return null;
      },
      removeItem: (name) => {
        return sessionStorage.removeItem(name);
      },
    };
  }
};
