import { subscribeTopic } from '@/api/topic/subscribeTopic';
import { unsubscribeTopic } from '@/api/topic/unsubscribeTopic';
import NotificationPermissionModal from '@/components/NotificationPermissionModal';
import SubscribeModal from '@/components/SubscribeModal';
import useSession from '@/hooks/useSession';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface NewsCardProps {
  id: number;
  themeId: number;
  topic?: string;
  title?: string;
  summary?: string;
  date?: string;
  variant?: 'default' | 'long';
  isBookmarked: boolean;
  onSubscribeToggle: (themeId: number, nextState: boolean) => void;
  //onBookmarkToggle: (newsId: number) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({
  id,
  themeId,
  topic = '미분류',
  title = '제목 없음',
  summary = '',
  date = '',
  variant = 'default',
  isBookmarked,
  onSubscribeToggle,
  //onBookmarkToggle,
}) => {
  const isLong = variant === 'long';
  const cleanSummary = (summary || '').replace(/^AI 요약:\s*/, '');
  const navigate = useNavigate();

  //   비회원용
  // const handleCardClick = () => {
  //   const recent = JSON.parse(localStorage.getItem('recentViewedNews') || '[]');
  //   const newItem = { id, themeId, topic, title, summary, date };
  //   const filtered = [newItem, ...recent.filter((item: any) => item.id !== id)].slice(0, 50);
  //   localStorage.setItem('recentViewedNews', JSON.stringify(filtered));
  // };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const { session } = useSession();

  const handleSubscribe = async () => {
    if (!session) {
      if (confirm('로그인이 필요한 기능입니다. 로그인하시겠습니까?')) return navigate('/signin');
      else return;
    }

    if (!isBookmarked) {
      let permission = Notification.permission;

      if (permission === 'default') {
        permission = await Notification.requestPermission();
      }

      if (permission !== 'granted') {
        setShowPermissionModal(true);
        return;
      }

      const data = await subscribeTopic(themeId);

      if (data.is_subscribed) {
        onSubscribeToggle(themeId, true);
        setIsModalOpen(true);
      }
    } else {
      try {
        await unsubscribeTopic(themeId);
        onSubscribeToggle(themeId, false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <SubscribeModal
        isOpen={isModalOpen}
        topicTitle={topic}
        onClose={() => setIsModalOpen(false)}
      />

      <NotificationPermissionModal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
      />

      <div
        //onClick={handleCardClick}
        onClick={() => navigate(`/event-detail/${id}`)}
        className={`
        ${isLong ? 'bg-[#F3F3F4]' : 'bg-white'} 
        border border-[#D7D7D7] rounded-[8px] flex flex-col overflow-hidden h-[185px] w-full 
        hover:shadow-sm transition-all group cursor-pointer
      `}
      >
        <div className="px-[18px] pt-[10px] pb-[4px] flex justify-between items-center">
          <span className="text-[11px] font-medium text-gray-400">{topic}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              //onBookmarkToggle(themeId);
              handleSubscribe();
            }}
            className={`transition-colors ${isBookmarked ? 'text-[#474747]' : 'text-gray-300 hover:text-[#474747]'}`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={isBookmarked ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
        </div>
        <div className="mx-[18px] border-b border-[#D7D7D7]" />
        <div className="px-[18px] pt-[8px] pb-[2px] flex-grow overflow-hidden">
          <h3 className="text-[18px] font-bold text-black mb-1.5 leading-[1.25] break-keep line-clamp-2">
            {title}
          </h3>
          <p className="text-[12px] text-gray-500 line-clamp-2 leading-relaxed font-light">
            <span className="font-semibold text-[#474747]">AI 요약: </span>
            {cleanSummary}
          </p>
        </div>
        <div className="px-[18px] pb-[14px] text-[11px] text-[#474747]">
          최초 보도: <span className="font-semibold">{date}</span>
        </div>
      </div>
    </>
  );
};

export default NewsCard;
