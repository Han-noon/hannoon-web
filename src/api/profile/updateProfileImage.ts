import { supabase } from '@/lib/supabase';

export const updateProfileImage = async (newUrl: string | null) => {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) throw new Error('로그인이 필요합니다.');

  const userId = authData.user.id;

  const { data, error } = await supabase
    .from('profiles')
    .update({ profile_image_url: newUrl })
    .eq('id', userId)
    .select();

  if (error) throw error;
  return data;
};
