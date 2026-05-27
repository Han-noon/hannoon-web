import type { Notification } from '@/data/NotificationData';

interface NotificationItemProps {
  data: Notification;
  onDelete: (id: number) => void;
}

const NotificationItem = ({ data, onDelete }: NotificationItemProps) => {
  return (
    <li className="text-[#7f7f7f] w-full bg-white rounded-xl min-h-[90px] px-4 py-[10px] shadow-[0_1px_5px_0_rgba(0,0,0,0.13)] mb-3">
      <div className="flex justify-between text-xs mt-2 relative">
        {!data.isRead && (
          <div className="w-1 h-1 bg-red-600 rounded-full absolute bottom-[17px] -left-1"></div>
        )}
        <p>새로운 사건 • 방금 전</p>
        <div className="flex">
          <button
            type="button"
            className="text-white"
            onClick={() => onDelete(data.id)}
            aria-label="알림 개별 삭제"
          >
            <DeleteIcon />
          </button>
        </div>
      </div>
      <p className="text-gray47 text-[15px] pt-3 line-clamp-2">
        '{data.topic}'에 대한 새로운 사건이 등록되었습니다.
      </p>
    </li>
  );
};

export default NotificationItem;

const DeleteIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4 text-[#7f7f7f] hover:text-gray47"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        transform="translate(4 0)"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
};
