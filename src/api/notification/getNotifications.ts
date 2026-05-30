import { supabase } from '@/lib/supabase';
import type { NotificationList } from '@/types/notification';

export const getNotifications = async (currentPage: number): Promise<NotificationList> => {
  const { data, error } = await supabase.rpc('get_notifications', {
    p_page: currentPage,
    p_size: 5,
  });

  if (error) throw error;

  if (!data) {
    throw new Error('데이터 없음');
  }

  return data;
};
