import { useEffect, useRef } from 'react';
import OneSignal from 'react-onesignal';
import { supabase } from '@/lib/supabase';

const useOneSignalAuth = (ready: boolean) => {
  const currentUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!ready) return;

    let mounted = true;

    const syncCurrentSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      const userId = session?.user?.id;

      if (!userId) return;

      if (currentUserId.current === userId) return;

      currentUserId.current = userId;

      await OneSignal.login(userId);

      console.log('OneSignal 로그인:', userId);
    };

    syncCurrentSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const userId = session?.user?.id;

      if (!userId) {
        currentUserId.current = null;

        await OneSignal.logout();

        console.log('OneSignal 로그아웃');

        return;
      }

      if (currentUserId.current === userId) {
        return;
      }

      currentUserId.current = userId;

      await OneSignal.login(userId);

      console.log('OneSignal 로그인:', userId);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [ready]);
};

export default useOneSignalAuth;
