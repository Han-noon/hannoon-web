import Meta from '@/pages/event-summary/components/meta/Meta';
import Summary from '@/pages/event-summary/components/main/Summary';
import BiasInfo from '@/pages/event-summary/components/main/statistics/BiasInfo';
import TimelineSummaryInfo from '@/pages/event-summary/components/main/statistics/TimelineSummaryInfo';
import AbusingInfo from '@/pages/event-summary/components/main/statistics/AbusingInfo';
import { useState, useEffect } from 'react';
import { getEvent } from '@/api/event/getEvent';
import type { EventSummary } from '@/types/eventSummary';
import { useParams } from 'react-router-dom';
import ArticleList from '@/pages/event-summary/components/article-list/ArticleList';
import Spinner from '@/components/Spinner';

const EventSummaryPage = () => {
  const [event, setEvent] = useState<EventSummary | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEvent(Number(id) || 1); // 임시: event_id = 1
        setEvent(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEvent();

    //스크롤바 위로 올리기
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [id]);

  return (
    <div className="w-full">
      {!event ? (
        <div className="mt-44 md:my-44 text-center">
          <Spinner />
        </div>
      ) : (
        <>
          <section className="border-b-4 border-gray47">
            {/* 메타 영역 */}
            {event && <Meta event={event} />}

            {/* 메인 */}
            <div className="flex flex-col md:flex-row border-b-2 border-gray47 mb-2">
              {/* 왼쪽-기사 요약 */}
              {event && <Summary event={event} />}

              {/* 오른쪽-요약 관련 통계 */}
              <article className="min-w-0 px-3 pt-3 lg:px-6 lg:pt-6 lg:w-4/12">
                {/* 언론사 편향 지수 */}
                {event && <BiasInfo event={event} />}

                {/* 타임라인 미리보기 */}
                {event && <TimelineSummaryInfo event={event} />}

                {/* 어뷰징 기사 통계 */}
                {event && <AbusingInfo event={event} />}
              </article>
            </div>
          </section>

          {/* 요약에 사용된 기사 리스트 - api 별도 요청 */}
          <section className="my-16">
            <ArticleList />
          </section>
        </>
      )}
    </div>
  );
};

export default EventSummaryPage;
