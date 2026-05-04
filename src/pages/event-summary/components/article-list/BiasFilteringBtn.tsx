import { useState } from 'react';

const BiasFilteringBtn = () => {
  type Bias = '전체' | '진보' | '중도' | '보수';

  const [isOpen, setIsOpen] = useState(false);
  const [bias, setBias] = useState('전체');
  const biasList: Bias[] = ['전체', '진보', '중도', '보수'];

  return (
    <div className="relative">
      <button
        className="w-24 h-8 flex items-center justify-around  bg-gray-300 text-sm hover:bg-gray-400"
        onClick={() => setIsOpen(!isOpen)}
      >
        {bias}
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
      <ul className="bg-gray-300 text-center absolute w-full">
        {isOpen &&
          biasList.map((data) => (
            <li
              className="p-2 hover:bg-gray-400 cursor-pointer"
              onClick={() => {
                setBias(data);
                setIsOpen(!isOpen);
              }}
            >
              {data}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default BiasFilteringBtn;
