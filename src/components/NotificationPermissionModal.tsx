interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPermissionModal = ({ isOpen, onClose }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 w-[90%] max-w-md rounded-2xl bg-white p-6">
        <h2 className="text-xl font-bold text-center mb-4">알림 권한 필요</h2>

        <p className="text-center text-gray-600">
          새로운 사건 알림을 받으려면
          <br />
          브라우저 알림 권한을 허용해야 합니다.
        </p>

        <div className="mt-4 rounded-lg bg-gray-100 p-4 text-sm">
          Chrome 기준
          <br />
          주소창 왼쪽 자물쇠 클릭
          <br />
          → 사이트 설정
          <br />→ 알림 허용
        </div>

        <button onClick={onClose} className="mt-6 w-full rounded-lg bg-gray47 py-3 text-white">
          확인
        </button>
      </div>
    </div>
  );
};

export default NotificationPermissionModal;
