import ShortcutButton from '@/components/ShortcutButton';
import type { EventSummary } from '@/types/eventSummary';
import { Link } from 'react-router-dom';

const TimelineSummaryInfo = ({ event }: { event: EventSummary }) => {
  const textStyle = (title: string | null) => `
  text-gray-600 truncate 
  ${title === null ? '' : 'underline underline-offset-4 hover:text-black'}
`;

  return (
    <section className="w-full">
      <p className="border-y border-gray47 py-3 text-center">타임라인</p>
      <div className="my-8 text-center">
        <p className="mb-6">소속 토픽: 누락</p>
        <div className="md:min-w-[331px] flex h-36 text-sm relative px-2">
          <p className="absolute left-1/2 -translate-x-[55%] top-[13px] text-xs text-gray-400">●</p>
          <p className="absolute left-1/2 -translate-x-[55%] top-[63px] text-xs">●</p>
          <p className="absolute left-1/2 -translate-x-[55%] bottom-[13px] text-xs text-gray-400">
            ●
          </p>
          <div className="w-1/2 h-full border-r-2 border-gray-400 flex flex-col justify-between py-3 pr-4 text-right">
            <Link to="#">
              <p className={textStyle(event.prev_event)}>
                {event.prev_event === null ? '정보없음' : event.prev_event}
              </p>
            </Link>
            <Link to="#">
              <p className={textStyle(event.next_event)}>
                {event.next_event === null ? '정보없음' : event.next_event}
              </p>
            </Link>
          </div>
          <div className="w-1/2 h-full flex items-center pl-4">
            <p className="truncate">{event.title}</p>
          </div>
        </div>
      </div>
      <ShortcutButton path="/timeline" name="전체 타임라인 보기" />
    </section>
  );
};

export default TimelineSummaryInfo;
