'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GlobalBackground } from '@/components/layout/GlobalBackground';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { 
  LogOut, 
  Home, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  Share2, 
  CreditCard, 
  FileText, 
  Plus, 
  Check, 
  Clock, 
  Search, 
  AudioLines,
  FileCheck2,
  ChevronRight,
  ListTodo,
  Mic,
  MicOff
} from 'lucide-react';
import { toast } from 'sonner';

interface WaitlistUser {
  id: string;
  name: string;
  email: string;
  plan: string;
  created_at: string;
  referral_code?: string;
  referral_count?: number;
  waitlist_position?: number;
  stripe_customer_id?: string;
  status?: string;
}

interface MeetingNote {
  id: string;
  title: string;
  date: string;
  duration: string;
  summary: string[];
  actionItems: { text: string; done: boolean }[];
  transcript: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [waitlistUser, setWaitlistUser] = useState<WaitlistUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  // Core Product: AI Meetings States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'summary' | 'transcript'>('summary');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStep, setUploadStep] = useState('');
  
  const [meetings, setMeetings] = useState<MeetingNote[]>([
    {
      id: 'meeting-1',
      title: 'Q3 Product Strategy Sync',
      date: 'Jul 14, 2026',
      duration: '42 mins',
      summary: [
        'Reviewed engineering OKRs and resolved Windows path execution limits.',
        'Decided to use standard, dependency-free REST calls to integrate Resend notifications.',
        'Approved deployment blueprint for Stripe customer billing portal redirects.'
      ],
      actionItems: [
        { text: 'Deploy rate-limiting protection to waitlist signups', done: true },
        { text: 'Integrate dynamic social proof loops on home page', done: true },
        { text: 'Map custom Stripe pricing configurations', done: false }
      ],
      transcript: `Founder: Welcome everyone. Let's align on our strategy. First, we need to guarantee that the onboarding emails look incredibly premium and match our new branding.
Marketing: Absolutely, I've drafted the copy for the welcome and referral alert templates. We'll use the Resend REST endpoints directly.
Engineering: Perfect. We've implemented rate limit filters to block spam bots from claiming our free tiers. Next step is pushing the final dashboard components live...`
    },
    {
      id: 'meeting-2',
      title: 'Marketing & Referral Launch',
      date: 'Jul 12, 2026',
      duration: '18 mins',
      summary: [
        'Introduced viral loop positioning that bumps referrers up in line.',
        'Configured session-based storage queries to capture incoming referral links.',
        'Launched live floating signup alerts in the bottom-left corner.'
      ],
      actionItems: [
        { text: 'Enable Twitter/X share parameter variables', done: true },
        { text: 'Set up Google Analytics conversion pixels', done: false }
      ],
      transcript: `Growth: Hey guys, we need to focus on virality. If we give referrers queue-boosting math, they will automatically share it.
Design: The social proof widgets look awesome. I'll make sure the animation curves are super smooth.
Founder: Let's launch this tonight to capture early beta feedback...`
    }
  ]);
  const [activeMeetingId, setActiveMeetingId] = useState<string>('meeting-1');

