import { supabase } from '@/lib/supabase';

export const deleteNotification = async (p_notification_id: number) => {
  const { error } = await supabase.rpc('delete_notification', {
    p_notification_id,
  });

  if (error) throw error;
};
