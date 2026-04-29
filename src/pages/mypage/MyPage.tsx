import React, { useState } from 'react';
import NewsCard from '@/components/NewsCard';
import Pagination from '@/components/Pagination';
import Modal from './Modal';

const MyPage: React.FC = () => {
  // 상태 관리: 초기값
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([200, 201, 202]);
  const [activeTab, setActiveTab] = useState<'scrapped' | 'recent'>('scrapped');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 최근 본 사건 더미 데이터
  const recentData = [
    {
      id: 301,
      category: '의료 개혁',
      title: '최근 본 소식 1',
      summary: '최근 열람한 사건의 상세 요약입니다.',
      date: '2026.10.11',
    },
    {
      id: 302,
      category: '의료 개혁',
      title: '최근 본 소식 2',
      summary: '최근 열람한 사건의 상세 요약입니다.',
      date: '2026.10.11',
    },
  ];

  const handleBookmarkToggle = (id: number) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full pb-20">
      <div className="max-w-[880px] mx-auto px-6 pt-10">
        {/* 프로필 섹션 */}
        <section className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-[#D7D7D7] mb-10">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 shadow-sm overflow-hidden">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#d1d5db"
                strokeWidth="1.2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div>
              <h2 className="text-[26px] font-bold text-black mb-1 leading-none">공오삼</h2>
              <p className="text-gray-400 font-light text-[13px]">test053@gmail.com</p>
            </div>
          </div>

          <div className="mt-6 md:mt-0 flex flex-col items-end">
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-[11px] font-medium border border-gray-200 px-4 py-2 text-gray-400 hover:border-red-400 hover:text-red-400 transition-all mb-4"
            >
              탈퇴하기
            </button>

            <div className="bg-[#F3F3F4] border border-[#D7D7D7] rounded-[10px] w-[130px] h-[95px] flex flex-col items-center justify-center">
              <p className="text-[11px] text-gray-400 font-bold mb-1">스크랩한 사건</p>
              <p className="text-[38px] font-bold text-black leading-none">
                {bookmarkedIds.length}
              </p>
            </div>
          </div>
        </section>

        {/* 탭 메뉴 */}
        <div className="flex space-x-8 mb-10 border-b border-gray-50">
          <button
            onClick={() => setActiveTab('scrapped')}
            className={`text-[14px] pb-3 transition-all ${
              activeTab === 'scrapped'
                ? 'font-bold text-black border-b-2 border-black'
                : 'text-gray-300 font-normal hover:text-gray-500'
            }`}
          >
            스크랩한 사건
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            className={`text-[14px] pb-3 transition-all ${
              activeTab === 'recent'
                ? 'font-bold text-black border-b-2 border-black'
                : 'text-gray-300 font-normal hover:text-gray-500'
            }`}
          >
            최근 본 사건
          </button>
        </div>

        {/* 카드 리스트 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 min-h-[300px]">
          {activeTab === 'scrapped' ? (
            bookmarkedIds.length > 0 ? (
              bookmarkedIds.map((id, index) => (
                <NewsCard
                  key={id}
                  id={id}
                  category="의료 개혁"
                  title={`스크랩 소식 ${index + 1}`}
                  summary="보건복지부는 지방 의료 인력 확충 및 의료 수급 불균형 해소를 위해 대학별 정원 배정 위원회를 가동했습니다."
                  date="2026.10.10"
                  isBookmarked={true}
                  onBookmarkToggle={handleBookmarkToggle}
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-gray-300 font-light">
                스크랩한 사건이 없습니다.
              </div>
            )
          ) : (
            recentData.map((news) => (
              <NewsCard
                key={news.id}
                {...news}
                isBookmarked={bookmarkedIds.includes(news.id)}
                onBookmarkToggle={handleBookmarkToggle}
              />
            ))
          )}
        </div>

        <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={() => setIsModalOpen(false)}
          title="정말 탈퇴하시겠습니까?"
          message="탈퇴 시 모든 스크랩 정보와 이용 기록이 삭제되며, 복구할 수 없습니다."
        />
      </div>
    </div>
  );
};

export default MyPage;
