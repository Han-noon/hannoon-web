import React, { useId, useState } from 'react';
import headerBg from '@/assets/back1.jpg';

const Header = () => {
  const [keyword, setKeyword] = useState('');
  const searchId = useId();

  const menus = ['알림', '내 정보', '소개', '로그아웃'];

  const onSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <header
      className="absolute top-0 left-0 w-full h-[230px] overflow-hidden bg-cover bg-[50%_50%]"
      style={{ backgroundImage: `url(${headerBg})` }}
    >
      <div
        className="absolute top-0 left-0 w-full h-full flex flex-col gap-9 bg-[#000000a3]"
        aria-hidden="true"
      />
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="h-[64px] w-full flex justify-between items-center px-16">
          <div className="font-bold text-[#f6f6f6] text-xl">AI PROJECT</div>
          <nav aria-label="주요 메뉴" className="flex justify-between w-[230px]">
            {menus.map((item) => (
              <button
                key={item}
                type="button"
                className={`${item === '로그아웃' ? 'ml-7' : ''} font-normal text-[#f6f6f6] text-sm flex items-center bg-transparent border-0 p-0 cursor-pointer hover:text-white`}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-12 font-bold text-[#dddddd] text-2xl flex items-center justify-center">
          오늘의 이슈, 관점을 더하다
        </div>
        <div className="flex justify-center">
          <form
            onSubmit={onSearch}
            role="search"
            className="mt-6 h-11 w-[800px] flex items-center bg-[#ffffff26] rounded-[30px] overflow-hidden border border-solid border-[#cbcbcba1] backdrop-blur-[12.5px]"
          >
            <input
              id={searchId}
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="검색어를 입력하세요"
              className="ml-6 h-6 bg-transparent outline-none border-0 font-normal text-[#f6f6f6] text-base placeholder:text-[#b3b3b3]"
            />
            <button
              type="submit"
              className="ml-auto mr-[19px] flex h-[30px] w-[30px] items-center justify-center bg-transparent p-0 border-0 cursor-pointer"
            >
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
            </button>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;
