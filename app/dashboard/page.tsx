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
import { ReferralLeaderboard } from '@/components/dashboard/ReferralLeaderboard';
import { GlobalBackground } from '@/components/layout/GlobalBackground';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { LogOut, LayoutDashboard, Sparkles, Home, BarChart3, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface WaitlistUser {
  id: string;
  name: string;
  email: string;
  plan: string;
  created_at: string;
  referral_code?: string;
  referred_by?: string;
  referral_count?: number;
  status?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const analyticsRef = useRef<HTMLDivElement>(null);
  
  // States
  const [users, setUsers] = useState<WaitlistUser[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d');
  const [isLoading, setIsLoading] = useState(true);
  
  const [stats, setStats] = useState({
    totalSignups: 0,
    conversionRate: 0,
    viralityRate: 0,
    mostSelectedPlan: 'pro',
  });
  
  const [growthData, setGrowthData] = useState<{ name: string; signups: number }[]>([]);
  const [topReferrers, setTopReferrers] = useState<any[]>([]);

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

  // Recalculate metrics whenever users data or selected time range changes
  useEffect(() => {
    if (users.length > 0) {
      calculateAnalytics();
    }
  }, [users, timeRange]);

  const fetchWaitlistData = async () => {
    setIsLoading(true);
    try {
      if (user?.email === 'demo-admin@aimeetings.com') {
        const mockUsers: WaitlistUser[] = [
          { id: '1', name: 'Steve Jobs', email: 'steve@apple.com', plan: 'enterprise', status: 'invited', referral_code: 'steve1', referral_count: 14, created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
          { id: '2', name: 'Elon Musk', email: 'elon@spacex.com', plan: 'pro', status: 'invited', referral_code: 'elon2', referral_count: 9, created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
          { id: '3', name: 'Bill Gates', email: 'bill@microsoft.com', plan: 'free', status: 'pending', referral_code: 'bill3', referral_count: 0, created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
          { id: '4', name: 'Mark Zuckerberg', email: 'zuck@meta.com', plan: 'pro', status: 'pending', referral_code: 'zuck4', referral_count: 2, created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() },
          { id: '5', name: 'Jeff Bezos', email: 'jeff@amazon.com', plan: 'enterprise', status: 'invited', referral_code: 'jeff5', referral_count: 5, created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
        ];
        setUsers(mockUsers);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('waitlist_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      toast.error('Failed to load waitlist data');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAnalytics = () => {
    const now = new Date();
    let startDate = new Date(0); // Default all-time

    if (timeRange === '7d') {
      startDate = new Date(now.setDate(now.getDate() - 7));
    } else if (timeRange === '30d') {
      startDate = new Date(now.setDate(now.getDate() - 30));
    }

    // 1. Filter users based on selected time range
    const filteredUsers = users.filter(u => new Date(u.created_at) >= startDate);
    const count = filteredUsers.length;

    // 2. Calculate paid conversions (status === 'invited' or plan !== 'free' in range)
    const paidUsers = filteredUsers.filter(u => u.plan === 'pro' || u.plan === 'enterprise');
    const conversion = count > 0 ? (paidUsers.length / count) * 100 : 0;

    // 3. Calculate viral signups (referred_by is set in range)
    const viralUsers = filteredUsers.filter(u => u.referred_by);
    const virality = count > 0 ? (viralUsers.length / count) * 100 : 0;

    // 4. Calculate most popular plan
    const planCounts = filteredUsers.reduce((acc: any, u) => {
      acc[u.plan] = (acc[u.plan] || 0) + 1;
      return acc;
    }, {});
    const popular = Object.keys(planCounts).reduce((a, b) => 
      planCounts[a] > planCounts[b] ? a : b, 'pro');

    setStats({
      totalSignups: count,
      conversionRate: conversion,
      viralityRate: virality,
      mostSelectedPlan: popular,
    });

    // 5. Generate Signup Growth Chart data
    generateGrowthChart(filteredUsers);

    // 6. Aggregate Top Referrers list (All time context for top drivers)
    const leaders = [...users]
      .filter((u: any) => u.referral_count && u.referral_count > 0)
      .sort((a: any, b: any) => (b.referral_count || 0) - (a.referral_count || 0))
      .slice(0, 5)
      .map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        referral_count: u.referral_count
      }));
    setTopReferrers(leaders);
  };

  const generateGrowthChart = (filteredList: WaitlistUser[]) => {
    const growthMap: { [key: string]: number } = {};

    if (timeRange === '7d') {
      // Group by day name for last 7 days
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
        growthMap[dayLabel] = 0;
      }
      filteredList.forEach(user => {
        const dayLabel = new Date(user.created_at).toLocaleDateString('en-US', { weekday: 'short' });
        if (growthMap[dayLabel] !== undefined) {
          growthMap[dayLabel]++;
        }
      });
    } else if (timeRange === '30d') {
      // Group by date strings for last 30 days
      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        growthMap[dateLabel] = 0;
      }
      filteredList.forEach(user => {
        const dateLabel = new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (growthMap[dateLabel] !== undefined) {
          growthMap[dateLabel]++;
        }
      });
    } else {
      // Group by month for all time (e.g. last 6 months)
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthLabel = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        growthMap[monthLabel] = 0;
      }
      filteredList.forEach(user => {
        const monthLabel = new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        if (growthMap[monthLabel] !== undefined) {
          growthMap[monthLabel]++;
        }
      });
    }

    const formattedData = Object.keys(growthMap).map(key => ({
      name: key,
      signups: growthMap[key],
    }));

    setGrowthData(formattedData);
  };

  const handleInviteUser = async (email: string) => {
    try {
      const response = await fetch('/api/waitlist/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send invite');
      }

      toast.success(`Invite sent successfully to ${email}`);
      fetchWaitlistData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to invite user');
      throw err;
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
              You have <span className="text-indigo-600 dark:text-indigo-400 font-bold">{users.length} founders</span> waiting for your launch. 
              Keep building.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            {/* Time range selector */}
            <div className="flex bg-gray-100 dark:bg-gray-900 p-1.5 rounded-2xl border border-gray-200 dark:border-gray-800">
              <button 
                onClick={() => setTimeRange('7d')}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${timeRange === '7d' ? 'bg-white dark:bg-gray-850 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-gray-400 hover:text-gray-600'}`}
              >
                7 Days
              </button>
              <button 
                onClick={() => setTimeRange('30d')}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${timeRange === '30d' ? 'bg-white dark:bg-gray-850 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-gray-400 hover:text-gray-600'}`}
              >
                30 Days
              </button>
              <button 
                onClick={() => setTimeRange('all')}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${timeRange === 'all' ? 'bg-white dark:bg-gray-850 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-gray-400 hover:text-gray-600'}`}
              >
                All Time
              </button>
            </div>

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

        {/* Stats Cards grid */}
        <motion.div variants={item}>
          <StatsCards
            totalSignups={stats.totalSignups}
            conversionRate={stats.conversionRate}
            viralityRate={stats.viralityRate}
            mostSelectedPlan={stats.mostSelectedPlan}
          />
        </motion.div>

        {/* Charts & Table analytics */}
        <div ref={analyticsRef} className="scroll-mt-32">
          <motion.div variants={item}>
            <Charts data={users} growthData={growthData} />
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-16">
            <motion.div variants={item} className="xl:col-span-2">
              <WaitlistTable users={users} onExport={fetchWaitlistData} onInvite={handleInviteUser} />
            </motion.div>
            
            <motion.div variants={item}>
              <ReferralLeaderboard referrers={topReferrers} />
            </motion.div>
          </div>
        </div>
      </motion.main>
    </div>
  );
}
