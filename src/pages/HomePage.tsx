import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import NewsCard from '@/components/NewsCard';
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
          <p className="text-[12px] text-gray-400 leading-relaxed font-light break-keep px-1">
            {message}
          </p>
        </div>
        <div className="flex border-t border-gray-50 h-[44px]">
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
  // const [bookmarkedIds, setBookmarkedIds] = useState<number[]>(() => {
  //   const saved = localStorage.getItem('scrappedNewsIds');
  //   return saved ? JSON.parse(saved) : [];
  // });
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);

  // 💡 상단 카드 로직 주석 처리에 따라 브리핑 데이터 상태만 사용
  const [briefingData, setBriefingData] = useState<EventItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || '전체';

  useEffect(() => {
    window.scrollTo({ top: 200, behavior: 'smooth' });
  }, [currentPage]);

  // 관련 코드 NewsCard 컴포넌트로 이동
  // const handleBookmarkToggle = async (newsId: number) => {
  //   const isCurrentlyScrapped = bookmarkedIds.includes(newsId);
  //   if (!isCurrentlyScrapped) {
  //     const updated = [...bookmarkedIds, newsId];
  //     setBookmarkedIds(updated);
  //     localStorage.setItem('scrappedNewsIds', JSON.stringify(updated));
  //   } else {
  //     const updated = bookmarkedIds.filter((id) => id !== newsId);
  //     setBookmarkedIds(updated);
  //     localStorage.setItem('scrappedNewsIds', JSON.stringify(updated));
  //   }
  // };

  const handleSubscribeToggle = (targetThemeId: number, nextState: boolean) => {
    setBriefingData((prevData) =>
      prevData.map((news) =>
        news.topic_id === targetThemeId
          ? { ...news, is_subscribed: nextState } // 토픽 ID가 같으면 스크랩 여부 변경
          : news
      )
    );
  };

  const { keyword, search } = useSearchStore();

  useEffect(() => {
    const fetchBriefings = async () => {
      setIsLoading(true);
      try {
        const categoryParam = selectedCategory === '전체' ? undefined : selectedCategory;

        // 💡 상단 긴 카드를 제외했으므로, 1페이지 여부와 상관없이 무조건 9개씩 가져오도록 원복
        const response: any = await getEvents(currentPage, 9, keyword, categoryParam);

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

  return (
    <div className="w-full pb-20">
      <div className="max-w-[880px] mx-auto px-6 pt-10">
        {/* 
          💡 [다음 학기 고도화 예정] 상단 주요 카드 2개 영역
          - 추후 스크랩순, 관리자 지정 등의 기준으로 2개를 동적으로 띄울 예정 
          - 하단 이슈 브리핑과 별도로 API에서 데이터를 분리하여 매핑할 것
        */}
        {/* <section className="grid grid-cols-2 gap-x-4 mb-14">
          <div>
            <NewsCard
              id={100}
              themeId={1}
              category="정치"
              title="상단 고정 카드 1 (예시)"
              summary="다음 학기에 추가될 동적 상단 카드 내용입니다."
              date="2026.10.10"
              variant="long"
              isBookmarked={false}
              onBookmarkToggle={() => {}}
            />
          </div>
          <div>
            <NewsCard
              id={101}
              themeId={2}
              category="경제"
              title="상단 고정 카드 2 (예시)"
              summary="다음 학기에 추가될 동적 상단 카드 내용입니다."
              date="2026.10.10"
              variant="long"
              isBookmarked={false}
              onBookmarkToggle={() => {}}
            />
          </div>
        </section> */}

        <section className="mb-8 flex items-start gap-4">
          <h2 className="text-4xl font-bold text-black tracking-tight leading-none shrink-0">
            이슈
          </h2>
          <div className="flex-grow pt-[12px]">
            <div className="h-[1px] bg-[#D7D7D7] opacity-50 w-full"></div>
            <p className="text-[12px] text-gray-400 font-light mt-1.5">
              방대한 데이터 속에서 정제된 분석과 통찰을 제공합니다.
            </p>
          </div>
        </section>

        {isLoading ? (
          <div className="w-full h-[300px] flex items-center justify-center text-gray-500">
            데이터를 불러오는 중...
          </div>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-2 gap-y-6">
            {briefingData.length > 0 ? (
              briefingData.map((news) => (
                <NewsCard
                  key={news.event_id}
                  id={news.event_id}
                  themeId={news.topic_id}
                  topic={news.topic_title || '미분류'}
                  title={news.event_title || '제목 없음'}
                  summary={news.summary || ''}
                  date={news.created_at ? news.created_at.slice(0, 10).replaceAll('-', '.') : ''}
                  isBookmarked={news.is_subscribed}
                  onSubscribeToggle={handleSubscribeToggle}
                  //onBookmarkToggle={handleBookmarkToggle}
                />
              ))
            ) : (
              <div className="col-span-full py-16 text-center text-gray-400 text-[14px]">
                해당 카테고리의 사건이 없습니다.
              </div>
            )}
          </section>
        )}

        {briefingData.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
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
