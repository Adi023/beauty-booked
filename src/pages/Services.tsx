import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchServices } from "@/services/api";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import type { ServiceCategory } from "@/types/salon";
import { useReviewStore } from "@/stores/reviewStore";

const CATEGORIES: { label: string; value: ServiceCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "✂️ Hair", value: "hair" },
  { label: "💅 Nails", value: "nails" },
  { label: "✨ Skin", value: "skin" },
  { label: "💄 Makeup", value: "makeup" },
  { label: "🎁 Packages", value: "package" },
];

export default function Services() {
  const [filter, setFilter] = useState<ServiceCategory | "all">("all");
  const { data: services = [] } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });
  const reviews = useReviewStore((s) => s.reviews);

  const filtered =
    filter === "all" ? services : services.filter((s) => s.category === filter);

  // Compute average rating
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <main className="pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="font-serif text-3xl md:text-5xl font-bold mb-3">
            Our Services
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg">
            Explore our full menu of beauty and wellness treatments.
          </p>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center gap-0.5">
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
                ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}
        </motion.div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat.value}
              variant={filter === cat.value ? "default" : "outline"}
              size="sm"
              className="rounded-full font-sans"
              onClick={() => setFilter(cat.value)}
            >
              {cat.label}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={`/book?service=${service.id}`}>
                <div className="group rounded-2xl bg-card border border-border/50 p-5 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                  <h3 className="font-serif text-lg font-semibold mb-1.5 group-hover:text-primary transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm">
                      <span className="font-semibold text-primary">
                        ₹{service.price}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" /> {service.duration}m
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Customer Reviews Section */}
        {reviews.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16"
          >
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-2">
              What Our Clients Say
            </h2>
            <p className="text-muted-foreground mb-8">
              Real reviews from real customers
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.slice(0, 6).map((review, i) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  className="rounded-2xl bg-card border border-border/50 p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <Quote className="w-5 h-5 text-primary/30" />
                    <div className="flex gap-0.5">
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
                  </div>
                  <p className="text-sm text-foreground leading-relaxed mb-4 line-clamp-3">
                    "{review.comment}"
                  </p>

                  {/* Before/After thumbnails */}
                  {(review.beforePhoto || review.afterPhoto) && (
                    <div className="flex gap-2 mb-3">
                      {review.beforePhoto && (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                          <img src={review.beforePhoto} alt="Before" className="w-full h-full object-cover" />
                          <span className="absolute bottom-0 left-0 right-0 text-[8px] text-center bg-background/80 py-0.5 font-medium">Before</span>
                        </div>
                      )}
                      {review.afterPhoto && (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                          <img src={review.afterPhoto} alt="After" className="w-full h-full object-cover" />
                          <span className="absolute bottom-0 left-0 right-0 text-[8px] text-center bg-background/80 py-0.5 font-medium">After</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="border-t border-border/50 pt-3">
                    <p className="text-sm font-semibold">{review.customerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {review.serviceName} · {review.stylistName}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </main>
  );
}
