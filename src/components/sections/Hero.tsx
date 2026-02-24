import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/5 blur-3xl" />
      </div>

      <div className="container pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-warm text-warm-foreground text-sm font-medium mb-6"
          >
            <Star className="w-3.5 h-3.5 fill-primary text-primary" />
            Rated 4.9 — 700+ happy clients
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6"
          >
            Where Beauty
            <br />
            Meets <span className="text-gradient">Artistry</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-lg mb-8 leading-relaxed"
          >
            Experience luxury beauty services tailored to you.
            Book your appointment in seconds and let our expert stylists transform your look.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Link to="/book">
              <Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary/25 font-sans text-base gap-2 group">
                Book Appointment
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/services">
              <Button size="lg" variant="outline" className="rounded-full px-8 font-sans text-base">
                View Services
              </Button>
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 flex items-center gap-4"
          >
            <div className="flex -space-x-3">
              {[0, 1, 2, 3].map(i => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground"
                >
                  {['SL', 'MC', 'AP', 'ER'][i]}
                </div>
              ))}
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">4 expert stylists</span>
              <br />
              ready to welcome you
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
