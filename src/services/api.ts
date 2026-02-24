/**
 * API Service Layer
 * Ready for Spring Boot REST API integration.
 * Replace BASE_URL and remove mock data when backend is available.
 */

import type { Service, Stylist, TimeSlot, Booking } from '@/types/salon';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

// ── Mock Data ──────────────────────────────────────────────

const MOCK_SERVICES: Service[] = [
  { id: '1', name: 'Signature Haircut', description: 'Precision cut with consultation, wash & style', duration: 45, price: 85, category: 'hair' },
  { id: '2', name: 'Balayage Color', description: 'Hand-painted highlights for a natural sun-kissed look', duration: 120, price: 220, category: 'hair' },
  { id: '3', name: 'Keratin Treatment', description: 'Smooth, frizz-free hair for up to 3 months', duration: 150, price: 300, category: 'hair' },
  { id: '4', name: 'Gel Manicure', description: 'Long-lasting gel polish with cuticle care', duration: 45, price: 55, category: 'nails' },
  { id: '5', name: 'Spa Pedicure', description: 'Luxurious soak, scrub, massage & polish', duration: 60, price: 70, category: 'nails' },
  { id: '6', name: 'HydraFacial', description: 'Deep cleansing, exfoliation & hydration treatment', duration: 60, price: 180, category: 'skin' },
  { id: '7', name: 'Classic Facial', description: 'Customized facial with extraction & mask', duration: 75, price: 120, category: 'skin' },
  { id: '8', name: 'Bridal Makeup', description: 'Full glam with trial session included', duration: 90, price: 250, category: 'makeup' },
  { id: '9', name: 'Hot Stone Massage', description: 'Deep relaxation with heated basalt stones', duration: 90, price: 160, category: 'spa' },
];

const MOCK_STYLISTS: Stylist[] = [
  { id: '1', name: 'Sofia Laurent', title: 'Senior Stylist', avatar: '', rating: 4.9, reviewCount: 234, specialties: ['hair', 'makeup'] },
  { id: '2', name: 'Marcus Chen', title: 'Color Specialist', avatar: '', rating: 4.8, reviewCount: 189, specialties: ['hair'] },
  { id: '3', name: 'Aisha Patel', title: 'Nail Artist', avatar: '', rating: 5.0, reviewCount: 312, specialties: ['nails'] },
  { id: '4', name: 'Elena Rossi', title: 'Skin Therapist', avatar: '', rating: 4.9, reviewCount: 156, specialties: ['skin', 'spa'] },
];

const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  for (let hour = 9; hour <= 18; hour++) {
    for (const min of ['00', '30']) {
      if (hour === 18 && min === '30') continue;
      slots.push({
        id: `${hour}${min}`,
        time: `${hour.toString().padStart(2, '0')}:${min}`,
        available: Math.random() > 0.3,
      });
    }
  }
  return slots;
};

// ── API Functions ──────────────────────────────────────────

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export async function fetchServices(): Promise<Service[]> {
  // TODO: Replace with actual API call
  // return fetch(`${BASE_URL}/services`).then(r => r.json());
  await delay(300);
  return MOCK_SERVICES;
}

export async function fetchService(id: string): Promise<Service | undefined> {
  await delay(200);
  return MOCK_SERVICES.find(s => s.id === id);
}

export async function fetchStylists(category?: string): Promise<Stylist[]> {
  await delay(300);
  if (category) return MOCK_STYLISTS.filter(s => s.specialties.includes(category as any));
  return MOCK_STYLISTS;
}

export async function fetchTimeSlots(_date: string, _stylistId: string): Promise<TimeSlot[]> {
  await delay(400);
  return generateTimeSlots();
}

export async function createBooking(booking: Omit<Booking, 'id' | 'status'>): Promise<Booking> {
  // TODO: POST to `${BASE_URL}/bookings`
  await delay(500);
  return { ...booking, id: crypto.randomUUID(), status: 'confirmed' };
}
