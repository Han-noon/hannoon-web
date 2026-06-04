import { supabase } from '@/lib/supabase';

export const deleteUser = async () => {
  const { error } = await supabase.rpc('delete_user');

  if (error) {
    console.error('Supabase RPC Error (delete_user):', error);
    throw error;
  }
};
