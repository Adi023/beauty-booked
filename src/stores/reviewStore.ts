import { create } from "zustand";
import hairBefore from "@/assets/gallery/hair-before.jpg";
import hairAfter from "@/assets/gallery/hair-after.jpg";
import nailsBefore from "@/assets/gallery/nails-before.jpg";
import nailsAfter from "@/assets/gallery/nails-after.jpg";
import skinAfter from "@/assets/gallery/skin-after.jpg";

export interface Review {
  id: string;
  customerName: string;
  stylistName: string;
  serviceName: string;
  bookingId: string;
  rating: number; // 1-5
  comment: string;
  beforePhoto?: string;
  afterPhoto?: string;
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
    beforePhoto: skinAfter,
    afterPhoto: skinAfter,
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
  {
    id: "r3",
    customerName: "Anita Desai",
    stylistName: "Madhuri",
    serviceName: "Bridal Makeup",
    bookingId: "ab8",
    rating: 5,
    comment: "Madhuri made me look absolutely stunning on my big day. Couldn't be happier!",
    createdAt: "2026-02-10",
  },
  {
    id: "r4",
    customerName: "Sneha Reddy",
    stylistName: "Aisha Patel",
    serviceName: "Gel Manicure",
    bookingId: "ab9",
    rating: 5,
    comment: "Perfect nails every time. Aisha is incredibly talented and detail-oriented.",
    beforePhoto: nailsBefore,
    afterPhoto: nailsAfter,
    createdAt: "2026-03-01",
  },
  {
    id: "r5",
    customerName: "Kavita Joshi",
    stylistName: "Elena Rossi",
    serviceName: "HydraFacial",
    bookingId: "ab10",
    rating: 4,
    comment: "My skin has never looked better. The HydraFacial was totally worth it.",
    createdAt: "2026-02-28",
  },
  {
    id: "r6",
    customerName: "Meera Kapoor",
    stylistName: "Marcus Chen",
    serviceName: "Keratin Treatment",
    bookingId: "ab11",
    rating: 5,
    comment: "Silky smooth hair for months! Marcus really knows his craft.",
    createdAt: "2026-03-05",
  },
];

export const useReviewStore = create<ReviewState>((set) => ({
  reviews: INITIAL_REVIEWS,
  addReview: (review) =>
    set((state) => ({ reviews: [review, ...state.reviews] })),
  deleteReview: (id) =>
    set((state) => ({ reviews: state.reviews.filter((r) => r.id !== id) })),
}));
