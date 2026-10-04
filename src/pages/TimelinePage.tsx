import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { getTopicSubtopicTimeline } from '@/api/topic/getTopicSubtopicTimeline';
import { getRelatedTopics, type RelatedTopic } from '@/api/topic/getRelatedTopics';
import { getArticlesByEvent } from '@/api/article/getArticlesByEvent';

import { subscribeTopic } from '@/api/topic/subscribeTopic';
import { unsubscribeTopic } from '@/api/topic/unsubscribeTopic';

import SubscribeModal from '@/components/SubscribeModal';
import NotificationPermissionModal from '@/components/NotificationPermissionModal';
import Spinner from '@/components/Spinner';

import useSession from '@/hooks/useSession';

import type { ArticleItem } from '@/types/article';
import type { SubtopicTimelineResponse, TopicTimelineEvent } from '@/types/topicSubtopicTimeline';

type PositionedEvent = {
  event: TopicTimelineEvent;
  x: number;
  y: number;
};

const xs = [48, 184, 320, 456, 592];

const formatDate = (value?: string | null) =>
  value ? value.slice(0, 10).replaceAll('-', '.') : '날짜 미정';

function buildLayout(events: TopicTimelineEvent[]) {
  const rows: PositionedEvent[][] = [];

  events.forEach((event, index) => {
    const row = Math.floor(index / 5);
    const slot = index % 5;

    (rows[row] ??= []).push({
      event,
      x: xs[row % 2 === 0 ? slot : 4 - slot],
      y: 39 + row * 162,
    });
  });

  if (!rows.length) {
    return {
      nodes: [] as PositionedEvent[],
      path: '',
      height: 105,
    };
  }

  let path = `M${rows[0][0].x} ${rows[0][0].y}`;

  rows.forEach((row, index) => {
    if (index) {
      const previous = rows[index - 1][rows[index - 1].length - 1];

      const edge = index % 2 ? 628 : 12;

      path += ` C${edge} ${previous.y} ${edge} ${row[0].y} ${row[0].x} ${row[0].y}`;
    }

    path += ` H${row[row.length - 1].x}`;
  });

  return {
    nodes: rows.flat(),
    path,
    height: rows[rows.length - 1][0].y + 105,
  };
}

function Icon({
  kind,
}: {
  kind: 'bookmark' | 'calendar' | 'chart' | 'news' | 'timeline' | 'bias';
}) {
  const paths = {
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
      {paths[kind]}
    </svg>
  );
}

