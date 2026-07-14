'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { loginSchema, LoginFormData } from '@/utils/validators';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  Loader2, 
  ArrowRight, 
  X, 
  Eye, 
  EyeOff, 
  Terminal 
} from 'lucide-react';
import { toast } from 'sonner';
import { isAdminEmail } from '@/config/site';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, signOut } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Password Visibility togglers
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSignIn = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await signInWithEmail(data);
      if (error) throw error;
      toast.success('Welcome back!');
      onClose();
      window.location.href = isAdminEmail(data.email) ? '/dashboard' : '/profile';
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSignUp = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await signUpWithEmail(data);
      if (error) throw error;
      toast.success('Account created! Check your email.');
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (mode: 'admin' | 'user') => {
    // Clear Supabase session client-side
    await signOut().catch(() => {});
    
    // Set demo cookie
    document.cookie = `demo_mode=${mode}; path=/; max-age=86400; SameSite=Lax`;
    toast.success(`Demo Mode (${mode === 'admin' ? 'Admin' : 'Workspace'}) Activated!`);
    onClose();

    // Hard redirect
    window.location.href = mode === 'admin' ? '/dashboard' : '/profile';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Inject style tag to completely hide scrollbar in Chrome/Safari */}
          <style dangerouslySetInnerHTML={{ __html: `
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `}} />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          
          <div className="fixed inset-0 flex items-center justify-center z-[101] pointer-events-none p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 400 }}
              className="w-full max-w-[420px] bg-white dark:bg-gray-950 rounded-[28px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] pointer-events-auto overflow-y-auto max-h-[90vh] relative border border-white/20 dark:border-white/10 hide-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-400 z-20"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="pt-8 pb-8 px-8">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-100 dark:shadow-none shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
                      Get Started
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold">
                      Manage your founder dashboard
                    </p>
                  </div>
                </div>

                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-50 dark:bg-gray-900 p-1 rounded-xl border border-gray-100 dark:border-gray-800">
                    <TabsTrigger value="login" className="rounded-lg text-[11px] font-bold py-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm">Sign In</TabsTrigger>
                    <TabsTrigger value="signup" className="rounded-lg text-[11px] font-bold py-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm">New Account</TabsTrigger>
                  </TabsList>

                  <AnimatePresence mode="wait">
                    <TabsContent value="login" key="login">
                      <motion.form 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        onSubmit={form.handleSubmit(onSignIn)} 
                        className="space-y-4"
                      >
                        <div className="space-y-1">
                          <Label htmlFor="email" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] ml-1">Work Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                            <Input 
                              id="email" 
                              placeholder="name@company.com" 
                              className="pl-11 h-11 rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-black transition-all text-sm font-medium"
                              {...form.register('email')}
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <Label htmlFor="password" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] ml-1">Password</Label>
                            <button type="button" className="text-[10px] text-indigo-600 dark:text-indigo-400 font-black hover:underline">
                              Forgot?
                            </button>
                          </div>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                            <Input 
                              id="password" 
                              type={showPassword ? "text" : "password"} 
                              placeholder="••••••••" 
                              className="pl-11 pr-11 h-11 rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-black transition-all text-sm font-medium"
                              {...form.register('password')}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-650 dark:hover:text-gray-250 cursor-pointer"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <Button 
                          disabled={isSubmitting}
                          className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-indigo-100 dark:shadow-none active:scale-[0.98] mt-2"
                        >
                          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Sign In to Dashboard"}
                          {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
                        </Button>
                      </motion.form>
                    </TabsContent>

                    <TabsContent value="signup" key="signup">
                      <motion.form 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        onSubmit={form.handleSubmit(onSignUp)} 
                        className="space-y-4"
                      >
                        <div className="space-y-1">
                          <Label htmlFor="signup-email" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] ml-1">Work Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                            <Input 
                              id="signup-email" 
                              placeholder="name@company.com" 
                              className="pl-11 h-11 rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-black transition-all text-sm font-medium"
                              {...form.register('email')}
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="signup-password" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] ml-1">Create Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                            <Input 
                              id="signup-password" 
                              type={showSignupPassword ? "text" : "password"} 
                              placeholder="••••••••" 
                              className="pl-11 pr-11 h-11 rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-black transition-all text-sm font-medium"
                              {...form.register('password')}
                            />
                            <button
                              type="button"
                              onClick={() => setShowSignupPassword(!showSignupPassword)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-650 dark:hover:text-gray-255 cursor-pointer"
                            >
                              {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <Button 
                          disabled={isSubmitting}
                          className="w-full h-11 rounded-xl bg-gray-900 dark:bg-white dark:text-gray-900 text-white font-black text-xs uppercase tracking-wider transition-all active:scale-[0.98] shadow-md shadow-gray-100 dark:shadow-none mt-2"
                        >
                          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Create Your Account"}
                          {!isSubmitting && <Sparkles className="w-4 h-4 ml-2" />}
                        </Button>
                      </motion.form>
                    </TabsContent>
                  </AnimatePresence>
                </Tabs>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-100 dark:border-gray-800"></span>
                  </div>
                  <div className="relative flex justify-center text-[9px] uppercase font-black tracking-[0.15em] text-gray-400">
                    <span className="bg-white dark:bg-gray-950 px-3">Or continue with</span>
                  </div>
                </div>

                <Button 
                  variant="outline"
                  onClick={signInWithGoogle} 
                  className="w-full h-11 rounded-xl border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all font-black text-xs flex items-center justify-center gap-2.5 active:scale-[0.98]"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Sign in with Google
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-150 dark:border-gray-800"></span>
                  </div>
                  <div className="relative flex justify-center text-[9px] uppercase font-bold tracking-widest text-gray-400">
                    <span className="bg-white dark:bg-gray-950 px-3">Demo Testing Mode</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline"
                    onClick={() => handleDemoLogin('user')}
                    className="h-11 rounded-xl border-indigo-100 hover:border-indigo-200 dark:border-gray-800 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20 transition-all font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 active:scale-[0.98] text-indigo-600 dark:text-indigo-400"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Workspace App
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleDemoLogin('admin')}
                    className="h-11 rounded-xl border-purple-100 hover:border-purple-200 dark:border-gray-800 hover:bg-purple-50/20 dark:hover:bg-purple-950/20 transition-all font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 active:scale-[0.98] text-purple-650 dark:text-purple-400"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    Founder Panel
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
