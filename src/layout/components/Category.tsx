import { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const Category = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams, _] = useSearchParams();
  const location = useLocation(); // 현재 URL 경로를 가져옴
  const navigate = useNavigate();

  const currentCategory = searchParams.get('category') || '전체';

  const categories = ['전체', '정치', '경제', '사회', '국제'];
  const dropMenus = [
    { label: '이슈', to: '/' },
    { label: '토픽', to: '/timeline' },
  ];

  const currentMenuLabel = location.pathname.startsWith('/timeline') ? '토픽' : '이슈';

  return (
    <div className="w-full h-9 md:h-11 bg-white border-b border-gray-200 flex items-center shadow-[0px_1px_2px_0px_#e0dfdf] text-xs md:text-sm">
      <div
        className="relative px-4 md:px-8 h-full min-w-[177px] flex items-center border-r border-gray-200 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className={`flex gap-1 md:gap-4 md:min-w-[180px] justify-between`}>
          <p className="text-[#474747]">{currentMenuLabel}</p>
          <div>
            <DropdownIcon isOpen={isOpen} />
          </div>
        </div>
        {isOpen && (
          <div className="md:min-w-[180px] absolute top-[45px] left-0 w-full bg-white border border-gray-200 shadow-lg flex flex-col z-40">
            {dropMenus.map((item, idx) => (
              <Link
                key={idx}
                to={item.to}
                className="px-0 py-3 text-center font-medium text-[#474747] hover:bg-gray-100 no-underline border-b last:border-b-0 border-gray-100"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
      <div className="overflow-x-auto h-full">
        <nav className="min-w-max flex items-center gap-12 md:pl-12 h-full px-4">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => {
                navigate(
                  currentMenuLabel === '토픽' ? `/timeline?category=${c}` : `/?category=${c}`
                );
              }}
              className={`whitespace-nowrap font-medium border-0 transition-colors ${
                currentCategory === c
                  ? 'text-[#474747] underline underline-offset-4'
                  : 'text-[#a3a3a3] hover:text-[#474747]'
              }`}
            >
              {c}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Category;

const DropdownIcon = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <svg
      className={`w-4 h-4 md:w-5 md:h-5 text-[#474747] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
};
