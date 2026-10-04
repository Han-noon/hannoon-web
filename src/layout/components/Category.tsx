import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const Category = () => {
  // const [isOpen, setIsOpen] = useState(false);
  const [searchParams, _] = useSearchParams();
  const location = useLocation(); // 현재 URL 경로를 가져옴
  const navigate = useNavigate();

  const currentCategory = searchParams.get('category') || '전체';

  const categories = ['전체', '정치', '경제', '사회', '국제'];

  const currentMenuLabel = location.pathname.startsWith('/timeline') ? '토픽' : '이슈';

  return (
    <div className="w-full h-9 md:h-11 bg-white border-b border-gray-200 flex items-center shadow-[0px_1px_2px_0px_#e0dfdf] text-xs md:text-sm">
      <div className="w-full max-w-[1200px] h-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="overflow-x-auto h-full">
          <nav className="min-w-max flex items-center gap-12 h-full px-6">
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
    </div>
  );
};

export default Category;
