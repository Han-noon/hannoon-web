import { getTopics } from '@/api/topic/getTopics';
import { subscribeTopic } from '@/api/topic/subscribeTopic';
import { unsubscribeTopic } from '@/api/topic/unsubscribeTopic';
import Pagination from '@/components/Pagination';
import ThemeCard from '@/components/ThemeCard';
import { useSearchStore } from '@/store/useSearchStore';
import type { Topics } from '@/types/timelineList';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';


const TimelineListPage = () => {
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [topicsData, setTopicsData] = useState<Topics | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(new Set());
  const navigate = useNavigate();
  const location = useLocation();

  const { search, keyword } = useSearchStore();
  const currentCategory = searchParams.get('category');

  useEffect(() => {
    setCurrentPage(1);
  }, [currentCategory]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getTopics(
          currentCategory === '전체' ? null : currentCategory,
          currentPage,
          keyword === '' ? null : keyword
        );
        setTopicsData(data);

        // 응답의 is_subscribed로 초기 북마크 상태 세팅
        const subscribedIds = new Set(
          data.topics.filter((topic) => topic.is_subscribed).map((topic) => topic.id)
        );
        setBookmarkedIds(subscribedIds);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEvent();

  }, [currentPage, currentCategory, search, location.key]);

  const handleBookmarkToggle = async (id: number) => {
    const isCurrentlyBookmarked = bookmarkedIds.has(id);


    // 낙관적 업데이트 (UI 먼저 반영)
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (isCurrentlyBookmarked) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

    try {
      if (isCurrentlyBookmarked) {
        await unsubscribeTopic(id);
      } else {
        await subscribeTopic(id);
      }
    } catch (error) {
      // 실패 시 롤백
      console.error('스크랩 처리 실패:', error);
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        if (isCurrentlyBookmarked) {
          next.add(id);
        } else {
          next.delete(id);
        }
        return next;
      });
    }
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
              <div key={topic.id} onClick={() => navigate(`/timeline/${topic.id}`)}>
                <ThemeCard
                  id={topic.id}
                  category={topic.category || '미분류'}
                  title={topic.title || '제목 없음'}
                  summary={topic.summary || ''}
                  firstReportDate={topic.created_at.slice(0, 10).replaceAll('-', '.') || ''}
                  latestReportDate={topic.updated_at.slice(0, 10).replaceAll('-', '.') || ''}
                  isBookmarked={bookmarkedIds.has(topic.id)}
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
