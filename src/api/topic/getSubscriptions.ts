import { supabase } from '@/lib/supabase';

export interface SubscribedTopic {
  id: number;
  category: string;
  title: string;
  summary: string;
  created_at: string;
  updated_at: string;
  subscription_id: number;
  is_subscribed: boolean;
}

export interface Subscriptions {
  topics: SubscribedTopic[];
  page: number;
  size: number;
  total_count: number;
  total_pages: number;
}

export const getSubscriptions = async (page = 1, size = 6): Promise<Subscriptions> => {
  const { data, error } = await supabase.rpc('get_subscribed_topics', {
    p_page: page,
    p_size: size,
  });

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  // Supabase RPC는 배열로 반환하는 경우가 있음
  return Array.isArray(data) ? data[0] : data;
};
