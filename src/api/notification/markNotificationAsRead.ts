import { supabase } from '@/lib/supabase';

export const markNotificationAsRead = async (p_notification_id: number) => {
  const { data, error } = await supabase.rpc('mark_notification_as_read', {
    p_notification_id,
  });

  if (error) throw error;

  if (!data) {
    throw new Error('데이터 없음');
  }
};
