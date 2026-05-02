import React, { useState, useEffect } from 'react';
import NewsCard from '@/components/NewsCard';
import Pagination from '@/components/Pagination';
import { THEME_CONFIG } from '@/components/Topic';

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
  const totalPages = 68;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const getThemeIdByNewsId = (newsId: number) => {
    if (newsId === 100) return 1;
    if (newsId === 101) return 2;
    if (newsId >= 200) return ((newsId - 200) % 3) + 1;
    return 1;
  };

  const handleBookmarkToggle = (newsId: number) => {
    const themeId = getThemeIdByNewsId(newsId);
    const isCurrentlyScrapped = bookmarkedIds.includes(newsId);

    if (!isCurrentlyScrapped) {
      const hasSameThemeScrapped = bookmarkedIds.some((id) => getThemeIdByNewsId(id) === themeId);
      if (hasSameThemeScrapped) {
        setIsDuplicateModalOpen(true);
      }
      const updated = [...bookmarkedIds, newsId];
      setBookmarkedIds(updated);
      localStorage.setItem('scrappedNewsIds', JSON.stringify(updated));
    } else {
      const updated = bookmarkedIds.filter((id) => id !== newsId);
      setBookmarkedIds(updated);
      localStorage.setItem('scrappedNewsIds', JSON.stringify(updated));
    }
  };

  const briefingData = Array(9)
    .fill(null)
    .map((_, i) => {
      const newsId = currentPage * 10 + i + 200;
      const themeId = getThemeIdByNewsId(newsId);
      return { id: newsId, themeId, date: '2026.10.10' };
    });

  return (
    <div className="w-full pb-20">
      <div className="max-w-[880px] mx-auto px-6 pt-10">
        <section className="grid grid-cols-2 gap-x-4 mb-14">
          <NewsCard
            id={100}
            themeId={1}
            category={THEME_CONFIG[1].topic}
            title={THEME_CONFIG[1].title}
            summary={THEME_CONFIG[1].summary}
            date="2026.10.10"
            variant="long"
            isBookmarked={bookmarkedIds.includes(100)}
            onBookmarkToggle={handleBookmarkToggle}
          />
          <NewsCard
            id={101}
            themeId={2}
            category={THEME_CONFIG[2].topic}
            title={THEME_CONFIG[2].title}
            summary={THEME_CONFIG[2].summary}
            date="2026.10.10"
            variant="long"
            isBookmarked={bookmarkedIds.includes(101)}
            onBookmarkToggle={handleBookmarkToggle}
          />
        </section>

        {/* ⭐️ [Restoration] 이슈 브리핑 섹션 문구 및 디자인 복구 */}
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

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6">
          {briefingData.map((news) => (
            <NewsCard
              key={news.id}
              id={news.id}
              themeId={news.themeId}
              category={THEME_CONFIG[news.themeId].topic}
              title={THEME_CONFIG[news.themeId].title}
              summary={THEME_CONFIG[news.themeId].summary}
              date={news.date}
              isBookmarked={bookmarkedIds.includes(news.id)}
              onBookmarkToggle={handleBookmarkToggle}
            />
          ))}
        </section>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
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
