'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Download, Filter, Loader2 } from 'lucide-react';
import { formatDate } from '@/utils/helpers';
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

interface WaitlistTableProps {
  users: WaitlistUser[];
  onExport: () => void;
  onInvite?: (email: string) => Promise<void>;
}

export function WaitlistTable({ users, onExport, onInvite }: WaitlistTableProps) {
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [invitingEmails, setInvitingEmails] = useState<string[]>([]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      (user.referral_code && user.referral_code.toLowerCase().includes(search.toLowerCase())) ||
      (user.referred_by && user.referred_by.toLowerCase().includes(search.toLowerCase()));
    const matchesPlan = planFilter === 'all' || user.plan === planFilter;
    return matchesSearch && matchesPlan;
  });

  const handleInviteClick = async (email: string) => {
    if (!onInvite) return;
    setInvitingEmails(prev => [...prev, email]);
    try {
      await onInvite(email);
    } catch (err) {
      console.error('Invite error:', err);
    } finally {
      setInvitingEmails(prev => prev.filter(e => e !== email));
    }
  };

  const handleExportCSV = () => {
    if (filteredUsers.length === 0) {
      toast.info('No data to export');
      return;
    }

    const headers = ['ID', 'Name', 'Email', 'Plan', 'Referral Code', 'Referred By', 'Referrals', 'Status', 'Created At'];
    const rows = filteredUsers.map(user => [
      user.id,
      `"${user.name.replace(/"/g, '""')}"`,
      `"${user.email.replace(/"/g, '""')}"`,
      user.plan,
      `"${(user.referral_code || '').replace(/"/g, '""')}"`,
      `"${(user.referred_by || '').replace(/"/g, '""')}"`,
      user.referral_count || 0,
      user.status || 'pending',
      user.created_at
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    try {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `waitlist_users_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Successfully exported ${filteredUsers.length} entries to CSV!`);
    } catch (err) {
      toast.error('Failed to export CSV file');
    }
  };

  const getPlanBadge = (plan: string) => {
    const colors = {
      free: 'bg-gray-150 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-0',
      pro: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-650 dark:text-indigo-400 border-0',
      enterprise: 'bg-purple-50 dark:bg-purple-900/30 text-purple-650 dark:text-purple-400 border-0',
    };
    return colors[plan as keyof typeof colors] || colors.free;
  };

  const getStatusBadge = (status?: string) => {
    const cleanStatus = status || 'pending';
    const colors = {
      pending: 'bg-yellow-50 dark:bg-yellow-950/30 text-yellow-650 dark:text-yellow-450 border-0',
      invited: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-650 dark:text-emerald-450 border-0',
    };
    return colors[cleanStatus as keyof typeof colors] || colors.pending;
  };

  return (
    <Card className="border border-gray-100 dark:border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white/70 dark:bg-gray-950/50 backdrop-blur-md rounded-[32px] overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
      <CardHeader className="p-6 md:p-8 pb-4">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div>
            <CardTitle className="text-2xl font-black text-gray-900 dark:text-white">Waitlist Submissions</CardTitle>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-1">Direct feedback from your early adopters.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative group min-w-[240px] flex-1 md:flex-none">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              <Input
                placeholder="Search founders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-11 h-11 bg-gray-55 dark:bg-gray-900 border-gray-100 dark:border-gray-800 rounded-2xl focus-visible:ring-indigo-500/20 transition-all font-medium text-xs"
              />
            </div>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-[120px] h-11 bg-gray-55 dark:bg-gray-900 border-gray-100 dark:border-gray-800 rounded-2xl font-bold text-xs">
                <Filter className="w-3.5 h-3.5 mr-2 text-gray-400" />
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-2xl">
                <SelectItem value="all" className="font-bold text-xs">All Plans</SelectItem>
                <SelectItem value="free" className="font-bold text-xs">Free</SelectItem>
                <SelectItem value="pro" className="font-bold text-xs">Pro</SelectItem>
                <SelectItem value="enterprise" className="font-bold text-xs">Enterprise</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={handleExportCSV}
              className="h-11 px-5 rounded-2xl border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all font-black text-[10px] uppercase tracking-widest"
            >
              <Download className="h-3.5 h-3.5 mr-1.5" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-900/30 border-y border-gray-50 dark:border-gray-800">
                <th className="text-left py-4 px-4 font-black text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-wider">Name</th>
                <th className="text-left py-4 px-4 font-black text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-wider">Email</th>
                <th className="text-left py-4 px-4 font-black text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-wider">Plan</th>
                <th className="text-left py-4 px-4 font-black text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-wider">Code</th>
                <th className="text-left py-4 px-4 font-black text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-wider">Referrer</th>
                <th className="text-left py-4 px-4 font-black text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-wider">Refs</th>
                <th className="text-left py-4 px-4 font-black text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-4 font-black text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-wider">Date</th>
                <th className="text-right py-4 px-4 font-black text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-wider">Action</th>
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
                    <td className="py-4 px-4 font-bold text-gray-900 dark:text-white text-xs truncate max-w-[110px]" title={user.name}>{user.name}</td>
                    <td className="py-4 px-4 text-gray-500 dark:text-gray-400 font-medium text-xs truncate max-w-[130px]" title={user.email}>{user.email}</td>
                    <td className="py-4 px-4">
                      <Badge className={`${getPlanBadge(user.plan)} px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider`}>
                        {user.plan}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 font-mono text-[10px] text-gray-500 dark:text-gray-400 font-bold">{user.referral_code || '—'}</td>
                    <td className="py-4 px-4 font-mono text-[10px] text-gray-450 dark:text-gray-500 font-semibold">{user.referred_by || '—'}</td>
                    <td className="py-4 px-4 font-black text-xs text-gray-700 dark:text-gray-300">{user.referral_count || 0}</td>
                    <td className="py-4 px-4">
                      <Badge className={`${getStatusBadge(user.status)} px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider`}>
                        {user.status || 'pending'}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-gray-400 dark:text-gray-500 text-[10px] font-bold">{formatDate(user.created_at)}</td>
                    <td className="py-4 px-4 text-right">
                      {(!user.status || user.status === 'pending') ? (
                        <Button 
                          onClick={() => handleInviteClick(user.email)}
                          disabled={invitingEmails.includes(user.email)}
                          size="sm"
                          className="h-8 px-3 rounded-lg text-[9px] font-black uppercase tracking-wider bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:scale-105 active:scale-95 transition-all"
                        >
                          {invitingEmails.includes(user.email) ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            'Invite'
                          )}
                        </Button>
                      ) : (
                        <span className="text-[9px] font-black text-emerald-650 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50/50 dark:bg-emerald-950/20 px-2 py-1 rounded">Invited</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-gray-250 dark:text-gray-750" />
              </div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white">No matches found</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1 px-8">We couldn't find anyone matching your current filters.</p>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
