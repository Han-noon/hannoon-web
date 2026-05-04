import { EVENT_SUMMARY_DATA } from '@/data/EventSummaryData';
import Meta from '@/pages/event-summary/components/meta/Meta';
import Summary from '@/pages/event-summary/components/main/Summary';
import BiasInfo from '@/pages/event-summary/components/main/statistics/BiasInfo';
import TimelineSummaryInfo from '@/pages/event-summary/components/main/statistics/TimelineSummaryInfo';
import AbusingInfo from '@/pages/event-summary/components/main/statistics/AbusingInfo';
import ArticleCard from '@/pages/event-summary/components/article-list/ArticleCard';
import Pagination from '@/components/Pagination';
import { useState } from 'react';
import TimeFilteringBtn from '@/pages/event-summary/components/article-list/TimeFilteringBtn';
import BiasFilteringBtn from '@/pages/event-summary/components/article-list/BiasFilteringBtn';

const EventSummaryPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const dummy = EVENT_SUMMARY_DATA[0];

  return (
    <div className="w-full">
      <section className="border-b-4 border-gray47">
        {/* 메타 영역 */}
        <Meta />

        {/* 메인 */}
        <div className="flex border-b-2 border-gray47 mb-2">
          {/* 왼쪽-기사 요약 */}
          <Summary />

          {/* 오른쪽-요약 관련 통계 */}
          <article className="w-4/12 px-6 pt-6">
            {/* 언론사 편향 지수 */}
            <BiasInfo {...dummy.bias_index} />

            {/* 타임라인 미리보기 */}
            <TimelineSummaryInfo
              topic={dummy.timeline_info.topic}
              timeline_summary={dummy.timeline_info.timeline_summary}
            />

            {/* 어뷰징 기사 통계 */}
            <AbusingInfo total={dummy.abusing_info.total} abusing={dummy.abusing_info.abusing} />
          </article>
        </div>
      </section>

      {/* 요약에 사용된 기사 리스트 */}
      <section className="my-16">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">요약에 사용된 기사 리스트</h1>
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
