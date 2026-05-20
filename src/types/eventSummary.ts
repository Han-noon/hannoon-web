export interface EventSummary {
  id: number;
  topic_id: number;
  category: string;
  title: string;
  summary: string;
  article_count: number;
  left_count: number;
  mid_count: number;
  right_count: number;
  abusing_count: number;
  event_image_url: string | null;
  created_at: string;
  updated_at: string;
  prev_event: string | null;
  next_event: string | null;
}
