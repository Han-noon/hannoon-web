import { supabase } from '@/lib/supabase';
import type { BiasType, GetArticlesByEventResponse } from '@/types/article';

interface GetArticlesByEventParams {
  eventId: number;
  biasType?: BiasType;
  page?: number;
  size?: number;
  order?: 'asc' | 'desc';
}

export const getArticlesByEvent = async ({
  eventId,
  biasType,
  page,
  size,
  order,
}: GetArticlesByEventParams): Promise<GetArticlesByEventResponse> => {
  const { data, error } = await supabase.rpc('get_articles_by_event', {
    p_event_id: eventId,
    ...(biasType !== undefined && { p_bias_type: biasType }),
    ...(page !== undefined && { p_page: page }),
    ...(size !== undefined && { p_size: size }),
    ...(order !== undefined && { p_order: order }),
  });

  if (error) throw error;

  if (!data) {
    throw new Error('데이터 없음');
  }

  return data as GetArticlesByEventResponse;
};
