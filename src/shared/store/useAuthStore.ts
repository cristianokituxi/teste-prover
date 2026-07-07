import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthState = {
  isAuthenticated: boolean;
  userName: string;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  login: (userName: string, password: string) => boolean;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      userName: "",
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

      login: (userName, password) => {
        const parsedUser = userName.trim();
        const parsedPassword = password.trim();
        if (!parsedUser || !parsedPassword) return false;
        set({ isAuthenticated: true, userName: parsedUser });
        return true;
      },

      logout: () => {
        set({ isAuthenticated: false, userName: "" });
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        userName: state.userName,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
