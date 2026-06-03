import { supabase } from '@/lib/supabase';

export const unsubscribeTopic = async (topicId: number): Promise<void> => {
  const { error } = await supabase.rpc('unsubscribe_topic', {
    p_topic_id: topicId,
  });

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
};
