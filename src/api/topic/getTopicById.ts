import { supabase } from '@/lib/supabase';

export interface TopicResponse {
  id: number;
  category: string;
  title: string;
  summary: string;
  created_at: string;
  updated_at: string;
}

export const getTopicById = async (topicId: number): Promise<TopicResponse> => {
  const { data, error } = await supabase
    .from('topics') // 실제 테이블 이름으로 교체
    .select('*')
    .eq('id', topicId)
    .single();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
};
