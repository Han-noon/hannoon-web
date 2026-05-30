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
      className="flex items-center justify-center gap-2 w-20 md:w-24 h-8 bg-[#d9d9d9] border border-[#c4c4c4] text-xs md:text-sm
       hover:bg-[#d0d0d0] rounded-sm"
    >
      <div className="flex flex-col items-center">
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className={timeFilter === 'asc' ? 'text-black' : 'text-gray-400'}
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
          className={timeFilter === 'desc' ? 'text-black' : 'text-gray-400'}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
      {timeFilter === 'asc' ? '과거순' : '최신순'}
    </button>
  );
};

export default TimeFilteringBtn;
