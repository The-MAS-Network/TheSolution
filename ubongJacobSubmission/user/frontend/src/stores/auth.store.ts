import { createWithEqualityFn } from "zustand/traditional";
import { persist } from "zustand/middleware";
import { shallow } from "zustand/shallow";

import { encryptedStore } from ".";
import {
  LoginResponse,
  OrdinalWalletData,
  UserData,
} from "../types/api/auth.types";

export interface AuthStore {
  loginResponse: LoginResponse | null;
  currentTrialCount: number;

  logout: () => void;
  setLoginResponse: (value: LoginResponse) => void;
  updateProfile: (value: UserData) => void;
  updateOrdinalWalletData: (value: OrdinalWalletData) => void;
  setCurrentTrialCount: (value: number) => void;
  getUserData: () => UserData | undefined;
}

export const authStoreName = "useAuthStore";

export const authStore = createWithEqualityFn(
  persist<AuthStore>(
    (set, get) => ({
      // DEFAULT STATE
      loginResponse: null,
      profileResponse: null,
      currentTrialCount: 0,

      //   ACTIONS OR MUTATORS
      logout: () => set(() => ({ loginResponse: null })),
      setLoginResponse: (loginResponse) => set(() => ({ loginResponse })),

      getUserData: () => get().loginResponse?.data,

      updateProfile: (values) =>
        set(() => {
          const loginData = get()?.loginResponse?.data!;

          return {
            loginResponse: {
              ...get()?.loginResponse!,
              data: { ...values, token: loginData.token },
            },
          };
        }),

      updateOrdinalWalletData: (values) => {
        console.log({ values });
        if (!values) return;
        return set(() => {
          const loginData = get()?.loginResponse?.data!;

          return {
            loginResponse: {
              ...get()?.loginResponse!,
              data: { ...loginData, ordinalWallet: { ...values } },
            },
          };
        });
      },
      setCurrentTrialCount: (currentTrialCount) =>
        set(() => ({ currentTrialCount })),
    }),
    {
      name: authStoreName,
      storage: encryptedStore(),
    },
  ),
  shallow,
);
