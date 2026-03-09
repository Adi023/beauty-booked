/**
 * Simple admin state management with mock auth.
 * Replace with real auth when Spring Boot backend is ready.
 */

import { create } from "zustand";
import type { Service, Stylist } from "@/types/salon";

export interface AdminBooking {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  stylistName: string;
  date: string;
  time: string;
  price: number;
  duration: number;
  status: "confirmed" | "pending" | "cancelled" | "completed";
}

interface AdminState {
  isAuthenticated: boolean;
  services: Service[];
  stylists: Stylist[];
  bookings: AdminBooking[];
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addService: (service: Service) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
  addStylist: (stylist: Stylist) => void;
  updateStylist: (id: string, stylist: Partial<Stylist>) => void;
  deleteStylist: (id: string) => void;
  confirmBooking: (id: string) => void;
  cancelBooking: (id: string) => void;
  completeBooking: (id: string) => void;
}

const INITIAL_SERVICES: Service[] = [
  {
    id: "1",
    name: "Bridal Makeup",
    description: "Full glam with trial session included",
    duration: 90,
    price: 3250,
    category: "makeup",
  },
  {
    id: "2",
    name: "Signature Haircut",
    description: "Precision cut with consultation, wash & style",
    duration: 45,
    price: 285,
    category: "hair",
  },
  {
    id: "3",
    name: "Classic Facial",
    description: "Customized facial with extraction & mask",
    duration: 75,
    price: 720,
    category: "skin",
  },
  {
    id: "4",
    name: "Haircut + D-Tan (Face & Neck) + (Eyebrow + FH + UL)",
    description:
      "Haircut with detan for face & neck plus eyebrow, full hands and upper lips",
    duration: 90,
    price: 699,
    category: "package",
  },
  {
    id: "5",
    name: "O3 Whitening & Brightening Facial + RICA Wax (FH + FL + UA)",
    description:
      "O3 whitening facial with RICA waxing for full hands, full legs and underarms",
    duration: 150,
    price: 2199,
    category: "package",
  },

  {
    id: "6",
    name: "Haircut Hair Spa (Wella) + (Eyebrow + FH + UL)",
    description:
      "Haircut with Wella hair spa plus eyebrow, full hands and upper lips",
    duration: 120,
    price: 1499,
    category: "package",
  },
  {
    id: "7",
    name: "VLCC Advance Facial + Gel Wax (FH + HL)",
    description:
      "VLCC advance facial with gel waxing for full hands and half legs",
    duration: 120,
    price: 1499,
    category: "package",
  },
  {
    id: "8",
    name: "Haircut Hair Spa (Wella) + Manicure/Pedicure",
    description: "Haircut with Wella hair spa plus manicure and pedicure",
    duration: 150,
    price: 1999,
    category: "package",
  },
  {
    id: "11",
    name: "Global Colour + Manicure & Pedicure + VLCC Facial",
    description: "Global hair colour with manicure, pedicure and VLCC facial",
    duration: 210,
    price: 3999,
    category: "package",
  },
  {
    id: "10",
    name: "Global Colour + N+ Facial",
    description: "Global hair colour with N+ facial treatment",
    duration: 180,
    price: 3499,
    category: "package",
  },
  {
    id: "11",
    name: "RICA Wax (FH + FL + UA)",
    description: "RICA waxing for full hands, full legs and underarms",
    duration: 60,
    price: 999,
    category: "package",
  },
  {
    id: "12",
    name: "Keratin Treatment",
    description: "Smooth, frizz-free hair for up to 3 months",
    duration: 150,
    price: 1299,
    category: "hair",
  },
  {
    id: "13",
    name: "Gel Manicure",
    description: "Long-lasting gel polish with cuticle care",
    duration: 45,
    price: 155,
    category: "nails",
  },
  {
    id: "14",
    name: "HydraFacial",
    description: "Deep cleansing, exfoliation & hydration treatment",
    duration: 60,
    price: 999,
    category: "skin",
  },
];

const INITIAL_STYLISTS: Stylist[] = [
  {
    id: "1",
    name: "Madhuri",
    title: "Senior Stylist",
    avatar: "",
    rating: 5.0,
    reviewCount: 534,
    specialties: ["hair", "makeup", "skin", "nails"],
  },
  {
    id: "2",
    name: "Marcus Chen",
    title: "Color Specialist",
    avatar: "",
    rating: 4.8,
    reviewCount: 189,
    specialties: ["hair"],
  },
  {
    id: "3",
    name: "Aisha Patel",
    title: "Nail Artist",
    avatar: "",
    rating: 5.0,
    reviewCount: 312,
    specialties: ["nails"],
  },
  {
    id: "4",
    name: "Elena Rossi",
    title: "Skin Therapist",
    avatar: "",
    rating: 4.9,
    reviewCount: 156,
    specialties: ["skin"],
  },
];

export const useAdminStore = create<AdminState>((set) => ({
  isAuthenticated: false,
  services: INITIAL_SERVICES,
  stylists: INITIAL_STYLISTS,

  login: (username, password) => {
    // Mock admin credentials — replace with API auth
    if (username === "admin" && password === "admin123") {
      set({ isAuthenticated: true });
      return true;
    }
    return false;
  },

  logout: () => set({ isAuthenticated: false }),

  addService: (service) =>
    set((state) => ({ services: [...state.services, service] })),

  updateService: (id, updates) =>
    set((state) => ({
      services: state.services.map((s) =>
        s.id === id ? { ...s, ...updates } : s,
      ),
    })),

  deleteService: (id) =>
    set((state) => ({ services: state.services.filter((s) => s.id !== id) })),

  addStylist: (stylist) =>
    set((state) => ({ stylists: [...state.stylists, stylist] })),

  updateStylist: (id, updates) =>
    set((state) => ({
      stylists: state.stylists.map((s) =>
        s.id === id ? { ...s, ...updates } : s,
      ),
    })),

  deleteStylist: (id) =>
    set((state) => ({ stylists: state.stylists.filter((s) => s.id !== id) })),
}));
