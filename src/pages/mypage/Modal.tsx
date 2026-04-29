import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-6">
      {/* 모달 박스 */}
      <div className="bg-white rounded-[12px] w-full max-w-[360px] overflow-hidden shadow-2xl">
        <div className="p-8 text-center">
          <h3 className="text-[20px] font-bold text-black mb-3">{title}</h3>
          <p className="text-[14px] text-gray-400 font-light leading-relaxed">{message}</p>
        </div>

        {/* 하단 버튼 영역 */}
        <div className="flex border-t border-gray-100">
          <button
            onClick={onClose}
            className="flex-1 py-4 text-[14px] font-medium text-gray-400 hover:bg-gray-50 transition-colors border-r border-gray-100"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-4 text-[14px] font-bold text-red-500 hover:bg-red-50 transition-colors"
          >
            탈퇴하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
