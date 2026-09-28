import { useEffect, useMemo, useRef, useState } from 'react';

type Article = { outlet: string; title: string; publishedAt: string };

type EventItem = {
  id: number;
  date: string;
  title: string;
  subtopics: string[];
  summary: string;
  analyzed: number;
  bias: [number, number, number];
  articles: Article[];
  demo?: boolean;
};

// UI 시연용 데이터입니다. API가 준비되면 이 배열을 실제 응답으로 교체합니다.
const events: EventItem[] = [
  {
    id: 1,
    date: '2024.02.06',
    title: '정부, 의대 2000명 증원 발표',
    subtopics: ['개혁안', '적용범위'],
    summary: '정부가 2025학년도부터 의대 입학정원을 2000명 늘리는 방안을 발표했습니다.',
    analyzed: 244,
    bias: [24, 53, 23],
    articles: [
      {
        outlet: '연합뉴스',
        title: '정부, 의대 정원 확대 방안 발표',
        publishedAt: '2024.02.06 14:10',
      },
      {
        outlet: '한겨레',
        title: '증원 효과와 교육 여건 놓고 논쟁',
        publishedAt: '2024.02.06 16:25',
      },
      {
        outlet: '조선일보',
        title: '의료개혁 핵심 카드로 의대 증원',
        publishedAt: '2024.02.06 18:40',
      },
    ],
  },
  {
    id: 2,
    date: '2024.02.15',
    title: '의협, 전면 반대 성명 발표',
    subtopics: ['반응', '쟁점'],
    summary:
      '의사협회가 의대 정원 확대에 반대하며 증원 추진 중단과 의료계와의 재논의를 요구했습니다.',
    analyzed: 186,
    bias: [25, 50, 25],
    articles: [
      { outlet: '한국경제', title: '의협, 의대 증원 전면 반대', publishedAt: '2024.02.15 14:10' },
      {
        outlet: '한겨레',
        title: '의대 증원 놓고 정부·의료계 충돌',
        publishedAt: '2024.02.15 16:25',
      },
      { outlet: '연합뉴스', title: '의협, 공동 대응 예고', publishedAt: '2024.02.15 18:40' },
    ],
  },
  {
    id: 3,
    date: '2024.02.20',
    title: '전공의 집단 사직',
    subtopics: ['반응', '전공의'],
    summary:
      '전공의 사직과 근무 중단이 확산되며 수술·외래 일정 조정 등 의료 공백이 현실화됐습니다.',
    analyzed: 321,
    bias: [22, 56, 22],
    articles: [
      { outlet: 'MBC', title: '전공의 집단 사직 확산', publishedAt: '2024.02.20 11:20' },
      { outlet: '한겨레', title: '환자 피해 우려 커져', publishedAt: '2024.02.20 15:00' },
    ],
  },
  {
    id: 4,
    date: '2024.02.22',
    title: '의대생 휴학계 제출 확산',
    subtopics: ['반응', '쟁점'],
    summary: '의대생들의 휴학계 제출이 늘어나며 반발이 대학 교육 현장으로 확산됐습니다.',
    analyzed: 198,
    bias: [20, 57, 23],
    articles: [
      { outlet: 'SBS', title: '의대생 휴학계 제출 확산', publishedAt: '2024.02.22 12:30' },
    ],
  },
  {
    id: 5,
    date: '2024.03.04',
    title: '정부, 업무개시명령 발동',
    subtopics: ['개혁안', '전공의'],
    summary: '정부가 집단 사직한 전공의에게 복귀를 요구하며 의료 공백 대응 조치를 강화했습니다.',
    analyzed: 165,
    bias: [23, 54, 23],
    articles: [
      { outlet: '연합뉴스', title: '정부, 전공의 복귀 요구', publishedAt: '2024.03.04 10:45' },
    ],
  },
  {
    id: 6,
    date: '2024.03.15',
    title: '의료 공백 장기화',
    subtopics: ['반응', '전공의'],
    summary: '전공의 이탈이 길어지며 진료·수술 일정 조정과 환자 불편이 이어졌습니다.',
    analyzed: 267,
    bias: [24, 52, 24],
    articles: [{ outlet: 'YTN', title: '의료 공백 장기화 우려', publishedAt: '2024.03.15 09:30' }],
  },
  {
    id: 7,
    date: '2024.04.19',
    title: '증원 규모 일부 조정안 논의',
    subtopics: ['개혁안', '쟁점'],
    summary: '정부가 대학별 자율 조정 가능성을 언급하며 증원 규모 조정의 여지를 열었습니다.',
    analyzed: 203,
    bias: [26, 51, 23],
    articles: [
      {
        outlet: 'KBS',
        title: '정부, 대학별 자율 조정 가능성 열어',
        publishedAt: '2024.04.19 16:05',
      },
    ],
  },
  {
    id: 8,
    date: '2024.09.25',
    title: '의정 협의체 출범',
    subtopics: ['반응', '쟁점'],
    summary: '의료 공백과 증원 갈등을 논의할 협의체가 출범하며 대화 재개의 계기가 마련됐습니다.',
    analyzed: 118,
    bias: [25, 55, 20],
    articles: [{ outlet: '연합뉴스', title: '의정 협의체 출범', publishedAt: '2024.09.25 17:20' }],
  },
  ...[
    ['2024.10.03', '후속 경과 예시'],
    ['2024.10.17', '정책 논의 예시'],
    ['2024.11.01', '현장 반응 예시'],
    ['2024.11.15', '협의 진행 예시'],
    ['2024.12.02', '추가 발표 예시'],
    ['2024.12.18', '의료 현장 예시'],
  ].map(
    ([date, title], index): EventItem => ({
      id: index + 9,
      date,
      title,
      demo: true,
      subtopics: [],
      summary: '타임라인 스크롤과 노드 선택을 보여주기 위한 예시 이벤트입니다.',
      analyzed: 0,
      bias: [0, 0, 0],
      articles: [],
    })
  ),
];

