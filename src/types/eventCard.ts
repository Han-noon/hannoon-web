export interface EventItem {
  event_id: number;
  topic_id: number; // 해당 이벤트가 속한 토픽의 ID
  category: string; // '국제' | '사회' | '경제' | '정치' 처럼 유니온 타입으로 제한 가능
  title: string;
  summary: string;
  created_at: string; // ISO 8601 날짜 문자열
  updated_at: string; // ISO 8601 날짜 문자열
  subscription_id: number | null; // null 허용 유니온 타입
  is_subscribed: boolean;
}

export interface EventResponse {
  events: EventItem[];
  page: number;
  size: number;
  total_count: number;
  total_pages: number;
}
