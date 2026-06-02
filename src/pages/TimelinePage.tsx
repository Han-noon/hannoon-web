import { useState, useEffect, useRef } from 'react';
import { getEventsByTopic } from '@/api/event/getEventsByTopic';
import { Link, useParams } from 'react-router-dom';
import type { EventResponse } from '@/types/timeline';

const TimelinePage = () => {
  const [showToast, setShowToast] = useState(false);
  const [isAscending, setIsAscending] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [eventsdata, setEventsdata] = useState<EventResponse | null>(null);
  const articleRef = useRef<HTMLElement>(null);

  const { topic_id } = useParams();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEventsByTopic({
          p_cursor_id: null,
          p_order: isAscending ? 'asc' : 'desc',
          p_size: 20,
          p_topic_id: Number(topic_id) || 1,
        });

        setEventsdata(data);
        console.log('결과:', data);
      } catch (error) {
        console.error('데이터 페칭 실패:', error);
      }
    };

    fetchEvents();
  }, [topic_id, isAscending]);

  const handleAlertClick = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const toggleSortOrder = () => {
    setIsAscending((prev) => !prev);
  };

  const activeItem =
    eventsdata?.events.find((item) => item.id === selectedId) || eventsdata?.events[0];

  return (
    <main className="w-full max-w-[1300px] mx-auto bg-white min-h-screen text-black pb-20 relative font-sans">
      {showToast && (
        <div className="text-center w-3/4 md:w-auto text-sm md:text-base px-6 py-3 fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#474747] text-white rounded-full shadow-lg z-50 transition-opacity duration-300">
          실시간 알림 신청이 완료되었습니다!
        </div>
      )}

      <div className="px-6 md:px-12 pt-8 md:pt-10">
        <div className="grid grid-cols-3 items-end pb-2">
          <div className="text-left">
            <p className="text-base md:text-lg font-medium tracking-wider text-[#333]">TIMELINE</p>
          </div>
          <div className="text-center">
            <p className="text-base md:text-lg font-medium text-[#333]">정치</p>
          </div>
          <div className="text-right">
            <button
              className="text-sm md:text-base font-medium text-[#555] hover:text-black transition-colors"
              onClick={handleAlertClick}
            >
              <span className="hidden md:inline">실시간 알림받기</span>
              <span className="md:hidden">알림받기</span>
            </button>
          </div>
        </div>
        <div className="border-b-[4px] border-[#222]"></div>
        <div className="border-b-[1px] border-[#222] mt-[3px]"></div>
      </div>

      <h1 className="text-center text-[28px] md:text-[32px] font-bold mt-10 md:mt-12 mb-8 md:mb-10 tracking-tight">
        12·3 비상계엄 사태
      </h1>

      <div className="px-6 md:px-12 mb-5">
        <button
          onClick={toggleSortOrder}
          className="flex items-center gap-1.5 bg-[#d9d9d9] px-3.5 py-1.5 border border-[#c4c4c4] rounded-sm shadow-sm hover:bg-[#d0d0d0] transition-colors inline-flex"
        >
          <div className="flex flex-col gap-[3px] text-[#222]">
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={!isAscending ? 'rotate-180 transition-transform' : 'transition-transform'}
            >
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={!isAscending ? 'rotate-180 transition-transform' : 'transition-transform'}
            >
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </div>
          <span className="text-sm tracking-[1.5px] font-medium mt-0.5">
            {isAscending ? '과거순' : '최신순'}
          </span>
        </button>
      </div>

      <div className="w-full border-t border-[#a0a0a0] mb-10 md:mb-12"></div>

      <section className="flex flex-col lg:flex-row px-6 md:px-12 gap-12 lg:gap-10">
        <div className="w-full lg:w-[32%] relative pl-2 lg:pl-4">
          <div className="absolute left-[19px] lg:left-[27px] top-[14px] bottom-[14px] w-[2px] bg-[#474747] z-0"></div>
          <ul className="flex flex-col gap-8 md:gap-14 relative z-10 m-0 p-0 list-none">
            {eventsdata?.events.map((item) => {
              const isActive = item.id === selectedId;
              return (
                <li key={item.id} className="flex items-start gap-4 md:gap-5 w-full">
                  <div className="relative w-6 h-6 flex-shrink-0 flex items-center justify-center bg-white z-10 mt-[3px]">
                    <div className="w-2.5 h-2.5 bg-[#474747] rounded-full"></div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedId(item.id);
                      if (window.innerWidth < 1024) {
                        articleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className={`text-left break-words w-full transition-colors mt-[3px] ${
                      isActive
                        ? 'font-bold text-black'
                        : 'font-medium text-gray-700 hover:text-black'
                    }`}
                  >
                    <span className="text-[17px] md:text-[20px] leading-tight block">
                      {item.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <article ref={articleRef} className="w-full lg:w-[68%] flex flex-col lg:pr-12 min-w-0">
          <img
            src={activeItem?.event_image_url ?? undefined}
            alt={activeItem?.title}
            className="w-full aspect-video object-cover rounded-sm mb-8 md:mb-10 bg-[#ccc] shadow-sm transition-opacity duration-300"
          />
          <div className="text-base md:text-[18px] leading-relaxed md:leading-[32px] text-[#222] mb-12 font-medium w-full">
            <p>{activeItem?.summary}</p>
          </div>
          <div className="flex justify-end mt-auto">
            <Link
              to={`/event-detail/${activeItem?.id}`}
              className="text-base md:text-lg font-bold text-gray-800 hover:text-gray-500 transition-colors flex items-center gap-1.5"
            >
              통계자료 같이 보기{' '}
              <span aria-hidden="true" className="font-normal">
                →
              </span>
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
};

export default TimelinePage;
