export interface Topic {
  id: number;
  category: string; // '국제' | '사회' | '경제' | '정치' 처럼 리터럴 유니온으로 제한하셔도 좋습니다.
  title: string;
  summary: string;
  created_at: string; // ISO 8601 날짜 문자열
  updated_at: string; // ISO 8601 날짜 문자열
  subscription_id: number | null; // null이 들어올 수 있으므로 유니온 타입 지정
  is_subscribed: boolean;
}

export interface Topics {
  topics: Topic[];
  page: number;
  size: number;
  total_count: number;
  total_pages: number;
}
