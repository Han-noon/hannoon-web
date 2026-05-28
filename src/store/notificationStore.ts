import { create } from 'zustand';

type NotificationStore = {
  isOpen: boolean;
  backgroundPath: string; // 알림 열기 전 페이지 기억
  open: (from: string) => void;
  close: () => void;
};

const useNotificationStore = create<NotificationStore>((set) => ({
  isOpen: false,
  backgroundPath: '',

  open: (from) => set({ isOpen: true, backgroundPath: from }),

  close: () =>
    set({
      isOpen: false,
    }),
}));

export default useNotificationStore;
