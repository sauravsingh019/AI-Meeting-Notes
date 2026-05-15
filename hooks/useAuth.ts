'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { User, SignInWithPasswordCredentials, SignUpWithPasswordCredentials } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/confirm`,
      },
    });
  };

  const signInWithEmail = async (credentials: SignInWithPasswordCredentials) => {
    return await supabase.auth.signInWithPassword(credentials);
  };

  const signUpWithEmail = async (credentials: SignUpWithPasswordCredentials) => {
    return await supabase.auth.signUp(credentials);
  };

  const signOut = async () => {
    return await supabase.auth.signOut();
  };

  return { 
    user, 
    loading, 
    signInWithGoogle, 
    signInWithEmail,
    signUpWithEmail,
    signOut 
  };
}
