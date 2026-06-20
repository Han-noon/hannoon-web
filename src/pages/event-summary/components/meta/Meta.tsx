import { subscribeTopic } from '@/api/topic/subscribeTopic';
import { unsubscribeTopic } from '@/api/topic/unsubscribeTopic';
import NotificationPermissionModal from '@/components/NotificationPermissionModal';
import SubscribeModal from '@/components/SubscribeModal';
import useSession from '@/hooks/useSession';
import type { EventSummary } from '@/types/eventSummary';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Meta = ({ event }: { event: EventSummary }) => {
  //const [showToast, setShowToast] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [subscribe, setSubscribe] = useState(event.is_subscribed);

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

      const data = await subscribeTopic(event.topic_id);

      setSubscribe(data.is_subscribed);

      if (data.is_subscribed) {
        setIsModalOpen(true);
      }
    } else {
      try {
        await unsubscribeTopic(event.topic_id);
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
        topicTitle={event.topic_title}
        onClose={() => setIsModalOpen(false)}
      />

      <NotificationPermissionModal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
      />

      {/* 상단 */}
      <div className="flex justify-between items-center border-b-4 border-gray47 pb-1 text-sm md:text-base">
        <p>사건요약</p>
        <p className="text-base md:text-xl">{event.category}</p>
        <button
          className="border-b border-gray47 hover:border-blue-600 hover:text-blue-600"
          onClick={handleSubscribe}
        >
          {subscribe ? '구독취소' : '구독하기'}
        </button>
      </div>

      {/* 하단 */}
      <div className="min-h-32 md:h-48 lg:h-32 flex flex-wrap lg:flex-nowrap justify-between border-y-2 border-gray47 mt-2 text-xs">
        <div className="w-1/2 lg:min-w-72 lg:w-72 border-b-2 lg:border-b-0 border-r-2 border-gray47 flex items-center pl-3 md:pl-7 order-1 ">
          {/* <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-slate-500"></div> */}
          {/* <div className="ml-2 md:ml-4"> */}
          <div className="">
            <p className="text-gray-700">최초 보도</p>
            <p className="text-sm md:text-base">
              {event.created_at.slice(0, 10).replaceAll('-', '.')}
            </p>
          </div>
        </div>
        <div className="py-2 w-full lg:w-auto flex flex-col justify-center items-center order-3 lg:order-2">
          <p>[ {event.topic_title} ]</p>
          <h1 className="text-lg md:text-2xl font-bold md:pb-4 md:mt-1 text-center">
            {event.event_title}
          </h1>
        </div>
        <div
          className="w-1/2 lg:min-w-72 lg:w-72 border-b-2 lg:border-b-0 lg:border-l-2 border-gray47 flex items-center 
          justify-end pr-3 md:pr-7 gap-10 order-2 lg:order-3 py-1"
        >
          <div className="text-right">
            <p className="text-gray-700">
              최근 업데이트<span className="sm:hidden"> / 분석 기사 수</span>
            </p>
            <p className="text-sm md:text-base">
              {event.updated_at.slice(0, 10).replaceAll('-', '.')}
              <span className="sm:hidden"> / {event.article_count}</span>
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-gray-700">분석 기사 수</p>
            <p className="text-sm md:text-base">{event.article_count}개</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Meta;
