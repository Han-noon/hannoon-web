import React from 'react';

interface ThemeCardProps {
  id: number;
  category: string;
  title: string;
  summary: string;
  firstReportDate: string;
  latestReportDate: string;
  isBookmarked: boolean;
  onBookmarkToggle: (id: number) => void;
}

const ThemeCard: React.FC<ThemeCardProps> = ({
  id,
  category,
  title,
  summary,
  firstReportDate,
  latestReportDate,
  isBookmarked,
  onBookmarkToggle,
}) => {
  const cleanSummary = summary.replace(/^AI 요약:\s*/, '');

  return (
    <div
      style={{ minHeight: '280px' }}
      className="relative w-full bg-white border border-[#D7D7D7] rounded-[8px] flex flex-col overflow-hidden hover:shadow-sm transition-all group cursor-pointer"
    >
      {/* 상단 영역 */}
      <div className="px-[18px] pt-[18px] pb-[10px] flex justify-between items-center">
        <span className="px-4 py-1 bg-gray-100 text-gray-500 text-[11px] font-bold rounded-full uppercase tracking-wider">
          {category}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBookmarkToggle(id);
          }}
          className={`transition-colors ${isBookmarked ? 'text-[#474747]' : 'text-gray-300 hover:text-[#474747]'}`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={isBookmarked ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>

      {/* 본문 섹션 */}
      <div className="px-[18px] pt-[10px] flex-grow overflow-hidden">
        <h3 className="text-[18px] font-bold text-black mb-1.5 leading-[1.2] break-keep">
          {title}
        </h3>
        <p className="text-[12px] text-gray-500 line-clamp-4 leading-relaxed font-light">
          <span className="font-semibold text-[#474747]">AI 요약: </span>
          {cleanSummary}
        </p>
      </div>

      {/* 하단 날짜 */}
      <div className="px-[18px] pb-[24px] text-[11px] text-[#474747] flex flex-col gap-1.5 mt-auto">
        <div className="flex items-center">
          <span className="w-14 text-gray-400">최초 보도:</span>
          <span className="font-semibold">{firstReportDate}</span>
        </div>
        <div className="flex items-center">
          <span className="w-14 text-gray-400">최신 보도:</span>
          <span className="font-semibold">{latestReportDate}</span>
        </div>
      </div>
    </div>
  );
};

export default ThemeCard;
