/**
 * API Service Layer
 * Ready for Spring Boot REST API integration.
 * Replace BASE_URL and remove mock data when backend is available.
 */

import type { Service, Stylist, TimeSlot, Booking } from "@/types/salon";

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

// ── Mock Data ──────────────────────────────────────────────
const MOCK_SERVICES: Service[] = [
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

const MOCK_STYLISTS: Stylist[] = [
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

const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  for (let hour = 9; hour <= 18; hour++) {
    for (const min of ["00", "30"]) {
      if (hour === 18 && min === "30") continue;
      slots.push({
        id: `${hour}${min}`,
        time: `${hour.toString().padStart(2, "0")}:${min}`,
        available: Math.random() > 0.3,
      });
    }
  }
  return slots;
};

// ── API Functions ──────────────────────────────────────────

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchServices(): Promise<Service[]> {
  // TODO: Replace with actual API call
  // return fetch(`${BASE_URL}/services`).then(r => r.json());
  await delay(300);
  return MOCK_SERVICES;
}

export async function fetchService(id: string): Promise<Service | undefined> {
  await delay(200);
  return MOCK_SERVICES.find((s) => s.id === id);
}

export async function fetchStylists(category?: string): Promise<Stylist[]> {
  await delay(300);
  if (category)
    return MOCK_STYLISTS.filter((s) => s.specialties.includes(category as any));
  return MOCK_STYLISTS;
}

export async function fetchTimeSlots(
  _date: string,
  _stylistId: string,
): Promise<TimeSlot[]> {
  await delay(400);
  return generateTimeSlots();
}

export async function createBooking(
  booking: Omit<Booking, "id" | "status">,
): Promise<Booking> {
  // TODO: POST to `${BASE_URL}/bookings`
  await delay(500);
  return { ...booking, id: crypto.randomUUID(), status: "confirmed" };
}
