import Meta from '@/pages/event-summary/components/meta/Meta';
import Summary from '@/pages/event-summary/components/main/Summary';
import BiasInfo from '@/pages/event-summary/components/main/statistics/BiasInfo';
import TimelineSummaryInfo from '@/pages/event-summary/components/main/statistics/TimelineSummaryInfo';
import AbusingInfo from '@/pages/event-summary/components/main/statistics/AbusingInfo';
import ArticleCard from '@/pages/event-summary/components/article-list/ArticleCard';
import Pagination from '@/components/Pagination';
import TimeFilteringBtn from '@/pages/event-summary/components/article-list/TimeFilteringBtn';
import BiasFilteringBtn from '@/pages/event-summary/components/article-list/BiasFilteringBtn';
import { useState, useEffect } from 'react';
import { getEvent } from '@/api/event/getEvent';
import type { EventSummary } from '@/types/eventSummary';

const EventSummaryPage = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const [event, setEvent] = useState<EventSummary | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEvent(1); // 임시: event_id = 1
        setEvent(data);
        console.log(event);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEvent();
  }, []);

  return (
    <div className="w-full">
      <section className="border-b-4 border-gray47">
        {/* 메타 영역 */}
        {event && <Meta event={event} />}

        {/* 메인 */}
        <div className="flex flex-col md:flex-row border-b-2 border-gray47 mb-2">
          {/* 왼쪽-기사 요약 */}
          {event && <Summary event={event} />}

          {/* 오른쪽-요약 관련 통계 */}
          <article className="px-3 pt-3 lg:px-6 lg:pt-6">
            {/* 언론사 편향 지수 */}
            {event && <BiasInfo event={event} />}

            {/* 타임라인 미리보기 */}
            {event && <TimelineSummaryInfo event={event} />}

            {/* 어뷰징 기사 통계 */}
            {event && <AbusingInfo event={event} />}
          </article>
        </div>
      </section>

      {/* 요약에 사용된 기사 리스트 */}
      <section className="my-16">
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <h1 className="text-lg md:text-2xl font-bold mb-3 md:mb-0">요약에 사용된 기사 리스트</h1>
          <div className="text-sm flex gap-2">
            <BiasFilteringBtn />
            <TimeFilteringBtn />
          </div>
        </div>
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
        <Pagination currentPage={currentPage} totalPages={3} onPageChange={setCurrentPage} />
      </section>
    </div>
  );
};

export default EventSummaryPage;
