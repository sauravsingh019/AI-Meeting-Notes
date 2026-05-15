'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Play, MessageSquare, Clock, Calendar, Users, Settings, Search, Download, Plus } from 'lucide-react';
import { useState, useRef } from 'react';
import { AuthModal } from '../auth/AuthModal';

export function HeroSection() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  const scrollToDemo = () => {
    dashboardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const logos = [
    { name: 'Stripe' },
    { name: 'OpenAI' },
    { name: 'Vercel' },
    { name: 'Supabase' },
    { name: 'Slack' },
  ];

  const sidebarItems = [
    { icon: Calendar, label: 'Meetings', active: true },
    { icon: Users, label: 'Team', active: false },
    { icon: MessageSquare, label: 'Templates', active: false },
  ];

  const users = [
    { initial: 'S', color: 'bg-indigo-600', text: 'text-white' },
    { initial: 'J', color: 'bg-purple-600', text: 'text-white' },
    { initial: 'M', color: 'bg-emerald-600', text: 'text-white' },
  ];

  return (
    <>
      <section className="relative min-h-screen flex items-center pt-24 md:pt-32 pb-20 overflow-hidden bg-transparent">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 mb-6 md:mb-8 hover:scale-105 transition-transform cursor-default">
                <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-[10px] md:text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">AI-First Meeting Intelligence</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-gray-900 dark:text-white mb-6 md:mb-8 leading-[1.1] md:leading-[1.1]">
                Every meeting, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">perfectly</span> captured.
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed px-4 md:px-0 font-medium">
                Turn hours of audio into actionable insights. Automatically summarize, extract tasks, and sync with your tools.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-5 mb-16 md:mb-20 px-4">
                <Button 
                  size="lg" 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="w-full sm:w-auto h-12 md:h-14 px-8 text-sm md:text-base font-black rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xl shadow-indigo-200 dark:shadow-none transition-all hover:scale-105 active:scale-95"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="lg" 
                  onClick={() => {
                    const el = document.getElementById('dashboard-demo');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="w-full sm:w-auto h-12 md:h-14 px-8 text-sm md:text-base font-bold rounded-2xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 transition-all hover:scale-105"
                >
                  <Play className="mr-2 w-3.5 h-3.5 md:w-4 md:h-4 fill-current" />
                  Watch Demo
                </Button>
              </div>

              {/* Trusted Logos */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 1 }}
                className="space-y-6"
              >
                <p className="text-[10px] md:text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.25em]">
                  Leading teams trust AI Meeting Notes
                </p>
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6 md:gap-x-12 md:gap-y-8 grayscale opacity-30 px-4">
                  {logos.map((logo) => (
                    <span key={logo.name} className="text-base md:text-xl font-black tracking-tighter text-gray-900 dark:text-white italic hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                      {logo.name}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* FULL DASHBOARD MOCKUP - SYMMETRICAL ROUNDING */}
            <motion.div
              id="dashboard-demo"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-20 md:mt-32 relative px-2 md:px-0 scroll-mt-32"
            >
              {/* Outer Frame - Uniformly Rounded */}
              <div className="p-3 md:p-5 rounded-[40px] md:rounded-[60px] bg-white/40 dark:bg-gray-900/40 backdrop-blur-3xl shadow-[0_48px_96px_-24px_rgba(0,0,0,0.15)] border border-white/60 dark:border-white/10 max-w-5xl mx-auto overflow-hidden">
                 
                 {/* Inner Dashboard - Perfectly Symmetrical Rounding */}
                 <div className="aspect-[16/10] md:aspect-video rounded-[30px] md:rounded-[50px] bg-white dark:bg-gray-950 shadow-2xl flex flex-col overflow-hidden border border-gray-100 dark:border-gray-800">
                    
                    {/* Header - Top Rounding Inherited */}
                    <div className="h-12 md:h-16 border-b border-gray-100 dark:border-gray-800 px-6 md:px-8 flex items-center justify-between bg-white dark:bg-gray-950 z-10 shrink-0">
                      <div className="flex items-center gap-4 md:gap-6">
                        <motion.div 
                          whileHover={{ rotate: 15 }}
                          className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100 dark:shadow-none cursor-pointer"
                        >
                           <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        </motion.div>
                        <div className="hidden sm:flex relative group/search">
                          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within/search:text-indigo-500 transition-colors" />
                          <div className="h-8 md:h-10 w-40 md:w-60 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-xl pl-10 flex items-center transition-all group-focus-within/search:border-indigo-500/50 group-focus-within/search:bg-white dark:group-focus-within/search:bg-gray-900">
                             <span className="text-[11px] md:text-xs text-gray-400 font-medium">Search insights...</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3 md:gap-4 items-center">
                        <div className="flex -space-x-1.5 md:-space-x-2">
                           {users.map((u, i) => (
                             <motion.div 
                               key={i} 
                               whileHover={{ y: -4, zIndex: 20 }}
                               className={`w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-white dark:border-gray-950 ${u.color} shadow-sm cursor-pointer transition-all flex items-center justify-center relative z-10`} 
                             >
                                <span className={`text-[9px] md:text-[10px] font-black ${u.text}`}>{u.initial}</span>
                             </motion.div>
                           ))}
                        </div>
                        <Settings className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 hover:rotate-90 transition-transform cursor-pointer" />
                      </div>
                    </div>

                    <div className="flex flex-1 overflow-hidden">
                      {/* Sidebar */}
                      <div className="w-14 md:w-56 border-r border-gray-100 dark:border-gray-800 p-3 md:p-6 lg:p-7 flex flex-col gap-6 md:gap-8 bg-gray-50/10 dark:bg-gray-900/10">
                        <div className="space-y-1.5">
                          {sidebarItems.map((item, i) => (
                            <motion.div 
                              key={i} 
                              whileHover={{ x: 4 }}
                              className={`flex items-center justify-center md:justify-start gap-3.5 px-3.5 py-2.5 rounded-xl transition-all duration-300 cursor-pointer ${item.active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'}`}
                            >
                              <item.icon className={`w-4 h-4 md:w-4.5 md:h-4.5 ${item.active ? 'text-white' : 'text-gray-400'}`} />
                              <span className="hidden md:block text-[12px] md:text-[13px] font-black tracking-tight">{item.label}</span>
                            </motion.div>
                          ))}
                        </div>
                        
                        <div className="mt-auto space-y-4 hidden md:block">
                          <motion.div 
                            whileHover={{ y: -4 }}
                            className="p-4 bg-white dark:bg-gray-900/50 rounded-[22px] border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md"
                          >
                             <div className="flex justify-between items-center mb-2">
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Usage</span>
                                <span className="text-[9px] font-black text-indigo-600">84%</span>
                             </div>
                             <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full mb-2 overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: '84%' }}
                                  transition={{ duration: 1.5, delay: 1 }}
                                  className="h-full bg-indigo-600 rounded-full" 
                                />
                             </div>
                             <p className="text-[9px] font-black text-gray-400 text-center">842 / 1,000 mins</p>
                          </motion.div>
                          <motion.div 
                            whileHover={{ scale: 1.02 }}
                            className="p-4 bg-indigo-600 rounded-[22px] text-white shadow-xl shadow-indigo-100 dark:shadow-none cursor-pointer group/plan"
                          >
                             <p className="text-[9px] font-black uppercase tracking-widest text-indigo-200 mb-1">Current Plan</p>
                             <p className="text-xs md:text-sm font-black flex items-center justify-between">
                                Pro Member
                                <Sparkles className="w-3.5 h-3.5 group-hover/plan:rotate-12 transition-transform" />
                             </p>
                          </motion.div>
                        </div>
                      </div>

                      {/* Main Content */}
                      <div className="flex-1 p-5 md:p-8 lg:p-10 bg-white dark:bg-gray-950 flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between gap-6 mb-6 shrink-0">
                          <div className="space-y-1.5">
                            <div className="flex items-center flex-wrap gap-2">
                              <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-[8px] md:text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.15em] border border-indigo-100 dark:border-indigo-900">Recording</span>
                              <div className="flex items-center gap-1 text-[9px] md:text-[10px] text-gray-400 font-bold">
                                <Clock className="w-3 h-3" /> 42:10
                              </div>
                            </div>
                            <h3 className="text-xl md:text-3xl lg:text-4xl font-black tracking-tight text-gray-900 dark:text-white leading-tight">
                              Weekly Product Sync
                            </h3>
                          </div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button className="bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-black dark:hover:bg-gray-100 text-white rounded-xl h-9 md:h-11 px-4 md:px-6 font-black text-[10px] md:text-xs shadow-xl shrink-0">
                               Export Notes
                            </Button>
                          </motion.div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 flex-1 min-h-0 overflow-hidden">
                          {/* Summary Column */}
                          <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-col gap-3 min-h-0"
                          >
                            <h4 className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                              <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> AI Executive Summary
                            </h4>
                            <div className="flex-1 p-5 md:p-7 bg-indigo-50/20 dark:bg-indigo-900/10 rounded-[28px] border border-indigo-100/30 dark:border-indigo-900/30 flex items-center justify-center text-center overflow-hidden hover:bg-indigo-50/30 dark:hover:bg-indigo-900/20 transition-colors cursor-default">
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-[12px] md:text-[14px] lg:text-[15px] font-medium">
                                The team reached a consensus on the <span className="text-indigo-600 dark:text-indigo-400 font-bold">Q4 product roadmap</span>. Key focus areas include scaling the infrastructure and refining onboarding flows.
                              </p>
                            </div>
                          </motion.div>
                          
                          {/* Transcription Column */}
                          <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-col gap-3 min-h-0"
                          >
                            <h4 className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                              <MessageSquare className="w-3.5 h-3.5 text-purple-500" /> Transcription Feed
                            </h4>
                            <div className="flex-1 space-y-5 px-1 overflow-hidden">
                              {[
                                { name: "SARAH", color: "indigo", text: "I'm concerned about the current latency in the AI processing engine." },
                                { name: "JAMES", color: "purple", text: "We've optimized the DB, but we might need more GPUs for real-time scaling." }
                              ].map((chat, i) => (
                                <motion.div 
                                  key={i} 
                                  whileHover={{ x: 6 }}
                                  className="flex gap-3.5 group/chat cursor-default"
                                >
                                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full bg-${chat.color}-100 dark:bg-${chat.color}-900/30 shrink-0 flex items-center justify-center text-[9px] md:text-[10px] font-black text-${chat.color}-600 dark:text-${chat.color}-400 border border-white dark:border-gray-900 shadow-sm transition-transform group-hover/chat:scale-110`}>
                                     {chat.name.charAt(0)}
                                  </div>
                                  <div className="space-y-1 flex-1 min-w-0">
                                    <span className={`text-[9px] font-black uppercase tracking-widest block transition-colors group-hover/chat:text-${chat.color}-600 dark:group-hover/chat:text-${chat.color}-400`}>
                                      {chat.name}
                                    </span>
                                    <p className="text-[11px] md:text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium line-clamp-2">
                                      {chat.text.split(chat.color === 'indigo' ? 'latency' : 'GPUs').map((part, index, array) => (
                                        <span key={index}>
                                          {part}
                                          {index < array.length - 1 && (
                                            <span className={`text-${chat.color}-600 dark:text-${chat.color}-400 font-bold`}>
                                              {chat.color === 'indigo' ? 'latency' : 'GPUs'}
                                            </span>
                                          )}
                                        </span>
                                      ))}
                                    </p>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
