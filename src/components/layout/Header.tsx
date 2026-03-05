import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/stores/userStore';
import logoMs from '@/assets/logo-ms.png';

const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'Services', path: '/services' },
  { label: 'Book Now', path: '/book' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { isAuthenticated, user } = useUserStore();

  if (pathname.startsWith('/admin')) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2 group">
          <img src={logoMs} alt="MS Salon & Academy" className="w-10 h-10 rounded-lg object-cover group-hover:scale-110 transition-transform" />
          <span className="font-serif text-xl font-semibold tracking-tight">MS Salon & Academy</span>
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
          
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button
                variant={pathname === '/dashboard' ? 'default' : 'outline'}
                size="sm"
                className="rounded-full px-5 font-sans text-sm font-medium gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                {user?.name?.split(' ')[0]}
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full px-5 font-sans text-sm font-medium gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" /> Login
              </Button>
            </Link>
          )}
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
              
              {isAuthenticated ? (
                <Link to="/dashboard" onClick={() => setOpen(false)}>
                  <Button
                    variant={pathname === '/dashboard' ? 'default' : 'outline'}
                    className="w-full justify-start rounded-lg font-sans gap-2"
                  >
                    <User className="w-4 h-4" /> My Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full justify-start rounded-lg font-sans gap-2">
                      <LogIn className="w-4 h-4" /> Login
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setOpen(false)}>
                    <Button className="w-full justify-start rounded-lg font-sans gap-2">
                      <User className="w-4 h-4" /> Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
