export interface UserProfile {
  id: string;
  email: string;
  name: string;
  profile_image_url?: string | null;
  profile_image_path?: string | null;
  created_at: string;
}
