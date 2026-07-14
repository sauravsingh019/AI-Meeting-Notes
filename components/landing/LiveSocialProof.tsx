'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, X, Sparkles } from 'lucide-react';

interface RecentSignup {
  name: string;
  plan: string;
  timeAgo: string;
}

export function LiveSocialProof() {
  const [signups, setSignups] = useState<RecentSignup[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // If user has dismissed social proof during this session, do not render
    if (typeof window !== 'undefined' && sessionStorage.getItem('social_proof_dismissed')) {
      setIsDismissed(true);
      return;
    }

    const fetchRecentSignups = async () => {
      try {
        const response = await fetch('/api/waitlist/recent');
        if (!response.ok) return;
        const resJson = await response.json();
        if (resJson.success && resJson.data && resJson.data.length > 0) {
          setSignups(resJson.data);
          
          // Initial delay before showing the first alert
          const showTimeout = setTimeout(() => {
            setIsVisible(true);
          }, 3000);

          return () => clearTimeout(showTimeout);
        }
      } catch (error) {
        console.error('Failed to load recent signups for social proof:', error);
      }
    };

    fetchRecentSignups();
  }, []);

  useEffect(() => {
    if (signups.length <= 1 || isDismissed) return;

    // Cycle through signups
    const interval = setInterval(() => {
      // Fade out
      setIsVisible(false);

      // Wait for fade-out animation to complete, then change index and fade back in
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % signups.length);
        setIsVisible(true);
      }, 1000);

    }, 12000); // Cycle every 12 seconds

    return () => clearInterval(interval);
  }, [signups, isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('social_proof_dismissed', 'true');
    }
  };

  if (isDismissed || signups.length === 0) return null;

  const currentSignup = signups[currentIndex];

  const getPlanBadge = (plan: string) => {
    if (plan === 'pro') return 'Pro Plan';
    if (plan === 'enterprise') return 'Enterprise';
    return 'Waitlist';
  };

  return (
    <AnimatePresence>
      {isVisible && currentSignup && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 left-6 z-50 flex items-center gap-4 p-4 pr-10 rounded-2xl border border-gray-150 dark:border-gray-800/80 shadow-[0_10px_40px_rgba(0,0,0,0.06)] bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl max-w-sm"
        >
          {/* User Icon Indicator */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-md shadow-indigo-100 dark:shadow-none shrink-0">
            <Users className="w-5 h-5 text-white" />
          </div>

          {/* Alert Content */}
          <div className="min-w-0 flex-grow">
            <p className="text-xs font-black text-gray-900 dark:text-white leading-tight">
              {currentSignup.name}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold mt-1">
              Joined waitlist for <span className="text-indigo-600 dark:text-indigo-400 font-bold">{getPlanBadge(currentSignup.plan)}</span>
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{currentSignup.timeAgo}</span>
            </div>
          </div>

          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-0.5 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
