import { supabase } from '@/lib/supabase';

export const signInWithOAuth = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: import.meta.env.VITE_SITE_URL || 'http://localhost:5173/',
    },
  });

  if (error) {
    console.error(error);
  }
};
