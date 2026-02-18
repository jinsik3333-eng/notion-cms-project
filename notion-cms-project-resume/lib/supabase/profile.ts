import { SupabaseClient } from "@supabase/supabase-js";
import { Profile, ProfileFormData, ProfileUpdateData } from "@/lib/types/profile";

/**
 * 사용자 프로필 관련 CRUD 함수들
 */

/**
 * 프로필 조회
 * @param supabase - Supabase 클라이언트
 * @param userId - 사용자 ID (UUID)
 * @returns 프로필 정보 또는 에러
 */
export async function getProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<{ data: Profile | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      // 프로필이 없는 경우 null 반환
      if (error.code === "PGRST116") {
        return { data: null, error: null };
      }
      throw error;
    }

    return { data: data as Profile, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * 프로필 생성
 * @param supabase - Supabase 클라이언트
 * @param userId - 사용자 ID (UUID)
 * @param email - 사용자 이메일
 * @param full_name - 사용자 이름 (선택)
 * @returns 생성된 프로필 정보 또는 에러
 */
export async function createProfile(
  supabase: SupabaseClient,
  userId: string,
  email: string,
  full_name?: string
): Promise<{ data: Profile | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        email,
        full_name: full_name || "",
      })
      .select()
      .single();

    if (error) throw error;

    return { data: data as Profile, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * 프로필 업데이트
 * @param supabase - Supabase 클라이언트
 * @param userId - 사용자 ID (UUID)
 * @param profileData - 업데이트할 프로필 정보
 * @returns 업데이트된 프로필 정보 또는 에러
 */
export async function updateProfile(
  supabase: SupabaseClient,
  userId: string,
  profileData: ProfileFormData
): Promise<{ data: Profile | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        ...profileData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;

    return { data: data as Profile, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * 프로필 삭제
 * @param supabase - Supabase 클라이언트
 * @param userId - 사용자 ID (UUID)
 * @returns 성공 여부 또는 에러
 */
export async function deleteProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabase.from("profiles").delete().eq("id", userId);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}

/**
 * 프로필이 존재하는지 확인
 * @param supabase - Supabase 클라이언트
 * @param userId - 사용자 ID (UUID)
 * @returns 존재 여부
 */
export async function profileExists(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  try {
    const { count, error } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("id", userId);

    if (error) throw error;

    return (count ?? 0) > 0;
  } catch {
    return false;
  }
}

/**
 * 여러 프로필 조회 (직군별 또는 경력별)
 * @param supabase - Supabase 클라이언트
 * @param filter - 필터링 조건 (예: { job_role: "신입", job_field: "개발" })
 * @param limit - 조회 수 제한 (기본값: 50)
 * @returns 프로필 목록 또는 에러
 */
export async function searchProfiles(
  supabase: SupabaseClient,
  filter: Partial<Record<keyof Profile, string | number>>,
  limit: number = 50
): Promise<{ data: Profile[] | null; error: Error | null }> {
  try {
    let query = supabase.from("profiles").select("*");

    // 필터 조건 적용
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    });

    const { data, error } = await query.limit(limit);

    if (error) throw error;

    return { data: data as Profile[], error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * 프로필 일괄 업데이트 (관리자용)
 * @param supabase - Supabase 클라이언트
 * @param profiles - 업데이트할 프로필 정보 배열
 * @returns 업데이트 성공 여부 또는 에러
 */
export async function batchUpdateProfiles(
  supabase: SupabaseClient,
  profiles: ProfileUpdateData[]
): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabase
      .from("profiles")
      .upsert(
        profiles.map((profile) => ({
          ...profile,
          updated_at: new Date().toISOString(),
        }))
      );

    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}
