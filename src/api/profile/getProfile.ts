import { supabase } from '@/lib/supabase';
import type { UserProfile } from '../../types/profile';

export const getProfile = async (): Promise<UserProfile> => {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) throw new Error('로그인이 필요합니다.');

  const userId = authData.user.id;

  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

  if (error) throw error;
  if (!data) throw new Error('프로필을 찾을 수 없습니다.');

  return data;
};
