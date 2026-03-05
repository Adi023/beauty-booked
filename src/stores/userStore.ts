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

export interface UserBooking {
  id: string;
  serviceName: string;
  stylistName: string;
  date: string;
  time: string;
  price: number;
  duration: number;
  status: "confirmed" | "pending" | "cancelled" | "completed";
}

interface UserState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  bookings: UserBooking[];
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, phone: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  cancelBooking: (id: string) => void;
  addBooking: (booking: UserBooking) => void;
}

const MOCK_BOOKINGS: UserBooking[] = [
  {
    id: "b1",
    serviceName: "Bridal Makeup",
    stylistName: "Madhuri",
    date: "2026-03-10",
    time: "10:00",
    price: 3250,
    duration: 90,
    status: "confirmed",
  },
  {
    id: "b2",
    serviceName: "Keratin Treatment",
    stylistName: "Marcus Chen",
    date: "2026-03-15",
    time: "14:00",
    price: 1299,
    duration: 150,
    status: "confirmed",
  },
  {
    id: "b3",
    serviceName: "Classic Facial",
    stylistName: "Elena Rossi",
    date: "2026-02-20",
    time: "11:30",
    price: 720,
    duration: 75,
    status: "completed",
  },
  {
    id: "b4",
    serviceName: "Signature Haircut",
    stylistName: "Madhuri",
    date: "2026-01-15",
    time: "09:00",
    price: 285,
    duration: 45,
    status: "completed",
  },
  {
    id: "b5",
    serviceName: "Gel Manicure",
    stylistName: "Aisha Patel",
    date: "2025-12-28",
    time: "16:00",
    price: 155,
    duration: 45,
    status: "cancelled",
  },
];

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

export const useUserStore = create<UserState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  bookings: [],

  login: (email, password) => {
    const account = MOCK_ACCOUNTS[email.toLowerCase()];
    if (account && account.password === password) {
      set({ isAuthenticated: true, user: account.user, bookings: MOCK_BOOKINGS });
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
    // Add to mock accounts for future login
    MOCK_ACCOUNTS[email.toLowerCase()] = { password: _password, user: newUser };
    set({ isAuthenticated: true, user: newUser, bookings: [] });
    return true;
  },

  logout: () => set({ isAuthenticated: false, user: null, bookings: [] }),

  updateProfile: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),

  cancelBooking: (id) =>
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === id ? { ...b, status: "cancelled" as const } : b
      ),
    })),

  addBooking: (booking) =>
    set((state) => ({ bookings: [...state.bookings, booking] })),
}));
