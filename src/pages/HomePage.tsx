import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import NewsCard from '@/components/NewsCard';
import Pagination from '@/components/Pagination';
import { THEME_CONFIG } from '@/components/Topic';
import { getEvents } from '@/api/event/getEvents';
import type { EventItem } from '@/types/eventCard';

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
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>(() => {
    const saved = localStorage.getItem('scrappedNewsIds');
    return saved ? JSON.parse(saved) : [];
  });
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);

  const [briefingData, setBriefingData] = useState<EventItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || '전체';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleBookmarkToggle = (newsId: number) => {
    const isCurrentlyScrapped = bookmarkedIds.includes(newsId);
    if (!isCurrentlyScrapped) {
      const updated = [...bookmarkedIds, newsId];
      setBookmarkedIds(updated);
      localStorage.setItem('scrappedNewsIds', JSON.stringify(updated));
    } else {
      const updated = bookmarkedIds.filter((id) => id !== newsId);
      setBookmarkedIds(updated);
      localStorage.setItem('scrappedNewsIds', JSON.stringify(updated));
    }
  };

  useEffect(() => {
    const fetchBriefings = async () => {
      setIsLoading(true);
      try {
        const categoryParam = selectedCategory === '전체' ? undefined : selectedCategory;
        const response: any = await getEvents(currentPage, 9, categoryParam);
        console.log('받아온 API 데이터:', response);

        if (response && response.events) {
          const dataWithUniqueIds = response.events.map((item: any, index: number) => ({
            ...item,
            id: item.id || 1000 + currentPage * 100 + index,
          }));
          setBriefingData(dataWithUniqueIds);
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
  }, [currentPage, selectedCategory]);

  return (
    <div className="w-full pb-20">
      <div className="max-w-[880px] mx-auto px-6 pt-10">
        <section className="grid grid-cols-2 gap-x-4 mb-14">
          <NewsCard
            id={100}
            themeId={1}
            category={THEME_CONFIG[1]?.topic}
            title={THEME_CONFIG[1]?.title}
            summary={THEME_CONFIG[1]?.summary}
            date="2026.10.10"
            variant="long"
            isBookmarked={bookmarkedIds.includes(100)}
            onBookmarkToggle={handleBookmarkToggle}
          />
          <NewsCard
            id={101}
            themeId={2}
            category={THEME_CONFIG[2]?.topic}
            title={THEME_CONFIG[2]?.title}
            summary={THEME_CONFIG[2]?.summary}
            date="2026.10.10"
            variant="long"
            isBookmarked={bookmarkedIds.includes(101)}
            onBookmarkToggle={handleBookmarkToggle}
          />
        </section>

        <section className="mb-8 flex items-start gap-4">
          <h2 className="text-[24px] font-bold text-black tracking-tight leading-none shrink-0">
            이슈 브리핑
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
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6">
            {briefingData.length > 0 ? (
              briefingData.map((news) => (
                <NewsCard
                  key={news.id}
                  id={news.id}
                  themeId={news.eventId}
                  category={news.category || '미분류'}
                  title={news.title || '제목 없음'}
                  summary={news.summary || ''}
                  date={news.date}
                  isBookmarked={bookmarkedIds.includes(news.id)}
                  onBookmarkToggle={handleBookmarkToggle}
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
