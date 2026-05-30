import { supabase } from '@/lib/supabase';

export type AbusingType = 'title_content_mismatch' | 'content_context_mismatch';

export interface AbusingArticleItem {
  link: string;
  title: string;
  summary: string;
  article_image_url: string | null;
  publisher: string;
  published_at: string;
}

export interface GetAbusingArticlesByEventResponse {
  articles: AbusingArticleItem[];
  page: number;
  size: number;
  total_count: number;
  total_pages: number;
}

interface GetAbusingArticlesByEventParams {
  eventId: number;
  abusingType?: AbusingType;
  page?: number;
  size?: number;
}

export const getAbusingArticlesByEvent = async ({
  eventId,
  abusingType,
  page,
  size,
}: GetAbusingArticlesByEventParams): Promise<GetAbusingArticlesByEventResponse> => {
  const { data, error } = await supabase.rpc('get_abusing_articles_by_event', {
    p_event_id: eventId,
    p_abusing_type: abusingType ?? null,
    ...(page !== undefined && { p_page: page }),
    ...(size !== undefined && { p_size: size }),
  });

  if (error) throw error;

  if (!data) {
    throw new Error('데이터 없음');
  }

  return data as GetAbusingArticlesByEventResponse;
};
