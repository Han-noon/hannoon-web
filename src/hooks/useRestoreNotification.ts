import { useEffect } from 'react';
import useNotificationStore from '@/store/notificationStore';

const useRestoreNotification = () => {
  const { backgroundPath, open } = useNotificationStore();

  // 알림 페이지 새로고침 후 상태 복구
  useEffect(() => {
    const navigationEntries = performance.getEntriesByType(
      'navigation'
    ) as PerformanceNavigationTiming[];

    const isReload = navigationEntries[0]?.type === 'reload';

    // 새로고침이면 기존 값 복구
    if (backgroundPath === '' && isReload) {
      const bgPath = sessionStorage.getItem('bgPath');

      if (bgPath) {
        open(bgPath);
      }
    }
  }, []);

  // 상태 저장
  useEffect(() => {
    // 일반 진입이면 현재 값 저장
    if (backgroundPath) {
      sessionStorage.setItem('bgPath', backgroundPath);
    }
  }, [backgroundPath]);
};

export default useRestoreNotification;
