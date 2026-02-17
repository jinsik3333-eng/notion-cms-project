import { z } from "zod";

/**
 * 자소서 입력 검증 스키마 (F001)
 *
 * 입력 규칙:
 * - 최소 글자 수: 50자
 * - 최대 글자 수: 5,000자
 * - 입력 형식: 텍스트만 (파일 업로드는 MVP 이후)
 */
export const resumeSchema = z.object({
  resumeText: z
    .string()
    .min(50, "자소서는 최소 50자 이상 입력해주세요.")
    .max(5000, "자소서는 최대 5,000자까지 입력 가능합니다."),
});

export type ResumeInput = z.infer<typeof resumeSchema>;
