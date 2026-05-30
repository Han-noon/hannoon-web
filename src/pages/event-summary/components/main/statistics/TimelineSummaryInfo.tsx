import ShortcutButton from '@/components/ShortcutButton';
import type { EventSummary } from '@/types/eventSummary';
import { useNavigate } from 'react-router-dom';

const TimelineSummaryInfo = ({ event }: { event: EventSummary }) => {
  const textStyle = (title: string | null) => `
  text-gray-600 truncate hover:cursor-pointer
  ${title === null ? 'hover:cursor-default' : 'underline underline-offset-4 hover:text-blue-500'}`;

  const navigate = useNavigate();
  function handleNavigate(eventId: number | null) {
    if (!eventId) return;
    console.log('id: ', eventId);
    navigate(`/event-detail/${eventId}`);
  }

  return (
    <section className="w-full">
      <p className="border-y border-gray47 py-3 text-center">타임라인</p>
      <div className="my-8 text-center">
        <p className="mb-6">소속 토픽: {event.topic_title}</p>
        <div className="md:min-w-[331px] flex h-36 text-sm relative px-2">
          <p className="absolute left-1/2 -translate-x-[55%] top-[13px] text-xs text-gray-400">●</p>
          <p className="absolute left-1/2 -translate-x-[55%] top-[63px] text-xs">●</p>
          <p className="absolute left-1/2 -translate-x-[55%] bottom-[13px] text-xs text-gray-400">
            ●
          </p>
          <div className="w-1/2 h-full border-r-2 border-gray-400 flex flex-col justify-between py-3 pr-4 text-right">
            <p
              onClick={() => handleNavigate(event.prev_event_id)}
              className={textStyle(event.prev_event_title)}
            >
              {event.prev_event_title === null ? '정보없음' : event.prev_event_title}
            </p>
            <p
              onClick={() => handleNavigate(event.next_event_id)}
              className={textStyle(event.next_event_title)}
            >
              {event.next_event_title === null ? '정보없음' : event.next_event_title}
            </p>
          </div>
          <div className="w-1/2 h-full flex items-center pl-4">
            <p className="truncate">{event.event_title}</p>
          </div>
        </div>
      </div>
      {/*토픽 아이디로 바꿔야 함!*/}
      <ShortcutButton path={`/timeline/${event.topic_id}`} name="전체 타임라인 보기" />
    </section>
  );
};

export default TimelineSummaryInfo;
