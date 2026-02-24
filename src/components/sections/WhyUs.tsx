import { Sparkles, Shield, Clock, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const FEATURES = [
  { icon: Sparkles, title: 'Expert Stylists', desc: 'Our team holds international certifications and trains continuously.' },
  { icon: Shield, title: 'Premium Products', desc: 'We exclusively use salon-grade, cruelty-free formulas.' },
  { icon: Clock, title: 'Easy Booking', desc: 'Book in seconds, get instant confirmation, reschedule anytime.' },
  { icon: Heart, title: 'Personal Touch', desc: 'Every visit is tailored to your unique style and preferences.' },
];

export default function WhyUs() {
  return (
    <section className="py-16 md:py-24 bg-warm/50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3">Why Lumière</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            A beauty experience designed around you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-serif text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
