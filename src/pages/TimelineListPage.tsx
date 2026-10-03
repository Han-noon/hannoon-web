import Pagination from '@/components/Pagination';
import ThemeCard from '@/components/ThemeCard';
import { useSearchStore } from '@/store/useSearchStore';
import type { Topics } from '@/types/timelineList';
import { useEffect, useState } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const TimelineListPage = () => {
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [topicsData, setTopicsData] = useState<Topics | null>(null);
  //const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(new Set());
  const location = useLocation();

  const { search, keyword } = useSearchStore();
  const currentCategory = searchParams.get('category');

  useEffect(() => {
    setCurrentPage(1);
  }, [currentCategory]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const categoryParam = currentCategory === '전체' ? null : currentCategory;
        const searchParam = keyword === '' ? null : keyword;

        const { data, error } = await supabase.rpc('get_topics', {
          p_category: categoryParam,
          p_order: 'latest',
          p_page: currentPage,
          p_search: searchParam,
          p_size: 9,
        });

        if (!error && data) {
          setTopicsData(data);
        } else {
          setTopicsData(null);
          if (error) console.error('Supabase RPC get_topics Error:', error);
        }

        // // 응답의 is_subscribed로 초기 북마크 상태 세팅
        // const subscribedIds = new Set(
        //   data.topics.filter((topic) => topic.is_subscribed).map((topic) => topic.id)
        // );
        // setBookmarkedIds(subscribedIds);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEvent();

    window.scrollTo({
      top: 200,
      behavior: 'smooth',
    });
  }, [currentPage, currentCategory, search, location.key, keyword]);

  // const handleBookmarkToggle = async (id: number) => {
  //   const isCurrentlyBookmarked = bookmarkedIds.has(id);

  //   // 낙관적 업데이트 (UI 먼저 반영)
  //   setBookmarkedIds((prev) => {
  //     const next = new Set(prev);
  //     if (isCurrentlyBookmarked) {
  //       next.delete(id);
  //     } else {
  //       next.add(id);
  //     }
  //     return next;
  //   });

  //   try {
  //     if (isCurrentlyBookmarked) {
  //       await unsubscribeTopic(id);
  //     } else {
  //       await subscribeTopic(id);
  //     }
  //   } catch (error) {
  //     // 실패 시 롤백
  //     console.error('스크랩 처리 실패:', error);
  //     setBookmarkedIds((prev) => {
  //       const next = new Set(prev);
  //       if (isCurrentlyBookmarked) {
  //         next.add(id);
  //       } else {
  //         next.delete(id);
  //       }
  //       return next;
  //     });
  //   }
  // };

  return (
    <div className="w-full pb-20">
      <div className="max-w-[1200px] mx-auto px-6 pt-10">
        <section className="mb-8 flex items-start gap-4">
          <h2 className="text-4xl font-bold text-[#2f2b2d]tracking-tight leading-none shrink-0">
            토픽
          </h2>
          <div className="flex-grow pt-[12px]">
            <div className="h-[1px] bg-[#D7D7D7] opacity-50 w-full"></div>
            <p className="text-[12px] text-gray-400 font-light mt-1.5">
              흩어진 사건을 하나의 흐름으로 본다
            </p>
          </div>
        </section>

        {/* 토픽 카드 그리드 또는 빈 상태 안내 문구 렌더링 */}
        {topicsData && topicsData.topics && topicsData.topics.length > 0 ? (
          <>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {topicsData.topics.map((topic: any) => (
                <ThemeCard
                  key={topic.id}
                  id={topic.id}
                  category={topic.category || '미분류'}
                  keyword={
                    topic.keywords && topic.keywords.length > 0 ? topic.keywords[0] : '주요이슈'
                  }
                  title={topic.title || '제목 없음'}
                  summary={topic.summary || ''}
                  firstReportDate={topic.first_published_at || topic.created_at || ''}
                  latestReportDate={
                    topic.updated_at ? topic.updated_at.slice(0, 10).replaceAll('-', '.') : ''
                  }
                  isBookmarked={topic.is_subscribed}
                  articleCount={topic.article_count ?? 0}
                  bias={{
                    left: topic.left_percent ?? 18,
                    center: topic.mid_percent ?? 60,
                    right: topic.right_percent ?? 22,
                  }}
                  imageUrl={topic.topic_image_url}
                />
              ))}
            </section>
            <Pagination
              currentPage={currentPage}
              totalPages={topicsData?.total_pages || 1}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          /* 👇 해당하는 토픽이 없을 때 보여줄 빈 상태(Empty State) UI */
          <div className="flex flex-col items-center justify-center py-28 text-center w-full">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3.5 border border-gray-100 shadow-sm">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <p className="text-[14px] text-gray-400 font-light">해당하는 토픽이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineListPage;
