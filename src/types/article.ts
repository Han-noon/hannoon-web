export type BiasType = '진보' | '중도' | '보수';

export interface ArticleItem {
  link: string;
  title: string;
  summary: string;
  article_image_url: string | null;
  publisher: string;
  published_at: string;
  bias_type: BiasType;
}

export interface GetArticlesByEventResponse {
  articles: ArticleItem[];
  page: number;
  size: number;
  total_count: number;
  total_pages: number;
}
