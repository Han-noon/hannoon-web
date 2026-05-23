import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[340px] rounded-[16px] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        {/* 높이 조절 */}
        <div className="pt-7 pb-6 px-5 text-center">
          <h2 className="text-[18px] font-bold text-black mb-2 tracking-tight">{title}</h2>
          <p className="text-[13px] text-gray-500 leading-relaxed font-normal break-keep whitespace-pre-wrap">
            {message}
          </p>
        </div>

        <div className="flex border-t border-gray-100 h-[50px]">
          <button
            onClick={onClose}
            className="flex-1 text-[14px] text-gray-400 font-medium hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <div className="w-[1px] bg-gray-100" />
          <button
            onClick={onConfirm}
            className="flex-1 text-[14px] text-black font-bold hover:bg-gray-50 transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
