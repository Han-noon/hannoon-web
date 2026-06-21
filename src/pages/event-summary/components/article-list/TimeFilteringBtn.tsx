import type { Dispatch, SetStateAction } from 'react';

interface ChildProps {
  timeFilter: string | null;
  setTimeFilter: Dispatch<SetStateAction<string>>;
}

const TimeFilteringBtn = ({ timeFilter, setTimeFilter }: ChildProps) => {
  return (
    <button
      type="button"
      onClick={() => setTimeFilter((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
      className="flex items-center justify-center gap-2 w-20 md:w-24 h-8 text-white bg-gray47
        hover:bg-[#211D1E] text-xs md:text-sm rounded-md"
    >
      <div className="flex flex-col items-center">
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className={timeFilter === 'asc' ? 'text-black' : 'text-white'}
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
          className={timeFilter === 'desc' ? 'text-black' : 'text-white'}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
      {timeFilter === 'asc' ? '과거순' : '최신순'}
    </button>
  );
};

export default TimeFilteringBtn;