const summaryBySubtopic: Record<string, string[]> = {
  전체: [
    '의대 정원 확대 발표부터 의료계 반발, 전공의 이탈과 이후 협의까지 주요 흐름을 묶었습니다.',
    '정책 발표와 의료 현장의 대응이 어떻게 이어졌는지 시간순으로 살펴볼 수 있습니다.',
  ],
  개혁안: [
    '정부의 증원 발표 이후 업무개시명령과 증원 규모 조정 논의까지 정책 변화가 이어졌습니다.',
    '초기 증원 기조에서 대학별 조정 가능성이 논의되기까지 정부 대응을 정리했습니다.',
  ],
  반응: [
    '의협 반대 성명 이후 전공의 사직과 의대생 휴학계 제출로 반발이 확산됐습니다.',
    '의료계의 반대가 병원과 대학 현장으로 이어지고 의료 공백 우려도 커졌습니다.',
  ],
  적용범위: [
    '의대 정원 2000명 증원안이 각 대학의 모집 인원에 어떻게 반영될지가 핵심입니다.',
    '전체 증원 규모와 실제 대학별 정원 배분의 차이에 주목할 수 있습니다.',
  ],
  쟁점: [
    '증원의 필요성과 교육 여건을 두고 정부와 의료계의 입장이 갈렸습니다.',
    '정책 규모와 추진 방식, 환자 진료에 미칠 영향이 함께 쟁점이 됐습니다.',
  ],
  전공의: [
    '전공의 집단 사직과 정부의 복귀 명령 이후 의료 공백이 장기화됐습니다.',
    '전공의 이탈이 병원 운영과 환자 진료에 미친 영향을 묶었습니다.',
  ],
};

const names = ['전체', '개혁안', '반응', '적용범위', '쟁점', '전공의'];

