'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Star, CreditCard, Share2 } from 'lucide-react';

interface StatsCardsProps {
  totalSignups: number;
  conversionRate: number;
  viralityRate: number;
  mostSelectedPlan: string;
}

export function StatsCards({ totalSignups, conversionRate, viralityRate, mostSelectedPlan }: StatsCardsProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
    >
      {/* Card 1: Total Signups */}
      <motion.div variants={item}>
        <Card className="border border-gray-100 dark:border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white/70 dark:bg-gray-900/70 backdrop-blur-md hover:shadow-xl transition-all duration-300 rounded-[32px] overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-8 px-8">
            <CardTitle className="text-[10px] md:text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Total Signups</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center transition-transform group-hover:scale-110">
              <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
          </CardHeader>
          <CardContent className="pb-8 px-8">
            <div className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 dark:text-white">{totalSignups}</div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 font-bold uppercase tracking-widest">Active queue count</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Card 2: Conversion Rate */}
      <motion.div variants={item}>
        <Card className="border border-gray-100 dark:border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white/70 dark:bg-gray-900/70 backdrop-blur-md hover:shadow-xl transition-all duration-300 rounded-[32px] overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-8 px-8">
            <CardTitle className="text-[10px] md:text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Paid Conversion</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center transition-transform group-hover:scale-110">
              <CreditCard className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent className="pb-8 px-8">
            <div className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 dark:text-white">{conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 font-bold uppercase tracking-widest">Waitlist to Paid Pro</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Card 3: Virality Rate */}
      <motion.div variants={item}>
        <Card className="border border-gray-100 dark:border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white/70 dark:bg-gray-900/70 backdrop-blur-md hover:shadow-xl transition-all duration-300 rounded-[32px] overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-8 px-8">
            <CardTitle className="text-[10px] md:text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Virality Rate</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center transition-transform group-hover:scale-110">
              <Share2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent className="pb-8 px-8">
            <div className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 dark:text-white">{viralityRate.toFixed(1)}%</div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 font-bold uppercase tracking-widest">Referred signups share</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Card 4: Most Popular Plan */}
      <motion.div variants={item}>
        <Card className="border border-gray-100 dark:border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white/70 dark:bg-gray-900/70 backdrop-blur-md hover:shadow-xl transition-all duration-300 rounded-[32px] overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-8 px-8">
            <CardTitle className="text-[10px] md:text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Top Plan Interest</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center transition-transform group-hover:scale-110">
              <Star className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent className="pb-8 px-8">
            <div className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 dark:text-white capitalize">{mostSelectedPlan}</div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 font-bold uppercase tracking-widest">Interest plan tier</p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