const css = `
.tl-page{
  --blue:#0e3566;
  --muted:#747780;
  box-sizing:border-box;
  max-width:1152px;
  margin:0 auto;
  padding:56px 48px 90px;
  background:#fafbff;
  color:#111c2d;
  font-family:'Noto Sans KR','Pretendard',system-ui,sans-serif
}

.tl-page *{
  box-sizing:border-box
}

.tl-page button{
  font:inherit;
  cursor:pointer
}

.tl-icon{
  width:16px;
  height:16px;
  flex:none
}

.tl-crumb{
  display:flex;
  flex-wrap:wrap;
  gap:8px;
  color:var(--muted);
  font-size:12px
}

.tl-crumb strong{
  color:var(--blue);
  font-weight:600
}

.tl-title-row{
  display:flex;
  align-items:end;
  justify-content:space-between;
  gap:20px;
  margin:36px 0 22px
}

.tl-kicker{
  display:inline-block;
  border-radius:4px;
  padding:5px 10px;
  background:#e8edf5;
  color:var(--blue);
  font-size:12px;
  font-weight:700
}

.tl-title-row h1{
  margin:9px 0 0;
  font-size:28px;
  line-height:1.35;
  letter-spacing:-.6px
}

.tl-subscribe{
  width:124px;
  height:36px;
  flex:none;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:6px;
  border:1px solid #c3c6d0;
  border-radius:5px;
  background:#fff;
  color:#43474f;
  font-size:12px!important;
  white-space:nowrap
}

.tl-subscribe.active{
  background:var(--blue);
  border-color:var(--blue);
  color:#fff
}

.tl-subscribe.active .tl-icon{
  fill:currentColor
}

.tl-subscribe:disabled{
  opacity:.6;
  cursor:wait
}

.tl-meta{
  display:flex;
  align-items:center;
  flex-wrap:wrap;
  gap:12px 24px;
  padding:12px 20px;
  border:1px solid #dce3f0;
  border-radius:8px;
  background:#f0f3ff;
  font-size:12px
}

.tl-meta>div{
  display:flex;
  align-items:center;
  gap:7px
}

.tl-meta .tl-icon{
  color:var(--blue)
}

.tl-meta span{
  color:var(--muted)
}

.tl-subtopics{
  margin-top:40px
}

.tl-subtopic-head{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:12px;
  margin-bottom:10px
}

.tl-subtopic-head h2{
  margin:0;
  color:var(--blue);
  font-size:13px
}

.tl-more{
  border:0;
  background:transparent;
  color:var(--blue);
  font-size:12px!important;
  font-weight:700!important;
  white-space:nowrap
}

.tl-more:hover{
  text-decoration:underline
}

.tl-tabs{
  display:flex;
  flex-wrap:wrap;
  align-content:flex-start;
  gap:10px;
  max-height:78px;
  overflow-x:hidden;
  overflow-y:auto;
  padding:2px 8px 2px 0;
  scrollbar-width:thin;
  scrollbar-color:#aab6c7 #eff2f7
}

.tl-tabs.expanded{
  max-height:none;
  overflow:visible
}

.tl-tabs::-webkit-scrollbar{
  width:6px
}

.tl-tabs::-webkit-scrollbar-thumb{
  border-radius:6px;
  background:#aab6c7
}

.tl-tabs::-webkit-scrollbar-track{
  background:#eff2f7
}

.tl-tab{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:6px;
  height:32px;
  min-width:68px;
  flex:0 0 auto;
  padding:0 13px;
  border:1px solid #c3c6d0;
  border-radius:999px;
  background:#fff;
  color:#43474f;
  font-size:11px;
  font-weight:500!important;
  white-space:nowrap
}

.tl-tab.active{
  background:var(--blue);
  border-color:var(--blue);
  color:#fff
}

.tl-tab span{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  min-width:18px;
  height:18px;
  padding:0 5px;
  border:1px solid #d7deea;
  border-radius:999px;
  background:#f7f9fc;
  color:#667084;
  font-size:10px;
  line-height:1
}

.tl-tab.active span{
  border-color:#ffffff70;
  background:#ffffff1a;
  color:#fff
}

.tl-ai-box{
  min-height:105px;
  margin-top:12px;
  padding:22px 25px;
  border:1px solid #dce3f0;
  border-radius:8px;
  background:#f5f7ff
}

.tl-ai-head{
  display:flex;
  justify-content:space-between;
  gap:10px;
  align-items:center
}

.tl-ai-head strong{
  color:var(--blue);
  font-size:14px
}

.tl-ai-box p{
  margin:12px 0 0;
  color:#43474f;
  font-size:13px;
  line-height:1.8
}

.tl-columns{
  display:grid;
  grid-template-columns:minmax(0,693px) minmax(290px,1fr);
  gap:32px;
  align-items:start;
  margin-top:40px
}

.tl-board,
.tl-detail{
  min-width:0;
  border:1px solid #dde1e8;
  border-radius:10px;
  background:#fff;
  box-shadow:0 8px 24px #1c27370a
}

.tl-board{
  padding:24px
}

.tl-board-head{
  min-height:70px;
  display:flex;
  justify-content:space-between;
  gap:12px;
  border-bottom:1px solid #e7e9ee
}

.tl-board-head h2{
  display:flex;
  align-items:center;
  gap:8px;
  margin:0;
  font-size:18px
}

.tl-board-head h2 .tl-icon{
  color:var(--blue);
  width:19px;
  height:19px
}

.tl-board-head p{
  margin:4px 0;
  color:var(--muted);
  font-size:12px
}

.tl-zoom{
  display:flex;
  gap:6px
}

.tl-zoom button{
  width:28px;
  height:31px;
  border:1px solid #d8dde5;
  border-radius:5px;
  background:#fff;
  color:#43474f;
  font-size:19px
}

.tl-viewport{
  height:315px;
  width:100%;
  margin-top:22px;
  overflow:auto;
  scrollbar-width:thin;
  scrollbar-color:#7890ad #e5e7ed
}

.tl-stage{
  position:relative;
  width:640px;
  transform-origin:top left
}

.tl-path{
  position:absolute;
  inset:0;
  width:640px;
  height:100%;
  pointer-events:none
}

.tl-node{
  position:absolute;
  z-index:1;
  display:flex;
  align-items:center;
  flex-direction:column;
  width:96px;
  min-height:96px;
  padding:0;
  border:0;
  background:transparent;
  color:#43474f
}

.tl-node time{
  height:21px;
  color:var(--muted);
  font-size:11px
}

.tl-dot{
  display:grid;
  place-items:center;
  flex:none;
  width:36px;
  height:36px;
  border:2px solid #c3c6d0;
  border-radius:50%;
  background:#fff;
  color:var(--muted);
  font-size:14px;
  font-weight:700
}

.tl-node-label{
  width:96px;
  padding-top:8px;
  text-align:center;
  font-size:12px;
  line-height:1.25
}

.tl-node.hit .tl-dot{
  background:var(--blue);
  border-color:var(--blue);
  color:#fff
}

.tl-node.hit .tl-node-label{
  color:var(--blue);
  font-weight:700
}

.tl-node.selected .tl-dot{
  outline:4px solid #dbe4ef
}

.tl-node.selected:not(.hit) .tl-dot{
  background:#cfd7e0;
  color:var(--blue)
}

.tl-legend{
  display:flex;
  flex-wrap:wrap;
  gap:10px 16px;
  margin-top:15px;
  padding-top:14px;
  border-top:1px solid #eef0f4;
  color:var(--muted);
  font-size:11px
}

.tl-legend span{
  display:flex;
  align-items:center;
  gap:6px
}

.tl-legend i{
  width:11px;
  height:11px;
  flex:none;
  border-radius:50%
}

.tl-legend .hit{
  background:var(--blue)
}

.tl-legend .normal{
  border:1px solid #c3c6d0
}

.tl-legend .selected{
  background:#cfd7e0;
  outline:2px solid #dbe4ef
}

.tl-detail{
  min-height:516px;
  padding:25px
}

.tl-detail-head>div{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:8px
}

.tl-detail-head span{
  padding:3px 8px;
  border-radius:4px;
  background:#e9eef5;
  color:var(--blue);
  font-size:11px;
  font-weight:700
}

.tl-detail-head time{
  color:var(--muted);
  font-size:11px
}

.tl-detail h2{
  margin:8px 0 18px;
  font-size:18px;
  line-height:1.4
}

.tl-detail section{
  padding:18px 0;
  border-top:1px solid #eef0f4
}

.tl-detail h3{
  display:flex;
  align-items:center;
  gap:6px;
  margin:0;
  font-size:13px
}

.tl-detail h3 .tl-icon{
  width:14px;
  height:14px;
  color:var(--blue)
}

.tl-detail section p{
  margin:12px 0 0;
  color:#43474f;
  font-size:12px;
  line-height:1.7
}

.tl-bar{
  display:flex;
  height:12px;
  overflow:hidden;
  margin-top:14px;
  border-radius:9px
}

/* 밝은 보도 성향 색 */
.tl-bar i:nth-child(1){
  background:#4f7fc4
}

.tl-bar i:nth-child(2){
  background:#9274b5
}

.tl-bar i:nth-child(3){
  background:#df6f6f
}

.tl-bias-label{
  display:flex;
  justify-content:space-between;
  gap:5px;
  margin-top:12px;
  color:#666b73;
  font-size:10px
}

.tl-bias-label span{
  display:flex;
  align-items:center;
  gap:4px
}

.tl-bias-label i{
  width:9px;
  height:9px;
  border-radius:2px
}

.tl-bias-label span:nth-child(1) i{
  background:#4f7fc4
}

.tl-bias-label span:nth-child(2) i{
  background:#9274b5
}

.tl-bias-label span:nth-child(3) i{
  background:#df6f6f
}

.tl-section-head{
  display:flex;
  align-items:center;
  justify-content:space-between
}

.tl-section-head small{
  color:var(--muted);
  font-size:11px
}

.tl-articles{
  display:grid;
  gap:10px;
  max-height:248px;
  margin-top:12px;
  overflow-y:auto;
  padding-right:4px;
  scrollbar-width:thin;
  scrollbar-color:#aab6c7 #eff2f7
}

.tl-articles::-webkit-scrollbar{
  width:6px
}

.tl-articles::-webkit-scrollbar-thumb{
  border-radius:6px;
  background:#aab6c7
}

.tl-articles::-webkit-scrollbar-track{
  background:#eff2f7
}

.tl-article{
  height:76px;
  padding:11px;
  border:1px solid #dce1eb;
  border-radius:8px;
  overflow:hidden
}

.tl-article>div{
  display:flex;
  justify-content:space-between;
  gap:7px
}

.tl-article strong{
  color:var(--blue);
  font-size:11px
}

.tl-article time{
  color:var(--muted);
  font-size:10px;
  white-space:nowrap
}

.tl-article a{
  display:-webkit-box;
  -webkit-box-orient:vertical;
  -webkit-line-clamp:2;
  margin-top:5px;
  overflow:hidden;
  color:#0e3566;
  font-size:12px;
  font-weight:700;
  line-height:1.4;
  text-decoration:none
}

.tl-article a:hover{
  text-decoration:underline
}

.tl-detail-button{
  display:block;
  width:100%;
  margin-top:14px;
  padding:12px;
  border:1px solid #dce3f0;
  border-radius:5px;
  background:#e7eeff;
  color:var(--blue);
  font-size:12px;
  font-weight:700;
  text-align:center;
  text-decoration:none
}

.tl-load-error{
  margin:12px 0 0;
  color:#ba1a1a;
  font-size:12px
}

.tl-related{
  margin-top:66px;
  padding-top:28px;
  border-top:1px solid #dfe3ed
}

.tl-related-head{
  display:flex;
  justify-content:space-between;
  gap:20px;
  align-items:flex-start
}

.tl-related-head h2{
  margin:0 0 5px;
  font-size:18px
}

.tl-related-head p{
  margin:0;
  color:var(--muted);
  font-size:12px
}

.tl-related-all{
  flex:none;
  color:var(--blue);
  font-size:12px;
  font-weight:700
}

.tl-related-grid{
  display:grid;
  grid-template-columns:repeat(3,minmax(0,1fr));
  gap:24px;
  margin-top:27px
}

.tl-related-card{
  width:100%;
  min-height:205px;
  display:flex;
  flex-direction:column;
  padding:20px;
  border:1px solid #dce1eb;
  border-radius:9px;
  background:#fff;
  color:inherit;
  text-align:left;
  cursor:pointer;
  transition:border-color .15s, transform .15s, box-shadow .15s
}

.tl-related-card:hover{
  border-color:#aebdd1;
  transform:translateY(-2px);
  box-shadow:0 8px 20px #1c27370d
}

.tl-related-card>span{
  color:var(--blue);
  font-size:11px;
  font-weight:700
}

.tl-related-card h3{
  margin:8px 0;
  font-size:15px;
  line-height:1.5
}

.tl-related-card p{
  flex:1;
  margin:0;
  color:#43474f;
  font-size:12px;
  line-height:1.6
}

.tl-related-card>div{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:8px;
  margin-top:14px;
  padding-top:12px;
  border-top:1px solid #e7e9ee
}

.tl-related-card small{
  color:var(--muted);
  font-size:11px
}

.tl-related-card>div span{
  color:var(--blue);
  font-size:11px;
  font-weight:700
}

.tl-related-empty{
  grid-column:1/-1;
  margin:0;
  padding:24px;
  border:1px solid #e0e4eb;
  border-radius:9px;
  background:#fff;
  color:var(--muted);
  text-align:center;
  font-size:12px
}

@media(max-width:900px){
  .tl-page{
    padding:35px 22px 70px
  }

  .tl-columns{
    grid-template-columns:1fr
  }

  .tl-detail{
    min-height:0
  }

  .tl-related-grid{
    grid-template-columns:1fr
  }
}

@media(max-width:600px){
  .tl-page{
    padding:24px 16px 60px
  }

  .tl-title-row h1{
    font-size:22px
  }

  .tl-meta{
    display:grid
  }

  .tl-board{
    padding:16px
  }
}
`;

