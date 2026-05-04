import { useState } from 'react';

const TimeFilteringBtn = () => {
  const [isAsc, setIsAsc] = useState(true);

  return (
    <button
      type="button"
      onClick={() => setIsAsc(!isAsc)}
      className="flex items-center justify-center gap-2 w-24 h-8 bg-gray-300 text-sm hover:bg-gray-400"
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
  );
};

export default TimeFilteringBtn;
