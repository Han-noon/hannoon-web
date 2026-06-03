import { supabase } from '@/lib/supabase';
import type { Topics } from '@/types/timelineList';

export const getTopics = async (
  p_category: string | null,
  p_page: number,
  p_search: string | null
): Promise<Topics> => {
  const { data, error } = await supabase.rpc('get_topics', {
    p_category,
    p_page,
    p_search,
    p_size: 9,
  });

  if (error) throw error;

  if (!data) {
    throw new Error('데이터 없음');
  }

  return data;
};
