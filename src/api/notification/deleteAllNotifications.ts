import { supabase } from '@/lib/supabase';

export const deleteAllNotification = async () => {
  const { error } = await supabase.rpc('delete_all_notifications');

  if (error) throw error;
};
