import { supabase } from '@/lib/supabase';
import type { EventSummary } from '@/types/eventSummary';

export const getEvent = async (eventId: number): Promise<EventSummary> => {
  const { data, error } = await supabase.rpc('get_event', {
    p_event_id: eventId,
  });

  if (error) throw error;

  if (!data) {
    throw new Error('데이터 없음');
  }

  return data;
};
