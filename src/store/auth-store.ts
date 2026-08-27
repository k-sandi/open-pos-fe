import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { fetchApi } from "@/lib/api";

interface User {
  id: string;
  name: string;
  employee_id: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: (token: string) => set({ token, isAuthenticated: true }),
      
      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth-storage");
          window.location.href = "/login";
        }
      },

      fetchUser: async () => {
        const { token, user } = get();
        if (!token) return;
        
        // If we already have the user, no need to fetch again unless forced
        if (user) return;
        
        set({ isLoading: true });
        try {
          const userData = await fetchApi("/users/me");
          set({ user: userData, isAuthenticated: true, isLoading: false });
        } catch (error) {
          console.error("Failed to fetch user", error);
          set({ token: null, user: null, isAuthenticated: false, isLoading: false });
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
      },
    }),
    {
      name: "auth-storage", // name of item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token }), // only persist token
    }
  )
);
