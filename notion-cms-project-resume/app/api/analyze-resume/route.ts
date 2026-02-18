import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { AnalysisData, AnalyzeResumeResponse } from '@/lib/types/resume';

/**
 * POST /api/analyze-resume
 * 자소서를 Gemini API로 분석하고 결과를 Supabase에 저장
 *
 * 요청: { resumeText: string }
 * 응답: AnalyzeResumeResponse (분석 결과 + resumeId)
 */
export async function POST(request: Request) {
  // 1. 인증 확인 (분석은 로그인 사용자만 가능)
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
  }

  // 2. 요청 본문 파싱 및 유효성 검사
  let resumeText: string;
  try {
    const body = await request.json();
    resumeText = body.resumeText;
  } catch {
    return NextResponse.json({ error: '잘못된 요청 형식입니다' }, { status: 400 });
  }

  if (!resumeText || typeof resumeText !== 'string') {
    return NextResponse.json({ error: '자소서 텍스트를 입력해주세요' }, { status: 400 });
  }

  const trimmed = resumeText.trim();
  if (trimmed.length < 50) {
    return NextResponse.json({ error: '자소서는 최소 50자 이상 입력해주세요' }, { status: 400 });
  }
  if (trimmed.length > 5000) {
    return NextResponse.json({ error: '자소서는 최대 5000자까지 입력 가능합니다' }, { status: 400 });
  }

  // 3. Google Gemini API 호출
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'AI 분석 서비스 설정 오류입니다' }, { status: 500 });
  }

  const systemPrompt = `당신은 한국의 취업 전문가입니다. 구직자의 자소서를 5가지 관점에서 분석하여 JSON 형식으로 반환하세요.

반드시 아래 JSON 구조를 정확히 따르세요:
{
  "logicStructure": {
    "score": 0~100 사이의 정수,
    "feedback": "논리구조에 대한 200자 내외의 피드백",
    "suggestions": ["개선 제안 1", "개선 제안 2", "개선 제안 3"]
  },
  "jobSuitability": {
    "score": 0~100 사이의 정수,
    "feedback": "직무적합성에 대한 200자 내외의 피드백",
    "suggestions": ["개선 제안 1", "개선 제안 2", "개선 제안 3"]
  },
  "differentiation": {
    "score": 0~100 사이의 정수,
    "feedback": "차별성에 대한 200자 내외의 피드백",
    "suggestions": ["개선 제안 1", "개선 제안 2", "개선 제안 3"]
  },
  "writingQuality": {
    "score": 0~100 사이의 정수,
    "feedback": "문장력에 대한 200자 내외의 피드백",
    "suggestions": ["개선 제안 1", "개선 제안 2", "개선 제안 3"]
  },
  "interviewerPerspective": {
    "score": 0~100 사이의 정수,
    "feedback": "면접관 시선에 대한 200자 내외의 피드백",
    "suggestions": ["개선 제안 1", "개선 제안 2", "개선 제안 3"]
  },
  "overallScore": 5가지 점수의 평균 정수,
  "summary": "종합 평가 200자 내외",
  "analyzedAt": "ISO8601 현재 시간"
}

모든 텍스트는 반드시 한국어로 작성하세요. JSON 외 다른 텍스트는 출력하지 마세요.`;

  let analysisData: AnalysisData;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 55_000); // 55초 타임아웃

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ parts: [{ text: `다음 자소서를 분석해주세요:\n\n${trimmed}` }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.3,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    clearTimeout(timeoutId);

    if (!geminiRes.ok) {
      const errBody = await geminiRes.text();
      console.error('Gemini API 오류:', geminiRes.status, errBody);

      if (geminiRes.status === 429) {
        return NextResponse.json(
          { error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요' },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { error: 'AI 분석 중 오류가 발생했습니다. 다시 시도해주세요' },
        { status: 500 }
      );
    }

    const geminiData = await geminiRes.json();
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return NextResponse.json({ error: 'AI 분석 결과를 받지 못했습니다' }, { status: 500 });
    }

    analysisData = JSON.parse(rawText) as AnalysisData;

    // analyzedAt 보정: Gemini가 올바른 ISO8601 반환 못하는 경우 대비
    analysisData.analyzedAt = new Date().toISOString();

    // overallScore 보정: 5가지 점수 평균으로 재계산
    const scores = [
      analysisData.logicStructure.score,
      analysisData.jobSuitability.score,
      analysisData.differentiation.score,
      analysisData.writingQuality.score,
      analysisData.interviewerPerspective.score,
    ];
    analysisData.overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      return NextResponse.json(
        { error: '분석 시간이 초과됐습니다. 다시 시도해주세요' },
        { status: 504 }
      );
    }
    console.error('Gemini 처리 오류:', err);
    return NextResponse.json({ error: 'AI 분석 중 오류가 발생했습니다' }, { status: 500 });
  }

  // 4. Supabase에 저장 (resumes + analysis_results)
  try {
    // 자소서 원문 저장
    const { data: resume, error: resumeError } = await supabase
      .from('resumes')
      .insert({
        user_id: user.id,
        original_text: trimmed,
        // 제목: 자소서 첫 30자 (공백 제거 후)
        title: trimmed.replace(/\s+/g, ' ').slice(0, 30) + (trimmed.length > 30 ? '...' : ''),
      })
      .select('id')
      .single();

    if (resumeError) throw resumeError;

    // 분석 결과 저장
    const { error: analysisError } = await supabase.from('analysis_results').insert({
      resume_id: resume.id,
      logic_structure_score: analysisData.logicStructure.score,
      job_suitability_score: analysisData.jobSuitability.score,
      differentiation_score: analysisData.differentiation.score,
      writing_quality_score: analysisData.writingQuality.score,
      interviewer_perspective_score: analysisData.interviewerPerspective.score,
      overall_score: analysisData.overallScore,
      analysis_data: analysisData,
    });

    if (analysisError) throw analysisError;

    // 클라이언트에 분석 결과 + 저장된 ID 반환
    const response: AnalyzeResumeResponse = {
      ...analysisData,
      resumeId: resume.id,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (err) {
    console.error('Supabase 저장 오류:', err);
    // DB 저장 실패해도 분석 결과는 반환 (사용자 경험 우선)
    // resumeId는 null 대신 빈 문자열로 표시
    const response: AnalyzeResumeResponse = {
      ...analysisData,
      resumeId: '',
    };
    return NextResponse.json(response, { status: 201 });
  }
}
