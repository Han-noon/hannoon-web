import useMediaQuery from '@/hooks/useMediaQuery';
import useRestoreNotification from '@/hooks/useRestoreNotification';
import NotificationBox from '@/layout/components/notification/NotificationBox';
import useNotificationStore from '@/store/notificationStore';
import { useNavigate } from 'react-router-dom';

const NotificationPage = () => {
  const { backgroundPath, close } = useNotificationStore();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const navigate = useNavigate();

  function onClose() {
    close();
    if (!isDesktop) navigate(backgroundPath); // 모바일 버전에서 이전 페이지로
  }

  // 새로고침 시 isOpen이 false가 되어 뒤로가기 버튼이 동작하지 않는 상황 방지
  useRestoreNotification();

  return (
    <div className="min-h-screen max-w-xl m-auto pt-8">
      <div className="w-full flex px-4 mb-2">
        <button onClick={() => onClose()} aria-label="뒤로가기">
          <ArrowIcon />
        </button>
        <p className="text-lg fw-700 mx-auto text-gray47 pr-[20px]">알림</p>
      </div>
      <div className="flex flex-col w-full min-h-[600px]">
        <NotificationBox />
      </div>
    </div>
  );
};

export default NotificationPage;

const ArrowIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-5"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
  );
};
