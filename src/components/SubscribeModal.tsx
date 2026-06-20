interface SubscribeModalProps {
  isOpen: boolean;
  topicTitle: string;
  onClose: () => void;
}

const SubscribeModal = ({ isOpen, topicTitle, onClose }: SubscribeModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 */}
      <div className="absolute inset-0 bg-black/50" />

      {/* 모달 */}
      <div className="relative z-10 w-[90%] max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="text-center">
          <h2 className="text-lg md:text-xl font-bold mb-4">토픽 구독 완료</h2>

          <div className="text-sm md:text-base text-gray-700 break-keep">
            <p className="fw-400 mb-2">[{topicTitle}]</p>
            해당 토픽과 관련된 새로운 사건이 등록되면 알림으로 안내해 드립니다.
          </div>

          <button
            onClick={onClose}
            className="mt-6 w-full rounded-lg bg-gray47 py-3 text-white font-medium transition hover:opacity-90"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscribeModal;
