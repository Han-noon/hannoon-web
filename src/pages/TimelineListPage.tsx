import { getTopics } from '@/api/topic/getTopics';
import Pagination from '@/components/Pagination';
import ThemeCard from '@/components/ThemeCard';
import type { Topics } from '@/types/timelineList';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TimelineListPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [topicsData, setTopicsData] = useState<Topics | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getTopics(currentPage);
        setTopicsData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEvent();
  }, [currentPage]);

  const handleBookmarkToggle = (id: number) => {
    // TODO: API 요청을 보내거나, 로컬 state를 변경하는 로직
    console.log(`토픽 ID ${id}의 북마크 상태를 토글합니다.`);
  };

  return (
    <div className="w-full pb-20">
      <div className="max-w-[880px] mx-auto px-6 pt-10">
        <section className="mb-8 flex items-start gap-4">
          <h2 className="text-[24px] font-bold text-black tracking-tight leading-none shrink-0">
            타임라인으로 보는 사건
          </h2>
          <div className="flex-grow pt-[12px]">
            <div className="h-[1px] bg-[#D7D7D7] opacity-50 w-full"></div>
            <p className="text-[12px] text-gray-400 font-light mt-1.5">
              흩어진 사건을 하나의 흐름으로 본다
            </p>
          </div>
        </section>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6">
          {topicsData &&
            topicsData?.topics.map((topic) => (
              <div onClick={() => navigate(`/timeline/${topic.id}`)}>
                <ThemeCard
                  key={topic.id}
                  id={topic.id}
                  category={topic.category || '미분류'}
                  title={topic.title || '제목 없음'}
                  summary={topic.summary || ''}
                  firstReportDate={topic.created_at.slice(0, 10).replaceAll('-', '.') || ''}
                  latestReportDate={topic.updated_at.slice(0, 10).replaceAll('-', '.') || ''}
                  isBookmarked={false}
                  onBookmarkToggle={handleBookmarkToggle}
                />
              </div>
            ))}
        </section>
        <Pagination
          currentPage={currentPage}
          totalPages={topicsData?.total_pages || 1}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default TimelineListPage;
