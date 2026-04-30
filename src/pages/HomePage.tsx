import React, { useState, useEffect } from 'react';
import NewsCard from '@/components/NewsCard';
import Pagination from '@/components/Pagination';

const HomePage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);
  const totalPages = 68;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleBookmarkToggle = (id: number) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const longSummary =
    '보건복지부는 지방 의료 인력 확충 및 의료 수급 불균형 해소를 위해 대학별 정원 배정 위원회를 가동하여 인원을 확정한다고 발표했습니다. 이번 개혁안은 단순한 인원 증원을 넘어, 필수 의료 분야의 안정적인 인력 공급과 지역 간 의료 격차를 실질적으로 줄이기 위한 다각적인 정책적 지원을 포함하고 있으며, 향후 10년간의 의료 시스템 체질 개선을 목표로 하고 있습니다.';

  const longData = [
    {
      id: 100,
      category: '의료 개혁',
      title: `${currentPage}P 긴 카드 1`,
      summary: longSummary,
      date: '2026.10.10',
    },
    {
      id: 101,
      category: '의료 개혁',
      title: `${currentPage}P 긴 카드 2`,
      summary: longSummary,
      date: '2026.10.10',
    },
  ];

  const briefingData = Array(9)
    .fill(null)
    .map((_, i) => ({
      id: currentPage * 10 + i,
      category: '의료 개혁',
      title: `${currentPage}P 뉴스 ${i + 1}`,
      summary: longSummary,
      date: '2026.10.10',
    }));

  return (
    <div className="w-full pb-20">
      <div className="max-w-[880px] mx-auto px-6 pt-10">
        <section className="grid grid-cols-2 gap-x-4 mb-14">
          {longData.map((news) => (
            <NewsCard
              key={news.id}
              {...news}
              variant="long"
              isBookmarked={bookmarkedIds.includes(news.id)}
              onBookmarkToggle={handleBookmarkToggle}
            />
          ))}
        </section>

        {/* 이슈 브리핑 헤더 */}
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

        {/* 뉴스 카드 그리드 */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6">
          {briefingData.map((news) => (
            <NewsCard
              key={news.id}
              {...news}
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
    </div>
  );
};

export default HomePage;
