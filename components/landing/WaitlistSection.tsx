'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { waitlistSchema, WaitlistFormData } from '@/utils/validators';
import { Loader2, Send, Sparkles, CheckCircle2, Copy } from 'lucide-react';

interface WaitlistResult {
  id: string;
  name: string;
  email: string;
  plan: string;
  referral_code: string;
  waitlist_position: number;
}

export function WaitlistSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [waitlistResult, setWaitlistResult] = useState<WaitlistResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      plan: 'free',
    }
  });

  // Capture referral parameter from URL and store in sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref');
      if (ref) {
        sessionStorage.setItem('referred_by', ref.toLowerCase());
      }
    }
  }, []);

  const onSubmit = async (data: WaitlistFormData) => {
    setIsSubmitting(true);
    try {
      const referredBy = typeof window !== 'undefined' ? sessionStorage.getItem('referred_by') : null;

      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          referredBy: referredBy || undefined,
          honeypot: honeypot || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to join waitlist');
      }

      const resJson = await response.json();
      setWaitlistResult(resJson.data);
      toast.success(resJson.message || 'You have been added to the waitlist!');
      reset();
    } catch (error: any) {
      toast.error(error.message || 'Failed to join waitlist. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    if (!waitlistResult) return;
    const refLink = `${window.location.origin}/?ref=${waitlistResult.referral_code}`;
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    toast.success('Referral link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const getReferralLink = () => {
    if (!waitlistResult) return '';
    return `${window.location.origin}/?ref=${waitlistResult.referral_code}`;
  };

  return (
    <section className="py-20 bg-transparent relative overflow-hidden" id="waitlist">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="bg-gray-900 dark:bg-indigo-950/40 backdrop-blur-xl rounded-[32px] p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center gap-12 border border-white/5 dark:border-white/10"
          >
            {/* Animated Internal Glows */}
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute top-0 right-0 w-80 h-80 bg-indigo-600 rounded-full blur-[100px] -z-0" 
            />
            <motion.div 
              animate={{ 
                scale: [1.2, 1, 1.2],
                opacity: [0.1, 0.15, 0.1]
              }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600 rounded-full blur-[100px] -z-0" 
            />

            <div className="flex-1 text-center lg:text-left z-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 mb-6">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-[9px] font-bold text-white uppercase tracking-widest">Early Access</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tight">
                  {waitlistResult ? 'Welcome to the club.' : 'Secure your spot today.'}
                </h2>
                <p className="text-gray-400 text-base leading-relaxed max-w-md mx-auto lg:mx-0 font-medium">
                  {waitlistResult 
                    ? 'Refer your founder friends to move up in line and get instant access to the beta portal.' 
                    : 'Join 1,000+ founders using AI to transform their meeting workflow.'}
                </p>
              </motion.div>
            </div>

            <AnimatePresence mode="wait">
              {waitlistResult ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full lg:w-[380px] bg-white dark:bg-gray-950/80 backdrop-blur-md rounded-2xl p-8 shadow-xl z-10 border border-gray-100 dark:border-white/10 text-center"
                >
                  <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950/50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  
                  <h3 className="text-xl font-black text-gray-900 dark:text-white">You're in, {waitlistResult.name.split(' ')[0]}!</h3>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">
                    Your registration has been confirmed.
                  </p>

                  <div className="my-5 p-4 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/50">
                    <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Waitlist Ranking</span>
                    <p className="text-4xl font-black text-gray-900 dark:text-white mt-1">
                      #{waitlistResult.waitlist_position}
                    </p>
                  </div>

                  <div className="space-y-4 text-left">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1">Referral Link</label>
                      <div className="flex gap-2 mt-1.5">
                        <input 
                          type="text" 
                          readOnly 
                          value={getReferralLink()}
                          className="flex-grow h-11 px-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-xs font-bold text-gray-600 dark:text-gray-300 focus:outline-none"
                        />
                        <Button 
                          onClick={handleCopyLink}
                          variant="outline"
                          className="h-11 w-11 rounded-xl p-0 flex items-center justify-center border-gray-100 dark:border-gray-800 bg-white dark:bg-black shrink-0 hover:scale-105 active:scale-95 transition-all"
                        >
                          {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="pt-1">
                      <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1">Share to rank up</span>
                      <div className="flex gap-2 mt-2">
                        <a 
                          href={`https://twitter.com/intent/tweet?text=Just%20joined%20the%20waitlist%20for%20AI%20Meeting%20Notes!%20Get%20early%20access%20here%3A%20${encodeURIComponent(getReferralLink())}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 h-11 rounded-xl bg-black text-white hover:bg-gray-900 flex items-center justify-center font-bold text-[11px] transition-all hover:scale-105 active:scale-95 border border-white/5"
                        >
                          Share on X
                        </a>
                        <a 
                          href={`https://api.whatsapp.com/send?text=Just%20joined%20the%20waitlist%20for%20AI%20Meeting%20Notes!%20Get%20early%20access%20here%3A%20${encodeURIComponent(getReferralLink())}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 h-11 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center font-bold text-[11px] transition-all hover:scale-105 active:scale-95"
                        >
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => setWaitlistResult(null)}
                    variant="ghost"
                    className="mt-5 text-[10px] text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold uppercase tracking-wider"
                  >
                    Add another email
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full lg:w-[380px] bg-white dark:bg-gray-950/80 backdrop-blur-md rounded-2xl p-8 shadow-xl z-10 border border-gray-100 dark:border-white/10"
                >
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Steve Jobs"
                        {...register('name')}
                        className="h-11 px-4 rounded-xl border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900 focus:bg-white dark:focus:bg-black transition-all text-sm dark:text-white"
                      />
                      {errors.name && <p className="text-[10px] text-red-500 font-bold">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1">Work Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="steve@apple.com"
                        {...register('email')}
                        className="h-11 px-4 rounded-xl border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900 focus:bg-white dark:focus:bg-black transition-all text-sm dark:text-white"
                      />
                      {errors.email && <p className="text-[10px] text-red-500 font-bold">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="plan" className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1">Plan</Label>
                      <Select
                        value={watch('plan')}
                        onValueChange={(value) => setValue('plan', value as any)}
                      >
                        <SelectTrigger className="h-11 px-4 rounded-xl border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900 focus:bg-white dark:focus:bg-black transition-all text-sm dark:text-white">
                          <SelectValue placeholder="Select a plan" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-gray-100 dark:border-gray-800 shadow-xl bg-white dark:bg-gray-950">
                          <SelectItem value="free" className="text-sm">Free (Beta)</SelectItem>
                          <SelectItem value="pro" className="text-sm">Pro ($19/mo)</SelectItem>
                          <SelectItem value="enterprise" className="text-sm">Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Honeypot field (hidden from screen readers & users) */}
                    <div className="hidden" aria-hidden="true">
                      <label htmlFor="website">Website</label>
                      <input
                        id="website"
                        type="text"
                        name="website"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-100 dark:shadow-none transition-all active:scale-[0.98] mt-4"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          Join Waitlist
                          <Send className="w-3.5 h-3.5 ml-2" />
                        </>
                      )}
                    </Button>
                    
                    <div className="flex items-center justify-center gap-2 pt-2">
                       <div className="flex -space-x-1.5">
                          {[1,2,3].map(i => (
                            <motion.div 
                              key={i} 
                              initial={{ opacity: 0, scale: 0 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.6 + (i * 0.1) }}
                              className="w-4 h-4 rounded-full border-2 border-white dark:border-gray-900 bg-gray-200 dark:bg-gray-800" 
                            />
                          ))}
                       </div>
                       <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">
                         +1,240 joined
                       </p>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
