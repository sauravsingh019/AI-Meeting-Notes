'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { NAV_LINKS } from '@/constants';
import { ThemeToggle } from './ThemeToggle';
import { AuthModal } from '../auth/AuthModal';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'py-4 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-lg border-b border-gray-100 dark:border-gray-800' 
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center h-12 relative">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-100 dark:shadow-none group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-4.5 h-4.5 md:w-5 md:h-5 text-white" />
                </div>
                <span className="hidden sm:block text-lg md:text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  AI Meeting Notes
                </span>
              </Link>
            </div>

            {/* Centered Links */}
            <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-10">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[13px] font-bold text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 tracking-tight"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Side Buttons */}
            <div className="flex-1 flex justify-end items-center gap-4">
              <div className="hidden lg:flex items-center gap-4">
                <ThemeToggle />
                <div className="w-px h-6 bg-gray-100 dark:bg-gray-800 mx-2" />
                {user ? (
                  <>
                    <Link href="/dashboard">
                      <Button variant="ghost" className="font-bold text-[13px] text-gray-600 dark:text-gray-400 rounded-xl px-5 h-10">Dashboard</Button>
                    </Link>
                    <Button onClick={() => signOut()} className="bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-black dark:hover:bg-gray-100 text-white font-bold text-[13px] px-6 h-10 rounded-xl transition-all active:scale-[0.98]">
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="ghost" 
                      onClick={() => setIsAuthModalOpen(true)}
                      className="font-bold text-[13px] text-gray-600 dark:text-gray-400 rounded-xl px-5 h-10"
                    >
                      Sign In
                    </Button>
                    <Button 
                      onClick={() => setIsAuthModalOpen(true)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[13px] px-6 h-10 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
                    >
                      Join Now
                    </Button>
                  </>
                )}
              </div>

              {/* Mobile Controls */}
              <div className="lg:hidden flex items-center gap-3">
                <ThemeToggle />
                <button
                  className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl transition-colors"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-6">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-lg font-bold text-gray-900 dark:text-white hover:text-indigo-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex flex-col gap-4 pt-4 border-t border-gray-50 dark:border-gray-800">
                  {user ? (
                    <>
                      <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full h-12 rounded-xl font-bold">Dashboard</Button>
                      </Link>
                      <Button onClick={() => { signOut(); setIsMobileMenuOpen(false); }} className="w-full h-12 rounded-xl bg-gray-900 dark:bg-white dark:text-gray-900 text-white font-bold">
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        variant="outline" 
                        onClick={() => { setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }}
                        className="w-full h-12 rounded-xl font-bold"
                      >
                        Sign In
                      </Button>
                      <Button 
                        onClick={() => { setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }}
                        className="w-full h-12 rounded-xl bg-indigo-600 text-white font-bold"
                      >
                        Get Started
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
}
