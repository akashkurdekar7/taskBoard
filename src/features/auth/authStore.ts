import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  login: (email: string, password: string, remember: boolean) => boolean;
  logout: () => void;
  checkAuth: () => void;
}

const HARDCODED_EMAIL = "intern@demo.com";
const HARDCODED_PASSWORD = "intern123";

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,

  login: (email, password, remember) => {
    if (email === HARDCODED_EMAIL && password === HARDCODED_PASSWORD) {
      if (remember) {
        localStorage.setItem("auth", "true");
      } else {
        sessionStorage.setItem("auth", "true");
      }
      set({ isAuthenticated: true });
      return true;
    }
    return false;
  },

  logout: () => {
    localStorage.removeItem("auth");
    sessionStorage.removeItem("auth");
    set({ isAuthenticated: false });
  },

  checkAuth: () => {
    const storedLocal = localStorage.getItem("auth");
    const storedSession = sessionStorage.getItem("auth");

    if (storedLocal === "true" || storedSession === "true") {
      set({ isAuthenticated: true });
    }
  },
}));
