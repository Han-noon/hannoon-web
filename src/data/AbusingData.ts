export interface Category {
  id: string;
  title: string;
  description: string;
}

export interface Article {
  id: number;
  type: string;
  source: string;
  updateTime: string;
  title: string;
  summary: string;
  imgUrl: string; // 이미지 URL 타입
}

export const categories: Category[] = [
  {
    id: 'all',
    title: '전체',
    description: '',
  },
  {
    id: 'blank',
    title: '공백 기사',
    description:
      '구체적인 취재 내용이나 정보 전달 목적 없이, 실시간 키워드를 단순 반복하거나 짧은 문구로 구성되어 기사의 형식을 갖추지 못한 콘텐츠',
  },
  {
    id: 'mismatch',
    title: '제목, 본문\n불일치 기사',
    description:
      '본문의 핵심 내용과 무관하거나 자극적인 어휘를 제목으로 사용하여 독자로 하여금 오해를 불러일으키고 클릭을 유도하는 기사',
  },
];

// --- 수정된 부분: imgUrl에 랜덤 이미지 서비스 적용 ---
export const mockArticles: Article[] = [
  {
    id: 1,
    type: 'mismatch',
    source: '조선 일보',
    updateTime: '2시간 전',
    title: '1차 개혁안 발표',
    summary:
      '1차 개혁안 발표. 보건복지부는 지방 의료의 필수 인력인 외과 및 소아과 부족 문제를 해결하기 위해 의과대학 정원을 25% 증원한다고 발표했습니다. 발표발표발표발표발표발표발표발표발표발표발표발표발표발표발표발표발표발표발표발표발표발표발표발표발표발표발표',
    // article의 id(1)를 random 파라미터로 사용
    imgUrl: 'https://picsum.photos/600/400?random=1',
  },
  {
    id: 2,
    type: 'blank',
    source: '한국 경제',
    updateTime: '3시간 전',
    title: '[속보] 특징주 A사, 상한가 직행...',
    summary:
      '특징주 A사 상한가. A사 특징주 상한가 직행. 오늘의 특징주 A사. 특징주 A사 상한가. A사 특징주 상한가 직행. (구체적인 기업 분석이나 원인 분석 내용 없음)',
    // article의 id(2)를 random 파라미터로 사용
    imgUrl: 'https://picsum.photos/600/400?random=2',
  },
  {
    id: 3,
    type: 'mismatch',
    source: '매일 경제',
    updateTime: '5시간 전',
    title: '충격! 국민배우 B씨, 결국...',
    summary:
      '국민배우 B씨가 오늘 오후 예정되었던 팬사인회에 감기 몸살로 인해 10분 지각하여 팬들의 아쉬움을 샀다. 소속사 측은 건강 관리에 유의하겠다고 밝혔다.',
    // article의 id(3)를 random 파라미터로 사용
    imgUrl: 'https://picsum.photos/600/400?random=3',
  },
  {
    id: 4,
    type: 'blank',
    source: '중앙 일보',
    updateTime: '1일 전',
    title: '오늘의 날씨 서울 날씨 부산 날씨',
    summary:
      '오늘의 날씨 서울 날씨 부산 날씨 대구 날씨 광주 날씨 대전 날씨 실시간 날씨 날씨 예보 오늘의 날씨 서울 날씨 부산 날씨 대구 날씨 광주 날씨',
    // article의 id(4)를 random 파라미터로 사용
    imgUrl: 'https://picsum.photos/600/400?random=4',
  },
];
