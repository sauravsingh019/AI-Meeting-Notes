'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}

export function useWaitlist() {
  const [loading, setLoading] = useState(false);

  const addToWaitlist = async (name: string, email: string, plan: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('waitlist_users')
        .insert([{ name, email, plan }]);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return { addToWaitlist, loading };
}
