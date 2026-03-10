/**
 * Shared booking store — single source of truth for all bookings.
 * Both user dashboard and admin panel consume this store.
 */
import { create } from "zustand";

export interface SharedBooking {
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

interface BookingState {
  bookings: SharedBooking[];
  addBooking: (booking: SharedBooking) => void;
  cancelBooking: (id: string) => void;
  rescheduleBooking: (id: string, newDate: string, newTime: string) => void;
  confirmBooking: (id: string) => void;
  completeBooking: (id: string) => void;
}

const INITIAL_BOOKINGS: SharedBooking[] = [
  {
    id: "ab1",
    customerName: "Priya Sharma",
    customerPhone: "+91 98765 43210",
    serviceName: "Bridal Makeup",
    stylistName: "Madhuri",
    date: "2026-03-10",
    time: "10:00",
    price: 3250,
    duration: 90,
    status: "pending",
  },
  {
    id: "ab2",
    customerName: "Priya Sharma",
    customerPhone: "+91 98765 43210",
    serviceName: "Keratin Treatment",
    stylistName: "Marcus Chen",
    date: "2026-03-15",
    time: "14:00",
    price: 1299,
    duration: 150,
    status: "pending",
  },
  {
    id: "ab3",
    customerName: "Anita Desai",
    customerPhone: "+91 91234 56789",
    serviceName: "HydraFacial",
    stylistName: "Elena Rossi",
    date: "2026-03-12",
    time: "11:00",
    price: 999,
    duration: 60,
    status: "confirmed",
  },
  {
    id: "ab4",
    customerName: "Priya Sharma",
    customerPhone: "+91 98765 43210",
    serviceName: "Classic Facial",
    stylistName: "Elena Rossi",
    date: "2026-02-20",
    time: "11:30",
    price: 720,
    duration: 75,
    status: "completed",
  },
  {
    id: "ab5",
    customerName: "Priya Sharma",
    customerPhone: "+91 98765 43210",
    serviceName: "Signature Haircut",
    stylistName: "Madhuri",
    date: "2026-01-15",
    time: "09:00",
    price: 285,
    duration: 45,
    status: "completed",
  },
  {
    id: "ab6",
    customerName: "Priya Sharma",
    customerPhone: "+91 98765 43210",
    serviceName: "Gel Manicure",
    stylistName: "Aisha Patel",
    date: "2025-12-28",
    time: "16:00",
    price: 155,
    duration: 45,
    status: "cancelled",
  },
  {
    id: "ab7",
    customerName: "Priya Sharma",
    customerPhone: "+91 98765 43210",
    serviceName: "Hair Spa Treatment",
    stylistName: "Marcus Chen",
    date: "2026-02-10",
    time: "13:00",
    price: 850,
    duration: 60,
    status: "completed",
  },
];

export const useBookingStore = create<BookingState>((set) => ({
  bookings: INITIAL_BOOKINGS,

  addBooking: (booking) =>
    set((state) => ({ bookings: [...state.bookings, booking] })),

  cancelBooking: (id) =>
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === id ? { ...b, status: "cancelled" as const } : b,
      ),
    })),

  rescheduleBooking: (id, newDate, newTime) =>
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === id ? { ...b, date: newDate, time: newTime } : b,
      ),
    })),

  confirmBooking: (id) =>
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === id ? { ...b, status: "confirmed" as const } : b,
      ),
    })),

  completeBooking: (id) =>
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === id ? { ...b, status: "completed" as const } : b,
      ),
    })),
}));