export default function TimelinePage() {
  const { topic_id } = useParams();

  const topicId = Number(topic_id);

  const location = useLocation();
  const navigate = useNavigate();

  const { session } = useSession();

  const tabsRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<SubtopicTimelineResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [subtopicId, setSubtopicId] = useState<number | null>(null);

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [detailArticles, setDetailArticles] = useState<ArticleItem[]>([]);

  const [articlesLoading, setArticlesLoading] = useState(false);

  const [articlesError, setArticlesError] = useState('');

  /*
   * 실제 연관 토픽
   */
  const [relatedTopics, setRelatedTopics] = useState<RelatedTopic[]>([]);

  const [relatedLoading, setRelatedLoading] = useState(false);

  const [relatedError, setRelatedError] = useState('');

  const [expandedSubtopics, setExpandedSubtopics] = useState(false);

  const [hasMoreSubtopics, setHasMoreSubtopics] = useState(false);

  const [viewportWidth, setViewportWidth] = useState(640);

  const [zoom, setZoom] = useState(1);

  const [subscribed, setSubscribed] = useState(false);

  const [subscribeBusy, setSubscribeBusy] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [showPermissionModal, setShowPermissionModal] = useState(false);

  /*
   * 메인 타임라인 API
   * +
   * 연관 토픽 조회
   */
  useEffect(() => {
    if (!Number.isInteger(topicId) || topicId <= 0) {
      setError('잘못된 토픽 주소입니다.');
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadPage = async () => {
      setLoading(true);
      setError('');

      setRelatedLoading(true);
      setRelatedError('');
      setRelatedTopics([]);

      const [timelineResult, relatedResult] = await Promise.allSettled([
        getTopicSubtopicTimeline(topicId),
        getRelatedTopics(topicId, 3),
      ]);

      if (cancelled) return;

      if (timelineResult.status === 'rejected') {
        console.error('타임라인 조회 실패:', timelineResult.reason);

        setError('타임라인을 불러오지 못했습니다. 새로고침 후 다시 시도해 주세요.');

        setLoading(false);
        setRelatedLoading(false);

        return;
      }

      const response = timelineResult.value;

      setData(response);

      setSubscribed(Boolean(response.topic.is_subscribed));

      setSubtopicId(null);

      /*
       * 첫 번째 노드는 기본 현재 선택
       */
      setSelectedId(response.events[0]?.id ?? null);

      if (relatedResult.status === 'fulfilled') {
        setRelatedTopics(relatedResult.value);
      } else {
        console.error('연관 토픽 조회 실패:', relatedResult.reason);

        setRelatedError('연관 토픽을 불러오지 못했습니다.');
      }

      setLoading(false);
      setRelatedLoading(false);
    };

    void loadPage();

    return () => {
      cancelled = true;
    };
  }, [topicId]);

  /*
   * 현재 선택 이벤트의 기사
   */
  useEffect(() => {
    if (selectedId === null) {
      setDetailArticles([]);
      setArticlesError('');
      setArticlesLoading(false);
      return;
    }

    let cancelled = false;

    const loadArticles = async () => {
      setArticlesLoading(true);
      setArticlesError('');
      setDetailArticles([]);

      try {
        const firstPage = await getArticlesByEvent({
          eventId: selectedId,
          page: 1,
          size: 100,
          order: 'desc',
        });

        if (cancelled) return;

        const remainingPages = await Promise.all(
          Array.from({ length: Math.max(0, firstPage.total_pages - 1) }, (_, index) =>
            getArticlesByEvent({
              eventId: selectedId,
              page: index + 2,
              size: 100,
              order: 'desc',
            })
          )
        );

        if (cancelled) return;

        setDetailArticles([
          ...(firstPage.articles ?? []),
          ...remainingPages.flatMap((page) => page.articles ?? []),
        ]);
      } catch (cause) {
        if (cancelled) return;

        console.error('이벤트 기사 조회 실패:', cause);

        setArticlesError('기사 목록을 불러오지 못했습니다.');
      } finally {
        if (!cancelled) {
          setArticlesLoading(false);
        }
      }
    };

    void loadArticles();

    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  /*
   * 화면 너비 계산
   */
  useEffect(() => {
    const element = viewportRef.current;

    if (!element) return;

    const update = () => {
      setViewportWidth(element.clientWidth);
    };

    update();

    const observer = new ResizeObserver(update);

    observer.observe(element);

    return () => observer.disconnect();
  }, [loading]);

  /*
   * 서브토픽 버튼 2줄 초과 확인
   */
  useEffect(() => {
    const element = tabsRef.current;

    if (!element) return;

    const update = () => {
      const rows = new Set(
        Array.from(element.children, (child) => (child as HTMLElement).offsetTop)
      );

      setHasMoreSubtopics(rows.size > 2);
    };

    update();

    const observer = new ResizeObserver(update);

    observer.observe(element);

    return () => observer.disconnect();
  }, [loading, data?.subtopics]);

  const topic = data?.topic;
  const stats = data?.stats;

  const subtopics = data?.subtopics ?? [];

  const events = data?.events ?? [];

  const selectedSubtopic = subtopics.find((item) => item.id === subtopicId) ?? null;

  const selectedEvent = events.find((event) => event.id === selectedId) ?? null;

  /*
   * 선택된 서브토픽에 포함되는 이벤트인지
   */
  const isSubtopicEvent = (event: TopicTimelineEvent) => {
    if (subtopicId === null) {
      return false;
    }

    return event.subtopic_ids.includes(subtopicId);
  };

  const layout = useMemo(() => buildLayout(events), [events]);

  const scale = Math.min(1, viewportWidth / 640) * zoom;

  const tracking = stats?.first_published_at
    ? `${formatDate(stats.first_published_at)} ~ ${
        stats.last_published_at ? formatDate(stats.last_published_at) : '현재'
      }`
    : '기간 정보 준비 중';

  /*
   * 현재 URL에서 topic_id 부분만
   * 연관 토픽 id로 바꿔 이동.
   *
   * 예:
   * /timeline/1 -> /timeline/3
   *
   * 라우트 구조를 따로 하드코딩하지 않아도 됨.
   */
  const handleRelatedTopicClick = (relatedTopicId: number) => {
    const currentTopicId = String(topic_id ?? '');

    const segments = location.pathname.split('/');

    const index = segments.findIndex((segment) => segment === currentTopicId);

    if (index === -1) {
      console.error('현재 URL에서 topic_id 위치를 찾지 못했습니다.');
      return;
    }

    segments[index] = String(relatedTopicId);

    navigate(`${segments.join('/')}${location.search}`);
  };

  const handleSubscribe = async () => {
    if (subscribeBusy || !topic) {
      return;
    }

    if (!session) {
      if (window.confirm('로그인이 필요한 기능입니다. 로그인하시겠습니까?')) {
        navigate('/signin');
      }

      return;
    }

    if (!subscribed && typeof Notification !== 'undefined') {
      let permission = Notification.permission;

      if (permission === 'default') {
        permission = await Notification.requestPermission();
      }

      if (permission !== 'granted') {
        setShowPermissionModal(true);
        return;
      }
    }

    setSubscribeBusy(true);

    try {
      if (subscribed) {
        await unsubscribeTopic(topicId);

        setSubscribed(false);
      } else {
        const result = await subscribeTopic(topicId);

        setSubscribed(result.is_subscribed);

        if (result.is_subscribed) {
          setIsModalOpen(true);
        }
      }
    } catch (cause) {
      console.error('구독 변경 실패:', cause);

      window.alert('구독 상태를 변경하지 못했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setSubscribeBusy(false);
    }
  };

  if (loading) {
    return (
      <main className="tl-page">
        <Spinner />
      </main>
    );
  }

  if (!data || !topic) {
    return (
      <main className="tl-page" role="alert">
        {error || '토픽을 찾을 수 없습니다.'}
      </main>
    );
  }

  return (
    <main className="tl-page">
      <style>{css}</style>

      <SubscribeModal
        isOpen={isModalOpen}
        topicTitle={topic.title ?? ''}
        onClose={() => setIsModalOpen(false)}
      />

      <NotificationPermissionModal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
      />

      <div className="tl-crumb">
        타임라인으로 보는 사건
        <span>›</span>
        {topic.category ?? '미분류'}
        <span>›</span>
        <strong>{topic.title}</strong>
      </div>

      <div className="tl-title-row">
        <div>
          <span className="tl-kicker">토픽 타임라인</span>

          <h1>{topic.title}</h1>
        </div>

        <button
          className={`tl-subscribe ${subscribed ? 'active' : ''}`}
          onClick={handleSubscribe}
          disabled={subscribeBusy}
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

          <strong>{tracking}</strong>
        </div>

        <div>
          <Icon kind="chart" />

          <span>분석된 기사:</span>

          <strong>{stats ? `${stats.article_count.toLocaleString()}건` : '정보 준비 중'}</strong>
        </div>

        <div>
          <Icon kind="news" />

          <span>이벤트 수:</span>

          <strong>{stats ? `${stats.event_count}개` : `${events.length}개`}</strong>
        </div>
      </div>

      {/* 서브토픽 */}
      <section className="tl-subtopics">
        <div className="tl-subtopic-head">
          <h2>서브토픽</h2>

          {hasMoreSubtopics && (
            <button
              className="tl-more"
              type="button"
              aria-expanded={expandedSubtopics}
              aria-controls="subtopic-tabs"
              onClick={() => setExpandedSubtopics((value) => !value)}
            >
              {expandedSubtopics ? '접기 ↑' : '전체 보기 ↓'}
            </button>
          )}
        </div>

        <div
          ref={tabsRef}
          id="subtopic-tabs"
          className={`tl-tabs ${expandedSubtopics ? 'expanded' : ''}`}
          role="tablist"
          aria-label="서브토픽"
        >
          <button
            className={`tl-tab ${subtopicId === null ? 'active' : ''}`}
            type="button"
            role="tab"
            aria-selected={subtopicId === null}
            onClick={() => setSubtopicId(null)}
          >
            전체
          </button>

          {subtopics.map((item) => (
            <button
              key={item.id}
              className={`tl-tab ${subtopicId === item.id ? 'active' : ''}`}
              type="button"
              role="tab"
              aria-selected={subtopicId === item.id}
              onClick={() => setSubtopicId(item.id)}
            >
              {item.name}

              <span>{item.event_count}</span>
            </button>
          ))}
        </div>

        <div className="tl-ai-box">
          <div className="tl-ai-head">
            <strong>
              {selectedSubtopic
                ? `◆ AI 서브 토픽 요약 _ ${selectedSubtopic.name}`
                : '◆ 토픽 전체 요약'}
            </strong>
          </div>

          <p aria-live="polite">
            {selectedSubtopic
              ? selectedSubtopic.summary || '서브토픽 요약이 준비되지 않았습니다.'
              : topic.ai_summary || topic.summary || '요약이 준비되지 않았습니다.'}
          </p>
        </div>
      </section>

      <div className="tl-columns">
        {/* 타임라인 */}
        <section className="tl-board">
          <div className="tl-board-head">
            <div>
              <h2>
                <Icon kind="timeline" />
                토픽 타임라인
              </h2>

              <p>노드를 클릭하면 오른쪽에 상세 정보가 표시됩니다.</p>
            </div>

            <div className="tl-zoom">
              <button
                type="button"
                aria-label="축소"
                onClick={() => setZoom((value) => Math.max(0.8, +(value - 0.1).toFixed(1)))}
              >
                −
              </button>

              <button
                type="button"
                aria-label="확대"
                onClick={() => setZoom((value) => Math.min(1.2, +(value + 0.1).toFixed(1)))}
              >
                ＋
              </button>
            </div>
          </div>

          {events.length ? (
            <div
              ref={viewportRef}
              className="tl-viewport"
              tabIndex={0}
              aria-label="스크롤 가능한 타임라인"
            >
              <div
                style={{
                  width: 640 * scale,
                  height: layout.height * scale,
                }}
              >
                <div
                  className="tl-stage"
                  style={{
                    height: layout.height,
                    transform: `scale(${scale})`,
                  }}
                >
                  <svg className="tl-path" viewBox={`0 0 640 ${layout.height}`} aria-hidden="true">
                    <path d={layout.path} fill="none" stroke="#c9d2df" strokeWidth="2" />
                  </svg>

                  {layout.nodes.map(({ event, x, y }, index) => {
                    const hit = isSubtopicEvent(event);

                    const selected = event.id === selectedId;

                    return (
                      <button
                        key={event.id}
                        className={`tl-node ${hit ? 'hit' : ''} ${selected ? 'selected' : ''}`}
                        type="button"
                        style={{
                          left: x - 48,
                          top: y - 39,
                        }}
                        onClick={() => setSelectedId(event.id)}
                      >
                        <time>
                          {event.occurred_at ? formatDate(event.occurred_at).slice(5) : '날짜 미정'}
                        </time>

                        <span className="tl-dot">{index + 1}</span>

                        <span className="tl-node-label">{event.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <p>이 토픽에 등록된 이벤트가 없습니다.</p>
          )}

          <div className="tl-legend">
            {subtopicId !== null && (
              <span>
                <i className="hit" />
                선택된 서브토픽
              </span>
            )}

            <span>
              <i className="normal" />
              일반 노드
            </span>

            <span>
              <i className="selected" />
              현재 선택
            </span>
          </div>
        </section>

        {/* 오른쪽 상세 */}
        <aside className="tl-detail" aria-live="polite">
          {selectedEvent ? (
            <>
              <div className="tl-detail-head">
                <div>
                  <span>선택된 이벤트 상세 정보</span>

                  <time>{formatDate(selectedEvent.occurred_at)}</time>
                </div>

                <h2>{selectedEvent.title}</h2>
              </div>

              <section>
                <h3>✦ 이벤트 요약</h3>

                <p>
                  {selectedEvent.summary ||
                    selectedEvent.short_summary ||
                    '요약이 준비되지 않았습니다.'}
                </p>
              </section>

              <section>
                <div className="tl-section-head">
                  <h3>
                    <Icon kind="bias" />
                    보도 성향 분석
                  </h3>

                  <small>{selectedEvent.article_count}건 대상</small>
                </div>

                <div className="tl-bar">
                  <i
                    style={{
                      width: `${selectedEvent.left_percent}%`,
                    }}
                  />

                  <i
                    style={{
                      width: `${selectedEvent.mid_percent}%`,
                    }}
                  />

                  <i
                    style={{
                      width: `${selectedEvent.right_percent}%`,
                    }}
                  />
                </div>

                <div className="tl-bias-label">
                  <span>
                    <i />
                    진보 {selectedEvent.left_percent}%
                  </span>

                  <span>
                    <i />
                    중도 {selectedEvent.mid_percent}%
                  </span>

                  <span>
                    <i />
                    보수 {selectedEvent.right_percent}%
                  </span>
                </div>
              </section>

              <section>
                <div className="tl-section-head">
                  <h3>보도 기사</h3>

                  <small>최신순</small>
                </div>

                {articlesLoading ? (
                  <p>기사를 불러오는 중...</p>
                ) : articlesError ? (
                  <p className="tl-load-error">{articlesError}</p>
                ) : detailArticles.length > 0 ? (
                  <div className="tl-articles">
                    {detailArticles.map((article, index) => (
                      <div className="tl-article" key={`${article.link}-${index}`}>
                        <div>
                          <strong>{article.publisher || '언론사'}</strong>

                          <time>{formatDate(article.published_at)}</time>
                        </div>

                        <a
                          href={article.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={article.title}
                        >
                          {article.title}
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>등록된 주요 보도가 없습니다.</p>
                )}
              </section>
            </>
          ) : (
            <p>이벤트를 선택해 주세요.</p>
          )}
        </aside>
      </div>

      {/* 실제 연관 토픽 */}
      <section className="tl-related" aria-labelledby="related-heading">
        <div className="tl-related-head">
          <div>
            <h2 id="related-heading">함께 보면 좋은 연관 토픽</h2>

            <p>현재 사건과 연결된 다른 문제를 함께 살펴보세요.</p>
          </div>

          <span className="tl-related-all">전체 연계 사건 보기 →</span>
        </div>

        <div className="tl-related-grid">
          {relatedLoading ? (
            <p className="tl-related-empty">연관 토픽을 불러오는 중...</p>
          ) : relatedError ? (
            <p className="tl-related-empty">{relatedError}</p>
          ) : relatedTopics.length > 0 ? (
            relatedTopics.map((item) => (
              <button
                key={item.id}
                type="button"
                className="tl-related-card"
                onClick={() => handleRelatedTopicClick(item.id)}
              >
                <span>{item.category || '미분류'}</span>

                <h3>{item.title}</h3>

                <p>{item.reason || item.summary || '현재 토픽과 관련된 사건입니다.'}</p>

                <div>
                  <small>연관 토픽</small>

                  <span>타임라인 탐색 →</span>
                </div>
              </button>
            ))
          ) : (
            <p className="tl-related-empty">등록된 연관 토픽이 없습니다.</p>
          )}
        </div>
      </section>
    </main>
  );
}
