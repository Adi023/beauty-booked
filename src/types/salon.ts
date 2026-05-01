export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // minutes
  price: number;
  category: ServiceCategory;
  image?: string;
}

export type ServiceCategory = "hair" | "nails" | "skin" | "makeup" | "package";

export interface Stylist {
  id: string;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  specialties: ServiceCategory[];
  /** Commission percentage (0-100). Defaults to 15 if not set. */
  commissionRate?: number;
}

export interface TimeSlot {
  id: string;
  time: string; // "HH:mm"
  available: boolean;
}

export interface Booking {
  id: string;
  serviceId: string;
  stylistId: string;
  date: string; // ISO date
  time: string;
  status: "confirmed" | "pending" | "cancelled";
  customerName: string;
  customerPhone: string;
}

export interface Salon {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  reviewCount: number;
}
