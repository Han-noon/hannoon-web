import ShortcutButton from '@/components/ShortcutButton';
import { CircularProgressChart } from '@/pages/event-summary/components/CircularProgressChart';
import type { EventSummary } from '@/types/eventSummary';

const AbusingInfo = ({ event }: { event: EventSummary }) => {
  return (
    <section className="w-full">
      <p className="border-y border-gray47 py-3 text-center">어뷰징 기사</p>
      <div className="flex flex-col items-center mt-5">
        <p className="text-sm">
          총 {event.article_count}건의 기사에서 {event.abusing_count}건의 어뷰징 기사를 탐지
        </p>
        <div className="w-2/5 min-w-28 max-w-40 md:w-[135px] lg:w-40 m-5 relative">
          <CircularProgressChart total={event.article_count} abusing={event.abusing_count} />
          <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl">
            {event.abusing_count}개
          </p>
        </div>
      </div>
      <ShortcutButton path="/abusing" name="관련 어뷰징 기사 보기" />
    </section>
  );
};

export default AbusingInfo;
