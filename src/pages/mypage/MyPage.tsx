import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import ThemeCard from '@/components/ThemeCard';
import Pagination from '@/components/Pagination';
import Modal from './Modal';
import { getProfile } from '@/api/profile/getProfile';
import { updateProfileImage } from '@/api/profile/updateProfileImage';
import { getSubscriptions } from '@/api/topic/getSubscriptions';
import { deleteUser } from '@/api/auth/deleteUser';
import type { SubscribedTopic } from '@/api/topic/getSubscriptions';

// 👇 최근 본 사건 관련 임포트 주석 처리
// import { getViewedEvents } from '@/api/event/getViewedEvents';
// import NewsCard from '@/components/NewsCard';

const ITEMS_PER_PAGE = 6;

interface UserData {
  nickname: string;
  email: string;
  profileImage: string | null;
}

const MyPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // 현재는 'scrapped' 탭만 사용되도록 고정
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

  // 프로필 로드
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

  // 스크랩 탭 데이터 패칭 함수
  const fetchSubscriptions = useCallback(async (page: number) => {
    setIsTopicsLoading(true);
    try {
      const data = await getSubscriptions(page, ITEMS_PER_PAGE);
      setScrappedTopics(data.topics || []);
      setTotalCount(data.total_count || 0);
      setTotalPages(data.total_pages || 1);
    } catch (error) {
      console.error('스크랩 목록을 불러오지 못했습니다:', error);
    } finally {
      setIsTopicsLoading(false);
    }
  }, []);

  // 스크랩 탭 useEffect
  useEffect(() => {
    if (activeTab !== 'scrapped') return;
    fetchSubscriptions(currentPage);
  }, [activeTab, currentPage, fetchSubscriptions]);

  // 스크랩한 토픽 북마크 해제 (프론트에서 즉시 제거 + 페이지 동기화)
  const handleBookmarkToggle = (topicId: number, isSubscribed: boolean) => {
    if (!isSubscribed) {
      // 1. 현재 화면에 보이는 배열에서 해당 아이템을 즉시 필터링하여 제거
      const updatedTopics = scrappedTopics.filter(
        (t: any) => (t.id || t.topic_id || t.themeId) !== topicId
      );
      setScrappedTopics(updatedTopics);

      // 2. 전체 개수 즉시 감소
      const newTotalCount = Math.max(0, totalCount - 1);
      setTotalCount(newTotalCount);

      // 3. 새로운 전체 페이지 수 계산
      const newTotalPages = Math.max(1, Math.ceil(newTotalCount / ITEMS_PER_PAGE));
      setTotalPages(newTotalPages);

      // 4. 만약 현재 페이지가 새로 계산된 전체 페이지보다 크다면 이전 페이지로 이동
      if (currentPage > newTotalPages) {
        handlePageChange(newTotalPages);
      } else if (updatedTopics.length === 0 && currentPage > 1) {
        // 현재 페이지에 카드가 다 사라지고 1페이지가 아니라면 이전 페이지로 이동
        handlePageChange(currentPage - 1);
      } else {
        // 만약 현재 페이지 내에서 지워진 거라면, 다음 페이지에 있던 첫 번째 카드가 현재 페이지로 딸려오도록 서버 데이터를 다시 fetch
        fetchSubscriptions(currentPage);
      }
    }
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

      return scrappedTopics.map((topic: any) => {
        const targetId = topic.id || topic.topic_id || topic.themeId;
        return (
          <div
            key={targetId}
            className="block w-full h-full cursor-pointer no-underline text-inherit"
          >
            <ThemeCard
              id={targetId}
              category={topic.category || '미분류'}
              keyword={topic.keywords && topic.keywords.length > 0 ? topic.keywords[0] : '주요이슈'}
              title={topic.topic_title || topic.title || '제목 없음'}
              summary={topic.summary || ''}
              firstReportDate={topic.first_published_at || topic.created_at || ''}
              latestReportDate={
                topic.updated_at ? topic.updated_at.slice(0, 10).replaceAll('-', '.') : ''
              }
              isBookmarked={true} // 스크랩 탭에 있는 건 무조건 북마크 된 상태
              articleCount={topic.article_count ?? 0}
              bias={{
                left: topic.left_percent ?? 18,
                center: topic.mid_percent ?? 60,
                right: topic.right_percent ?? 22,
              }}
              imageUrl={topic.topic_image_url}
              onBookmarkToggle={handleBookmarkToggle} // 상태 변경 알림 받기
            />
          </div>
        );
      });
    }

    return null;
  };

  const currentTotalPages = totalPages;
  const currentTotalItems = totalCount;

  return (
    <div className="w-full pb-20">
      {isLoading && userData && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-white/50 backdrop-blur-sm">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
        </div>
      )}

      <div className="max-w-[1200px] mx-auto px-6 pt-10">
        <section className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-10">
          <div className="flex items-center space-x-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center border border-gray-200 shadow-sm overflow-hidden">
                <img
                  src={
                    userData.profileImage && userData.profileImage !== 'null'
                      ? userData.profileImage
                      : '/default-profile.png'
                  }
                  alt="프로필 이미지"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 min-h-[300px] items-start">
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
