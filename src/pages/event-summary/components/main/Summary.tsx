import img from '@/assets/back1.jpg';
import type { EventSummary } from '@/types/eventSummary';

const Summary = ({ event }: { event: EventSummary }) => {
  return (
    <article className="md:w-8/12 md:border-r-2 border-gray47 flex flex-col items-center py-8">
      <div className="w-4/5 lg:w-3/5 mb-5">
        {event.event_image_url ? (
          <img src={event.event_image_url} alt="이벤트 이미지" />
        ) : (
          <>
            <img src={img} alt="임시이미지" />
            <img src={img} alt="임시이미지" />
            <img src={img} alt="임시이미지" />
          </>
        )}
      </div>
      <div className="w-full px-2 lg:px-16 text-base/8">{event.summary}</div>
    </article>
  );
};

export default Summary;
