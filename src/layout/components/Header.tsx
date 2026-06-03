import React, { useId, useRef, useState } from 'react';
import headerBg from '@/assets/back1.jpg';
import MobileMenu from '@/layout/components/menu/MobileMenu';
import useNotificationStore from '@/store/notificationStore';
import useMediaQuery from '@/hooks/useMediaQuery';
import { useLocation, useNavigate } from 'react-router-dom';
import NotificationModalWrapper from '@/layout/components/notification/NotificationModalWrapper';
import useClickOutside from '@/hooks/useClickOutside';
import useSession from '@/hooks/useSession';
import { signOut } from '@/api/auth/signOut';
import type { Menu } from '@/types/header';
import { useSearchStore } from '@/store/useSearchStore';

const Header = () => {
  const navigate = useNavigate();
  const { keyword, setKeyword, search, setSearch } = useSearchStore();
  const searchId = useId();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 모바일용 햄버거바

  function signInRequired() {
    if (confirm('로그인이 필요한 기능입니다. 로그인하시겠습니까?')) navigate('/signin');
    else return;
  }

  async function handleSignOut() {
    if (!confirm('로그아웃 하시겠습니까?')) return;

    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  }

  const { session } = useSession();
  const menus: Menu[] = [
    {
      label: '내 정보',
      onClick: () => {
        session ? navigate('/mypage') : signInRequired();
      },
    },
    {
      label: session ? '로그아웃' : '로그인',
      onClick: session ? handleSignOut : () => navigate('/signIn'),
    },
  ];

  // 알림
  const { isOpen, backgroundPath, open, close } = useNotificationStore();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const location = useLocation();

  function handleNotification() {
    if (!session) return signInRequired();

    if (isOpen) {
      close();
      if (!isDesktop) navigate(backgroundPath); // 모바일 버전에서 이전 페이지로
    } else {
      open(location.pathname); // 현재 페이지 기억
      if (!isDesktop) navigate('/notification'); // 모바일 버전이면 라우팅, md 버전이면 모달
    }
  }

  //포커스아웃 시 알림창 닫기(md 버전만 해당)
  const NotiBoxRef = useRef<HTMLDivElement | null>(null);
  useClickOutside(NotiBoxRef, close);

  const currentPath = location.pathname;

  return (
    <header
      className="w-full h-[185px] md:h-[230px] bg-cover bg-[50%_50%]"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.64), rgba(0,0,0,0.64)), url(${headerBg})`,
      }}
    >
      {/* 로고 & 사용자 관련 네비 */}
      <div className="w-full h-16 flex justify-between items-center px-5 md:px-16">
        <h1
          onClick={() => {
            setKeyword('');
            navigate('/');
          }}
          className="text-[#f6f6f6] text-2xl md:text-3xl font-[EbsHunmin]"
        >
          한 눈
        </h1>
        <nav aria-label="주요 메뉴" className="flex justify-between items-center md:w-60">
          {/* 알림 */}
          <div ref={NotiBoxRef} className="relative">
            <button
              className="text-[#f6f6f6] text-sm cursor-pointer flex items-center"
              onClick={handleNotification}
            >
              <span className="hidden md:inline md:mr-6">알림</span>
              <span className="md:hidden">
                <BellIcon />
              </span>
            </button>
            {isOpen && <NotificationModalWrapper />}
          </div>

          {/* pc버전 나머지 메뉴 */}
          <div className="hidden md:flex md:flex-1 justify-between">
            {menus.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={item.onClick}
                className={`${item.label === '로그아웃' && '로그인' ? 'md:pl-7' : ''} text-[#f6f6f6] text-sm p-0 cursor-pointer`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* 모바일버전 메뉴 */}
          <button
            type="button"
            className="md:hidden ml-3"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="메뉴 열기"
          >
            <MenuIcon />
          </button>
          <MobileMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} menus={menus} />
        </nav>
      </div>
      <h1 className="mt-7 md:mt-12 font-bold text-[#dddddd] text-l md:text-2xl flex items-center justify-center">
        오늘의 이슈, 관점을 더하다
      </h1>
      <div className="flex justify-center">
        <form
          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
            setSearch(!search);
            const nav = currentPath === '/' || currentPath === '/timeline' ? false : true;
            if (nav) navigate('/');
            event.preventDefault();
          }}
          role="search"
          className="mt-3 md:mt-6 mx-6 h-9 md:h-11 max-w-[800px] w-full flex items-center bg-[#ffffff26] rounded-[30px] overflow-hidden border border-solid border-[#cbcbcba1] backdrop-blur-[12.5px]"
        >
          <input
            id={searchId}
            type="search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="검색어를 입력하세요"
            className="ml-6 h-6 flex-1 bg-transparent outline-none border-0 text-[#f6f6f6] text-xs md:text-base placeholder:text-[#b3b3b3]"
          />
          <button
            type="submit"
            className="mr-[19px] mb-[2px] flex h-[30px] w-[30px] items-center justify-center bg-transparent p-0 border-0 cursor-pointer"
          >
            <SearchIcon />
          </button>
        </form>
      </div>
    </header>
  );
};

export default Header;

// 아이콘 컴포넌트
const SearchIcon = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );
};

const MenuIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="white"
      className="h-7 w-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    </svg>
  );
};

const BellIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
      />
    </svg>
  );
};
