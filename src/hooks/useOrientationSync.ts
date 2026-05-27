import useMediaQuery from '@/hooks/useMediaQuery';
import useNotificationStore from '@/store/notificationStore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useOrientationSync = () => {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { isOpen, backgroundPath } = useNotificationStore();

  useEffect(() => {
    if (!isOpen) return;

    if (isDesktop && location.pathname === '/notification') {
      // md 미만 -> md 이상: URL만 backgroundPath로 되돌림
      navigate(backgroundPath, { replace: true });
    }

    if (!isDesktop && location.pathname !== '/notification') {
      // md 이상 -> md 미만: /notification으로 라우팅
      navigate('/notification', { replace: true });
    }
  }, [isDesktop]);
};

export default useOrientationSync;
