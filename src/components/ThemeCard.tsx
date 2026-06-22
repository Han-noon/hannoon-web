import { subscribeTopic } from '@/api/topic/subscribeTopic';
import { unsubscribeTopic } from '@/api/topic/unsubscribeTopic';
import NotificationPermissionModal from '@/components/NotificationPermissionModal';
import SubscribeModal from '@/components/SubscribeModal';
import useSession from '@/hooks/useSession';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ThemeCardProps {
  id: number;
  category: string;
  title: string;
  summary: string;
  firstReportDate: string;
  latestReportDate: string;
  isBookmarked: boolean;
  //onBookmarkToggle: (id: number) => void;
}

const ThemeCard: React.FC<ThemeCardProps> = ({
  id,
  category,
  title,
  summary,
  firstReportDate,
  latestReportDate,
  isBookmarked,
  //onBookmarkToggle,
}) => {
  const cleanSummary = summary.replace(/^AI 요약:\s*/, '');

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
        style={{ minHeight: '280px' }}
        className="relative w-full bg-white border border-[#D7D7D7] rounded-[8px] 
                   flex flex-col overflow-hidden hover:shadow-sm transition-all group cursor-pointer hover:bg-[#f1f1f1]"
        onClick={() =>
          navigate(`/timeline/${id}`, {
            state: {
              is_subscribed: subscribe,
            },
          })
        }
      >
        {/* 상단 영역 */}
        <div className="px-[18px] pt-[18px] pb-[10px] flex justify-between items-center">
          <span className="px-4 flex justify-center bg-[#53474a] text-white text-[11px] rounded-full uppercase tracking-wider">
            {category}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSubscribe();
            }}
            className={`transition-colors ${subscribe ? 'text-[#474747]' : 'text-gray-300 hover:text-[#474747]'}`}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={subscribe ? 'currentColor' : 'white'}
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>

        {/* 본문 섹션 */}
        <div className="px-[18px] pt-[10px] flex-grow overflow-hidden">
          <h3 className="text-[18px] font-bold text-black mb-1.5 leading-[1.5] break-keep line-clamp-2 min-h-[44px]">
            # {title}
          </h3>
          <p className="text-[12px] text-gray-500 line-clamp-3 leading-[1.7] mt-4">
            <b className=" text-[#474747]">AI 요약: </b>
            {cleanSummary}
          </p>
        </div>

        {/* 하단 날짜 */}
        <div className="border-t border-[#e5e7eb] px-[18px] py-3 text-xs text-[#474747] flex flex-col gap-1.5 mt-auto">
          <div className="flex items-center">
            <span className="w-14 text-gray-400">최초 이슈:</span>
            <span>{firstReportDate}</span>
          </div>
          <div className="flex items-center">
            <span className="w-14 text-gray-400">최신 이슈:</span>
            <span>{latestReportDate}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThemeCard;
