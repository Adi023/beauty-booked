/**
 * Customer auth & booking state (mock).
 * Replace with real API when Spring Boot backend is ready.
 */
import { create } from "zustand";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  joinedDate: string;
}

interface UserState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, phone: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const MOCK_USER: UserProfile = {
  id: "u1",
  name: "Priya Sharma",
  email: "priya@example.com",
  phone: "+91 98765 43210",
  joinedDate: "2025-06-15",
};

// Mock credentials: priya@example.com / password123
const MOCK_ACCOUNTS: Record<string, { password: string; user: UserProfile }> = {
  "priya@example.com": { password: "password123", user: MOCK_USER },
};

export const useUserStore = create<UserState>((set) => ({
  isAuthenticated: false,
  user: null,

  login: (email, password) => {
    const account = MOCK_ACCOUNTS[email.toLowerCase()];
    if (account && account.password === password) {
      set({ isAuthenticated: true, user: account.user });
      return true;
    }
    return false;
  },

  signup: (name, email, phone, _password) => {
    const newUser: UserProfile = {
      id: crypto.randomUUID(),
      name,
      email,
      phone,
      joinedDate: new Date().toISOString().split("T")[0],
    };
    MOCK_ACCOUNTS[email.toLowerCase()] = { password: _password, user: newUser };
    set({ isAuthenticated: true, user: newUser });
    return true;
  },

  logout: () => set({ isAuthenticated: false, user: null }),

  updateProfile: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),
}));
