/**
 * Simple admin state management with mock auth.
 * Replace with real auth when Spring Boot backend is ready.
 */

import { create } from 'zustand';
import type { Service, Stylist } from '@/types/salon';

interface AdminState {
  isAuthenticated: boolean;
  services: Service[];
  stylists: Stylist[];
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addService: (service: Service) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
  addStylist: (stylist: Stylist) => void;
  updateStylist: (id: string, stylist: Partial<Stylist>) => void;
  deleteStylist: (id: string) => void;
}

const INITIAL_SERVICES: Service[] = [
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

const INITIAL_STYLISTS: Stylist[] = [
  { id: '1', name: 'Sofia Laurent', title: 'Senior Stylist', avatar: '', rating: 4.9, reviewCount: 234, specialties: ['hair', 'makeup'] },
  { id: '2', name: 'Marcus Chen', title: 'Color Specialist', avatar: '', rating: 4.8, reviewCount: 189, specialties: ['hair'] },
  { id: '3', name: 'Aisha Patel', title: 'Nail Artist', avatar: '', rating: 5.0, reviewCount: 312, specialties: ['nails'] },
  { id: '4', name: 'Elena Rossi', title: 'Skin Therapist', avatar: '', rating: 4.9, reviewCount: 156, specialties: ['skin', 'spa'] },
];

export const useAdminStore = create<AdminState>((set) => ({
  isAuthenticated: false,
  services: INITIAL_SERVICES,
  stylists: INITIAL_STYLISTS,

  login: (username, password) => {
    // Mock admin credentials — replace with API auth
    if (username === 'admin' && password === 'admin123') {
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
      services: state.services.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    })),

  deleteService: (id) =>
    set((state) => ({ services: state.services.filter((s) => s.id !== id) })),

  addStylist: (stylist) =>
    set((state) => ({ stylists: [...state.stylists, stylist] })),

  updateStylist: (id, updates) =>
    set((state) => ({
      stylists: state.stylists.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    })),

  deleteStylist: (id) =>
    set((state) => ({ stylists: state.stylists.filter((s) => s.id !== id) })),
}));
