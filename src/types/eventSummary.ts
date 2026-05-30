// 요약에 사용된 기사 제외한 이벤트 요약 페이지 데이터 타입
export interface EventSummary {
  topic_id: number;
  event_id: number;
  topic_title: string;
  event_title: string;
  category: string;
  title: string;
  summary: string;
  article_count: number;
  left_count: number;
  mid_count: number;
  right_count: number;
  abusing_count: number;

  prev_event_id: number | null;
  next_event_id: number | null;
  prev_event_title: string | null;
  next_event_title: string | null;

  publishers: {
    mid: string[];
    left: string[];
    right: string[];
  };

  event_image_url: string | null;
  created_at: string;
  updated_at: string;
  subscription_id: number | null;
  is_subscribed: boolean;
}

// 요약에 사용된 기사 데이터 타입
export interface Article {
  link: string;
  title: string;
  summary: string;
  article_image_url: string | null;
  publisher: string;
  published_at: string;
  bias_type: '진보' | '중도' | '보수';
}

export interface Articles {
  articles: Article[];
  page: number;
  size: number;
  total_count: number;
  total_pages: number;
}
