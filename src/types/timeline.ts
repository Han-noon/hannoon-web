export interface Event {
  id: number;
  event_image_url: string | null;
  title: string;
  summary: string;
  created_at: string;
  updated_at: string;
}

export interface EventResponse {
  events: Event[];
  has_more: boolean;
  next_cursor: number | null; // 다음 데이터가 없을 경우 null이 될 수 있다면 `| null`을 추가하는 것이 좋습니다.
}