  // Live Browser voice recognition (100% Free)
  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);
  const transcriptRef = useRef('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'en-US';

        rec.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          
          const currentText = finalTranscript || interimTranscript;
          if (currentText.trim()) {
            setLiveTranscript(currentText);
            transcriptRef.current = currentText;
          }
        };

        rec.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          if (event.error === 'not-allowed') {
            toast.error('Microphone permission blocked. Please check your browser settings.');
          }
          setIsRecording(false);
        };

        rec.onend = () => {
          setIsRecording(false);
        };

        setRecognition(rec);
      }
    }
  }, []);

  const handleStartRecording = () => {
    if (!recognition) {
      toast.error('Speech recognition is not supported in this browser. Try Google Chrome or Microsoft Edge.');
      return;
    }
    setLiveTranscript('');
    transcriptRef.current = '';
    setIsRecording(true);
    try {
      recognition.start();
      toast.success('Microphone active! Speak to record your meeting in real-time.');
    } catch (err) {
      console.error('Start recognition error:', err);
    }
  };

  const handleStopRecording = () => {
    if (!recognition) return;
    try {
      recognition.stop();
    } catch (err) {
      console.error('Stop recognition error:', err);
    }
    setIsRecording(false);

    // Save notes based on transcript
    setTimeout(() => {
      const finalSpeech = transcriptRef.current.trim();
      if (!finalSpeech) {
        toast.info('No speech detected. Meeting note was not saved.');
        return;
      }
      
      const newId = `meeting-${Date.now()}`;
      const { tasks, summary } = parseSpeechToTasks(finalSpeech);
      const newNote: MeetingNote = {
        id: newId,
        title: `Voice Session #${meetings.length + 1}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        duration: 'Live Sync',
        summary: summary,
        actionItems: tasks,
        transcript: finalSpeech
      };

      setMeetings(prev => [newNote, ...prev]);
      setActiveMeetingId(newId);
      toast.success('Live voice note saved successfully!');
    }, 600);
  };

  const parseSpeechToTasks = (text: string) => {
    const sentences = text.split(/[.!?]+/);
    const tasks: { text: string; done: boolean }[] = [];
    const summary: string[] = [];

    sentences.forEach(sentence => {
      const clean = sentence.trim().toLowerCase();
      if (clean.includes('need to') || clean.includes('have to')) {
        const keyword = clean.includes('need to') ? 'need to' : 'have to';
        const idx = clean.indexOf(keyword) + keyword.length;
        const taskText = sentence.substring(idx).trim();
        if (taskText.length > 3) {
          tasks.push({ text: `Action Item: ${taskText.charAt(0).toUpperCase() + taskText.slice(1)}`, done: false });
        }
      }
      if (clean.includes('remember to') || clean.includes('make sure')) {
        const keyword = clean.includes('remember to') ? 'remember to' : 'make sure';
        const idx = clean.indexOf(keyword) + keyword.length;
        const taskText = sentence.substring(idx).trim();
        if (taskText.length > 3) {
          tasks.push({ text: `Task: ${taskText.charAt(0).toUpperCase() + taskText.slice(1)}`, done: false });
        }
      }
    });

    if (tasks.length === 0) {
      tasks.push({ text: 'Review voice sync meeting transcript', done: false });
      tasks.push({ text: 'Identify growth action checkpoints', done: false });
    }

    summary.push('Transcribed live microphone input client-side.');
    summary.push(`Captured speech stream totaling ${text.split(' ').length} words.`);
    
    return { tasks, summary };
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('demo_portal') === 'success') {
        toast.success("Demo Mode: Simulated billing portal redirect success! (In production, this launches your Stripe customer billing center).");
        router.replace('/profile');
      }
      if (urlParams.get('demo_checkout') === 'success') {
        toast.success("Demo Mode: Upgrade success! Your account is now subscribed to the PRO tier.");
        setWaitlistUser(prev => prev ? { ...prev, plan: 'pro' } : null);
        router.replace('/profile');
      }
    }
  }, [router]);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      if (user?.email === 'demo-user@aimeetings.com') {
        setWaitlistUser({
          id: 'demo-user-id',
          name: 'Demo Workspace User',
          email: 'demo-user@aimeetings.com',
          plan: 'pro',
          created_at: new Date().toISOString(),
          status: 'invited',
          referral_code: 'demoref',
          referral_count: 3,
          waitlist_position: 12,
          stripe_customer_id: 'cus_demo123'
        });
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('waitlist_users')
        .select('*')
        .eq('email', user?.email)
        .maybeSingle();

      if (error) throw error;
      setWaitlistUser(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load waitlist status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (!waitlistUser) return;
    const refLink = `${window.location.origin}/?ref=${waitlistUser.referral_code || waitlistUser.id}`;
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    toast.success('Referral link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCheckout = async () => {
    if (!waitlistUser) return;
    setCheckoutLoading(true);
    try {
      let priceId = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID;
      if (waitlistUser.plan === 'enterprise') {
        priceId = process.env.NEXT_PUBLIC_STRIPE_TEAM_PRICE_ID;
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          priceId: priceId,
          planName: waitlistUser.plan 
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Checkout failed');
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Stripe Error:', error);
      toast.error(error.message || 'Stripe integration is in test mode. Check .env settings.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handlePortalRedirect = async () => {
    if (!waitlistUser || !waitlistUser.stripe_customer_id) return;
    setPortalLoading(true);
    try {
      const response = await fetch('/api/checkout/portal', {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to open billing portal');
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No billing portal URL received');
      }
    } catch (error: any) {
      console.error('Portal Error:', error);
      toast.error(error.message || 'Failed to redirect to billing portal');
    } finally {
      setPortalLoading(false);
    }
  };

  // Mock Upload Process
  const handleUploadMock = () => {
    setUploading(true);
    setUploadProgress(0);
    setUploadStep('Reading audio file...');

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const newId = `meeting-${Date.now()}`;
            const newNote: MeetingNote = {
              id: newId,
              title: `Uploaded Meeting Note #${meetings.length + 1}`,
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              duration: '15 mins',
              summary: [
                'Parsed local audio voice tracks into clean structures.',
                'Identified primary roadmap decisions and action items.'
              ],
              actionItems: [
                { text: 'Review automatically generated summary notes', done: false },
                { text: 'Invite team members to portal workspace', done: false }
              ],
              transcript: `Speaker 1: Hi, I've uploaded the audio clip from our product sync. Let's make sure the transcript is accurate.
Speaker 2: Yes, we resolved the database issues and have checked that webhook alerts are running correctly.`
            };

            setMeetings((prevMeetings) => [newNote, ...prevMeetings]);
            setActiveMeetingId(newId);
            setUploading(false);
            toast.success('Meeting audio processed successfully!');
          }, 500);
          return 100;
        }

        const nextVal = prev + 10;
        if (nextVal === 30) setUploadStep('Transcribing speech to text...');
        if (nextVal === 70) setUploadStep('Generating AI summaries & checkpoints...');
        if (nextVal === 90) setUploadStep('Structuring final dashboard note...');
        return nextVal;
      });
    }, 300);
  };

  const handleToggleTask = (meetingId: string, taskIndex: number) => {
    setMeetings((prevMeetings) => 
      prevMeetings.map((m) => {
        if (m.id !== meetingId) return m;
        const newActions = [...m.actionItems];
        newActions[taskIndex] = {
          ...newActions[taskIndex],
          done: !newActions[taskIndex].done
        };
        return {
          ...m,
          actionItems: newActions
        };
      })
    );
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
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

  const isInvited = waitlistUser?.status === 'invited';
  const activeMeeting = meetings.find(m => m.id === activeMeetingId) || meetings[0];
  const filteredMeetings = meetings.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.transcript.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-transparent">
      <GlobalBackground />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <motion.div 
                whileHover={{ rotate: 15 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-100 dark:shadow-none cursor-pointer"
                onClick={() => router.push('/')}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
              <h1 className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
                {isInvited ? 'AI Meeting Notes Workspace' : 'Dashboard Portal'}
              </h1>
            </div>
            
            <div className="flex items-center gap-3 md:gap-6">
              <ThemeToggle />
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

      {/* Main Container */}
      <motion.main 
        variants={container}
        initial="hidden"
        animate="show"
        className="container mx-auto px-6 pt-32 pb-20 relative z-10 flex flex-col items-center"
      >
        {isInvited ? (
          /* =============================================================== */
          /* CLIENT WORKSPACE: UNLOCKED AI MEETING NOTES PORTAL             */
          /* =============================================================== */
          <motion.div variants={item} className="w-full max-w-6xl">
            
            {/* Header info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">
                  Welcome to your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Workspace</span>
                </h2>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-1">
                  Upload audio clips and review structured transcripts instantly.
                </p>
              </div>

              {waitlistUser?.stripe_customer_id && (
                <Button 
                  onClick={handlePortalRedirect}
                  disabled={portalLoading}
                  variant="outline"
                  className="rounded-2xl h-12 px-6 border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm font-black text-xs uppercase tracking-widest hover:scale-105 transition-all active:scale-95 shrink-0"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {portalLoading ? 'Redirecting...' : 'Billing Panel'}
                </Button>
              )}
            </div>

            {/* Split layout: Sidebar and Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Notes List & Actions */}
              <div className="space-y-6">
                
                {/* Upload Button Card */}
                <Card className="border border-gray-150/50 dark:border-gray-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-gradient-to-tr from-indigo-50/50 to-purple-50/30 dark:from-indigo-950/20 dark:to-purple-950/10 rounded-3xl overflow-hidden p-6">
                  <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-3">Transcribe New</h4>
                  {uploading ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs font-black text-indigo-600 dark:text-indigo-400">
                        <span className="animate-pulse">{uploadStep}</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="h-2 w-full bg-indigo-100 dark:bg-indigo-950 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                  ) : isRecording ? (
                    <div className="space-y-3 p-4 bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30 rounded-2xl">
                      <div className="flex items-center justify-between text-xs font-black text-red-600 dark:text-red-400">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping shrink-0" />
                          Listening live...
                        </span>
                      </div>
                      <div className="text-[11px] font-medium text-gray-600 dark:text-gray-300 max-h-[80px] overflow-y-auto italic hide-scrollbar" style={{ scrollbarWidth: 'none' }}>
                        "{liveTranscript || 'Start speaking, your voice will appear here in real-time...'}"
                      </div>
                      <Button 
                        onClick={handleStopRecording}
                        className="w-full h-10 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                      >
                        <MicOff className="w-3.5 h-3.5 mr-1.5" />
                        Stop & Save Note
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button 
                        onClick={handleUploadMock}
                        className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-md shadow-indigo-100 dark:shadow-none hover:scale-[1.02] active:scale-[0.98] transition-all"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Upload Meeting Audio
                      </Button>
                      <Button 
                        onClick={handleStartRecording}
                        variant="outline"
                        className="w-full h-11 border-indigo-100 dark:border-indigo-950 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20 text-indigo-650 dark:text-indigo-400 font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                      >
                        <Mic className="w-4 h-4 mr-2 text-indigo-500" />
                        Record Live Meeting
                      </Button>
                    </div>
                  )}
                </Card>

                {/* Meetings List */}
                <Card className="border border-gray-100 dark:border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white/70 dark:bg-gray-950/50 backdrop-blur-md rounded-3xl overflow-hidden p-6 flex flex-col h-[400px]">
                  <div className="relative mb-4">
                    <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                    <input 
                      type="text"
                      placeholder="Search meetings..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 rounded-2xl border border-gray-100 dark:border-gray-850 bg-gray-50/50 dark:bg-gray-900/50 text-xs font-bold text-gray-700 dark:text-gray-300 placeholder-gray-450 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div className="flex-grow overflow-y-auto space-y-2 pr-1">
                    {filteredMeetings.length === 0 ? (
                      <div className="text-center py-12 text-xs font-semibold text-gray-400">
                        No meeting notes match your search.
                      </div>
                    ) : (
                      filteredMeetings.map((meeting) => (
                        <button
                          key={meeting.id}
                          onClick={() => {
                            setActiveMeetingId(meeting.id);
                            setActiveTab('summary');
                          }}
                          className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group ${activeMeetingId === meeting.id ? 'border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/40 dark:bg-indigo-950/20' : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-900/30'}`}
                        >
                          <div className="min-w-0">
                            <h5 className={`text-xs font-black truncate ${activeMeetingId === meeting.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-850 dark:text-gray-200'}`}>
                              {meeting.title}
                            </h5>
                            <div className="flex items-center gap-3 mt-1.5 text-[10px] font-bold text-gray-400 dark:text-gray-500">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {meeting.duration}</span>
                              <span>{meeting.date}</span>
                            </div>
                          </div>
                          <ChevronRight className={`w-4 h-4 text-gray-300 transition-transform group-hover:translate-x-0.5 shrink-0 ${activeMeetingId === meeting.id ? 'text-indigo-400' : ''}`} />
                        </button>
                      ))
                    )}
                  </div>
                </Card>
              </div>

              {/* Right Column: Note Viewer details */}
              <div className="lg:col-span-2">
                <Card className="border border-gray-100 dark:border-gray-800 shadow-[0_12px_40px_rgb(0,0,0,0.03)] bg-white/70 dark:bg-gray-950/50 backdrop-blur-md rounded-3xl overflow-hidden p-6 md:p-10 h-full min-h-[500px] flex flex-col">
                  {activeMeeting ? (
                    <div className="flex-grow flex flex-col">
                      
                      {/* Note Header */}
                      <div className="border-b border-gray-100 dark:border-gray-800 pb-6 mb-6">
                        <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1.5">
                          <AudioLines className="w-4.5 h-4.5" />
                          <span>AI Transcribed</span>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
                          {activeMeeting.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-xs font-bold text-gray-400 dark:text-gray-500">
                          <span>Date: {activeMeeting.date}</span>
                          <span>•</span>
                          <span>Length: {activeMeeting.duration}</span>
                        </div>
                      </div>

                      {/* Tab toggler */}
                      <div className="flex border-b border-gray-100 dark:border-gray-850 mb-6 p-1 bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl">
                        <button
                          onClick={() => setActiveTab('summary')}
                          className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${activeTab === 'summary' ? 'bg-white dark:bg-gray-850 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-gray-400 hover:text-gray-650'}`}
                        >
                          <FileCheck2 className="w-3.5 h-3.5" />
                          Summary & Action items
                        </button>
                        <button
                          onClick={() => setActiveTab('transcript')}
                          className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${activeTab === 'transcript' ? 'bg-white dark:bg-gray-850 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-gray-400 hover:text-gray-650'}`}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Full Transcript
                        </button>
                      </div>

                      {/* Tab content viewer */}
                      <div className="flex-grow">
                        {activeTab === 'summary' ? (
                          <div className="space-y-6">
                            
                            {/* Summary points */}
                            <div>
                              <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1 mb-3">AI Summary Keypoints</h4>
                              <ul className="space-y-2.5">
                                {activeMeeting.summary.map((point, index) => (
                                  <li key={index} className="text-sm font-medium text-gray-600 dark:text-gray-300 leading-relaxed flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                                    <span>{point}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Checkbox tasks */}
                            <div className="pt-4 border-t border-gray-100 dark:border-gray-855">
                              <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1 mb-3 flex items-center gap-2">
                                <ListTodo className="w-4 h-4 text-indigo-500" />
                                Action Items Checklist
                              </h4>
                              <div className="space-y-2">
                                {activeMeeting.actionItems.map((item, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => handleToggleTask(activeMeeting.id, idx)}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-50 dark:border-gray-900 bg-white/40 dark:bg-gray-900/20 hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors text-left"
                                  >
                                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${item.done ? 'bg-indigo-650 border-indigo-650 text-white' : 'border-gray-200 dark:border-gray-800'}`}>
                                      {item.done && <Check className="w-3.5 h-3.5" />}
                                    </div>
                                    <span className={`text-sm font-medium transition-all ${item.done ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-200'}`}>
                                      {item.text}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Transcript viewer */
                          <div className="h-[300px] overflow-y-auto p-4 bg-gray-50/30 dark:bg-gray-900/30 rounded-2xl border border-gray-100/50 dark:border-gray-850/50">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                              {activeMeeting.transcript}
                            </p>
                          </div>
                        )}
                      </div>

                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-sm font-bold text-gray-400">
                      Select a meeting note from the list.
                    </div>
                  )}
                </Card>
              </div>

            </div>

          </motion.div>
        ) : (
          /* =============================================================== */
          /* WAITLIST PORTAL: PENDING SPOT QUEUE (ORIGINAL VIEW)             */
          /* =============================================================== */
          <motion.div variants={item} className="w-full max-w-2xl">
            <Card className="border border-gray-100 dark:border-gray-800 shadow-2xl bg-white/70 dark:bg-gray-950/50 backdrop-blur-md rounded-[32px] overflow-hidden p-8 md:p-12">
              <CardHeader className="p-0 text-center md:text-left">
                <div className="flex justify-center md:justify-start mb-6">
                  <CheckCircle2 className="h-16 w-16 text-indigo-600 dark:text-indigo-400" />
                </div>
                <CardTitle className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight">
                  You are on the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">waitlist!</span>
                </CardTitle>
                <CardDescription className="text-base text-gray-500 dark:text-gray-400 font-medium mt-3">
                  Thanks for registering. We are releasing early access spots weekly. Here is your dashboard.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-0 mt-10 space-y-8">
                {/* Profile Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Account</h4>
                    <p className="mt-2 text-base font-bold text-gray-900 dark:text-white">{waitlistUser?.name || 'Waitlist Member'}</p>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>

                  <div className="p-6 bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Plan</h4>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-base font-bold uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
                        {waitlistUser?.plan || 'free'}
                      </span>
                      {waitlistUser && waitlistUser.plan !== 'free' && (
                        <span className="px-2 py-0.5 text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400 rounded-md">
                          Subscribed
                        </span>
                      )}
                    </div>
                    {waitlistUser && waitlistUser.stripe_customer_id ? (
                      <button 
                        onClick={handlePortalRedirect}
                        disabled={portalLoading}
                        className="mt-2 text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        {portalLoading ? 'Opening billing portal...' : 'Manage Subscription'}
                      </button>
                    ) : waitlistUser && waitlistUser.plan !== 'free' ? (
                      <p className="text-[11px] text-gray-400 font-medium mt-1">Payment verified via Stripe.</p>
                    ) : (
                      <button 
                        onClick={handleCheckout}
                        disabled={checkoutLoading || !waitlistUser}
                        className="mt-2 text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        {checkoutLoading ? 'Loading checkout...' : 'Upgrade to Pro now'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Referral Widget */}
                <div className="p-6 md:p-8 bg-indigo-50/20 dark:bg-indigo-950/20 rounded-3xl border border-indigo-100/30 dark:border-indigo-900/30">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                      <h3 className="text-lg font-black text-gray-900 dark:text-white">Jump the queue.</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Share your referral link with friends. For each person who signs up, you'll move up in line.</p>
                    </div>
                    <div className="text-left md:text-right shrink-0">
                      <h4 className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Referrals</h4>
                      <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">
                        {waitlistUser?.referral_count || 0}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 text-left">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1">Referral Link</label>
                      <div className="flex gap-2 mt-1.5">
                        <input 
                          type="text" 
                          readOnly 
                          value={waitlistUser ? `${window.location.origin}/?ref=${waitlistUser.referral_code || waitlistUser.id}` : ''}
                          className="flex-grow h-12 px-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-xs font-bold text-gray-650 dark:text-gray-300 focus:outline-none"
                        />
                        <Button 
                          onClick={handleCopyLink}
                          variant="outline"
                          className="h-12 w-12 rounded-2xl p-0 flex items-center justify-center border-gray-100 dark:border-gray-800 bg-white dark:bg-black shrink-0 hover:scale-105 active:scale-95 transition-all animate-shimmer"
                        >
                          {copied ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <Button
                    onClick={() => router.push('/')}
                    className="rounded-2xl h-14 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-150 dark:shadow-none hover:scale-105 transition-all active:scale-95"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Back to Homepage
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.main>
    </div>
  );
}
