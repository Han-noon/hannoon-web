import { supabase } from '@/lib/supabase';

export interface SubscribeResponse {
  subscription_id: number;
  is_subscribed: boolean;
}

export const subscribeTopic = async (topicId: number): Promise<SubscribeResponse> => {
  const { data, error } = await supabase.rpc('subscribe_topic', {
    p_topic_id: topicId,
  });

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
};
