import { supabase } from '@/lib/supabase';
import type { EventItem } from '@/types/eventCard';

export const getEvents = async (
  page: number,
  size: number = 9,
  keyword: string,
  category?: string
): Promise<EventItem[]> => {
  const { data, error } = await supabase.rpc('get_events', {
    p_category: category || null,
    p_page: page,
    p_search: keyword === '' ? null : keyword,
    p_size: size,
  });

  if (error) {
    console.error('Supabase RPC Error:', error);
    throw error;
  }

  return data || [];
};
