import NotificationBox from '@/layout/components/notification/NotificationBox';

const NotificationModalWrapper = () => {
  return (
    <div
      className="hidden md:block w-[390px] h-[500px] bg-[#f6f6f6] absolute top-8 -right-16
            z-[1000] rounded-xl shadow-[0_2px_11px_0_rgba(0,0,0,0.25)] overflow-hidden"
    >
      <div className="h-full overflow-y-auto overflow-x-hidden flex flex-col items-center">
        <p className="text-lg fw-700 mb-3 mt-6 text-gray47">알림센터</p>
        <NotificationBox />
      </div>
    </div>
  );
};

export default NotificationModalWrapper;
