import { supabase } from '@/lib/supabase';

export const updateProfileImage = async (fileOrNull: File | null) => {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) throw new Error('로그인이 필요합니다.');

  const userId = authData.user.id;
  let finalUrl = null;

  if (fileOrNull) {
    const bucketName = 'user_profile_images';

    const fileExt = fileOrNull.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    // Storage에 파일 업로드
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileOrNull, { upsert: true });

    if (uploadError) {
      console.error('스토리지 업로드 실패:', uploadError);
      throw uploadError;
    }

    const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(fileName);
    finalUrl = urlData.publicUrl;
  }

  // DB 업데이트
  const { error: dbError } = await supabase
    .from('profiles')
    .update({ profile_image_path: finalUrl })
    .eq('id', userId)
    .select();

  if (dbError) {
    console.error('DB 업데이트 실패:', dbError);
    throw dbError;
  }

  return finalUrl;
};
