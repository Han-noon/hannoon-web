import type { EventSummary } from '@/types/eventSummary';
import { useState } from 'react';

const Meta = ({ event }: { event: EventSummary }) => {
  const [showToast, setShowToast] = useState(false);

  const handleAlertClick = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <>
      {showToast && (
        <div className="text-center w-3/4 md:w-auto text-sm md:text-base px-6 py-3 fixed bottom-10 left-1/2 -translate-x-1/2 bg-gray47 text-white rounded-full shadow-lg z-50 transition-opacity duration-300">
          실시간 알림 신청이 완료되었습니다!
        </div>
      )}

      {/* 상단 */}
      <div className="flex justify-between items-center border-b-4 border-gray47 pb-1 text-sm md:text-base">
        <p className="md:w-28">사건요약</p>
        <p className="text-base md:text-xl">{event.category}</p>
        <button className="" onClick={handleAlertClick}>
          <span className="hidden md:inline">실시간 알림 받기</span>
          <span className="md:hidden">알림받기</span>
        </button>
      </div>

      {/* 하단 */}
      <div className="min-h-32 md:h-48 lg:h-32 flex flex-wrap lg:flex-nowrap justify-between border-y-2 border-gray47 mt-2 text-xs">
        <div className="w-1/2 lg:min-w-72 lg:w-72 border-b-2 lg:border-b-0 border-r-2 border-gray47 flex items-center pl-3 md:pl-7 order-1 ">
          <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-slate-500"></div>
          <div className="ml-2 md:ml-4">
            <p className="text-gray-700">최초 보도</p>
            <p className="text-sm md:text-base">
              {event.created_at.slice(0, 10).replaceAll('-', '.')}
            </p>
          </div>
        </div>
        <div className="py-2 w-full lg:w-auto flex flex-col justify-center items-center order-3 lg:order-2">
          <p>[누락]</p>
          <h1 className="text-lg md:text-2xl font-bold md:pb-4 md:mt-1 text-center">
            {event.title}
          </h1>
        </div>
        <div
          className="w-1/2 lg:min-w-72 lg:w-72 border-b-2 lg:border-b-0 lg:border-l-2 border-gray47 flex items-center 
          justify-end pr-3 md:pr-7 gap-10 order-2 lg:order-3 py-1"
        >
          <div className="text-right">
            <p className="text-gray-700">
              최근 업데이트<span className="sm:hidden"> / 분석 기사 수</span>
            </p>
            <p className="text-sm md:text-base">
              {event.updated_at.slice(0, 10).replaceAll('-', '.')}
              <span className="sm:hidden"> / {event.article_count}</span>
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-gray-700">분석 기사 수</p>
            <p className="text-sm md:text-base">{event.article_count}개</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Meta;
