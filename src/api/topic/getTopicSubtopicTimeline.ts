import { supabase } from '@/lib/supabase';
import type { SubtopicTimelineResponse } from '@/types/topicSubtopicTimeline';

export const getTopicSubtopicTimeline = async (
  topicId: number
): Promise<SubtopicTimelineResponse> => {
  const { data, error } = await supabase.rpc('get_topic_subtopic_timeline', {
    p_topic_id: topicId,
  });

  if (error) {
    console.error('토픽 서브토픽 타임라인 조회 실패:', error);
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error('데이터 없음');
  }

  return data as SubtopicTimelineResponse;
};
