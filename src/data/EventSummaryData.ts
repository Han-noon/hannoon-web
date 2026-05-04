// 개별 편향 정보 상세 타입
interface BiasDetail {
  value: number; // 퍼센트 수치
  mediaList: string[]; // 해당 성향의 언론사들
}

// 수정된 편향지수 타입
export interface BiasIndex {
  progressive: BiasDetail; // 진보
  neutral: BiasDetail; // 중도
  conservative: BiasDetail; // 보수
}

// ... 나머지 인터페이스(TimelineInfo, AbusInfo, NewsSummary)는 동일

// 타임라인 아이템 타입
interface TimelineItem {
  id: number;
  title: string;
}

// 타임라인 정보 타입
export interface TimelineInfo {
  topic: string;
  timeline_summary: TimelineItem[];
}

// 어뷰징 정보 타입
export interface AbusInfo {
  total: number;
  abusing: number;
}

// 전체 요약문 데이터 인터페이스
export interface NewsSummary {
  id: number;
  category: '정치' | '경제' | '사회';
  first_reported: string;
  topic_name: string;
  event_name: string;
  last_updated: string;
  article_count: number;
  image_url: string;
  summary: string;
  bias_index: BiasIndex;
  timeline_info: TimelineInfo;
  abusing_info: AbusInfo;
}

export const EVENT_SUMMARY_DATA: NewsSummary[] = [
  {
    id: 1,
    category: '사회',
    first_reported: '2024-05-24',
    topic_name: '의료 개혁',
    event_name: '정부, 의대 정원 증원 발표',
    last_updated: '2024-05-30',
    article_count: 143,
    image_url: 'https://picsum.photos/id/1/400/300',
    summary:
      '정부가 2025학년도부터 의과대학 정원을 2,000명 증원하기로 발표하며 의료계와 정부 간의 갈등이 심화되었습니다. 전공의들은 이에 반발하여 집단 사직서를 제출하고 현장을 떠났습니다.',
    bias_index: {
      progressive: {
        value: 20,
        mediaList: ['한겨레', '경향신문', '오마이뉴스'],
      },
      neutral: {
        value: 70,
        mediaList: ['연합뉴스', '한국일보', 'KBS', 'SBS', '연합뉴스', '한국일보', 'KBS', 'SBS'],
      },
      conservative: {
        value: 10,
        mediaList: ['조선일보', '중앙일보', '동아일보'],
      },
    },
    timeline_info: {
      topic: '의료 개혁',
      timeline_summary: [
        { id: 0, title: '정보없음' },
        { id: 1, title: '정부, 의대 정원 증원 발표' },
        { id: 2, title: '전공의 집단 사직' },
      ],
    },
    abusing_info: {
      total: 142,
      abusing: 70,
    },
  },
];
