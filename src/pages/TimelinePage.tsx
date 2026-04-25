import React, { useState } from 'react';
import { TimelineData } from '../data/TimelineData';

export default function TimelinePage() {
  const [isAsc, setIsAsc] = useState(true);
  const sortedData = isAsc ? [...TimelineData] : [...TimelineData].reverse();

  const handleAlertClick = () => {
    alert('실시간 알림 신청이 완료되었습니다!');
  };

  const ITEM_HEIGHT = 550;
  const START_TOP = 350;

  return (
    <section
      className="relative w-full bg-[#f8f9fa]"
      style={{ height: `${START_TOP + sortedData.length * ITEM_HEIGHT + 100}px` }}
    >
      <div className="absolute top-[67px] left-[70px] w-[1300px] h-1 bg-[#474747]" />
      <div className="absolute top-[88px] left-[70px] w-[1300px] h-[2px] bg-[#474747]" />
      <div className="absolute top-[249px] left-[70px] w-[1300px] h-[2px] bg-[#474747]" />

      <div
        className="absolute top-[251px] left-[718px] w-[2px] bg-[#474747]"
        style={{ height: `${sortedData.length * ITEM_HEIGHT + 50}px` }}
      />

      <h1 className="absolute top-[135px] left-[581px] text-black text-6xl font-bold">의료 개혁</h1>

      <button
        onClick={handleAlertClick}
        className="absolute top-[35px] left-[1223px] text-black text-lg font-medium bg-transparent border-none cursor-pointer transition-all hover:font-bold"
      >
        실시간 알림받기
      </button>

      <div className="absolute top-[32px] left-[70px] text-black text-2xl font-bold">TIMELINE</div>
      <div className="absolute top-[32px] left-[696px] text-black text-2xl font-bold">정치</div>

      <div className="absolute top-[198px] left-20 w-[100px] h-8 bg-[#d9d9d9] rounded cursor-pointer z-20">
        <button
          type="button"
          onClick={() => setIsAsc(!isAsc)}
          className="w-full h-full flex items-center justify-center gap-2 text-black text-sm font-medium bg-transparent border-0"
        >
          <div className="flex flex-col items-center">
            <svg
              width="8"
              height="8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className={isAsc ? 'text-black' : 'text-gray-400'}
            >
              <path d="m18 15-6-6-6 6" />
            </svg>
            <svg
              width="8"
              height="8"
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

      {sortedData.map((milestone, index) => {
        const isRightSide = index % 2 === 0;
        const currentTop = START_TOP + index * ITEM_HEIGHT;

        return (
          <React.Fragment key={milestone.id}>
            <div
              className="absolute left-[704px] w-7 h-7 bg-[#474747] rounded-full border-4 border-white z-10"
              style={{ top: `${currentTop + 82}px` }}
            />
            <div
              className="absolute w-[613px] border-t-2 border-[#474747]"
              style={{
                top: `${currentTop + 95}px`,
                left: isRightSide ? '718px' : '105px',
              }}
            />
            <div
              className="absolute w-[560px] h-[400px] rounded-lg shadow-md bg-cover bg-center object-cover"
              style={{
                top: `${currentTop}px`,
                left: isRightSide ? '98px' : '778px',
                backgroundImage: `url(${milestone.imageUrl})`,
              }}
            />
            <div
              className="absolute text-gray-500 text-xl font-medium tracking-wider"
              style={{
                top: `${currentTop + 53}px`,
                left: isRightSide ? '1195px' : '105px',
              }}
            >
              {milestone.date}
            </div>
            <div
              className="absolute text-[#474747] text-6xl font-bold"
              style={{
                top: `${currentTop + 16}px`,
                left: isRightSide ? '760px' : '542px',
              }}
            >
              #{String(index + 1).padStart(2, '0')}
            </div>
            <h2
              className="absolute text-black text-4xl font-bold truncate w-[579px]"
              style={{
                top: `${currentTop + 159}px`,
                left: isRightSide ? '760px' : '98px',
              }}
            >
              {milestone.title}
            </h2>
            <div
              className="absolute w-[579px] h-[120px] overflow-hidden text-ellipsis"
              style={{
                top: `${currentTop + 224}px`,
                left: isRightSide ? '760px' : '98px',
              }}
            >
              <p className="font-normal text-xl leading-relaxed text-gray-700 line-clamp-3">
                {milestone.summary}
              </p>
            </div>
            <a
              href={milestone.link}
              className="absolute text-blue-600 text-lg font-medium hover:underline"
              style={{
                top: `${currentTop + 373}px`,
                left: isRightSide ? '1173px' : '511px',
              }}
            >
              전문 보러 가기 →
            </a>
          </React.Fragment>
        );
      })}
    </section>
  );
}
