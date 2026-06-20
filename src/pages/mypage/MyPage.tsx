import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ThemeCard from '@/components/ThemeCard';
import Pagination from '@/components/Pagination';
import Modal from './Modal';
import { getProfile } from '@/api/profile/getProfile';
import { updateProfileImage } from '@/api/profile/updateProfileImage';
import { getSubscriptions } from '@/api/topic/getSubscriptions';
import { unsubscribeTopic } from '@/api/topic/unsubscribeTopic';
import { getViewedEvents } from '@/api/event/getViewedEvents';
import { deleteUser } from '@/api/auth/deleteUser';
import type { SubscribedTopic } from '@/api/topic/getSubscriptions';
import NewsCard from '@/components/NewsCard';

const ITEMS_PER_PAGE = 6;

interface UserData {
  nickname: string;
  email: string;
  profileImage: string | null;
}

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = (searchParams.get('tab') as 'scrapped' | 'recent') || 'scrapped';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // 프로필
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetchError, setIsFetchError] = useState<boolean>(false);

  // 스크랩한 토픽
  const [scrappedTopics, setScrappedTopics] = useState<SubscribedTopic[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isTopicsLoading, setIsTopicsLoading] = useState(false);

  // 최근 본 사건
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [recentTotalCount, setRecentTotalCount] = useState(0);
  const [recentTotalPages, setRecentTotalPages] = useState(1);
  const [isRecentLoading, setIsRecentLoading] = useState(false);

  // // 뉴스 카드 스크랩용 로컬 스토리지
  // const [scrappedNewsIds, setScrappedNewsIds] = useState<number[]>(() => {
  //   const saved = localStorage.getItem('scrappedNewsIds');
  //   return saved ? JSON.parse(saved) : [];
  // });

  // 모달
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [errorModal, setErrorModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({ isOpen: false, title: '', message: '' });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // 페이지 변경 함수
  const handlePageChange = (newPage: number) => {
    setSearchParams({ tab: activeTab, page: newPage.toString() });
  };

  // 페이지 변경 시 스크롤
  useEffect(() => {
    if (gridRef.current) {
      const yOffset = -80;
      const y = gridRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [currentPage]);

  // 프로필 로드 (최초 1회)
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const profileData = await getProfile();
        setUserData({
          nickname: profileData.name || '이름 없음',
          email: profileData.email || '',
          profileImage: profileData.profile_image_path || profileData.profile_image_url || null,
        });
        setIsFetchError(false);
      } catch (error) {
        console.error('프로필 정보를 불러오지 못했습니다:', error);
        setIsFetchError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 스크랩 탭 데이터 패칭
  useEffect(() => {
    if (activeTab !== 'scrapped') return;

    const fetchSubscriptions = async () => {
      setIsTopicsLoading(true);
      try {
        const data = await getSubscriptions(currentPage, ITEMS_PER_PAGE);
        setScrappedTopics(data.topics || []);
        setTotalCount(data.total_count || 0);
        setTotalPages(data.total_pages || 1);
      } catch (error) {
        console.error('스크랩 목록을 불러오지 못했습니다:', error);
      } finally {
        setIsTopicsLoading(false);
      }
    };

    fetchSubscriptions();
  }, [activeTab, currentPage]);

  // 최근 본 사건 탭 데이터 패칭
  useEffect(() => {
    if (activeTab !== 'recent') return;

    const fetchRecentEvents = async () => {
      setIsRecentLoading(true);
      try {
        const data = await getViewedEvents(currentPage, ITEMS_PER_PAGE);
        setRecentEvents(data.events || []);
        setRecentTotalCount(data.total_count || 0);
        setRecentTotalPages(data.total_pages || 1);
      } catch (error) {
        console.error('최근 본 사건 목록을 불러오지 못했습니다:', error);
      } finally {
        setIsRecentLoading(false);
      }
    };

    fetchRecentEvents();
  }, [activeTab, currentPage]);

  // 스크랩한 토픽 북마크 해제
  const handleBookmarkToggle = async (topicId: number) => {
    try {
      await unsubscribeTopic(topicId);
      setScrappedTopics((prev) => prev.filter((t) => t.id !== topicId));
      setTotalCount((prev) => prev - 1);

      if (scrappedTopics.length === 1 && currentPage > 1) {
        handlePageChange(currentPage - 1);
      }
    } catch (error) {
      console.error('스크랩 해제 실패:', error);
    }
  };

  // 최근 본 사건 뉴스 카드 북마크 토글
  // const handleEventBookmarkToggle = (newsId: number) => {
  //   setScrappedNewsIds((prev) => {
  //     const isCurrentlyScrapped = prev.includes(newsId);
  //     const updated = isCurrentlyScrapped ? prev.filter((id) => id !== newsId) : [...prev, newsId];
  //     localStorage.setItem('scrappedNewsIds', JSON.stringify(updated));
  //     return updated;
  //   });
  // };
  const handleSubscribeToggle = (targetThemeId: number, nextState: boolean) => {
    setRecentEvents((prevData) =>
      prevData.map((news) =>
        news.topic_id === targetThemeId
          ? { ...news, is_subscribed: nextState } // 토픽 ID가 같으면 스크랩 여부 변경
          : news
      )
    );
  };

  // 이미지 변경
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const newUrl = await updateProfileImage(file);
      setUserData((prev) => (prev ? { ...prev, profileImage: newUrl } : null));
    } catch (error) {
      console.error('이미지 변경 통신 에러:', error);
      setErrorModal({
        isOpen: true,
        title: '이미지 변경 실패',
        message: '서버와 통신 중 오류가 발생했습니다. \n다시 시도해 주세요.',
      });
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // 이미지 삭제
  const handleDeleteImage = async () => {
    setIsLoading(true);
    try {
      await updateProfileImage(null);
      setUserData((prev) => (prev ? { ...prev, profileImage: null } : null));
    } catch (error) {
      console.error('이미지 삭제 통신 에러:', error);
      setErrorModal({
        isOpen: true,
        title: '이미지 삭제 실패',
        message: '서버와 통신 중 오류가 발생했습니다. \n다시 시도해 주세요.',
      });
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  // 회원 탈퇴
  const handleWithdraw = async () => {
    try {
      await deleteUser();
      localStorage.clear();
      alert('탈퇴되었습니다.');
      window.location.href = '/';
    } catch (error) {
      console.error('탈퇴 처리 실패:', error);
      setErrorModal({
        isOpen: true,
        title: '탈퇴 실패',
        message: '서버와 통신 중 오류가 발생했습니다. \n다시 시도해 주세요.',
      });
    } finally {
      setIsWithdrawModalOpen(false);
    }
  };

  // 탭 전환
  const handleTabChange = (tab: 'scrapped' | 'recent') => {
    setSearchParams({ tab, page: '1' });
  };

  if (isLoading && !userData) {
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
    if (activeTab === 'scrapped') {
      if (isTopicsLoading) {
        return (
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        );
      }

      if (scrappedTopics.length === 0) {
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

      return scrappedTopics.map((topic) => (
        <ThemeCard
          key={topic.id}
          id={topic.id}
          category={topic.category || '미분류'}
          title={(topic as any).topic_title || topic.title || '제목 없음'}
          summary={topic.summary || ''}
          firstReportDate={
            topic.created_at ? topic.created_at.slice(0, 10).replaceAll('-', '.') : ''
          }
          latestReportDate={
            topic.updated_at ? topic.updated_at.slice(0, 10).replaceAll('-', '.') : ''
          }
          isBookmarked={true}
          onBookmarkToggle={handleBookmarkToggle}
        />
      ));
    }

    if (activeTab === 'recent') {
      if (isRecentLoading) {
        return (
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        );
      }

      if (recentEvents.length === 0) {
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

      return recentEvents.map((news) => {
        if (!news) return null;

        // const newsId = news.event_id || news.id;
        // const topicId = news.topic_id || news.themeId || 1;

        // const title = news.event_title || news.title || '제목 없음';

        // const category = news.category || news.event_category || '미분류';
        // const summary = news.summary || news.event_summary || '';
        // const dateStr = news.created_at || news.date || '';

        return (
          <div key={news.event_id} onClick={() => navigate(`/event-detail/${news.event_id}`)}>
            <NewsCard
              key={news.event_id}
              id={news.event_id}
              themeId={news.topic_id}
              topic={news.topic_title || '미분류'}
              title={news.event_title || '제목 없음'}
              summary={news.summary || ''}
              date={news.created_at ? news.created_at.slice(0, 10).replaceAll('-', '.') : ''}
              isBookmarked={news.is_subscribed}
              onSubscribeToggle={handleSubscribeToggle}
              //onBookmarkToggle={handleBookmarkToggle}
            />
          </div>
        );
      });
    }

    return null;
  };

  const currentTotalPages = activeTab === 'scrapped' ? totalPages : recentTotalPages;
  const currentTotalItems = activeTab === 'scrapped' ? totalCount : recentTotalCount;

  return (
    <div className="w-full pb-20">
      {isLoading && userData && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-white/50 backdrop-blur-sm">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
        </div>
      )}

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
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes('default-profile.png')) {
                      target.src = '/default-profile.png';
                    }
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
              <p className="text-[34px] font-bold text-black leading-none">{totalCount}</p>
            </div>
          </div>
        </section>

        <div
          ref={gridRef}
          className="flex items-end justify-between mb-10 border-b border-gray-300"
        >
          <div className="flex space-x-8">
            <button
              onClick={() => handleTabChange('scrapped')}
              className={`text-[14px] pb-1 transition-all ${activeTab === 'scrapped' ? 'font-bold text-black border-b-2 border-black' : 'text-gray-300 font-normal hover:text-gray-500'}`}
            >
              스크랩한 토픽
            </button>
            <button
              onClick={() => handleTabChange('recent')}
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
            totalPages={currentTotalPages}
            onPageChange={handlePageChange}
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
