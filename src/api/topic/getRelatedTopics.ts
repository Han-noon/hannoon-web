import { supabase } from '@/lib/supabase';

export interface RelatedTopic {
  id: number;
  category: string;
  title: string;
  summary: string | null;
  reason: string | null;
  evidence: unknown;
}

interface TopicRelationRow {
  topic_id: number;
  related_topic_id: number;
  reason: string | null;
  evidence: unknown;
  generated_at: string | null;
}

export const getRelatedTopics = async (
  topicId: number,
  limit: number = 3
): Promise<RelatedTopic[]> => {
  const { data: relations, error: relationError } = await supabase
    .from('topic_relations')
    .select('topic_id, related_topic_id, reason, evidence, generated_at')
    .or(`topic_id.eq.${topicId},related_topic_id.eq.${topicId}`)
    .order('generated_at', {
      ascending: false,
    })
    .limit(Math.max(limit * 3, limit));

  if (relationError) {
    console.error('연관 토픽 관계 조회 실패:', relationError);
    throw relationError;
  }

  const relationByTopicId = new Map<number, TopicRelationRow>();

  for (const relation of (relations ?? []) as TopicRelationRow[]) {
    const relatedId = relation.topic_id === topicId ? relation.related_topic_id : relation.topic_id;

    if (relatedId === topicId) continue;

    if (!relationByTopicId.has(relatedId)) {
      relationByTopicId.set(relatedId, relation);
    }
  }

  const relatedIds = Array.from(relationByTopicId.keys()).slice(0, limit);

  if (!relatedIds.length) {
    return [];
  }

  const { data: topics, error: topicError } = await supabase
    .from('topics')
    .select('id, category, title, summary')
    .in('id', relatedIds);

  if (topicError) {
    console.error('연관 토픽 정보 조회 실패:', topicError);
    throw topicError;
  }

  const topicMap = new Map((topics ?? []).map((topic) => [topic.id, topic]));

  const result: RelatedTopic[] = [];

  for (const relatedId of relatedIds) {
    const topic = topicMap.get(relatedId);
    const relation = relationByTopicId.get(relatedId);

    if (!topic || !relation) continue;

    result.push({
      id: topic.id,
      category: topic.category,
      title: topic.title,
      summary: topic.summary ?? null,
      reason: relation.reason ?? null,
      evidence: relation.evidence,
    });
  }

  return result;
};
