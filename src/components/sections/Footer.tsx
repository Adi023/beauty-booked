import { MapPin, Phone, Mail } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logoMs from '@/assets/logo-ms.png';

export default function Footer() {
  const { pathname } = useLocation();
  if (pathname.startsWith('/admin')) return null;

  return (
    <footer className="border-t border-border bg-card/50 py-12 md:py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={logoMs} alt="MS Salon & Academy" className="w-9 h-9 rounded-lg object-cover" />
              <span className="font-serif text-lg font-semibold">MS Salon & Academy</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Premium beauty services crafted with passion and expertise. Your beauty, our artistry.
            </p>
          </div>

          <div>
            <h4 className="font-serif font-semibold mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <Link to="/services" className="hover:text-primary transition-colors">Services</Link>
              <Link to="/book" className="hover:text-primary transition-colors">Book Now</Link>
            </div>
          </div>

          <div>
            <h4 className="font-serif font-semibold mb-4">Contact</h4>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> 123 Luxe Avenue, Beverly Hills</span>
              <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> (310) 555-0199</span>
              <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> hello@mssalon.com</span>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} MS Salon & Academy. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