const relatedTopics = [
  {
    category: '사회',
    title: '2026학년도 대입 의대 정원 재조정 및 입시 파장',
    description: '의대 정원 재조정이 입시 일정과 지역인재전형에 미친 영향을 살펴봅니다.',
    meta: '이벤트 14개 · 종결 사안',
  },
  {
    category: '사회/의료',
    title: '응급실·필수의료 공백 장기화 및 비상진료체계',
    description: '전공의 이탈 이후 응급의료 운영과 정부의 비상진료체계 대응을 정리합니다.',
    meta: '이벤트 7개 · 진행중',
  },
  {
    category: '정치',
    title: '군의관·공보의 차출 여파 및 복무기간 단축 논의',
    description: '병원 인력 공백을 메우기 위한 차출이 지역 의료에 남긴 영향을 살펴봅니다.',
    meta: '이벤트 11개 · 진행중',
  },
];

const xs = [48, 184, 320, 456, 592];

const rows = Array.from({ length: Math.ceil(events.length / 5) }, (_, row) =>
  events.slice(row * 5, row * 5 + 5).map((event, slot) => ({
    event,
    x: xs[row % 2 === 0 ? slot : 4 - slot],
    y: 39 + row * 162,
  }))
);

const stageHeight = rows[rows.length - 1][0].y + 105;

let path = `M${rows[0][0].x} ${rows[0][0].y}`;
rows.forEach((row, index) => {
  if (index) {
    const before = rows[index - 1][rows[index - 1].length - 1];
    const edge = index % 2 ? 628 : 12;
    path += ` C${edge} ${before.y} ${edge} ${row[0].y} ${row[0].x} ${row[0].y}`;
  }
  path += ` H${row[row.length - 1].x}`;
});

function Icon({
  kind,
}: {
  kind: 'bookmark' | 'calendar' | 'chart' | 'news' | 'timeline' | 'bias';
}) {
  const icons = {
    bookmark: <path d="M5 3h14v18l-7-4-7 4V3Z" />,
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M7 3v4M17 3v4M3 10h18" />
      </>
    ),
    chart: (
      <>
        <path d="M3 20h18M6 17v-5h3v5M11 17V8h3v9M16 17V4h3v13" />
      </>
    ),
    news: (
      <>
        <path d="M4 4h16v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4Z" />
        <path d="M8 8h8M8 12h3M8 16h3M14 12h2v4h-2z" />
      </>
    ),
    timeline: (
      <>
        <path d="M4 5v13a4 4 0 0 0 8 0V7a4 4 0 0 1 8 0v12" />
        <circle cx="4" cy="4" r="2" />
        <circle cx="20" cy="20" r="2" />
      </>
    ),
    bias: <circle cx="12" cy="12" r="9" strokeWidth="3.5" strokeDasharray="10 4" />,
  };

  return (
    <svg
      className="tl-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[kind]}
    </svg>
  );
}

