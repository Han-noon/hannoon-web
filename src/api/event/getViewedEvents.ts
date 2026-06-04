import { supabase } from '@/lib/supabase';

export const getViewedEvents = async (page: number, size: number = 6) => {
  const { data, error } = await supabase.rpc('get_viewed_events', {
    p_page: page,
    p_size: size,
  });

  if (error) {
    console.error('Supabase RPC Error (get_viewed_events):', error);
    throw error;
  }

  return data || { events: [], total_count: 0, total_pages: 1 };
};
