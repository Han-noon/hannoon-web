import React from 'react';

interface NewsCardProps {
  id: number;
  category: string;
  title: string;
  summary: string;
  date: string;
  variant?: 'default' | 'long';
  isBookmarked: boolean;
  onBookmarkToggle: (id: number) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({
  id,
  category,
  title,
  summary,
  date,
  variant = 'default',
  isBookmarked,
  onBookmarkToggle,
}) => {
  const isLong = variant === 'long';
  const cleanSummary = summary.replace(/^AI 요약:\s*/, '');

  return (
    <div
      className={`
        ${isLong ? 'bg-[#F3F3F4]' : 'bg-white'} 
        border border-[#D7D7D7] rounded-[8px] 
        flex flex-col overflow-hidden h-[185px] w-full 
        hover:shadow-sm transition-all group cursor-pointer
      `}
    >
      {/* 상단 헤더*/}
      <div className="px-[18px] pt-[10px] pb-[4px] flex justify-between items-center">
        <span className="text-[11px] font-medium text-gray-400">{category}</span>
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
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      </div>

      <div className="mx-[18px] border-b border-[#D7D7D7]" />

      <div className="px-[18px] pt-[8px] pb-[2px] flex-grow overflow-hidden">
        <h3 className="text-[18px] font-bold text-black mb-1.5 leading-[1.25] break-keep line-clamp-2">
          {title}
        </h3>
        <p className="text-[12px] text-gray-500 line-clamp-2 leading-relaxed font-light">
          <span className="font-semibold text-[#474747]">AI 요약: </span>
          {cleanSummary}
        </p>
      </div>

      <div className="px-[18px] pb-[14px] text-[11px] text-[#474747]">
        최초 보도: <span className="font-semibold">{date}</span>
      </div>
    </div>
  );
};

export default NewsCard;
