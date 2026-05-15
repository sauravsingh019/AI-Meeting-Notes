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
import { Sparkles, Mail, Lock, Loader2, ArrowRight, X } from 'lucide-react';
import { toast } from 'sonner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
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
              className="w-full max-w-[480px] bg-white dark:bg-gray-950 rounded-[40px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] pointer-events-auto overflow-hidden relative border border-white/20 dark:border-white/10"
            >
              <button 
                onClick={onClose}
                className="absolute top-8 right-8 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-400 z-20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="pt-12 pb-12 px-10">
                <div className="flex items-center gap-5 mb-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-100 dark:shadow-none shrink-0">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                      Get Started
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Manage your founder dashboard
                    </p>
                  </div>
                </div>

                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-50 dark:bg-gray-900 p-1 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <TabsTrigger value="login" className="rounded-xl text-xs font-bold py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm">Sign In</TabsTrigger>
                    <TabsTrigger value="signup" className="rounded-xl text-xs font-bold py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm">New Account</TabsTrigger>
                  </TabsList>

                  <AnimatePresence mode="wait">
                    <TabsContent value="login" key="login">
                      <motion.form 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        onSubmit={form.handleSubmit(onSignIn)} 
                        className="space-y-5"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-[11px] font-black text-gray-400 uppercase tracking-[0.1em] ml-1">Work Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input 
                              id="email" 
                              placeholder="name@company.com" 
                              className="pl-11 h-12 rounded-2xl bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-black transition-all text-[15px] font-medium"
                              {...form.register('email')}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label htmlFor="password" className="text-[11px] font-black text-gray-400 uppercase tracking-[0.1em] ml-1">Password</Label>
                            <button type="button" className="text-[11px] text-indigo-600 dark:text-indigo-400 font-black hover:underline">
                              Forgot?
                            </button>
                          </div>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input 
                              id="password" 
                              type="password" 
                              placeholder="••••••••" 
                              className="pl-11 h-12 rounded-2xl bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-black transition-all text-[15px] font-medium"
                              {...form.register('password')}
                            />
                          </div>
                        </div>
                        <Button 
                          disabled={isSubmitting}
                          className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base transition-all shadow-xl shadow-indigo-100 dark:shadow-none active:scale-95 mt-2"
                        >
                          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Sign In to Dashboard"}
                          {!isSubmitting && <ArrowRight className="w-5 h-5 ml-2" />}
                        </Button>
                      </motion.form>
                    </TabsContent>

                    <TabsContent value="signup" key="signup">
                      <motion.form 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        onSubmit={form.handleSubmit(onSignUp)} 
                        className="space-y-5"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="signup-email" className="text-[11px] font-black text-gray-400 uppercase tracking-[0.1em] ml-1">Work Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input 
                              id="signup-email" 
                              placeholder="name@company.com" 
                              className="pl-11 h-12 rounded-2xl bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-black transition-all text-[15px] font-medium"
                              {...form.register('email')}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-password" className="text-[11px] font-black text-gray-400 uppercase tracking-[0.1em] ml-1">Create Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input 
                              id="signup-password" 
                              type="password" 
                              placeholder="••••••••" 
                              className="pl-11 h-12 rounded-2xl bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-black transition-all text-[15px] font-medium"
                              {...form.register('password')}
                            />
                          </div>
                        </div>
                        <Button 
                          disabled={isSubmitting}
                          className="w-full h-14 rounded-2xl bg-gray-900 dark:bg-white dark:text-gray-900 text-white font-black text-base transition-all active:scale-95 shadow-xl shadow-gray-100 dark:shadow-none mt-2"
                        >
                          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Create Your Account"}
                          {!isSubmitting && <Sparkles className="w-5 h-5 ml-2" />}
                        </Button>
                      </motion.form>
                    </TabsContent>
                  </AnimatePresence>
                </Tabs>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-100 dark:border-gray-800"></span>
                  </div>
                  <div className="relative flex justify-center text-[11px] uppercase font-black tracking-[0.15em] text-gray-400">
                    <span className="bg-white dark:bg-gray-950 px-4">Or continue with</span>
                  </div>
                </div>

                <Button 
                  variant="outline"
                  onClick={signInWithGoogle} 
                  className="w-full h-14 rounded-2xl border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all font-black text-sm flex items-center justify-center gap-3 active:scale-95"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Sign in with Google
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
