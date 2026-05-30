export interface Notification {
  id: number;
  created_at: string;
  read_at: string | null;
  is_read: boolean;

  topic_id: number;
  topic_category: string;
  topic_title: string;

  event_id: number;
  event_title: string;
  event_summary: string;
  event_image_url: string | null;
}

export interface NotificationList {
  notifications: Notification[];

  page: number;
  size: number;
  total_count: number;
  total_pages: number;
}
