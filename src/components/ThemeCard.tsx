import { subscribeTopic } from '@/api/topic/subscribeTopic';
import { unsubscribeTopic } from '@/api/topic/unsubscribeTopic';
import NotificationPermissionModal from '@/components/NotificationPermissionModal';
import SubscribeModal from '@/components/SubscribeModal';
import useSession from '@/hooks/useSession';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface ThemeCardProps {
  id: number;
  category: string;
  keyword?: string; // ex: 기준금리
  title: string;
  summary: string;
  firstReportDate: string;
  latestReportDate?: string;
  isBookmarked: boolean;
  articleCount?: number; // 관련 기사 개수
  bias?: { left: number; center: number; right: number }; // 성향 퍼센트
  imageUrl?: string; // 썸네일 이미지
}

// 날짜 문자열(ISO 형태 등)을 YYYY.MM.DD 형식으로 변환해주는 파싱 함수
const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  // 유효하지 않은 날짜 문자열일 경우 기존 문자열 반환
  if (isNaN(date.getTime())) {
    return dateStr;
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

const ThemeCard: React.FC<ThemeCardProps> = ({
  id,
  category,
  keyword = '키워드',
  title,
  summary,
  firstReportDate,
  isBookmarked,
  articleCount = 0,
  bias = { left: 18, center: 60, right: 22 },
  imageUrl = 'https://via.placeholder.com/400x200?text=News+Thumbnail',
}) => {
  const cleanSummary = summary.replace(/^AI 요약:\s*/, '');

  // 전달된 firstReportDate(created_at)를 YYYY.MM.DD 포맷으로 파싱
  const formattedFirstReportDate = formatDate(firstReportDate);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [subscribe, setSubscribe] = useState(isBookmarked);

  const { session } = useSession();
  const navigate = useNavigate();

  const handleSubscribe = async () => {
    if (!session) {
      if (confirm('로그인이 필요한 기능입니다. 로그인하시겠습니까?')) return navigate('/signin');
      else return;
    }

    if (!subscribe) {
      let permission = Notification.permission;
      if (permission === 'default') {
        permission = await Notification.requestPermission();
      }

      if (permission !== 'granted') {
        setShowPermissionModal(true);
        return;
      }

      const data = await subscribeTopic(id);
      setSubscribe(data.is_subscribed);

      if (data.is_subscribed) {
        setIsModalOpen(true);
      }
    } else {
      try {
        await unsubscribeTopic(id);
        setSubscribe(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <SubscribeModal
        isOpen={isModalOpen}
        topicTitle={title}
        onClose={() => setIsModalOpen(false)}
      />
      <NotificationPermissionModal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
      />

      <div
        className="relative w-full bg-white border border-gray-200 rounded-[14px] flex flex-col overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
        onClick={() =>
          navigate(`/timeline/${id}`, {
            state: { is_subscribed: subscribe },
          })
        }
      >
        {/* 상단 썸네일 이미지 영역 */}
        <div className="w-full h-[150px] bg-gray-200 overflow-hidden relative">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* 본문 콘텐츠 영역 */}
        <div className="p-5 flex flex-col flex-grow">
          {/* 카테고리, 해시태그 & 북마크 */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex gap-1.5 text-[12px] font-bold">
              <span className="text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                {category}
              </span>
              <span className="text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                #{keyword}
              </span>
            </div>

            {/* 북마크 아이콘 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSubscribe();
              }}
              className={`transition-transform hover:scale-110 ${subscribe ? 'text-purple-600' : 'text-gray-300 hover:text-gray-400'}`}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill={subscribe ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </button>
          </div>

          {/* 제목 */}
          <h3 className="text-[17px] font-bold text-gray-900 mb-4 leading-[1.4] line-clamp-2 break-keep">
            {title}
          </h3>

          {/* AI 요약 박스 */}
          <div className="bg-[#F8F9FA] rounded-xl p-4 mb-5 border border-gray-100">
            <p className="text-blue-600 font-bold text-[13px] mb-1.5">AI 요약</p>
            <p className="text-[13px] text-gray-600 leading-[1.6] line-clamp-3 break-keep">
              {cleanSummary}
            </p>
          </div>

          {/* 하단 정보 & 성향 통계 */}
          <div className="mt-auto">
            <div className="flex justify-between items-center text-[12px] text-gray-500 mb-2.5">
              <span>최초 보도 | {formattedFirstReportDate}</span>
              <span>관련 기사 {articleCount}개</span>
            </div>

            {/* 성향 바 */}
            <div className="w-full h-1.5 flex rounded-full overflow-hidden mb-2.5">
              <div className="bg-blue-600 h-full" style={{ width: `${bias.left}%` }}></div>
              <div className="bg-purple-500 h-full" style={{ width: `${bias.center}%` }}></div>
              <div className="bg-red-500 h-full" style={{ width: `${bias.right}%` }}></div>
            </div>

            <div className="flex justify-between items-center text-[12px]">
              <div className="flex gap-2.5 font-bold tracking-tight">
                <span className="text-blue-600">진보 {bias.left}%</span>
                <span className="text-purple-500">중도 {bias.center}%</span>
                <span className="text-red-500">보수 {bias.right}%</span>
              </div>
              <div className="text-gray-600 font-medium flex items-center gap-0.5">
                타임라인 보기
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThemeCard;
