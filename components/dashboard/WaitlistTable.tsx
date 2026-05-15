'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Download, Filter } from 'lucide-react';
import { formatDate } from '@/utils/helpers';

interface WaitlistUser {
  id: string;
  name: string;
  email: string;
  plan: string;
  created_at: string;
}

interface WaitlistTableProps {
  users: WaitlistUser[];
  onExport: () => void;
}

export function WaitlistTable({ users, onExport }: WaitlistTableProps) {
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('all');

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesPlan = planFilter === 'all' || user.plan === planFilter;
    return matchesSearch && matchesPlan;
  });

  const getPlanBadge = (plan: string) => {
    const colors = {
      free: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-0',
      pro: 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border-0',
      enterprise: 'bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 border-0',
    };
    return colors[plan as keyof typeof colors] || colors.free;
  };

  return (
    <Card className="border border-gray-100 dark:border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white/70 dark:bg-gray-950/50 backdrop-blur-md rounded-[32px] overflow-hidden">
      <CardHeader className="p-6 md:p-10 pb-6">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div>
            <CardTitle className="text-2xl font-black text-gray-900 dark:text-white">Waitlist Submissions</CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">Direct feedback from your early adopters.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative group min-w-[280px] flex-1 md:flex-none">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              <Input
                placeholder="Search founders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-11 h-12 bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 rounded-2xl focus-visible:ring-indigo-500/20 transition-all font-medium"
              />
            </div>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-[140px] h-12 bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 rounded-2xl font-bold">
                <Filter className="w-4 h-4 mr-2 text-gray-400" />
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-2xl">
                <SelectItem value="all" className="font-bold">All Plans</SelectItem>
                <SelectItem value="free" className="font-bold">Free</SelectItem>
                <SelectItem value="pro" className="font-bold">Pro</SelectItem>
                <SelectItem value="enterprise" className="font-bold">Enterprise</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={onExport}
              className="h-12 px-6 rounded-2xl border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all font-black text-xs uppercase tracking-widest"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-900/30 border-y border-gray-50 dark:border-gray-800">
                <th className="text-left py-5 px-10 font-black text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-[0.2em]">Name</th>
                <th className="text-left py-5 px-10 font-black text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-[0.2em]">Email Address</th>
                <th className="text-left py-5 px-10 font-black text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-[0.2em]">Interest</th>
                <th className="text-left py-5 px-10 font-black text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-[0.2em]">Joined Date</th>
               </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredUsers.map((user, idx) => (
                  <motion.tr 
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="border-b border-gray-50 dark:border-gray-900 hover:bg-gray-50/50 dark:hover:bg-gray-900/20 transition-colors group"
                  >
                    <td className="py-6 px-10 font-bold text-gray-900 dark:text-white">{user.name}</td>
                    <td className="py-6 px-10 text-gray-500 dark:text-gray-400 font-medium">{user.email}</td>
                    <td className="py-6 px-10">
                      <Badge className={`${getPlanBadge(user.plan)} px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider`}>
                        {user.plan}
                      </Badge>
                    </td>
                    <td className="py-6 px-10 text-gray-400 dark:text-gray-500 text-xs font-bold">{formatDate(user.created_at)}</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-gray-200 dark:text-gray-700" />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">No matches found</h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium mt-1 px-10">We couldn't find anyone matching your current filters.</p>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
