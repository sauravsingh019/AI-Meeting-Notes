'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReferrerStat {
  id: string;
  name: string;
  email: string;
  referral_count: number;
}

interface ReferralLeaderboardProps {
  referrers: ReferrerStat[];
}

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  if (local.length <= 2) return `${local}***@${domain}`;
  return `${local.substring(0, 2)}***${local.substring(local.length - 1)}@${domain}`;
}

export function ReferralLeaderboard({ referrers }: ReferralLeaderboardProps) {
  // Find the maximum count to normalize progress bars
  const maxReferrals = referrers.length > 0 ? Math.max(...referrers.map(r => r.referral_count)) : 1;

  const getLeaderColor = (index: number) => {
    const gradients = [
      'from-yellow-400 to-amber-500 text-amber-950 shadow-yellow-100 dark:shadow-none',
      'from-slate-300 to-slate-400 text-slate-800 shadow-slate-100 dark:shadow-none',
      'from-amber-600 to-amber-700 text-amber-50 shadow-amber-100 dark:shadow-none',
    ];
    return gradients[index] || 'from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 text-indigo-600 dark:text-indigo-400';
  };

  return (
    <Card className="border border-gray-100 dark:border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white/70 dark:bg-gray-950/50 backdrop-blur-md rounded-[32px] overflow-hidden h-full flex flex-col">
      <CardHeader className="p-6 md:p-10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <CardTitle className="text-2xl font-black text-gray-900 dark:text-white">Referral Leaderboard</CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">Top founders driving viral growth.</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-6 md:px-10 pb-10 flex-grow flex flex-col justify-center">
        {referrers.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-gray-300" />
            </div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">No referrals yet</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">Referral links shared by users will count here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {referrers.map((referrer, idx) => {
              const percentage = maxReferrals > 0 ? (referrer.referral_count / maxReferrals) * 100 : 0;
              const initials = referrer.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

              return (
                <motion.div 
                  key={referrer.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-4 group"
                >
                  {/* Avatar / Rank Indicator */}
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${getLeaderColor(idx)} flex items-center justify-center font-black text-sm shrink-0 shadow-lg`}>
                    {idx < 3 ? idx + 1 : initials}
                  </div>

                  {/* Profile info & progress */}
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {referrer.name}
                      </span>
                      <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                        {maskEmail(referrer.email)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-grow h-2 bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                        />
                      </div>
                      <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 w-6 text-right shrink-0">
                        {referrer.referral_count}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
