import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ThemeCard from '@/components/ThemeCard';
import Pagination from '@/components/Pagination';
import { useSearchStore } from '@/store/useSearchStore';
import { supabase } from '@/lib/supabase';

// --- API 응답 타입 정의 ---
interface HotTopic {
  rank: number;
  topic_id: number;
  title: string;
  category: string;
  article_count: number;
}

interface TimelineEvent {
  id: number;
  title: string;
  occurred_at: string;
  article_count: number;
  is_latest: boolean;
  is_active: boolean;
}

interface PopularTimeline {
  as_of: string;
  topic: {
    id: number;
    title: string;
    category: string;
  } | null;
  events: TimelineEvent[];
  window_hours: number;
  view_count: number;
  views_as_of: string;
}

// 백엔드 명세에 맞춘 토픽 메타 정보 타입
interface TopicItem {
  id: number;
  category: string;
  title: string;
  summary: string;
  created_at: string;
  updated_at?: string;
  is_subscribed?: boolean;
  article_count?: number;
  keywords?: string[]; // 배열로 들어옴
  left_percent?: number;
  mid_percent?: number;
  right_percent?: number;
  first_published_at?: string;
  topic_image_url?: string; // 백엔드가 알려준 진짜 썸네일 URL
}
// -----------------------

const AlertModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}> = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[340px] rounded-[14px] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="pt-9 pb-7 px-7 text-center">
          <h2 className="text-[15px] font-bold text-black mb-2.5 tracking-tight">{title}</h2>
          <p className="text-[12px] text-gray-400 leading-relaxed font-light break-keep px-1 whitespace-pre-line">
            {message}
          </p>
        </div>
        <div className="flex border-t border-gray-100 h-[44px]">
          <button
            onClick={onClose}
            className="flex-1 text-[13px] text-black font-bold hover:bg-gray-50 transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  // 백엔드 정렬 명세 ('latest', 'articles')에 맞춤
  const [sortOrder, setSortOrder] = useState<'latest' | 'articles'>('latest');
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);

  const [topicData, setTopicData] = useState<TopicItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 사이드바 상태 관리
  const [hotTopics, setHotTopics] = useState<HotTopic[]>([]);
  const [realtimeTimeline, setRealtimeTimeline] = useState<PopularTimeline | null>(null);

  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || '전체';
  const { keyword, search } = useSearchStore();

  useEffect(() => {
    window.scrollTo({ top: 200, behavior: 'smooth' });
  }, [currentPage]);

  // 메인 토픽 리스트 페칭 (get_topics 하나로 모두 해결)
  useEffect(() => {
    const fetchTopics = async () => {
      setIsLoading(true);
      try {
        const categoryParam = selectedCategory === '전체' ? null : selectedCategory;
        const searchParam = keyword?.trim() ? keyword : null;

        // 프론트 함수 래퍼 대신 백엔드 명세에 맞춰 supabase rpc를 직접 호출하여 파라미터 안전성 보장
        const { data, error } = await supabase.rpc('get_topics', {
          p_category: categoryParam,
          p_order: sortOrder, // 'latest' 또는 'articles'
          p_page: currentPage,
          p_search: searchParam,
          p_size: 6, // API 기본값
        });

        if (!error && data) {
          // data.topics가 배열 형태로 넘어옵니다.
          setTopicData(data.topics || data || []);
          setTotalPages(data.total_pages || 1);
        } else {
          setTopicData([]);
          setTotalPages(1);
          if (error) console.error('Supabase RPC get_topics Error:', error);
        }
      } catch (error) {
        console.error('토픽 API 에러:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTopics();
  }, [currentPage, selectedCategory, search, keyword, sortOrder]); // sortOrder 변경 시에도 호출되도록 의존성 배열에 추가

  // 사이드바(핫 토픽 랭킹, 실시간 타임라인) API 연동
  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        // 오늘의 핫 토픽 랭킹 호출
        const { data: hotData, error: hotError } = await supabase.rpc('get_hot_topics', {
          p_window_hours: 1,
          p_size: 5,
        });

        if (!hotError && hotData) {
          setHotTopics(hotData.topics || []);
        }

        // 실시간 인기 타임라인 호출
        const { data: timeData, error: timeError } = await supabase.rpc(
          'get_popular_topic_timeline',
          {
            p_window_hours: 1,
            p_size: 3,
            p_active_hours: 24,
          }
        );

        if (!timeError && timeData) {
          setRealtimeTimeline(timeData);
        }
      } catch (error) {
        console.error('사이드바 API 에러:', error);
      }
    };

    fetchSidebarData();
  }, []);

  return (
    <div className="w-full pb-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-6 pt-10">
        {/* 상단 타이틀 & 정렬 영역 */}
        <section className="mb-6 flex items-center w-full">
          <h2 className="text-[28px] font-bold text-[#111111] tracking-tight whitespace-nowrap">
            토픽리스트
          </h2>
          <div className="flex-1 h-[1px] bg-gray-200 mx-5" />
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg text-[13px] shrink-0">
            <button
              onClick={() => setSortOrder('latest')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                sortOrder === 'latest'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              최신순
            </button>
            <button
              onClick={() => setSortOrder('articles')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                sortOrder === 'articles'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              기사량 많은순
            </button>
          </div>
        </section>

        {/* 좌/우 레이아웃 */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
          {/* 좌측: 토픽 카드 리스트 */}
          <div className="flex-1 w-full">
            {isLoading ? (
              <div className="w-full h-[400px] bg-white rounded-xl flex items-center justify-center text-gray-400 text-[14px]">
                데이터를 불러오는 중...
              </div>
            ) : (
              <>
                <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {topicData.length > 0 ? (
                    topicData.map((topic) => (
                      <ThemeCard
                        key={topic.id}
                        id={topic.id}
                        category={
                          topic.category ||
                          (selectedCategory !== '전체' ? selectedCategory : '기타')
                        }
                        // 키워드가 배열로 들어오므로 값이 있으면 첫번째 요소를 보여줌
                        keyword={
                          topic.keywords && topic.keywords.length > 0
                            ? topic.keywords[0]
                            : '주요이슈'
                        }
                        title={topic.title || '제목 없음'}
                        summary={topic.summary || ''}
                        // 첫 기사 보도 시간(first_published_at)을 우선시하고, 없으면 생성일 사용
                        firstReportDate={topic.first_published_at || topic.created_at || ''}
                        isBookmarked={!!topic.is_subscribed}
                        articleCount={topic.article_count ?? 0}
                        // 진짜 성향 통계 매핑
                        bias={{
                          left: topic.left_percent ?? 18,
                          center: topic.mid_percent ?? 60,
                          right: topic.right_percent ?? 22,
                        }}
                        // 진짜 썸네일 이미지 연결
                        imageUrl={topic.topic_image_url}
                      />
                    ))
                  ) : (
                    <div className="col-span-full py-20 bg-white rounded-xl text-center text-gray-400 text-[14px]">
                      해당 카테고리의 토픽이 없습니다.
                    </div>
                  )}
                </section>

                {topicData.length > 0 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* 우측: 사이드바 위젯 */}
          <aside className="w-full lg:w-[320px] shrink-0 space-y-6">
            {/* 오늘의 핫 토픽 랭킹 */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-3">
                <h3 className="text-[17px] font-bold text-gray-900">오늘의 핫 토픽 랭킹</h3>
                <span className="text-[12px] text-gray-400 font-medium tracking-tight">
                  1시간 기준
                </span>
              </div>
              <ol className="flex flex-col gap-1 text-[14px]">
                {hotTopics.length > 0 ? (
                  hotTopics.map((item) => (
                    <li key={item.topic_id}>
                      <Link
                        to={`/timeline/${item.topic_id}`}
                        className="group flex items-center justify-between text-gray-700 hover:bg-gray-50 p-2.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <span
                            className={`font-bold w-4 text-center shrink-0 ${
                              item.rank <= 3 ? 'text-blue-600' : 'text-gray-400'
                            }`}
                          >
                            {item.rank}
                          </span>
                          <span className="truncate transition-all duration-200 group-hover:text-gray-900 group-hover:font-bold">
                            {item.title}
                          </span>
                        </div>
                        <span className="text-[12px] text-gray-400 shrink-0 ml-2">
                          {item.article_count}개 기사
                        </span>
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="text-center text-[13px] text-gray-400 py-4">
                    랭킹 데이터가 없습니다.
                  </li>
                )}
              </ol>
            </div>

            {/* 실시간 인기 타임라인 */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  <h3 className="text-[15px] font-bold text-gray-900">실시간 인기 타임라인</h3>
                </div>
                <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  실시간 추적
                </span>
              </div>

              {realtimeTimeline && realtimeTimeline.topic ? (
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="text-[13px] font-bold text-gray-800 mb-3">
                    토픽 : [{realtimeTimeline.topic.title || '제목 없음'}]
                  </div>
                  <ul className="space-y-3 relative pl-3 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-200">
                    {(realtimeTimeline.events || []).map((event, index) => (
                      <li key={event.id} className="relative pl-3">
                        <span
                          className={`absolute -left-[11px] top-1.5 w-2 h-2 rounded-full border-2 border-white ${
                            event.is_active || event.is_latest ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                        />
                        <p
                          className={`text-[12px] font-semibold ${
                            event.is_active || event.is_latest ? 'text-blue-600' : 'text-gray-800'
                          }`}
                        >
                          이벤트 {index + 1}. {event.title} {event.is_latest ? '(현재)' : ''}
                        </p>
                        <p
                          className={`text-[11px] mt-0.5 ${
                            event.is_active || event.is_latest
                              ? 'text-blue-500 font-medium'
                              : 'text-gray-400'
                          }`}
                        >
                          {event.occurred_at
                            ? event.occurred_at.slice(0, 10).replaceAll('-', '.')
                            : ''}{' '}
                          · {event.article_count}개 기사
                        </p>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={`/timeline/${realtimeTimeline.topic.id}`}
                    className="mt-4 flex items-center justify-center text-[12px] text-gray-500 hover:text-gray-900 hover:font-bold transition-all pt-3 border-t border-gray-100"
                  >
                    타임라인 전체보기 &gt;
                  </Link>
                </div>
              ) : (
                <div className="text-center text-[13px] text-gray-400 py-4 border-t border-gray-100 mt-4 pt-4">
                  현재 진행 중인 실시간 타임라인이 없습니다.
                </div>
              )}
            </div>

            {/* 뉴스 읽기 가이드 */}
            <div className="bg-[#1E2E4A] text-white rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-1 border-b border-white/10">
                <span className="text-[10px] font-black bg-white/20 px-1.5 py-0.5 rounded tracking-wide">
                  INFO
                </span>
                <h3 className="text-[14px] font-bold tracking-tight">뉴스 읽기 가이드</h3>
              </div>

              <div className="space-y-2.5 text-[12px]">
                <div className="bg-[#2B3B5C] rounded-lg p-3">
                  <p className="font-bold text-white mb-1">토픽 (Topic)</p>
                  <p className="text-gray-300 font-light text-[12px] leading-snug">
                    관련된 여러 사건을 하나로 묶은 '큰 주제'
                  </p>
                </div>
                <div className="bg-[#2B3B5C] rounded-lg p-3">
                  <p className="font-bold text-white mb-1">서브토픽 (Subtopic)</p>
                  <p className="text-gray-300 font-light text-[12px] leading-snug">
                    다양한 관점과 쟁점으로 나눠서 보는 '다각도 필터'
                  </p>
                </div>
                <div className="bg-[#2B3B5C] rounded-lg p-3">
                  <p className="font-bold text-white mb-1">이벤트 (Event)</p>
                  <p className="text-gray-300 font-light text-[12px] leading-snug">
                    같은 사실을 다룬 여러 기사들의 '핵심 요약'
                  </p>
                </div>
                <div className="bg-[#2B3B5C] rounded-lg p-3">
                  <p className="font-bold text-white mb-1">성향 분석 (Bias)</p>
                  <p className="text-gray-300 font-light text-[12px] leading-snug">
                    다양한 언론사들의 시각을 색상으로 한눈에 비교
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <AlertModal
        isOpen={isDuplicateModalOpen}
        onClose={() => setIsDuplicateModalOpen(false)}
        title="이미 스크랩된 주제"
        message={`해당 기사의 주제는 이미 스크랩한 토픽에 등록되어 있습니다.\n마이페이지에서 확인해 주세요.`}
      />
    </div>
  );
};

export default HomePage;
