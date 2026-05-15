'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { WaitlistTable } from '@/components/dashboard/WaitlistTable';
import { Charts } from '@/components/dashboard/Charts';
import { GlobalBackground } from '@/components/layout/GlobalBackground';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { LogOut, LayoutDashboard, Sparkles, Home, BarChart3, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

interface WaitlistUser {
  id: string;
  name: string;
  email: string;
  plan: string;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const analyticsRef = useRef<HTMLDivElement>(null);
  const [users, setUsers] = useState<WaitlistUser[]>([]);
  const [stats, setStats] = useState({
    totalSignups: 0,
    recentSignups: 0,
    mostSelectedPlan: 'pro',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchWaitlistData();
    }
  }, [user]);

  const fetchWaitlistData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('waitlist_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUsers(data || []);

      const now = new Date();
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      const recentUsers = data?.filter(u => new Date(u.created_at) > thirtyDaysAgo) || [];

      const planCounts = data?.reduce((acc: any, u) => {
        acc[u.plan] = (acc[u.plan] || 0) + 1;
        return acc;
      }, {}) || {};

      const mostPopular = Object.keys(planCounts).reduce((a, b) =>
        planCounts[a] > planCounts[b] ? a : b, 'pro');

      setStats({
        totalSignups: data?.length || 0,
        recentSignups: recentUsers.length,
        mostSelectedPlan: mostPopular,
      });
    } catch (error) {
      toast.error('Failed to load waitlist data');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToAnalytics = () => {
    analyticsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="rounded-full h-10 w-10 border-b-2 border-indigo-600" 
        />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen relative overflow-hidden bg-transparent transition-colors duration-500">
      <GlobalBackground />
      
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <motion.div 
                whileHover={{ rotate: 15 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-100 dark:shadow-none cursor-pointer"
              >
                <LayoutDashboard className="w-5 h-5 text-white" />
              </motion.div>
              <h1 className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
                Founder Portal
              </h1>
            </div>
            
            <div className="flex items-center gap-3 md:gap-6">
              <ThemeToggle />
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-2xl bg-gray-50/50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-xs">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{user.email?.split('@')[0]}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => signOut()}
                className="rounded-xl h-10 px-4 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 transition-colors font-black text-[10px] uppercase tracking-widest"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <motion.main 
        variants={container}
        initial="hidden"
        animate="show"
        className="container mx-auto px-6 pt-32 pb-20 relative z-10"
      >
        <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100/50 dark:border-indigo-900/50 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Real-time Analytics</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white leading-[1.1]">
              Metrics that <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">matter.</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-4 font-medium text-lg max-w-xl">
              You have <span className="text-indigo-600 dark:text-indigo-400 font-bold">{stats.totalSignups} founders</span> waiting for your launch. 
              Keep building.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="outline"
              className="rounded-2xl h-14 px-8 border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm font-black text-xs uppercase tracking-widest hover:scale-105 transition-all active:scale-95"
              onClick={() => router.push('/')}
            >
              <Home className="w-4 h-4 mr-2" />
              Public View
            </Button>
            <Button 
              onClick={scrollToAnalytics}
              className="rounded-2xl h-14 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-200 dark:shadow-none hover:scale-105 transition-all active:scale-95"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Detailed Reports
            </Button>
          </div>
        </motion.div>

        <motion.div variants={item}>
          <StatsCards
            totalSignups={stats.totalSignups}
            recentSignups={stats.recentSignups}
            mostSelectedPlan={stats.mostSelectedPlan}
          />
        </motion.div>

        <div ref={analyticsRef} className="scroll-mt-32">
          <motion.div variants={item}>
            <Charts data={users} />
          </motion.div>

          <motion.div variants={item} className="mt-16">
            <WaitlistTable users={users} onExport={fetchWaitlistData} />
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}
