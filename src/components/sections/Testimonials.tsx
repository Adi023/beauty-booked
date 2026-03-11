import { useReviewStore } from "@/stores/reviewStore";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";

export default function Testimonials() {
  const reviews = useReviewStore((s) => s.reviews);
  const topReviews = [...reviews]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const navigate = useCallback(
    (dir: 1 | -1) => {
      setDirection(dir);
      setCurrent((prev) => (prev + dir + topReviews.length) % topReviews.length);
    },
    [topReviews.length]
  );

  // Auto-advance every 5s
  useEffect(() => {
    if (topReviews.length <= 1) return;
    const timer = setInterval(() => navigate(1), 5000);
    return () => clearInterval(timer);
  }, [navigate, topReviews.length]);

  if (topReviews.length === 0) return null;

  const review = topReviews[current];
  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <section className="py-16 md:py-24 bg-accent/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3">
            Loved by Our Clients
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(avgRating)
                      ? "fill-[hsl(var(--gold))] text-[hsl(var(--gold))]"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold">{avgRating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">
              · {reviews.length} reviews
            </span>
          </div>
        </motion.div>

        {/* Carousel */}
        <div className="relative max-w-2xl mx-auto">
          <div className="overflow-hidden rounded-2xl bg-card border border-border/50 p-8 md:p-10 min-h-[220px] flex items-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={review.id}
                custom={direction}
                initial={{ opacity: 0, x: direction * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * 60 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="w-full text-center"
              >
                <Quote className="w-8 h-8 text-primary/20 mx-auto mb-4" />
                <p className="text-foreground text-lg md:text-xl leading-relaxed mb-6 font-serif italic">
                  "{review.comment}"
                </p>

                {/* Before/After */}
                {(review.beforePhoto || review.afterPhoto) && (
                  <div className="flex justify-center gap-3 mb-5">
                    {review.beforePhoto && (
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden">
                        <img src={review.beforePhoto} alt="Before" className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 inset-x-0 text-[9px] text-center bg-background/80 py-0.5 font-medium">Before</span>
                      </div>
                    )}
                    {review.afterPhoto && (
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden">
                        <img src={review.afterPhoto} alt="After" className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 inset-x-0 text-[9px] text-center bg-background/80 py-0.5 font-medium">After</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= review.rating
                          ? "fill-[hsl(var(--gold))] text-[hsl(var(--gold))]"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
                <p className="font-semibold text-sm">{review.customerName}</p>
                <p className="text-xs text-muted-foreground">
                  {review.serviceName} · {review.stylistName}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Nav buttons */}
          {topReviews.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full shadow-md bg-card hidden md:flex"
                onClick={() => navigate(-1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full shadow-md bg-card hidden md:flex"
                onClick={() => navigate(1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}

          {/* Dots */}
          <div className="flex justify-center gap-1.5 mt-5">
            {topReviews.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > current ? 1 : -1);
                  setCurrent(i);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === current
                    ? "bg-primary w-6"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
