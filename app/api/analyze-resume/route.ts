import { GoogleGenerativeAI } from "@google/generative-ai";
import { AnalysisResult } from "@/lib/types/analysis";
import { v4 as uuidv4 } from "uuid";

// Gemini API 초기화
const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  throw new Error("GOOGLE_API_KEY 환경 변수가 설정되어 있지 않습니다.");
}

const genAI = new GoogleGenerativeAI(apiKey);

/**
 * POST /api/analyze-resume
 * Google Gemini API를 사용한 자소서 5가지 관점 분석
 */
export async function POST(request: Request) {
  try {
    // 요청 본문 파싱
    const body = await request.json();
    const { resumeText } = body;

    // 입력값 검증: 50자 이상 5000자 이하
    if (!resumeText || typeof resumeText !== "string") {
      return Response.json(
        { success: false, error: "자소서 텍스트는 필수입니다." },
        { status: 400 }
      );
    }

    const textLength = resumeText.trim().length;
    if (textLength < 50) {
      return Response.json(
        {
          success: false,
          error: "자소서는 최소 50자 이상이어야 합니다.",
        },
        { status: 400 }
      );
    }

    if (textLength > 5000) {
      return Response.json(
        {
          success: false,
          error: "자소서는 최대 5,000자 이하여야 합니다.",
        },
        { status: 400 }
      );
    }

    // Gemini API 모델 초기화
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 1,
      },
    });

    // System Prompt: 5가지 관점 분석 지시
    const systemPrompt = `당신은 자소서 전문가입니다. 다음 자소서를 정확하게 5가지 관점에서 분석해주세요.

## 분석 관점

1. **논리구조 (logicStructure)**: 자소서의 논리적 흐름, 일관성, 구조적 완성도
   - 시작-중간-결론의 명확성
   - 각 문장 간 인과관계
   - 전체 맥락의 연결성

2. **직무적합성 (jobSuitability)**: 작성자의 경험/역량이 특정 직무에 얼마나 적합한지
   - 직무 요구사항 대비 경험의 관련성
   - 기술 스택 및 도메인 지식의 완성도
   - 직무에 필요한 소프트스킬 표현

3. **차별성 (differentiation)**: 다른 지원자와 구별되는 고유한 강점
   - 독특한 경험 또는 성과
   - 특별한 성취도 및 임팩트
   - 개성 있는 표현과 스토리텔링

4. **문장력 (writingQuality)**: 글쓰기의 문법적 정확성과 표현의 품질
   - 맞춤법 및 문법 오류 없음
   - 명확하고 이해하기 쉬운 표현
   - 전문적이고 세련된 문체

5. **면접관시선 (interviewerPerspective)**: 면접관이 읽을 때 받는 인상과 신뢰도
   - 솔직성과 성실함의 느낌
   - 자신감과 겸손함의 균형
   - 면접에서 묻고 싶을 흥미로운 포인트

## 응답 형식

아래 JSON 형식으로 응답해주세요 (다른 텍스트는 추가하지 마세요):

\`\`\`json
{
  "analyses": {
    "logicStructure": {
      "score": <0-100 숫자>,
      "feedback": "<200-300자 피드백>",
      "suggestions": ["<첫 번째 개선 제안>", "<두 번째 개선 제안>", "<세 번째 개선 제안>"]
    },
    "jobSuitability": {
      "score": <0-100 숫자>,
      "feedback": "<200-300자 피드백>",
      "suggestions": ["<첫 번째 개선 제안>", "<두 번째 개선 제안>", "<세 번째 개선 제안>"]
    },
    "differentiation": {
      "score": <0-100 숫자>,
      "feedback": "<200-300자 피드백>",
      "suggestions": ["<첫 번째 개선 제안>", "<두 번째 개선 제안>", "<세 번째 개선 제안>"]
    },
    "writingQuality": {
      "score": <0-100 숫자>,
      "feedback": "<200-300자 피드백>",
      "suggestions": ["<첫 번째 개선 제안>", "<두 번째 개선 제안>", "<세 번째 개선 제안>"]
    },
    "interviewerPerspective": {
      "score": <0-100 숫자>,
      "feedback": "<200-300자 피드백>",
      "suggestions": ["<첫 번째 개선 제안>", "<두 번째 개선 제안>", "<세 번째 개선 제안>"]
    }
  },
  "summary": "<200-300자 종합 평가>"
}
\`\`\``;

    // 타임아웃 설정 (60초)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    // Gemini API 호출
    let analysisData;
    try {
      const response = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${systemPrompt}\n\n## 분석할 자소서\n\n${resumeText}`,
              },
            ],
          },
        ],
      });

      const responseText =
        response.response.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!responseText) {
        throw new Error("Gemini API 응답이 비어있습니다.");
      }

      // JSON 파싱 (markdown 코드블록이 있을 수 있음)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Gemini API 응답에서 JSON을 찾을 수 없습니다.");
      }

      analysisData = JSON.parse(jsonMatch[0]);
    } finally {
      clearTimeout(timeoutId);
    }

    // 응답 데이터 검증 및 변환
    if (
      !analysisData.analyses ||
      !analysisData.summary ||
      typeof analysisData.analyses !== "object"
    ) {
      throw new Error("Gemini API 응답 형식이 올바르지 않습니다.");
    }

    // 5가지 점수의 평균 계산
    const scores = [
      analysisData.analyses.logicStructure?.score || 0,
      analysisData.analyses.jobSuitability?.score || 0,
      analysisData.analyses.differentiation?.score || 0,
      analysisData.analyses.writingQuality?.score || 0,
      analysisData.analyses.interviewerPerspective?.score || 0,
    ];

    const overallScore = Math.round(
      scores.reduce((a, b) => a + b, 0) / scores.length
    );

    // 최종 응답 객체 구성
    const result: AnalysisResult = {
      id: uuidv4(),
      resumeText: resumeText.trim(),
      analyses: {
        logicStructure: analysisData.analyses.logicStructure || {
          score: 0,
          feedback: "",
          suggestions: [],
        },
        jobSuitability: analysisData.analyses.jobSuitability || {
          score: 0,
          feedback: "",
          suggestions: [],
        },
        differentiation: analysisData.analyses.differentiation || {
          score: 0,
          feedback: "",
          suggestions: [],
        },
        writingQuality: analysisData.analyses.writingQuality || {
          score: 0,
          feedback: "",
          suggestions: [],
        },
        interviewerPerspective:
          analysisData.analyses.interviewerPerspective || {
            score: 0,
            feedback: "",
            suggestions: [],
          },
      },
      overallScore,
      summary: analysisData.summary || "",
      analyzedAt: new Date().toISOString(),
    };

    return Response.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("자소서 분석 오류:", error);

    // 에러 종류별 처리
    if (error instanceof SyntaxError) {
      return Response.json(
        {
          success: false,
          error: "Gemini API 응답 파싱 실패",
        },
        { status: 500 }
      );
    }

    if (
      error instanceof Error &&
      error.message.includes("429") &&
      error.message.includes("RESOURCE_EXHAUSTED")
    ) {
      return Response.json(
        {
          success: false,
          error: "API 요청이 많습니다. 잠시 후 다시 시도해주세요.",
          retryAfter: 30,
        },
        { status: 429 }
      );
    }

    if (error instanceof Error && error.message.includes("AbortError")) {
      return Response.json(
        {
          success: false,
          error: "분석이 너무 오래 걸렸습니다. 다시 시도해주세요.",
        },
        { status: 504 }
      );
    }

    return Response.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "자소서 분석 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
