import { create } from "zustand";

export interface Review {
  id: string;
  customerName: string;
  stylistName: string;
  serviceName: string;
  bookingId: string;
  rating: number; // 1-5
  comment: string;
  beforePhoto?: string; // data URL
  afterPhoto?: string;  // data URL
  createdAt: string;
}

interface ReviewState {
  reviews: Review[];
  addReview: (review: Review) => void;
  deleteReview: (id: string) => void;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: "r1",
    customerName: "Priya Sharma",
    stylistName: "Elena Rossi",
    serviceName: "Classic Facial",
    bookingId: "ab4",
    rating: 5,
    comment: "Amazing experience! My skin felt so refreshed and glowing after the session.",
    createdAt: "2026-02-21",
  },
  {
    id: "r2",
    customerName: "Priya Sharma",
    stylistName: "Madhuri",
    serviceName: "Signature Haircut",
    bookingId: "ab5",
    rating: 4,
    comment: "Great haircut, exactly what I wanted. Will definitely come back!",
    createdAt: "2026-01-16",
  },
];

export const useReviewStore = create<ReviewState>((set) => ({
  reviews: INITIAL_REVIEWS,
  addReview: (review) =>
    set((state) => ({ reviews: [review, ...state.reviews] })),
  deleteReview: (id) =>
    set((state) => ({ reviews: state.reviews.filter((r) => r.id !== id) })),
}));
