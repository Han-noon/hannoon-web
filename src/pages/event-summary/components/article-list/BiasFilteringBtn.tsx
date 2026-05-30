import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

interface ChildProps {
  biasFilter: string | null;
  setBiasFilter: Dispatch<SetStateAction<string | null>>;
}

type Bias = '전체' | '진보' | '중도' | '보수';

const BiasFilteringBtn = ({ biasFilter, setBiasFilter }: ChildProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const biasList: Bias[] = ['전체', '진보', '중도', '보수'];

  return (
    <div className="relative">
      <button
        className="w-20 md:w-24 h-8 flex items-center justify-around bg-[#d9d9d9] border border-[#c4c4c4] text-xs md:text-sm 
        hover:bg-[#d0d0d0] rounded-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        {biasFilter === null ? '전체' : biasFilter}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`size-4 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {isOpen && (
        <ul className="bg-[#d9d9d9] text-center absolute w-full text-xs top-9 border border-[#c4c4c4] rounded-sm">
          {biasList.map((data) => {
            return (
              <li
                key={data}
                className="p-2 hover:bg-[#eae9e9] cursor-pointer text-xs"
                onClick={() => {
                  const bias = data === '전체' ? null : data;
                  setBiasFilter(bias);
                  setIsOpen(!isOpen);
                }}
              >
                {data}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default BiasFilteringBtn;
