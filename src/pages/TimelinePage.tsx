import { useState, useEffect, useRef } from 'react';
import { getEventsByTopic } from '@/api/event/getEventsByTopic';
import { getTopicById } from '@/api/topic/getTopicById';
import type { TopicResponse } from '@/api/topic/getTopicById';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { EventResponse } from '@/types/timeline';
import { useLocation } from 'react-router-dom';
import useSession from '@/hooks/useSession';
import { subscribeTopic } from '@/api/topic/subscribeTopic';
import { unsubscribeTopic } from '@/api/topic/unsubscribeTopic';
import SubscribeModal from '@/components/SubscribeModal';
import NotificationPermissionModal from '@/components/NotificationPermissionModal';
import Spinner from '@/components/Spinner';

const TimelinePage = () => {
  //const [showToast, setShowToast] = useState(false);
  const [isAscending, setIsAscending] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [eventsdata, setEventsdata] = useState<EventResponse | null>(null);
  const [topicData, setTopicData] = useState<TopicResponse | null>(null);

  const { topic_id } = useParams();
  // 임시: 토픽 조회 시 구독 정보 필요
  const { state } = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [subscribe, setSubscribe] = useState(state.is_subscribed);

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

      const data = await subscribeTopic(Number(topic_id));

      setSubscribe(data.is_subscribed);

      if (data.is_subscribed) {
        setIsModalOpen(true);
      }
    } else {
      try {
        await unsubscribeTopic(Number(topic_id));
        setSubscribe(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const data = await getTopicById(Number(topic_id) || 1);
        setTopicData(data);
      } catch (error) {
        console.error('토픽 조회 실패:', error);
      }
    };

    fetchTopic();
  }, [topic_id]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEventsByTopic({
          p_cursor_id: null,
          p_order: isAscending ? 'asc' : 'desc',
          p_size: 20,
          p_topic_id: Number(topic_id) || 1,
        });

        setEventsdata(data);
        setSelectedId(data.events[0].id);
        console.log('결과:', data);
      } catch (error) {
        console.error('데이터 페칭 실패:', error);
      }
    };

    fetchEvents();
  }, [topic_id, isAscending]);

  // const handleAlertClick = () => {
  //   setShowToast(true);
  //   setTimeout(() => setShowToast(false), 3000);
  // };

  const toggleSortOrder = () => {
    setIsAscending((prev) => !prev);
  };

  const activeItem =
    eventsdata?.events.find((item) => item.id === selectedId) || eventsdata?.events[0];

  return (
    <>
      {!eventsdata ? (
        <div className="mt-44 md:my-44 text-center">
          <Spinner />
        </div>
      ) : (
        <main className="w-full max-w-[1150px] mx-auto bg-white min-h-screen text-black pb-20 relative font-sans">
          {/* {showToast && (
        <div className="text-center w-3/4 md:w-auto text-sm md:text-base px-6 py-3 fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#474747] text-white rounded-full shadow-lg z-50 transition-opacity duration-300">
          실시간 알림 신청이 완료되었습니다!
        </div>
      )} */}
          <SubscribeModal
            isOpen={isModalOpen}
            topicTitle={topicData?.title ?? ''}
            onClose={() => setIsModalOpen(false)}
          />

          <NotificationPermissionModal
            isOpen={showPermissionModal}
            onClose={() => setShowPermissionModal(false)}
          />

          <div className="flex justify-between items-center border-b-4 border-gray47 pb-1 text-sm md:text-base">
            <p className="text-sm mt-2 text-gray-500">
              {topicData?.category ?? ''} &gt; [ 토픽 ] {topicData?.title ?? ''}
            </p>
            {/* <p className="text-base md:text-xl">{event.category}</p> */}
            <button
              className="bg-gray47 py-1 px-3 text-sm text-white rounded-full hover:bg-[#211D1E]"
              onClick={handleSubscribe}
            >
              {subscribe ? '구독취소' : '타임라인 구독하기'}
            </button>
          </div>

          <div className="min-h-30 h-28 md:h-40 border-y-2 border-gray47 mt-2 text-xs flex flex-col items-center justify-center">
            <p className="bg-gray47 text-white py-[3px] px-4 rounded-full flex items-center">
              토픽
            </p>
            <h1 className="text-center text-[24px] md:text-[32px] text-base font-bold tracking-tight mt-4 mb-5">
              # {topicData?.title ?? ''}
            </h1>
          </div>

          <div className="mb-5">
            <button
              onClick={toggleSortOrder}
              className="ml-2 my-5 text-white items-center gap-1.5 bg-[#575052] px-3.5 py-1.5 border rounded-md hover:bg-[#211D1E] transition-colors inline-flex"
            >
              <div className="flex flex-col gap-[3px] text-white">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={
                    !isAscending ? 'rotate-180 transition-transform' : 'transition-transform'
                  }
                >
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={
                    !isAscending ? 'rotate-180 transition-transform' : 'transition-transform'
                  }
                >
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
              </div>
              <span className="text-sm tracking-[1.5px] font-medium mt-0.5">
                {isAscending ? '과거순' : '최신순'}
              </span>
            </button>
          </div>

          <section className="flex flex-col lg:flex-row lg:justify-between">
            <div className="w-full lg:w-1/2 relative pl-2">
              <div className="absolute left-[19px] lg:left-[19px] top-[14px] bottom-[14px] w-[2px] bg-[#474747] z-0"></div>
              <ul className="flex flex-col gap-8 md:gap-14 relative z-10 m-0 p-0 list-none">
                {eventsdata?.events.map((item, i) => {
                  const isActive = item.id === selectedId;
                  return (
                    <li key={item.id} className="flex items-start gap-4 md:gap-5 w-full">
                      <div className="relative w-6 h-6 flex-shrink-0 flex items-center justify-center bg-white z-10 mt-[3px]">
                        <div className="w-2.5 h-2.5 bg-[#474747] rounded-full"></div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedId(item.id);

                          if (window.innerWidth < 1024) {
                            articleRef.current?.scrollIntoView({
                              behavior: 'smooth',
                              block: 'start',
                            });
                          }
                        }}
                        className={`group text-left break-words w-full transition-colors mt-[3px] ${
                          isActive
                            ? 'font-bold text-gray47'
                            : 'font-medium text-[#999999] hover:text-black'
                        }`}
                      >
                        <div className="text-md flex items-center gap-1 mb-1">
                          <p
                            className={`border px-2 fw-700 rounded-md h-[20px] text-xs flex items-center transition-colors
                        ${
                          isActive
                            ? 'bg-[#474747] text-white border-[#474747]'
                            : 'border-[#999999] text-[#999999] group-hover:border-black group-hover:text-black'
                        }`}
                          >
                            이슈{i + 1}
                          </p>

                          <p>{item.created_at.slice(0, 10).replaceAll('-', '.')}</p>
                        </div>

                        <span className="text-[17px] md:text-lg leading-tight block">
                          {item.title}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <article
              ref={articleRef}
              className="w-full lg:w-1/2 flex flex-col items-center min-w-0"
            >
              <div className="w-full mb-5">
                <img
                  src={activeItem?.event_image_url ?? undefined}
                  alt={activeItem?.title}
                  className="w-full aspect-video object-cover rounded-sm md:mb-1 bg-[#ccc] shadow-sm transition-opacity duration-300"
                />
              </div>
              <div className="text-[18px] leading-relaxed md:leading-[36px] text-gray47 mb-12 font-medium w-full">
                <p>{activeItem?.summary}</p>
              </div>
              <div className="mt-15 self-end bg-gray47 py-1 px-5 text-xs text-white rounded-full hover:bg-[#211D1E]">
                <Link
                  to={`/event-detail/${activeItem?.id}`}
                  className="text-base md:text-md flex items-center"
                >
                  이슈 상세 보기
                  <span aria-hidden="true" className="font-normal">
                    →
                  </span>
                </Link>
              </div>
            </article>
          </section>
        </main>
      )}
    </>
  );
};

export default TimelinePage;
