import type { Menu } from '@/types/header';

interface MobileMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  menus: Menu[];
}

const MobileMenu = ({ isMenuOpen, setIsMenuOpen, menus }: MobileMenuProps) => {
  return (
    <>
      {/* 배경 */}
      <div
        className={`
          fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-300
          ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* 메뉴 패널 */}
      <div
        className={`
          fixed top-0 right-0 h-full w-[290px] bg-[#f6f6f6] z-50 md:hidden
          transition-transform duration-300 ease-in-out
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* 닫기 버튼 */}
        <div className="flex justify-end p-6">
          <button
            type="button"
            className="text-white"
            onClick={() => setIsMenuOpen(false)}
            aria-label="메뉴 닫기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="black"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 메뉴 */}
        <div className="mt-10 flex flex-col items-center">
          {menus.map((item) => (
            <button
              key={item.label}
              type="button"
              className="text-black text-[18px] font-semibold py-4 w-full hover:bg-[#e1dfdf]"
              onClick={() => {
                setIsMenuOpen(false);
                item.onClick();
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
