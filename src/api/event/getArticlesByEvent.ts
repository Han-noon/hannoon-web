import { supabase } from '@/lib/supabase';
import type { Articles } from '@/types/eventSummary';

interface ArticlesParam {
  p_bias_type: string | null;
  p_event_id: number;
  p_order: string | null;
  p_page: number | null;
}

export const getArticlesByEvent = async ({
  p_bias_type,
  p_event_id,
  p_order,
  p_page,
}: ArticlesParam): Promise<Articles> => {
  const { data, error } = await supabase.rpc('get_articles_by_event', {
    p_bias_type,
    p_event_id,
    p_order,
    p_page,
    p_size: 4,
  });

  if (error) throw error;

  if (!data) {
    throw new Error('데이터 없음');
  }

  return data;
};
