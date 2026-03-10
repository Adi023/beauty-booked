import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Upload, X, Camera } from "lucide-react";
import { toast } from "sonner";
import { useReviewStore, type Review } from "@/stores/reviewStore";
import type { SharedBooking } from "@/stores/bookingStore";

interface ReviewDialogProps {
  booking: SharedBooking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ReviewDialog({ booking, open, onOpenChange }: ReviewDialogProps) {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState("");
  const [beforePhoto, setBeforePhoto] = useState<string | null>(null);
  const [afterPhoto, setAfterPhoto] = useState<string | null>(null);
  const beforeRef = useRef<HTMLInputElement>(null);
  const afterRef = useRef<HTMLInputElement>(null);
  const addReview = useReviewStore((s) => s.addReview);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setter(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!booking) return;
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a review");
      return;
    }

    const review: Review = {
      id: crypto.randomUUID(),
      customerName: booking.customerName,
      stylistName: booking.stylistName,
      serviceName: booking.serviceName,
      bookingId: booking.id,
      rating,
      comment: comment.trim(),
      beforePhoto: beforePhoto || undefined,
      afterPhoto: afterPhoto || undefined,
      createdAt: new Date().toISOString().split("T")[0],
    };

    addReview(review);
    toast.success("Review submitted! Thank you 💖");
    resetAndClose();
  };

  const resetAndClose = () => {
    setRating(0);
    setHoveredStar(0);
    setComment("");
    setBeforePhoto(null);
    setAfterPhoto(null);
    onOpenChange(false);
  };

  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">Rate & Review</DialogTitle>
          <DialogDescription>
            {booking.serviceName} with {booking.stylistName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Star rating */}
          <div className="text-center">
            <p className="text-sm font-medium mb-2">How was your experience?</p>
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-0.5 transition-transform hover:scale-110"
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoveredStar || rating)
                        ? "fill-[hsl(var(--gold))] text-[hsl(var(--gold))]"
                        : "text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                {["", "Poor", "Fair", "Good", "Great", "Excellent"][rating]}
              </p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Your Review</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience..."
              className="rounded-xl resize-none"
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {comment.length}/500
            </p>
          </div>

          {/* Before/After photos */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Before & After Photos <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Before */}
              <div>
                <input
                  ref={beforeRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, setBeforePhoto)}
                />
                {beforePhoto ? (
                  <div className="relative rounded-xl overflow-hidden aspect-square bg-muted">
                    <img src={beforePhoto} alt="Before" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-background/80 rounded-full p-1"
                      onClick={() => setBeforePhoto(null)}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-1 left-1 text-[10px] bg-background/80 px-1.5 py-0.5 rounded-full font-medium">
                      Before
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => beforeRef.current?.click()}
                    className="w-full aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1.5 text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    <Camera className="w-5 h-5" />
                    <span className="text-xs font-medium">Before</span>
                  </button>
                )}
              </div>

              {/* After */}
              <div>
                <input
                  ref={afterRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, setAfterPhoto)}
                />
                {afterPhoto ? (
                  <div className="relative rounded-xl overflow-hidden aspect-square bg-muted">
                    <img src={afterPhoto} alt="After" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-background/80 rounded-full p-1"
                      onClick={() => setAfterPhoto(null)}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-1 left-1 text-[10px] bg-background/80 px-1.5 py-0.5 rounded-full font-medium">
                      After
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => afterRef.current?.click()}
                    className="w-full aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1.5 text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    <Upload className="w-5 h-5" />
                    <span className="text-xs font-medium">After</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" className="rounded-full font-sans" onClick={resetAndClose}>
            Cancel
          </Button>
          <Button className="rounded-full font-sans" onClick={handleSubmit}>
            Submit Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
