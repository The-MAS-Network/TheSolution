import { createWithEqualityFn } from "zustand/traditional";
import { persist } from "zustand/middleware";
import { shallow } from "zustand/shallow";

import { encryptedStore } from ".";
import { LoginResponse, UserData } from "../types/api/auth.types";

export interface AuthStore {
  loginResponse: LoginResponse | null;
  currentTrialCount: number;

  logout: () => void;
  setLoginResponse: (value: LoginResponse) => void;
  updateProfile: (value: UserData) => void;
  setCurrentTrialCount: (value: number) => void;
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
