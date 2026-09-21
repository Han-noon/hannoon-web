import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ThemeCard from '@/components/ThemeCard';
import Pagination from '@/components/Pagination';
import { getEvents } from '@/api/event/getEvents';
import type { EventItem } from '@/types/eventCard';
import { useSearchStore } from '@/store/useSearchStore';

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
  const [sortOrder, setSortOrder] = useState<'latest' | 'count'>('latest');
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);

  const [briefingData, setBriefingData] = useState<EventItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || '전체';
  const { keyword, search } = useSearchStore();

  useEffect(() => {
    window.scrollTo({ top: 200, behavior: 'smooth' });
  }, [currentPage]);

  useEffect(() => {
    const fetchBriefings = async () => {
      setIsLoading(true);
      try {
        const categoryParam = selectedCategory === '전체' ? undefined : selectedCategory;
        const response: any = await getEvents(currentPage, 6, keyword, categoryParam);

        if (response && response.events) {
          setBriefingData(response.events);
          setTotalPages(response.total_pages || 1);
        } else {
          setBriefingData([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error('API 에러:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBriefings();
  }, [currentPage, selectedCategory, search]);

  // 오늘의 핫 토픽 랭킹 데이터
  const hotTopics =
    briefingData.length >= 5
      ? briefingData.slice(0, 5).map((item, idx) => ({
          id: item.event_id,
          rank: idx + 1,
          text: item.event_title || item.topic_title || '제목 없음',
          count: `${Math.floor(Math.random() * 50) + 50}개 기사`,
        }))
      : [
          { id: 101, rank: 1, text: '의대 정원 증원 및 의료 공백', count: '142개 기사' },
          { id: 102, rank: 2, text: '한은 기준금리 연속 동결', count: '98개 기사' },
          { id: 103, rank: 3, text: '26조 반도체 금융·인프라 지원', count: '84개 기사' },
          { id: 104, rank: 4, text: '서울 AI 안전 정상회의', count: '76개 기사' },
          { id: 105, rank: 5, text: '수도권 주택 매매 심리 동향', count: '63개 기사' },
        ];

  const realtimeTopicId = briefingData.length > 0 ? briefingData[0].event_id : 101;
  const realtimeTopicTitle = '의대 정원 증원 논란';

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
              onClick={() => setSortOrder('count')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                sortOrder === 'count'
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
                  {briefingData.length > 0 ? (
                    briefingData.map((news) => (
                      <ThemeCard
                        key={news.event_id}
                        id={news.event_id}
                        category={selectedCategory !== '전체' ? selectedCategory : '경제'}
                        keyword={news.topic_title?.split(' ')[0] || '키워드'}
                        title={news.event_title || '제목 없음'}
                        summary={news.summary || ''}
                        firstReportDate={
                          news.created_at ? news.created_at.slice(0, 10).replaceAll('-', '.') : ''
                        }
                        isBookmarked={news.is_subscribed}
                        articleCount={Math.floor(Math.random() * 50) + 50}
                        bias={{ left: 18, center: 60, right: 22 }}
                      />
                    ))
                  ) : (
                    <div className="col-span-full py-20 bg-white rounded-xl text-center text-gray-400 text-[14px]">
                      해당 카테고리의 사건이 없습니다.
                    </div>
                  )}
                </section>

                {briefingData.length > 0 && (
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
                {hotTopics.map((item) => (
                  <li key={item.rank}>
                    <Link
                      to={`/timeline/${item.id}`}
                      className="group flex items-center justify-between text-gray-700 hover:bg-gray-50 p-2.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <span
                          className={`font-bold w-4 text-center shrink-0 ${item.rank <= 3 ? 'text-blue-600' : 'text-gray-400'}`}
                        >
                          {item.rank}
                        </span>
                        <span className="truncate transition-all duration-200 group-hover:text-gray-900 group-hover:font-bold">
                          {item.text}
                        </span>
                      </div>
                      <span className="text-[12px] text-gray-400 shrink-0 ml-2">{item.count}</span>
                    </Link>
                  </li>
                ))}
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

              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="text-[13px] font-bold text-gray-800 mb-3">
                  토픽 : [{realtimeTopicTitle}]
                </div>
                <ul className="space-y-3 relative pl-3 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-200">
                  <li className="relative pl-3">
                    <span className="absolute -left-[11px] top-1.5 w-2 h-2 rounded-full bg-blue-600 border-2 border-white" />
                    <p className="text-[12px] font-semibold text-gray-800">이벤트 1. 정부안 발표</p>
                    <p className="text-[11px] text-gray-400">
                      2024.02.06 · 의대 2,000명 확대 공식화
                    </p>
                  </li>
                  <li className="relative pl-3">
                    <span className="absolute -left-[11px] top-1.5 w-2 h-2 rounded-full bg-blue-600 border-2 border-white" />
                    <p className="text-[12px] font-semibold text-gray-800">
                      이벤트 2. 전공의 집단 사직
                    </p>
                    <p className="text-[11px] text-gray-400">
                      2024.02.19 · 주요 대형병원 근무 중단
                    </p>
                  </li>
                  <li className="relative pl-3">
                    <span className="absolute -left-[11px] top-1.5 w-2 h-2 rounded-full bg-blue-600 border-2 border-white" />
                    <p className="text-[12px] font-semibold text-blue-600">
                      이벤트 3. 비상 진료체계 (현재)
                    </p>
                    <p className="text-[11px] text-blue-500 font-medium">2024.05 집중 보도 중</p>
                  </li>
                </ul>

                <Link
                  to={`/timeline/${realtimeTopicId}`}
                  className="mt-4 flex items-center justify-center text-[12px] text-gray-500 hover:text-gray-900 hover:font-bold transition-all pt-3 border-t border-gray-100"
                >
                  타임라인 전체보기 &gt;
                </Link>
              </div>
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
