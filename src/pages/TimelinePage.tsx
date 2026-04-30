import React, { useState } from 'react';
import { TimelineData } from '../data/TimelineData';

export default function TimelinePage() {
  const [isAsc, setIsAsc] = useState(true);
  const [showToast, setShowToast] = useState(false);

  const sortedData = isAsc ? [...TimelineData] : [...TimelineData].reverse();

  const handleAlertClick = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans pb-24">
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#474747] text-white px-6 py-3 rounded-full shadow-lg z-50 transition-opacity duration-300">
          실시간 알림 신청이 완료되었습니다!
        </div>
      )}

      <div className="max-w-[1300px] mx-auto px-4 sm:px-8 pt-12">
        <div className="flex justify-between items-end mb-4 relative">
          <div className="text-black text-xl md:text-2xl font-bold tracking-widest uppercase">
            Timeline
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 text-black text-xl md:text-2xl font-bold">
            정치
          </div>
          <button
            onClick={handleAlertClick}
            className="text-black text-sm md:text-lg font-medium hover:font-bold transition-all focus:outline-none"
          >
            실시간 알림받기
          </button>
        </div>

        <div className="w-full h-1 bg-[#474747] mb-[20px]"></div>
        <div className="w-full h-[2px] bg-[#474747] mb-12"></div>

        <h1 className="text-center text-5xl md:text-6xl font-bold text-black mb-12 tracking-tight">
          의료 개혁
        </h1>

        <div className="flex justify-start mb-4">
          <button
            type="button"
            onClick={() => setIsAsc(!isAsc)}
            className="flex items-center justify-center gap-2 w-[100px] h-8 bg-[#d9d9d9] hover:bg-gray-300 rounded text-black text-sm font-medium transition-colors focus:outline-none"
          >
            <div className="flex flex-col items-center">
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className={isAsc ? 'text-black' : 'text-gray-400'}
              >
                <path d="m18 15-6-6-6 6" />
              </svg>
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className={!isAsc ? 'text-black' : 'text-gray-400'}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
            {isAsc ? '과거순' : '최신순'}
          </button>
        </div>
        <div className="w-full h-[2px] bg-[#474747] mb-16"></div>

        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-[#474747] hidden md:block z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-16 md:gap-y-24 pt-8 md:pt-16">
            {sortedData.map((item, index) => {
              const isRightText = index % 2 === 0;

              return (
                <React.Fragment key={item.id}>
                  <div
                    className={`w-full flex ${isRightText ? 'justify-center md:justify-end pr-0 md:pr-[50px]' : 'justify-center md:justify-end pr-0 md:pr-[50px] order-2 md:order-none'} relative`}
                  >
                    <div className="absolute right-[-14px] top-[46px] w-7 h-7 bg-[#474747] rounded-full border-4 border-[#f8f9fa] z-10 hidden md:block"></div>

                    {isRightText ? (
                      <img
                        src={item.imageUrl}
                        className="w-full max-w-[560px] h-auto md:h-[400px] aspect-video md:aspect-auto object-cover rounded-lg shadow-md"
                        alt={item.title}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full max-w-[560px] flex flex-col pt-4 md:pt-0">
                        <div className="flex justify-between items-end pb-3 mb-6 relative">
                          <div className="absolute bottom-0 left-0 right-0 md:right-[-50px] h-[2px] bg-[#474747]"></div>
                          <span className="text-gray-500 text-lg md:text-xl font-medium z-10 bg-[#f8f9fa] pr-4">
                            {item.date}
                          </span>
                          <span className="text-[#474747] text-5xl md:text-6xl font-bold z-10 bg-[#f8f9fa] pl-4 leading-none tracking-tighter">
                            #{String(index + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <h2 className="text-black text-3xl md:text-4xl font-bold mb-4 line-clamp-1">
                          {item.title}
                        </h2>
                        <p className="font-normal text-lg md:text-xl leading-relaxed text-gray-700 line-clamp-4 mb-6">
                          {item.summary}
                        </p>
                        <div className="text-right">
                          <a
                            href={item.link}
                            className="text-blue-600 text-base md:text-lg font-medium hover:text-blue-800 hover:underline transition-colors"
                          >
                            전문 보러 가기 →
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  <div
                    className={`w-full flex ${isRightText ? 'justify-center md:justify-start pl-0 md:pl-[50px] order-2 md:order-none' : 'justify-center md:justify-start pl-0 md:pl-[50px]'}`}
                  >
                    {isRightText ? (
                      <div className="w-full max-w-[560px] flex flex-col pt-4 md:pt-0">
                        <div className="flex justify-between items-end pb-3 mb-6 relative">
                          <div className="absolute bottom-0 right-0 left-0 md:left-[-50px] h-[2px] bg-[#474747]"></div>
                          <span className="text-[#474747] text-5xl md:text-6xl font-bold z-10 bg-[#f8f9fa] pr-4 leading-none tracking-tighter">
                            #{String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="text-gray-500 text-lg md:text-xl font-medium z-10 bg-[#f8f9fa] pl-4">
                            {item.date}
                          </span>
                        </div>
                        <h2 className="text-black text-3xl md:text-4xl font-bold mb-4 line-clamp-1">
                          {item.title}
                        </h2>
                        <p className="font-normal text-lg md:text-xl leading-relaxed text-gray-700 line-clamp-4 mb-6">
                          {item.summary}
                        </p>
                        <div className="text-right">
                          <a
                            href={item.link}
                            className="text-blue-600 text-base md:text-lg font-medium hover:text-blue-800 hover:underline transition-colors"
                          >
                            전문 보러 가기 →
                          </a>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={item.imageUrl}
                        className="w-full max-w-[560px] h-auto md:h-[400px] aspect-video md:aspect-auto object-cover rounded-lg shadow-md"
                        alt={item.title}
                        loading="lazy"
                      />
                    )}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
