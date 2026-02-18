/**
 * 사용자 프로필 정보 타입 정의
 */

export interface Profile {
  id: string; // UUID (auth.users.id)
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  bio: string | null;
  job_role: string | null; // 신입, 경력자, 대학생 등
  company: string | null;
  job_field: string | null; // 개발, 마케팅, 영업 등
  years_of_experience: number;
  created_at: string;
  updated_at: string;
}

export interface ProfileFormData {
  full_name: string;
  phone?: string;
  bio?: string;
  job_role?: string;
  company?: string;
  job_field?: string;
  years_of_experience?: number;
  avatar_url?: string;
}

export interface ProfileUpdateData extends Partial<ProfileFormData> {
  id: string; // 필수: 프로필 ID
}
