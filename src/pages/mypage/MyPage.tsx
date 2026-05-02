import React, { useState, useRef, useEffect } from 'react';
import NewsCard from '@/components/NewsCard';
import ThemeCard from '@/components/ThemeCard';
import Pagination from '@/components/Pagination';
import { THEME_CONFIG } from '@/components/Topic';

const getThemeIdByNewsId = (newsId: number) => {
  if (newsId === 100) return 1;
  if (newsId === 101) return 2;
  if (newsId >= 200) return ((newsId - 200) % 3) + 1;
  return 1;
};

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
}> = ({ isOpen, onClose, onConfirm, title, message, confirmText }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[340px] rounded-[14px] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="pt-9 pb-7 px-7 text-center">
          <h2 className="text-[15px] font-bold text-black mb-2.5 tracking-tight">{title}</h2>
          <p className="text-[12px] text-gray-400 leading-relaxed font-light break-keep whitespace-pre-wrap px-1">
            {message}
          </p>
        </div>
        <div className="flex border-t border-gray-50 h-[44px]">
          <button
            onClick={onClose}
            className="flex-1 text-[13px] text-gray-300 font-medium hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <div className="w-[1px] bg-gray-50" />
          <button
            onClick={onConfirm}
            className="flex-1 text-[13px] text-black font-bold hover:bg-gray-50 transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const MyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'scrapped' | 'recent'>('scrapped');
  const [scrappedNewsIds, setScrappedNewsIds] = useState<number[]>([]);
  const [recentNews, setRecentNews] = useState<any[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 1;

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(
    localStorage.getItem('userProfileImage')
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedScraps = JSON.parse(localStorage.getItem('scrappedNewsIds') || '[]');
    const savedHistory = JSON.parse(localStorage.getItem('recentViewedNews') || '[]');
    const cleanHistory = savedHistory.filter((item: any) => item.themeId !== undefined);
    setScrappedNewsIds(savedScraps);
    setRecentNews(cleanHistory);
    setCurrentPage(1); // 탭 전환 시 페이지 리셋
  }, [activeTab]);

  const scrappedThemeIds = Array.from(new Set(scrappedNewsIds.map((id) => getThemeIdByNewsId(id))));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setProfileImage(base64);
        localStorage.setItem('userProfileImage', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setProfileImage(null);
    localStorage.removeItem('userProfileImage');
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="w-full pb-20">
      <div className="max-w-[880px] mx-auto px-6 pt-10">
        {/* 프로필 섹션 */}
        <section className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-10">
          <div className="flex items-center space-x-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center border border-gray-200 shadow-sm overflow-hidden">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <svg
                    width="50"
                    height="50"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                )}
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center bg-white border border-gray-200 rounded-full px-2.5 py-1.5 shadow-lg space-x-2 z-10">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-gray-400 hover:text-black transition-colors p-0.5"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                    <circle cx="12" cy="13" r="4"></circle>
                  </svg>
                </button>
                <div className="w-[1px] h-2.5 bg-gray-100"></div>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="text-gray-300 hover:text-black transition-colors p-0.5"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            <div>
              <h2 className="text-[28px] font-bold text-black mb-1 leading-none">공오삼</h2>
              <p className="text-gray-400 font-light text-[14px]">test053@gmail.com</p>
            </div>
          </div>
          <div className="mt-6 md:mt-0">
            <div className="bg-[#F3F3F4] rounded-[12px] w-[100px] h-[85px] flex flex-col items-center justify-center">
              <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wider">
                스크랩한 토픽
              </p>
              <p className="text-[34px] font-bold text-black leading-none">
                {scrappedThemeIds.length}
              </p>
            </div>
          </div>
        </section>

        {/* 탭 & 탈퇴 버튼 */}
        <div className="flex items-end justify-between mb-10 border-b border-gray-300">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('scrapped')}
              className={`text-[14px] pb-1 transition-all ${activeTab === 'scrapped' ? 'font-bold text-black border-b-2 border-black' : 'text-gray-300 font-normal hover:text-gray-500'}`}
            >
              스크랩한 토픽
            </button>
            <button
              onClick={() => setActiveTab('recent')}
              className={`text-[14px] pb-1 transition-all ${activeTab === 'recent' ? 'font-bold text-black border-b-2 border-black' : 'text-gray-300 font-normal hover:text-gray-500'}`}
            >
              최근 본 사건
            </button>
          </div>
          <button
            onClick={() => setIsWithdrawModalOpen(true)}
            className="group flex items-center space-x-1.5 text-[12px] text-gray-300 hover:text-black transition-all pb-1 border-b border-transparent hover:border-black"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>탈퇴하기</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 min-h-[300px] items-start">
          {activeTab === 'scrapped'
            ? scrappedThemeIds.map((id) => {
                const theme = THEME_CONFIG[id];
                return (
                  <ThemeCard
                    key={id}
                    id={id}
                    category={theme.topic}
                    title={theme.topic}
                    summary={theme.summary}
                    firstReportDate={theme.firstDate}
                    latestReportDate={theme.latestDate}
                    isBookmarked={true}
                    onBookmarkToggle={() => {}}
                  />
                );
              })
            : recentNews.map((news) => (
                <NewsCard
                  key={news.id}
                  {...news}
                  category={THEME_CONFIG[news.themeId].topic}
                  isBookmarked={scrappedNewsIds.includes(news.id)}
                  onBookmarkToggle={(id) => {
                    const updated = scrappedNewsIds.includes(id)
                      ? scrappedNewsIds.filter((i) => i !== id)
                      : [...scrappedNewsIds, id];
                    setScrappedNewsIds(updated);
                    localStorage.setItem('scrappedNewsIds', JSON.stringify(updated));
                  }}
                />
              ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteImage}
          title="프로필 이미지 초기화"
          message="현재 설정된 이미지를 삭제하시겠습니까? 삭제 후에는 기본 프로필로 변경됩니다."
          confirmText="삭제하기"
        />
        <Modal
          isOpen={isWithdrawModalOpen}
          onClose={() => setIsWithdrawModalOpen(false)}
          onConfirm={() => {
            alert('탈퇴되었습니다.');
            setIsWithdrawModalOpen(false);
          }}
          title="계정 탈퇴 확인"
          message="정말 탈퇴하시겠습니까? 탈퇴 시 모든 활동 기록이 즉시 삭제되며 이는 복구가 불가능합니다."
          confirmText="탈퇴하기"
        />
      </div>
    </div>
  );
};

export default MyPage;
