import { deleteAllNotification } from '@/api/notification/deleteAllNotifications';
import { deleteNotification } from '@/api/notification/deleteNotification';
import { getNotifications } from '@/api/notification/getNotifications';
import Pagination from '@/components/Pagination';
import Spinner from '@/components/Spinner';
import NotificationItem from '@/layout/components/notification/NotificationItem';
import type { NotificationList, Notification } from '@/types/notification';
import { useEffect, useState } from 'react';

const NotificationBox = () => {
  const [notificationsData, setNotificationsData] = useState<NotificationList | null>(null);
  const [noti, setNoti] = useState<Notification[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // 알림 개별 삭제
  async function deleteNoti(id: number) {
    if (!confirm('해당 알림을 삭제하시겠습니까?')) return;

    try {
      await deleteNotification(id);

      if (noti?.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        await fetchNotification();
      }
    } catch (error) {
      console.error('삭제 중 오류 발생:', error);
    }
    // TODO: 요청 구조 개선
    // const newNotiList: Notification[] = noti?.filter((data) => data.id !== id) ?? [];
    // setNoti(newNotiList);
    // deleteNotification(id);
  }

  // 알림 전체 삭제
  async function deleteAllNoti() {
    if (!confirm('모든 알림을 삭제하시겠습니까?')) return;

    try {
      await deleteAllNotification();
      setNoti([]);
    } catch (error) {
      console.error('전체 삭제 중 오류 발생:', error);
    }

    // setNoti([]);
    // deleteAllNotification();
  }

  // 알림 리스트 조회 요청
  async function fetchNotification() {
    try {
      const data = await getNotifications(currentPage);
      setNotificationsData(data);
      setNoti(data.notifications);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    fetchNotification();
  }, [currentPage]);

  return (
    <>
      {!noti ? (
        <div className="mt-44 md:mt-36 text-center">
          <Spinner />
        </div>
      ) : (
        noti.length > 0 && (
          <>
            <button
              onClick={deleteAllNoti}
              className="text-sm text-[#7f7f7f] self-end mr-5 mb-1 hover:text-gray47"
            >
              전체삭제
            </button>
            <ul className="w-full mb-auto md:min-h-[290px] px-4 flex flex-col items-center">
              {noti.map((data: Notification) => (
                <NotificationItem key={data.id} data={data} onDelete={deleteNoti} />
              ))}
            </ul>
            <Pagination
              currentPage={currentPage}
              totalPages={notificationsData?.total_pages || 1}
              onPageChange={setCurrentPage}
            />
          </>
        )
      )}
      {noti && noti.length < 1 && (
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
