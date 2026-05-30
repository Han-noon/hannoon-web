import { supabase } from '@/lib/supabase';
import type { EventResponse } from '@/types/timeline';

interface RequestParams {
  p_cursor_id: number | null;
  p_order: string;
  p_size: number;
  p_topic_id: number;
}

export const getEventsByTopic = async ({
  p_cursor_id,
  p_order,
  p_size,
  p_topic_id,
}: RequestParams): Promise<EventResponse> => {
  const { data, error } = await supabase.rpc('get_events_by_topic', {
    p_cursor_id: p_cursor_id,
    p_order: p_order,
    p_size: p_size,
    p_topic_id: p_topic_id,
  });
  if (error) console.error(error);
  else console.log(data);

  return data;
};
