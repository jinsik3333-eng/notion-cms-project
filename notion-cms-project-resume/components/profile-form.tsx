"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { getProfile, updateProfile } from "@/lib/supabase/profile";
import { Profile, ProfileFormData } from "@/lib/types/profile";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export function ProfileForm({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: "",
  });

  const supabase = createClient();
  const router = useRouter();

  // 프로필 조회
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await getProfile(supabase, userId);

        if (error) throw error;

        if (data) {
          setProfile(data);
          setFormData({
            full_name: data.full_name || "",
            phone: data.phone || "",
            bio: data.bio || "",
            job_role: data.job_role || "",
            company: data.company || "",
            job_field: data.job_field || "",
            years_of_experience: data.years_of_experience || 0,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "프로필 조회 실패");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  // 입력값 변경 처리
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "years_of_experience" ? parseInt(value) || 0 : value,
    }));
  };

  // 프로필 저장
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      const { data, error } = await updateProfile(supabase, userId, formData);

      if (error) throw error;

      setProfile(data);
      setSuccess("프로필이 저장되었습니다");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "프로필 저장 실패");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">프로필을 불러오는 중...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>프로필 관리</CardTitle>
        <CardDescription>
          {profile?.email && `계정: ${profile.email}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave}>
          <div className="space-y-6">
            {/* 기본 정보 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">기본 정보</h3>

              <div className="grid gap-2">
                <Label htmlFor="full_name">이름</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  placeholder="홍길동"
                  value={formData.full_name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">전화번호</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="010-1234-5678"
                  type="tel"
                  value={formData.phone || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bio">자기소개</Label>
                <textarea
                  id="bio"
                  name="bio"
                  placeholder="자신을 소개해주세요"
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.bio || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* 직무 정보 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">직무 정보</h3>

              <div className="grid gap-2">
                <Label htmlFor="job_role">직급</Label>
                <select
                  id="job_role"
                  name="job_role"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.job_role || ""}
                  onChange={handleInputChange}
                >
                  <option value="">선택해주세요</option>
                  <option value="신입">신입</option>
                  <option value="경력자">경력자 (1-3년)</option>
                  <option value="경력자">경력자 (3-5년)</option>
                  <option value="경력자">경력자 (5년 이상)</option>
                  <option value="대학생">대학생</option>
                  <option value="기타">기타</option>
                </select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="job_field">직무 분야</Label>
                <select
                  id="job_field"
                  name="job_field"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.job_field || ""}
                  onChange={handleInputChange}
                >
                  <option value="">선택해주세요</option>
                  <option value="개발">개발</option>
                  <option value="마케팅">마케팅</option>
                  <option value="영업">영업</option>
                  <option value="기획">기획</option>
                  <option value="디자인">디자인</option>
                  <option value="기타">기타</option>
                </select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="company">회사명</Label>
                <Input
                  id="company"
                  name="company"
                  placeholder="현재 근무 회사"
                  value={formData.company || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="years_of_experience">경력 (년)</Label>
                <Input
                  id="years_of_experience"
                  name="years_of_experience"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.years_of_experience || 0}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* 메시지 */}
            {error && (
              <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                {error}
              </p>
            )}
            {success && (
              <p className="rounded-md bg-green-50 p-3 text-sm text-green-600">
                {success}
              </p>
            )}

            {/* 버튼 */}
            <div className="flex gap-3">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "저장 중..." : "프로필 저장"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                취소
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
