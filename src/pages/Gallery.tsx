import { useState } from "react";
import { useReviewStore, type Review } from "@/stores/reviewStore";
import { Star, Camera, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function Gallery() {
  const reviews = useReviewStore((s) => s.reviews);
  const withPhotos = reviews.filter((r) => r.beforePhoto || r.afterPhoto);
  const [selected, setSelected] = useState<Review | null>(null);

  return (
    <main className="pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="font-serif text-3xl md:text-5xl font-bold mb-3">
            Transformations
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg">
            Before & after results from our happy clients.
          </p>
        </motion.div>

        {withPhotos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Camera className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="font-serif text-xl font-semibold mb-2">
              No transformations yet
            </h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              When customers share before & after photos in their reviews, they'll appear here.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {withPhotos.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="group rounded-2xl bg-card border border-border/50 overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => setSelected(review)}
              >
                {/* Photo grid */}
                <div className="grid grid-cols-2 gap-px bg-border/30">
                  <div className="relative aspect-square bg-muted">
                    {review.beforePhoto ? (
                      <img
                        src={review.beforePhoto}
                        alt="Before"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/40">
                        <Camera className="w-8 h-8" />
                      </div>
                    )}
                    <span className="absolute top-2 left-2 text-[10px] font-semibold uppercase tracking-wider bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded-full">
                      Before
                    </span>
                  </div>
                  <div className="relative aspect-square bg-muted">
                    {review.afterPhoto ? (
                      <img
                        src={review.afterPhoto}
                        alt="After"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/40">
                        <Camera className="w-8 h-8" />
                      </div>
                    )}
                    <span className="absolute top-2 left-2 text-[10px] font-semibold uppercase tracking-wider bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded-full">
                      After
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-sm">{review.customerName}</p>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${
                            star <= review.rating
                              ? "fill-[hsl(var(--gold))] text-[hsl(var(--gold))]"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {review.serviceName} · {review.stylistName}
                  </p>
                  <p className="text-sm text-foreground mt-2 line-clamp-2 leading-relaxed">
                    "{review.comment}"
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden">
          {selected && (
            <div>
              <div className="grid grid-cols-2 gap-px bg-border/30">
                {selected.beforePhoto && (
                  <div className="relative aspect-square bg-muted">
                    <img
                      src={selected.beforePhoto}
                      alt="Before"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 text-xs font-semibold uppercase tracking-wider bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
                      Before
                    </span>
                  </div>
                )}
                {selected.afterPhoto && (
                  <div className="relative aspect-square bg-muted">
                    <img
                      src={selected.afterPhoto}
                      alt="After"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 text-xs font-semibold uppercase tracking-wider bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
                      After
                    </span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif text-lg font-semibold">
                    {selected.customerName}
                  </h3>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= selected.rating
                            ? "fill-[hsl(var(--gold))] text-[hsl(var(--gold))]"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {selected.serviceName} · {selected.stylistName}
                </p>
                <p className="text-foreground leading-relaxed">
                  "{selected.comment}"
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
