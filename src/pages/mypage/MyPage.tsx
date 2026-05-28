import React, { useState, useRef, useEffect } from 'react';
import NewsCard from '@/components/NewsCard';
import ThemeCard from '@/components/ThemeCard';
import Pagination from '@/components/Pagination';
import { THEME_CONFIG } from '@/components/Topic';
import Modal from './Modal';
import { getProfile } from '@/api/profile/getProfile';
import { updateProfileImage } from '@/api/profile/updateProfileImage';

const ITEMS_PER_PAGE = 6;

const getThemeIdByNewsId = (newsId: number) => {
  if (newsId === 100) return 1;
  if (newsId === 101) return 2;
  if (newsId >= 200) return ((newsId - 200) % 15) + 1;
  return 1;
};

interface UserData {
  nickname: string;
  email: string;
  profileImage: string | null;
}

const MyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'scrapped' | 'recent'>('scrapped');
  const [scrappedNewsIds, setScrappedNewsIds] = useState<number[]>([]);
  const [recentNews, setRecentNews] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetchError, setIsFetchError] = useState<boolean>(false);

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const gridRef = useRef<HTMLDivElement>(null);

  const [errorModal, setErrorModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (gridRef.current) {
      const yOffset = -80;
      const element = gridRef.current;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [currentPage]);

  // const toggleScrap = (id: number) => {
  //   setScrappedNewsIds((prev) => {
  //     const isScrapped = prev.includes(id);
  //     const nextScraps = isScrapped ? prev.filter((item) => item !== id) : [...prev, id];
  //     localStorage.setItem('scrappedNewsIds', JSON.stringify(nextScraps));
  //     return nextScraps;
  //   });
  // };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const profileData = await getProfile();
        setUserData({
          nickname: profileData.name || '이름 없음',
          email: profileData.email || '',
          profileImage: profileData.profile_image_url || null,
        });
        setIsFetchError(false);
      } catch (error) {
        console.error('프로필 정보를 불러오지 못했습니다:', error);
        setIsFetchError(true);
      }

      try {
        const savedScraps = JSON.parse(localStorage.getItem('scrappedNewsIds') || '[]');
        const savedHistory = JSON.parse(localStorage.getItem('recentViewedNews') || '[]');
        const cleanHistory = Array.isArray(savedHistory)
          ? savedHistory.filter((item: any) => item && item.themeId !== undefined)
          : [];

        setScrappedNewsIds(Array.isArray(savedScraps) ? savedScraps : []);
        setRecentNews(cleanHistory);
        setCurrentPage(1);
      } catch (e) {
        console.error('Localstorage data corrupted:', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const scrappedThemeIds = Array.from(new Set(scrappedNewsIds.map((id) => getThemeIdByNewsId(id))));

  const currentTotalItems = activeTab === 'scrapped' ? scrappedThemeIds.length : recentNews.length;
  const totalPages = Math.max(1, Math.ceil(currentTotalItems / ITEMS_PER_PAGE));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64 = reader.result as string;
          if (!base64) throw new Error('Encoding failed');

          await updateProfileImage(base64);

          setUserData((prev: UserData | null) => (prev ? { ...prev, profileImage: base64 } : null));
        } catch (error) {
          setErrorModal({
            isOpen: true,
            title: '이미지 변경 실패',
            message: '서버와 통신 중 오류가 발생했습니다. 다시 시도해 주세요.',
          });
        }
      };
      reader.onerror = () => {
        setErrorModal({
          isOpen: true,
          title: '이미지 변경 실패',
          message: '파일을 읽어오는 중 에러가 발생했습니다. 다시 시도해 주세요.',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = async () => {
    try {
      await updateProfileImage(null);
      setUserData((prev: UserData | null) => (prev ? { ...prev, profileImage: null } : null));
      setIsDeleteModalOpen(false);
    } catch (error) {
      setErrorModal({
        isOpen: true,
        title: '이미지 삭제 실패',
        message: '서버와 통신 중 오류가 발생했습니다. 다시 시도해 주세요.',
      });
    }
  };

  const handleWithdraw = () => {
    setIsWithdrawModalOpen(false);
    const isDbSuccess = window.navigator.onLine;

    if (!isDbSuccess) {
      setErrorModal({
        isOpen: true,
        title: '회원 탈퇴 실패',
        message:
          '처리 오류로 인해 탈퇴 처리가 완료되지 않았습니다. 잠시 후 서버가 안정되면 다시 시도해 주세요.',
      });
      return;
    }

    localStorage.clear();
    alert('탈퇴되었습니다.');
    window.location.href = '/';
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
      </div>
    );
  }

  if (isFetchError || !userData) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-4">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h2 className="text-[18px] font-bold text-black mb-2">회원 정보를 조회할 수 없습니다.</h2>
          <p className="text-[14px] text-gray-400 font-light mb-6 break-keep">
            서버 통신 장애로 마이페이지 데이터를 불러오지 못했습니다.
            <br />
            다시 시도해주세요.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-black text-white rounded-[10px] text-[13px] font-medium hover:bg-gray-800 transition-colors"
          >
            페이지 새로고침
          </button>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    if (activeTab === 'scrapped') {
      if (scrappedThemeIds.length === 0) {
        return (
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-16 text-center w-full">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3.5 border border-gray-100">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <p className="text-[14px] text-gray-400 font-light">스크랩한 토픽이 없습니다.</p>
          </div>
        );
      }

      const paginatedScrapped = scrappedThemeIds.slice(startIndex, endIndex);

      return paginatedScrapped.map((id) => {
        const theme = THEME_CONFIG && THEME_CONFIG[id];
        if (!theme) return null;
        return (
          <ThemeCard
            key={id}
            id={id}
            category={theme.category || '미분류'}
            title={theme.topic || '제목 없음'}
            summary={theme.summary || ''}
            firstReportDate={theme.firstDate || ''}
            latestReportDate={theme.latestDate || ''}
            isBookmarked={true}
            onBookmarkToggle={(themeId) => {
              setScrappedNewsIds((prev) => {
                const nextScraps = prev.filter((newsId) => getThemeIdByNewsId(newsId) !== themeId);
                localStorage.setItem('scrappedNewsIds', JSON.stringify(nextScraps));

                const remainingItems = Array.from(
                  new Set(nextScraps.map((nid) => getThemeIdByNewsId(nid)))
                ).length;
                if (
                  remainingItems > 0 &&
                  currentPage > Math.ceil(remainingItems / ITEMS_PER_PAGE)
                ) {
                  setCurrentPage(Math.ceil(remainingItems / ITEMS_PER_PAGE));
                }

                return nextScraps;
              });
            }}
          />
        );
      });
    }

    if (activeTab === 'recent') {
      if (recentNews.length === 0) {
        return (
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-16 text-center w-full">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3.5 border border-gray-100">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <p className="text-[14px] text-gray-400 font-light">최근 본 사건이 없습니다.</p>
          </div>
        );
      }

      const paginatedRecent = recentNews.slice(startIndex, endIndex);

      return paginatedRecent.map((news) => {
        if (!news) return null;
        const targetTheme = THEME_CONFIG && news.themeId ? THEME_CONFIG[news.themeId] : null;
        return (
          <NewsCard
            key={news.id}
            {...news}
            category={targetTheme ? targetTheme.topic : '미분류'}
            isBookmarked={scrappedNewsIds.includes(news.id)}
            onBookmarkToggle={(id) => {
              const updated = scrappedNewsIds.includes(id)
                ? scrappedNewsIds.filter((i) => i !== id)
                : [...scrappedNewsIds, id];
              setScrappedNewsIds(updated);
              localStorage.setItem('scrappedNewsIds', JSON.stringify(updated));
            }}
          />
        );
      });
    }
    return null;
  };

  return (
    <div className="w-full pb-20">
      <div className="max-w-[880px] mx-auto px-6 pt-10">
        <section className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-10">
          <div className="flex items-center space-x-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center border border-gray-200 shadow-sm overflow-hidden">
                <img
                  src={userData.profileImage || '/default-profile.png'}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/default-profile.png';
                  }}
                />
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
              <h2 className="text-[28px] font-bold text-black mb-1 leading-none">
                {userData.nickname}
              </h2>
              <p className="text-gray-400 font-light text-[14px]">{userData.email}</p>
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

        <div
          ref={gridRef}
          className="flex items-end justify-between mb-10 border-b border-gray-300"
        >
          <div className="flex space-x-8">
            <button
              onClick={() => {
                setActiveTab('scrapped');
                setCurrentPage(1);
              }}
              className={`text-[14px] pb-1 transition-all ${activeTab === 'scrapped' ? 'font-bold text-black border-b-2 border-black' : 'text-gray-300 font-normal hover:text-gray-500'}`}
            >
              스크랩한 토픽
            </button>
            <button
              onClick={() => {
                setActiveTab('recent');
                setCurrentPage(1);
              }}
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
          {renderTabContent()}
        </div>

        {currentTotalItems > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteImage}
          title="프로필 이미지 삭제"
          message={'현재 설정된 이미지를 삭제하시겠습니까?\n삭제 후에는 기본 프로필로 변경됩니다.'}
          confirmText="삭제하기"
        />

        <Modal
          isOpen={isWithdrawModalOpen}
          onClose={() => setIsWithdrawModalOpen(false)}
          onConfirm={handleWithdraw}
          title="계정 탈퇴 확인"
          message={
            '정말 탈퇴하시겠습니까?\n탈퇴 시 모든 활동 기록이 즉시 삭제되며\n이는 복구가 불가능합니다.'
          }
          confirmText="탈퇴하기"
        />

        <Modal
          isOpen={errorModal.isOpen}
          onClose={() => setErrorModal((prev) => ({ ...prev, isOpen: false }))}
          onConfirm={() => setErrorModal((prev) => ({ ...prev, isOpen: false }))}
          title={errorModal.title}
          message={errorModal.message}
          confirmText="확인"
        />
      </div>
    </div>
  );
};

export default MyPage;
