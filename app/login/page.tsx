'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { loginSchema, LoginFormData } from '@/utils/validators';
import { Sparkles, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const onSignIn = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await signInWithEmail(data);
      if (error) throw error;
      toast.success('Welcome back!');
      router.push('/dashboard');
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
      toast.success('Account created! Please check your email for verification.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="rounded-full h-10 w-10 border-b-2 border-indigo-600" 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px] relative z-10"
      >
        <Card className="border border-white/40 dark:border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] bg-white/60 dark:bg-gray-950/60 backdrop-blur-2xl rounded-[32px] overflow-hidden">
          <CardHeader className="text-center space-y-1.5 pt-10 pb-6">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring" }}
              className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-indigo-200/50 dark:shadow-none"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Get Started
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Manage your founder dashboard
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-10">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100/50 dark:bg-gray-800/40 p-1 rounded-xl">
                <TabsTrigger value="login" className="rounded-lg text-xs font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-lg text-xs font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">New Account</TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                <TabsContent value="login" key="login">
                  <motion.form 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    onSubmit={form.handleSubmit(onSignIn)} 
                    className="space-y-4"
                  >
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input 
                          id="email" 
                          placeholder="name@company.com" 
                          className="pl-11 h-11 rounded-xl bg-gray-50/50 dark:bg-gray-900/40 border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-950 transition-all text-sm"
                          {...form.register('email')}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="password" className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Password</Label>
                        <button type="button" className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                          Forgot?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input 
                          id="password" 
                          type="password" 
                          placeholder="••••••••" 
                          className="pl-11 h-11 rounded-xl bg-gray-50/50 dark:bg-gray-900/40 border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-950 transition-all text-sm"
                          {...form.register('password')}
                        />
                      </div>
                    </div>
                    <Button 
                      disabled={isSubmitting}
                      className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-lg shadow-indigo-100 dark:shadow-none active:scale-95"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Sign In"}
                      {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
                    </Button>
                  </motion.form>
                </TabsContent>

                <TabsContent value="signup" key="signup">
                  <motion.form 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    onSubmit={form.handleSubmit(onSignUp)} 
                    className="space-y-4"
                  >
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-email" className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input 
                          id="signup-email" 
                          placeholder="name@company.com" 
                          className="pl-11 h-11 rounded-xl bg-gray-50/50 dark:bg-gray-900/40 border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-950 transition-all text-sm"
                          {...form.register('email')}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-password" className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input 
                          id="signup-password" 
                          type="password" 
                          placeholder="••••••••" 
                          className="pl-11 h-11 rounded-xl bg-gray-50/50 dark:bg-gray-900/40 border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-950 transition-all text-sm"
                          {...form.register('password')}
                        />
                      </div>
                    </div>
                    <Button 
                      disabled={isSubmitting}
                      className="w-full h-11 rounded-xl bg-gray-900 dark:bg-white dark:text-gray-900 text-white font-bold transition-all active:scale-95 shadow-lg shadow-gray-100 dark:shadow-none"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Create Account"}
                      {!isSubmitting && <Sparkles className="w-4 h-4 ml-2" />}
                    </Button>
                  </motion.form>
                </TabsContent>
              </AnimatePresence>
            </Tabs>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-100 dark:border-gray-800"></span>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-gray-400">
                <span className="bg-transparent px-3">Or continue with</span>
              </div>
            </div>

            <Button 
              variant="outline"
              onClick={signInWithGoogle} 
              className="w-full h-11 rounded-xl border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-all font-bold text-xs flex items-center justify-center gap-2.5 active:scale-95"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
