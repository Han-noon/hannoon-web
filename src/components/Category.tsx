import { useState } from 'react';
import { Link } from 'react-router-dom';

const Category = () => {
  const [isOpen, setIsOpen] = useState(false);
  const categories = ['전체', '정치', '경제', '사회'];
  const dropMenus = [
    { label: '사건 리스트', to: '/' },
    { label: '사건 브리핑', to: '/event-detail' },
    { label: '타임라인으로 보는 사건', to: '/timeline' },
    { label: '어뷰징 리스트', to: '/abusing' },
  ];

  return (
    <div className="absolute top-[230px] left-0 w-full h-11 bg-white border-b border-gray-200 flex items-center z-30 shadow-[0px_1px_2px_0px_#e0dfdf]">
      <div
        className="relative w-80 h-full flex items-center justify-center border-r border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <span className="text-[#474747] text-[14px]">타임라인으로 보는 사건</span>
          <svg
            className={`w-6 h-6 text-[#474747] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            viewBox="0 0 24 24"
            width="100%"
            height="100%"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
        {isOpen && (
          <div className="absolute top-[45px] left-0 w-full bg-white border border-gray-200 shadow-lg flex flex-col z-40">
            {dropMenus.map((item, idx) => (
              <Link
                key={idx}
                to={item.to}
                className="px-0 py-3 text-center text-[14px] font-medium text-[#474747] hover:bg-gray-100 no-underline border-b last:border-b-0 border-gray-100"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
      <nav className="flex items-center gap-12 pl-12 h-full">
        {categories.map((c) => (
          <button
            key={c}
            className="text-[#a3a3a3] hover:text-[#474747] font-medium text-[14px] bg-transparent border-0"
          >
            {c}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Category;
