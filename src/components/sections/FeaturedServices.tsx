import { useQuery } from '@tanstack/react-query';
import { fetchServices } from '@/services/api';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Service } from '@/types/salon';
import salonServicesImg from '@/assets/salon-services.jpg';

const CATEGORY_EMOJI: Record<string, string> = {
  hair: '✂️',
  nails: '💅',
  skin: '✨',
  makeup: '💄',
  spa: '🧖',
};

function ServiceCard({ service, index }: { service: Service; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link to={`/book?service=${service.id}`}>
        <div className="group relative rounded-2xl bg-card border border-border/50 p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer">
          <div className="flex items-start justify-between mb-3">
            <span className="text-2xl">{CATEGORY_EMOJI[service.category]}</span>
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {service.category}
            </span>
          </div>
          <h3 className="font-serif text-lg font-semibold mb-1.5 group-hover:text-primary transition-colors">
            {service.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">
            {service.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm">
              <span className="font-semibold text-primary">${service.price}</span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-3.5 h-3.5" /> {service.duration}m
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function FeaturedServices() {
  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: fetchServices,
  });

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3">Our Services</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            From signature cuts to full-body pampering — we've got you covered.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.slice(0, 6).map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/services">
            <Button variant="outline" className="rounded-full px-8 font-sans gap-2">
              View All Services <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
