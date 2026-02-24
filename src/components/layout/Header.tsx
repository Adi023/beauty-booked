import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'Services', path: '/services' },
  { label: 'Book Now', path: '/book' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
            <Scissors className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-serif text-xl font-semibold tracking-tight">Lumière</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(item => (
            <Link key={item.path} to={item.path}>
              <Button
                variant={pathname === item.path ? 'default' : 'ghost'}
                size="sm"
                className={cn(
                  'rounded-full px-5 font-sans text-sm font-medium',
                  pathname === item.path && 'shadow-md'
                )}
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden border-t border-border/50 bg-background"
          >
            <div className="container py-4 flex flex-col gap-2">
              {NAV_ITEMS.map(item => (
                <Link key={item.path} to={item.path} onClick={() => setOpen(false)}>
                  <Button
                    variant={pathname === item.path ? 'default' : 'ghost'}
                    className="w-full justify-start rounded-lg font-sans"
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
