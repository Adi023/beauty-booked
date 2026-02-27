import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchServices } from "@/services/api";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { ServiceCategory } from "@/types/salon";

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

  const filtered =
    filter === "all" ? services : services.filter((s) => s.category === filter);

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
      </div>
    </main>
  );
}
