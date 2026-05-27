import Pagination from '@/components/Pagination';
import { notificationDummyData } from '@/data/NotificationData';
import type { Notification } from '@/data/NotificationData';
import NotificationItem from '@/layout/components/notification/NotificationItem';
import { useState } from 'react';

const NotificationBox = () => {
  const [noti, setNoti] = useState<Notification[]>(notificationDummyData);
  const [currentPage, setCurrentPage] = useState(1);

  // 알림 개별 삭제
  function deleteNoti(id: number) {
    if (!confirm('해당 알림을 삭제하시겠습니까?')) return;
    const newNotiList: Notification[] = noti?.filter((data) => data.id !== id);
    setNoti(newNotiList);
  }

  // 알림 전체 삭제
  function deleteAllNoti() {
    if (!confirm('모든 알림을 삭제하시겠습니까?')) return;
    setNoti([]);
  }

  return (
    <>
      {noti.length > 0 && (
        <>
          <button
            onClick={deleteAllNoti}
            className="text-sm text-[#7f7f7f] self-end mr-5 mb-1 hover:text-gray47"
          >
            전체삭제
          </button>
          <ul className="w-full px-4 flex flex-col items-center">
            {noti.map((data: Notification) => (
              <NotificationItem key={data.id} data={data} onDelete={deleteNoti} />
            ))}
          </ul>
          <Pagination currentPage={currentPage} totalPages={3} onPageChange={setCurrentPage} />
        </>
      )}
      {noti.length < 1 && (
        <div className="text-[#7f7f7f] text-sm h-full flex flex-col items-center justify-center mt-40 md:mt-0">
          <div className="w-10 h-10 rounded-full border border-gray-200 flex justify-center items-center">
            <BellIcon />
          </div>
          <p className="mb-20 pt-4">받은 알림이 없습니다.</p>
        </div>
      )}
    </>
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
