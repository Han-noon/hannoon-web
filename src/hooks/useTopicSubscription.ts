import { subscribeTopic } from '@/api/topic/subscribeTopic';
import { unsubscribeTopic } from '@/api/topic/unsubscribeTopic';
import { supabase } from '@/lib/supabase';

export const useTopicSubscription = () => {
  const subscribe = async (topicId: number) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('LOGIN_REQUIRED');
    }

    let permission = Notification.permission;

    if (permission === 'default') {
      permission = await Notification.requestPermission();
    }

    if (permission !== 'granted') {
      throw new Error('NOTIFICATION_DENIED');
    }

    return await subscribeTopic(topicId);
  };

  const unsubscribe = async (topicId: number) => {
    return await unsubscribeTopic(topicId);
  };

  return {
    subscribe,
    unsubscribe,
  };
};