const css = `
.tl-page{--blue:#0e3566;--muted:#747780;box-sizing:border-box;max-width:1152px;margin:0 auto;padding:56px 48px 90px;background:#fafbff;color:#111c2d;font-family:'Noto Sans KR','Pretendard',system-ui,sans-serif}
.tl-page *{box-sizing:border-box}.tl-page button{font:inherit;cursor:pointer}.tl-icon{width:16px;height:16px;flex:none}
.tl-crumb{display:flex;flex-wrap:wrap;gap:8px;color:var(--muted);font-size:12px}.tl-crumb strong{color:var(--blue);font-weight:600}
.tl-title-row{display:flex;align-items:end;justify-content:space-between;gap:20px;margin:36px 0 22px}.tl-kicker{display:inline-block;border-radius:4px;padding:5px 10px;background:#e8edf5;color:var(--blue);font-size:12px;font-weight:700}
.tl-title-row h1{margin:9px 0 0;font-size:28px;line-height:1.35;letter-spacing:-.6px}.tl-subscribe{width:124px;height:36px;flex:none;display:flex;align-items:center;justify-content:center;gap:6px;border:1px solid #c3c6d0;border-radius:5px;background:#fff;color:#43474f;font-size:12px!important;white-space:nowrap}.tl-subscribe.active{background:var(--blue);border-color:var(--blue);color:#fff}.tl-subscribe.active .tl-icon{fill:currentColor}
.tl-meta{display:flex;align-items:center;flex-wrap:wrap;gap:12px 24px;padding:12px 20px;border:1px solid #dce3f0;border-radius:8px;background:#f0f3ff;font-size:12px}.tl-meta>div{display:flex;align-items:center;gap:7px}.tl-meta .tl-icon{color:var(--blue)}.tl-meta span{color:var(--muted)}
.tl-subtopics{margin-top:40px}.tl-tabs{display:flex;gap:10px;overflow-x:auto;padding:2px 0 6px}.tl-tab{height:32px;min-width:68px;flex:none;padding:0 13px;border:1px solid #c3c6d0;border-radius:999px;background:#fff;color:#43474f;font-size:12px;white-space:nowrap}.tl-tab.active{background:var(--blue);border-color:var(--blue);color:#fff;font-weight:700}.tl-tab span{margin-left:6px;font-size:11px}
.tl-ai-box{min-height:105px;margin-top:12px;padding:22px 25px;border:1px solid #dce3f0;border-radius:8px;background:#f5f7ff}.tl-ai-head{display:flex;justify-content:space-between;gap:10px;align-items:center}.tl-ai-head strong{color:var(--blue);font-size:14px}.tl-ai-head small{padding:4px 9px;border:1px solid #cbd2de;border-radius:15px;color:var(--muted);font-size:10px}.tl-ai-box p{margin:12px 0 0;color:#43474f;font-size:13px;line-height:1.8}
.tl-columns{display:grid;grid-template-columns:minmax(0,693px) minmax(290px,1fr);gap:32px;align-items:start;margin-top:40px}.tl-board,.tl-detail{min-width:0;border:1px solid #dde1e8;border-radius:10px;background:#fff;box-shadow:0 8px 24px #1c27370a}.tl-board{padding:24px}.tl-board-head{min-height:70px;display:flex;justify-content:space-between;gap:12px;border-bottom:1px solid #e7e9ee}.tl-board-head h2{display:flex;align-items:center;gap:8px;margin:0;font-size:18px}.tl-board-head h2 .tl-icon{color:var(--blue);width:19px;height:19px}.tl-board-head p{margin:4px 0;color:var(--muted);font-size:12px}.tl-zoom{display:flex;gap:6px}.tl-zoom button{width:28px;height:31px;border:1px solid #d8dde5;border-radius:5px;background:#fff;color:#43474f;font-size:19px}
.tl-viewport{height:315px;width:100%;margin-top:22px;overflow:auto;scrollbar-width:thin;scrollbar-color:#7890ad #e5e7ed}.tl-stage{position:relative;width:640px;transform-origin:top left}.tl-path{position:absolute;inset:0;width:640px;height:100%;pointer-events:none}.tl-node{position:absolute;z-index:1;display:flex;align-items:center;flex-direction:column;width:96px;min-height:96px;padding:0;border:0;background:transparent;color:#43474f}.tl-node time{height:21px;color:var(--muted);font-size:11px}.tl-dot{display:grid;place-items:center;flex:none;width:36px;height:36px;border:2px solid #c3c6d0;border-radius:50%;background:#fff;color:var(--muted);font-size:14px;font-weight:700}.tl-node-label{width:96px;padding-top:8px;text-align:center;font-size:12px;line-height:1.25}.tl-node.hit .tl-dot{background:var(--blue);border-color:var(--blue);color:#fff}.tl-node.hit .tl-node-label{color:var(--blue);font-weight:700}.tl-node.selected .tl-dot{outline:4px solid #dbe4ef}.tl-node.selected:not(.hit) .tl-dot{background:#cfd7e0;color:var(--blue)}
.tl-legend{display:flex;flex-wrap:wrap;gap:10px 16px;margin-top:15px;padding-top:14px;border-top:1px solid #eef0f4;color:var(--muted);font-size:11px}.tl-legend span{display:flex;align-items:center;gap:6px}.tl-legend i{width:11px;height:11px;flex:none;border-radius:50%}.tl-legend .hit{background:var(--blue)}.tl-legend .normal{border:1px solid #c3c6d0}.tl-legend .selected{background:#cfd7e0;outline:2px solid #dbe4ef}
.tl-detail{min-height:516px;padding:25px}.tl-detail-head>div{display:flex;align-items:center;justify-content:space-between;gap:8px}.tl-detail-head span{padding:3px 8px;border-radius:4px;background:#e9eef5;color:var(--blue);font-size:11px;font-weight:700}.tl-detail-head time{color:var(--muted);font-size:11px}.tl-detail h2{margin:8px 0 18px;font-size:18px;line-height:1.4}.tl-detail section{padding:18px 0;border-top:1px solid #eef0f4}.tl-detail h3{display:flex;align-items:center;gap:6px;margin:0;font-size:13px}.tl-detail h3 .tl-icon{width:14px;height:14px;color:var(--blue)}.tl-detail section p{margin:12px 0 0;color:#43474f;font-size:12px;line-height:1.7}.tl-bar{display:flex;height:12px;overflow:hidden;margin-top:14px;border-radius:9px}.tl-bar i:nth-child(1),.tl-bias-label i:nth-child(1){background:#0e3566}.tl-bar i:nth-child(2),.tl-bias-label i:nth-child(2){background:#68507b}.tl-bar i:nth-child(3),.tl-bias-label i:nth-child(3){background:#ba1a1a}.tl-bias-label{display:flex;justify-content:space-between;gap:5px;margin-top:12px;color:#666b73;font-size:10px}.tl-bias-label span{display:flex;align-items:center;gap:4px}.tl-bias-label i{width:9px;height:9px;border-radius:2px}.tl-section-head{display:flex;align-items:center;justify-content:space-between}.tl-section-head small{color:var(--muted);font-size:11px}.tl-articles{display:grid;gap:10px;margin-top:12px}.tl-article{padding:11px;border:1px solid #dce1eb;border-radius:8px}.tl-article>div{display:flex;justify-content:space-between;gap:7px}.tl-article strong{color:var(--blue);font-size:11px}.tl-article time{color:var(--muted);font-size:10px;white-space:nowrap}.tl-article b{display:block;margin-top:5px;font-size:12px;line-height:1.4}.tl-demo-note{margin-top:15px;padding:14px;border:1px solid #dce3f0;border-radius:7px;background:#f5f7ff;color:var(--muted);font-size:12px;line-height:1.6}.tl-detail-button{width:100%;margin-top:14px;padding:12px;border:1px solid #dce3f0;border-radius:5px;background:#e7eeff;color:var(--blue);font-size:12px;font-weight:700}
.tl-related{margin-top:66px;padding-top:28px;border-top:1px solid #dfe3ed}.tl-related-head h2{margin:0 0 5px;font-size:18px}.tl-related-head p{margin:0;color:var(--muted);font-size:12px}.tl-related-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px;margin-top:27px}.tl-related-card{min-height:205px;display:flex;flex-direction:column;padding:20px;border:1px solid #dce1eb;border-radius:9px;background:#fff}.tl-related-card>span{color:var(--blue);font-size:11px;font-weight:700}.tl-related-card h3{margin:8px 0;font-size:15px;line-height:1.5}.tl-related-card p{flex:1;margin:0;color:#43474f;font-size:12px;line-height:1.6}.tl-related-card>div{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:14px;padding-top:12px;border-top:1px solid #e7e9ee}.tl-related-card small{color:var(--muted);font-size:11px}.tl-related-card>div span{color:var(--blue);font-size:11px;font-weight:700}
@media(max-width:900px){.tl-page{padding:35px 22px 70px}.tl-columns{grid-template-columns:1fr}.tl-detail{min-height:0}.tl-related-grid{grid-template-columns:1fr}}
@media(max-width:600px){.tl-page{padding:24px 16px 60px}.tl-title-row h1{font-size:22px}.tl-meta{display:grid}.tl-board{padding:16px}.tl-ai-head small{display:none}}
`;

