import { notificationDummyData } from '@/data/NotificationData';
import type { Notification } from '@/data/NotificationData';
import NotificationItem from '@/layout/components/notification/NotificationItem';
import { useEffect, useRef, useState } from 'react';

const NotificationBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [noti, setNoti] = useState<Notification[]>(notificationDummyData);
  const NotiBoxRef = useRef<HTMLDivElement | null>(null);

  //포커스아웃 시 알림창 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (NotiBoxRef.current && !NotiBoxRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 알림 개별 삭제하기
  function deleteNoti(id: number) {
    if (!confirm('해당 알림을 삭제하시겠습니까?')) return;
    const newNotiList: Notification[] = noti?.filter((data) => data.id !== id);
    setNoti(newNotiList);
    console.log(noti);
  }

  function deleteAllNoti() {
    if (!confirm('모든 알림을 삭제하시겠습니까?')) return;
    setNoti([]);
  }

  return (
    <div ref={NotiBoxRef} className="relative">
      <button
        className="text-[#f6f6f6] text-sm cursor-pointer flex items-center"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="hidden md:inline">알림</span>
        <span className="md:hidden">
          <BellIcon />
        </span>
      </button>
      {isOpen && (
        <div
          className="
            w-[390px]
            h-[500px]
            bg-[#f6f6f6]
            absolute top-8 -right-16
            z-[1000]
            rounded-xl
            shadow-[0_2px_11px_0_rgba(0,0,0,0.25)]
            overflow-hidden
          "
        >
          <div className="h-full overflow-y-auto overflow-x-hidden flex flex-col items-center">
            <p className="text-lg fw-700 mb-3 mt-6 text-gray47">알림센터</p>
            {noti.length > 0 && (
              <>
                <button
                  onClick={deleteAllNoti}
                  className="text-sm text-[#7f7f7f] self-end mr-5 mb-1 hover:text-gray47"
                >
                  전체삭제
                </button>
                <ul className="w-[350px] flex flex-col items-center mb-3">
                  {noti.map((data: Notification) => (
                    <NotificationItem key={data.id} data={data} onDelete={deleteNoti} />
                  ))}
                </ul>
              </>
            )}
            {noti.length < 1 && (
              <div className="text-[#7f7f7f] text-sm h-full flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-full border border-gray-200 flex justify-center items-center">
                  <BellIcon />
                </div>
                <p className="mb-20 pt-4">받은 알림이 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBox;

const BellIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
      />
    </svg>
  );
};
