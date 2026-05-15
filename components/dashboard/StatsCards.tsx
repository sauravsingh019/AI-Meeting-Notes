'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, Star } from 'lucide-react';

interface StatsCardsProps {
  totalSignups: number;
  recentSignups: number;
  mostSelectedPlan: string;
}

export function StatsCards({ totalSignups, recentSignups, mostSelectedPlan }: StatsCardsProps) {
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
      className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
    >
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
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 font-bold uppercase tracking-widest">All time records</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="border border-gray-100 dark:border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white/70 dark:bg-gray-900/70 backdrop-blur-md hover:shadow-xl transition-all duration-300 rounded-[32px] overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-8 px-8">
            <CardTitle className="text-[10px] md:text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Recent Signups</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center transition-transform group-hover:scale-110">
              <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent className="pb-8 px-8">
            <div className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 dark:text-white">{recentSignups}</div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 font-bold uppercase tracking-widest">Last 30 days active</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="border border-gray-100 dark:border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white/70 dark:bg-gray-900/70 backdrop-blur-md hover:shadow-xl transition-all duration-300 rounded-[32px] overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-8 px-8">
            <CardTitle className="text-[10px] md:text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Most Popular Plan</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center transition-transform group-hover:scale-110">
              <Star className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent className="pb-8 px-8">
            <div className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 dark:text-white capitalize">{mostSelectedPlan}</div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 font-bold uppercase tracking-widest">Based on interest</p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
