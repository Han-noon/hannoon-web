export interface TopicSubtopicTimelineTopic {
  id: number;
  title: string;
  category: string;
  summary: string;
  ai_summary: string | null;
  subscription_id: number | null;
  is_subscribed: boolean;
}

export interface TopicTimelineStats {
  first_published_at: string | null;
  last_published_at: string | null;
  article_count: number;
  event_count: number;
}

export interface TimelineSubtopic {
  id: number;
  name: string;
  type: string;
  summary: string | null;
  event_count: number;
}

export interface TopicTimelineEvent {
  id: number;
  title: string;
  short_summary: string | null;
  summary: string;
  occurred_at: string | null;
  subtopic_ids: number[];
  article_count: number;
  left_percent: number;
  mid_percent: number;
  right_percent: number;
}

export interface SubtopicTimelineResponse {
  topic: TopicSubtopicTimelineTopic;
  stats: TopicTimelineStats;
  subtopics: TimelineSubtopic[];
  events: TopicTimelineEvent[];
}