export default function TimelinePage() {
  const [subtopic, setSubtopic] = useState('개혁안');
  const [summaryIndex, setSummaryIndex] = useState(0);
  const [selectedId, setSelectedId] = useState(2);
  const [subscribed, setSubscribed] = useState(false);
  const [zoom, setZoom] = useState(1);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(640);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const updateWidth = () => setViewportWidth(viewport.clientWidth);
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  const scale = Math.min(1, viewportWidth / 640) * zoom;
  const selected = events.find((event) => event.id === selectedId) ?? events[1];

  const counts = useMemo(
    () =>
      Object.fromEntries(
        names.map((name) => [name, events.filter((event) => event.subtopics.includes(name)).length])
      ),
    []
  );

  return (
    <main className="tl-page">
      <style>{css}</style>

      <div className="tl-crumb">
        타임라인으로 보는 사건 <span>›</span> 사회/의료 <span>›</span>
        <strong>의대 정원 증원 및 의료 공백</strong>
      </div>

      <div className="tl-title-row">
        <div>
          <span className="tl-kicker">정부 정책 심층 추적</span>
          <h1>의대 정원 증원 및 의료 공백</h1>
        </div>
        <button
          className={`tl-subscribe ${subscribed ? 'active' : ''}`}
          onClick={() => setSubscribed(!subscribed)}
          type="button"
        >
          <Icon kind="bookmark" />
          {subscribed ? '구독 중' : '관심 토픽 구독'}
        </button>
      </div>

      <div className="tl-meta">
        <div>
          <Icon kind="calendar" />
          <span>추적 기간:</span>
          <strong>2024.02.06 ~ 2024.09.25</strong>
        </div>
        <div>
          <Icon kind="chart" />
          <span>분석된 기사:</span>
          <strong>1,842건 (시연 예시)</strong>
        </div>
        <div>
          <Icon kind="news" />
          <span>이벤트 수:</span>
          <strong>14개 (예시 6개)</strong>
        </div>
      </div>

      <section className="tl-subtopics">
        <div className="tl-tabs" role="tablist" aria-label="서브토픽">
          {names.map((name) => (
            <button
              key={name}
              className={`tl-tab ${subtopic === name ? 'active' : ''}`}
              type="button"
              role="tab"
              aria-selected={subtopic === name}
              onClick={() => {
                setSubtopic(name);
                setSummaryIndex((value) => (value + 1) % summaryBySubtopic[name].length);
              }}
            >
              {name}
              {name !== '전체' && <span>{counts[name]}</span>}
            </button>
          ))}
        </div>

        <div className="tl-ai-box">
          <div className="tl-ai-head">
            <strong>◆ AI 서브 토픽 요약 _ {subtopic}</strong>
            <small>시연용 문구</small>
          </div>
          <p aria-live="polite">{summaryBySubtopic[subtopic][summaryIndex]}</p>
        </div>
      </section>

      <div className="tl-columns">
        <section className="tl-board">
          <div className="tl-board-head">
            <div>
              <h2>
                <Icon kind="timeline" /> 토픽 타임라인
              </h2>
              <p>노드를 클릭하면 오른쪽에 상세 정보가 표시됩니다.</p>
            </div>
            <div className="tl-zoom">
              <button
                type="button"
                aria-label="축소"
                onClick={() => setZoom((z) => Math.max(0.8, +(z - 0.1).toFixed(1)))}
              >
                −
              </button>
              <button
                type="button"
                aria-label="확대"
                onClick={() => setZoom((z) => Math.min(1.2, +(z + 0.1).toFixed(1)))}
              >
                ＋
              </button>
            </div>
          </div>

          <div
            ref={viewportRef}
            className="tl-viewport"
            tabIndex={0}
            aria-label="스크롤 가능한 타임라인"
          >
            <div
              style={{
                width: 640 * scale,
                height: stageHeight * scale,
              }}
            >
              <div
                className="tl-stage"
                style={{
                  height: stageHeight,
                  transform: `scale(${scale})`,
                }}
              >
                <svg className="tl-path" viewBox={`0 0 640 ${stageHeight}`} aria-hidden="true">
                  <path d={path} fill="none" stroke="#c9d2df" strokeWidth="2" />
                </svg>

                {rows.flat().map(({ event, x, y }) => {
                  const hit =
                    !event.demo && (subtopic === '전체' || event.subtopics.includes(subtopic));

                  return (
                    <button
                      key={event.id}
                      className={`tl-node ${hit ? 'hit' : ''} ${
                        event.id === selectedId ? 'selected' : ''
                      }`}
                      type="button"
                      style={{ left: x - 48, top: y - 39 }}
                      onClick={() => setSelectedId(event.id)}
                    >
                      <time>{event.date.slice(5).replace('.', '-')}</time>
                      <span className="tl-dot">{event.id}</span>
                      <span className="tl-node-label">{event.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="tl-legend">
            <span>
              <i className="hit" /> 선택된 서브토픽
            </span>
            <span>
              <i className="normal" /> 일반 노드
            </span>
            <span>
              <i className="selected" /> 현재 선택
            </span>
          </div>
        </section>

        <aside className="tl-detail" aria-live="polite">
          <div className="tl-detail-head">
            <div>
              <span>선택된 이벤트 상세 정보</span>
              <time>
                {selected.date}
                {selected.demo ? ' · 예시' : ''}
              </time>
            </div>
            <h2>{selected.title}</h2>
          </div>

          <section>
            <h3>✦ {selected.demo ? '이벤트 설명' : 'AI 핵심 요약'}</h3>
            <p>{selected.summary}</p>
          </section>

          {selected.demo ? (
            <div className="tl-demo-note">
              스크롤 동작 확인을 위한 예시 노드입니다. 실제 기사와 분석 데이터는 연결되지
              않았습니다.
            </div>
          ) : (
            <>
              <section>
                <div className="tl-section-head">
                  <h3>
                    <Icon kind="bias" /> 보도 성향 분석
                  </h3>
                  <small>{selected.analyzed}건 대상</small>
                </div>
                <div className="tl-bar">
                  <i style={{ width: `${selected.bias[0]}%` }} />
                  <i style={{ width: `${selected.bias[1]}%` }} />
                  <i style={{ width: `${selected.bias[2]}%` }} />
                </div>
                <div className="tl-bias-label">
                  <span>
                    <i />
                    진보 {selected.bias[0]}%
                  </span>
                  <span>
                    <i />
                    중도 {selected.bias[1]}%
                  </span>
                  <span>
                    <i />
                    보수 {selected.bias[2]}%
                  </span>
                </div>
              </section>

              <section>
                <div className="tl-section-head">
                  <h3>교차 검증된 주요 보도</h3>
                  <small>최신순</small>
                </div>
                <div className="tl-articles">
                  {selected.articles.map((article) => (
                    <div className="tl-article" key={`${selected.id}-${article.outlet}`}>
                      <div>
                        <strong>{article.outlet}</strong>
                        <time>{article.publishedAt}</time>
                      </div>
                      <b>{article.title}</b>
                    </div>
                  ))}
                </div>
              </section>

              <button className="tl-detail-button" type="button">
                요약에 사용된 전체 기사 보기 →
              </button>
            </>
          )}
        </aside>
      </div>

      <section className="tl-related" aria-labelledby="related-heading">
        <div className="tl-related-head">
          <h2 id="related-heading">함께 보면 좋은 연관 토픽</h2>
          <p>현재 사건과 연결된 다른 문제를 함께 살펴보세요.</p>
        </div>

        <div className="tl-related-grid">
          {relatedTopics.map((topic) => (
            <article className="tl-related-card" key={topic.title}>
              <span>{topic.category}</span>
              <h3>{topic.title}</h3>
              <p>{topic.description}</p>
              <div>
                <small>{topic.meta}</small>
                <span>타임라인 탐색 →</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
