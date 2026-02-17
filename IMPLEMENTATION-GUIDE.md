# ResumeLens 구현 가이드

이 가이드는 PRD-VALIDATION-REPORT.md의 검증 결과를 바탕으로 구현할 때 참조하세요.

**검증 문서 참조**: PRD-VALIDATION-REPORT.md
**예상 개발 시간**: 15-20시간
**권장 팀 규모**: 1인 개발자 (경험자)

---

## 1. 사전 필수 준비

### 1.1 환경 변수 설정

```bash
# .env.local 파일 생성 또는 기존 파일에 추가

# Claude API
CLAUDE_API_KEY=sk-ant-...

# Notion API
NOTION_TOKEN=ntn_...
NOTION_PRICING_DB_ID=...
NOTION_REVIEWS_DB_ID=...
NOTION_INTRO_DB_ID=...  # 선택사항
```

### 1.2 패키지 설치 확인

```bash
npm ls
```

필요 패키지:
- ✓ next@16.1.6
- ✓ react@19.2.3
- ✓ react-hook-form@7.71.1
- ✓ zod@4.3.6
- ✓ zustand@5.0.11
- ✓ tailwindcss@4
- ✓ shadcn (UI 컴포넌트)

### 1.3 Notion 데이터베이스 생성

Notion에서 다음 데이터베이스를 생성하고 Integration 연결:

**Database 1: PricingPlans**
```
Columns:
- Name (Title)
- Price (Number)
- Features (Multi-select)
- Description (Rich text)
- IsPopular (Checkbox)
- Order (Number)
```

**Database 2: Reviews**
```
Columns:
- Author (Text)
- Content (Rich text)
- Rating (Number)
- Date (Date)
- Company (Text)
- IsVerified (Checkbox)
- Order (Number)
```

---

## 2. Phase 1: 기초 구현 (자소서 분석)

### 2.1 데이터 모델 정의

**파일**: `lib/validations/resume-analysis.ts`

```typescript
import { z } from 'zod';

// 입력 스키마
export const resumeInputSchema = z.object({
  content: z.string()
    .min(50, "최소 50글자 이상 입력하세요")
    .max(5000, "최대 5000글자입니다"),
  position: z.string().optional(),
  company: z.string().optional(),
});

export type ResumeInput = z.infer<typeof resumeInputSchema>;

// 분석 결과 스키마
export const analysisSchema = z.object({
  score: z.number().min(0).max(100),
  feedback: z.string().max(500),
  suggestions: z.array(z.string()).optional(),
});

export const analysisResultSchema = z.object({
  analyses: z.object({
    logicStructure: analysisSchema,
    jobSuitability: analysisSchema,
    differentiation: analysisSchema,
    sentenceQuality: analysisSchema,
    interviewerPerspective: analysisSchema,
  }),
  summary: z.string().max(1000),
  analyzedAt: z.string().datetime(),
});

export type Analysis = z.infer<typeof analysisSchema>;
export type AnalysisResult = z.infer<typeof analysisResultSchema>;
```

### 2.2 상태 관리 구현

**파일**: `lib/store/analysis-store.ts`

```typescript
import { create } from 'zustand';
import type { AnalysisResult } from '@/lib/validations/resume-analysis';

interface AnalysisState {
  // 상태
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  resumeInput: string;

  // 액션
  setResult: (result: AnalysisResult) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setResumeInput: (input: string) => void;
  clear: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  result: null,
  isLoading: false,
  error: null,
  resumeInput: '',

  setResult: (result) => set({ result, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  setResumeInput: (resumeInput) => set({ resumeInput }),
  clear: () => set({ result: null, error: null, resumeInput: '' }),
}));
```

### 2.3 API Route 구현

**파일**: `app/api/analyze-resume/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { analysisResultSchema } from '@/lib/validations/resume-analysis';

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, position, company } = body;

    // 입력 검증
    if (!content || content.length < 50 || content.length > 5000) {
      return NextResponse.json(
        { error: '자소서는 50-5000글자여야 합니다' },
        { status: 400 }
      );
    }

    // Claude API 요청
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: buildPrompt(content, position, company),
          },
        ],
        // Structured Output 사용
        temperature: 1,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Claude API Error:', error);
      throw new Error(`Claude API Error: ${response.status}`);
    }

    const data = await response.json();
    const analysisText = data.content[0].text;

    // JSON 파싱
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Claude API');
    }

    const analysis = JSON.parse(jsonMatch[0]);

    // 스키마 검증
    const validated = analysisResultSchema.parse(analysis);

    return NextResponse.json(validated);
  } catch (error) {
    console.error('Analysis error:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: '분석 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

function buildPrompt(content: string, position?: string, company?: string): string {
  const positionInfo = position ? `직급: ${position}` : '';
  const companyInfo = company ? `회사: ${company}` : '';
  const metadata = [positionInfo, companyInfo].filter(Boolean).join('\n');

  return `당신은 자소서를 5가지 관점에서 분석하는 전문가입니다.

[자소서]
${content}

${metadata ? `[지원 정보]\n${metadata}` : ''}

다음 5가지 관점에서 자소서를 분석하고 JSON 형식으로 결과를 반환하세요:

1. 논리구조: 자소서의 논리적 흐름, 스토리 구조, 설득력을 평가합니다.
2. 직무적합성: 지원 직무와의 경험, 스킬 적합도를 평가합니다.
3. 차별성: 다른 지원자와 구별되는 차별적 강점을 평가합니다.
4. 문장력: 한국어 문장력, 표현의 명확성과 정확성을 평가합니다.
5. 면접관 시선: 면접관 입장에서 호감도, 신뢰도를 평가합니다.

각 항목에 대해:
- score (0-100): 평가 점수
- feedback (최대 300글자): 평가 내용과 강점
- suggestions (선택사항): 개선 제안 (리스트)

그리고 종합 평가를 "summary" 필드에 작성하세요 (최대 500글자).

JSON 형식:
{
  "analyses": {
    "logicStructure": {
      "score": 85,
      "feedback": "...",
      "suggestions": ["..."]
    },
    "jobSuitability": {
      "score": 75,
      "feedback": "...",
      "suggestions": ["..."]
    },
    "differentiation": {
      "score": 80,
      "feedback": "...",
      "suggestions": ["..."]
    },
    "sentenceQuality": {
      "score": 88,
      "feedback": "...",
      "suggestions": ["..."]
    },
    "interviewerPerspective": {
      "score": 82,
      "feedback": "...",
      "suggestions": ["..."]
    }
  },
  "summary": "..."
}`;
}
```

### 2.4 폼 컴포넌트 구현

**파일**: `components/organisms/resume-analyzer-form.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useAnalysisStore } from '@/lib/store/analysis-store';
import { resumeInputSchema, type ResumeInput } from '@/lib/validations/resume-analysis';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/atoms/loading-spinner';
import { cn } from '@/lib/utils';

interface ResumeAnalyzerFormProps {
  className?: string;
}

export function ResumeAnalyzerForm({ className }: ResumeAnalyzerFormProps) {
  const router = useRouter();
  const { setResult, setLoading, setError, resumeInput, setResumeInput } = useAnalysisStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ResumeInput>({
    resolver: zodResolver(resumeInputSchema),
    defaultValues: {
      content: resumeInput,
      position: '',
      company: '',
    },
  });

  const onSubmit = async (data: ResumeInput) => {
    setIsSubmitting(true);
    setLoading(true);

    try {
      setResumeInput(data.content);

      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '분석 중 오류가 발생했습니다');
      }

      const result = await response.json();
      setResult(result);
      router.push('/resume-analyzer/results');
    } catch (error) {
      const message = error instanceof Error ? error.message : '분석 중 오류가 발생했습니다';
      setError(message);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={cn('space-y-6', className)}>
      <div className="space-y-2">
        <label htmlFor="content" className="text-sm font-medium">
          자소서 입력 *
        </label>
        <Textarea
          id="content"
          placeholder="자소서를 입력하세요 (50-5000글자)..."
          className="min-h-[300px]"
          {...form.register('content')}
        />
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            {form.watch('content')?.length || 0} / 5000
          </span>
          {form.formState.errors.content && (
            <span className="text-red-500">{form.formState.errors.content.message}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="position" className="text-sm font-medium">
            지원 직급 (선택)
          </label>
          <Input
            id="position"
            placeholder="예: 주니어 개발자"
            {...form.register('position')}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="company" className="text-sm font-medium">
            지원 회사 (선택)
          </label>
          <Input
            id="company"
            placeholder="예: OO 회사"
            {...form.register('company')}
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || !form.formState.isValid}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <LoadingSpinner className="mr-2 h-4 w-4" />
            분석 중입니다...
          </>
        ) : (
          '분석하기'
        )}
      </Button>

      {form.formState.isSubmitting && (
        <div className="text-center text-sm text-gray-500">
          약 10-15초 소요됩니다
        </div>
      )}
    </form>
  );
}
```

### 2.5 결과 표시 컴포넌트

**파일**: `components/organisms/analysis-results-card.tsx`

```typescript
'use client';

import { useAnalysisStore } from '@/lib/store/analysis-store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';
import type { Analysis } from '@/lib/validations/resume-analysis';

const ANALYSIS_LABELS = {
  logicStructure: {
    title: '논리구조',
    description: '자소서의 논리적 흐름과 스토리 구조',
    icon: '🔗',
  },
  jobSuitability: {
    title: '직무적합성',
    description: '지원 직무와의 경험과 스킬 적합도',
    icon: '🎯',
  },
  differentiation: {
    title: '차별성',
    description: '다른 지원자와의 구별되는 강점',
    icon: '⭐',
  },
  sentenceQuality: {
    title: '문장력',
    description: '한국어 표현의 명확성과 정확성',
    icon: '📝',
  },
  interviewerPerspective: {
    title: '면접관 시선',
    description: '면접관 입장에서의 호감도와 신뢰도',
    icon: '👁️',
  },
};

function AnalysisCard({
  label,
  analysis,
}: {
  label: keyof typeof ANALYSIS_LABELS;
  analysis: Analysis;
}) {
  const info = ANALYSIS_LABELS[label];
  const scorePercentage = analysis.score / 100;

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{info.icon}</span>
                <h3 className="font-semibold text-lg">{info.title}</h3>
              </div>
              <p className="text-sm text-gray-500 mt-1">{info.description}</p>
            </div>
            <div className="text-3xl font-bold text-blue-600">{analysis.score}</div>
          </div>
          <Progress value={scorePercentage * 100} className="h-2" />
        </div>

        <div>
          <p className="text-sm font-medium mb-2">평가</p>
          <p className="text-sm text-gray-700">{analysis.feedback}</p>
        </div>

        {analysis.suggestions && analysis.suggestions.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">개선 제안</p>
            <ul className="text-sm text-gray-700 space-y-1">
              {analysis.suggestions.map((suggestion, idx) => (
                <li key={idx} className="flex gap-2">
                  <span>•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}

export function AnalysisResultsCard() {
  const router = useRouter();
  const { result, clear } = useAnalysisStore();

  if (!result) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">분석 결과를 불러올 수 없습니다.</p>
        <Button onClick={() => router.push('/resume-analyzer')} className="mt-4">
          다시 분석하기
        </Button>
      </div>
    );
  }

  const averageScore = Math.round(
    Object.values(result.analyses).reduce((sum, a) => sum + a.score, 0) / 5
  );

  return (
    <div className="space-y-8">
      {/* 종합 점수 */}
      <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <p className="text-gray-600 mb-2">종합 평가</p>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-6xl font-bold text-blue-600">{averageScore}</div>
            <div className="text-lg text-gray-600">/ 100</div>
          </div>
          <Progress value={averageScore} className="h-3 mb-4" />
          <p className="text-sm text-gray-500">
            {getScoreMessage(averageScore)}
          </p>
        </div>
      </Card>

      {/* 5개 분석 결과 */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">상세 분석</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {Object.entries(result.analyses).map(([key, analysis]) => (
            <AnalysisCard
              key={key}
              label={key as keyof typeof ANALYSIS_LABELS}
              analysis={analysis}
            />
          ))}
        </div>
      </div>

      {/* 종합 평가 */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-3">종합 평가</h3>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {result.summary}
        </p>
      </Card>

      {/* 행동 버튼 */}
      <div className="flex gap-4">
        <Button
          onClick={() => {
            clear();
            router.push('/resume-analyzer');
          }}
          className="flex-1"
        >
          다시 분석하기
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push('/')}
          className="flex-1"
        >
          홈으로 돌아가기
        </Button>
      </div>

      <p className="text-xs text-gray-500 text-center">
        분석 시간: {new Date(result.analyzedAt).toLocaleString('ko-KR')}
      </p>
    </div>
  );
}

function getScoreMessage(score: number): string {
  if (score >= 85) return '🎉 우수한 자소서입니다!';
  if (score >= 75) return '😊 좋은 자소서입니다.';
  if (score >= 65) return '😐 평균 정도의 자소서입니다.';
  return '📈 개선의 여지가 있습니다.';
}
```

### 2.6 페이지 구현

**파일**: `app/(marketing)/resume-analyzer/page.tsx`

```typescript
import { PageHeader } from '@/components/molecules/page-header';
import { ResumeAnalyzerForm } from '@/components/organisms/resume-analyzer-form';

export const metadata = {
  title: '자소서 AI 분석 | ResumeLens',
  description: '자소서를 5가지 관점에서 AI가 분석해드립니다',
};

export default function ResumeAnalyzerPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <PageHeader
        title="자소서 AI 분석"
        description="당신의 자소서를 AI가 5가지 관점에서 분석합니다"
      />

      <div className="max-w-2xl mx-auto mt-12">
        <ResumeAnalyzerForm />
      </div>
    </div>
  );
}
```

**파일**: `app/(marketing)/resume-analyzer/results/page.tsx`

```typescript
'use client';

import { PageHeader } from '@/components/molecules/page-header';
import { AnalysisResultsCard } from '@/components/organisms/analysis-results-card';

export default function ResultsPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <PageHeader
        title="분석 결과"
        description="자소서 분석이 완료되었습니다"
      />

      <div className="max-w-4xl mx-auto mt-12">
        <AnalysisResultsCard />
      </div>
    </div>
  );
}
```

---

## 3. Phase 2: CMS 구현 (Notion 콘텐츠)

### 3.1 Notion API Route Handlers

**파일**: `app/api/notion/pricing/route.ts`

```typescript
import { NextResponse } from 'next/server';

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const PRICING_DB_ID = process.env.NOTION_PRICING_DB_ID;

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  description: string;
  isPopular: boolean;
  order: number;
}

export async function GET() {
  try {
    if (!NOTION_TOKEN || !PRICING_DB_ID) {
      throw new Error('Missing Notion configuration');
    }

    const response = await fetch(
      `https://api.notion.com/v1/databases/${PRICING_DB_ID}/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NOTION_TOKEN}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sorts: [{ property: 'Order', direction: 'ascending' }],
        }),
        // ISR 캐싱 (1시간)
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error(`Notion API Error: ${response.status}`);
    }

    const data = await response.json();
    const plans = data.results.map((page: any): PricingPlan => ({
      id: page.id,
      name: page.properties.Name?.title?.[0]?.plain_text || '',
      price: page.properties.Price?.number || 0,
      features: page.properties.Features?.multi_select?.map((f: any) => f.name) || [],
      description: page.properties.Description?.rich_text?.[0]?.plain_text || '',
      isPopular: page.properties.IsPopular?.checkbox || false,
      order: page.properties.Order?.number || 0,
    }));

    return NextResponse.json(plans);
  } catch (error) {
    console.error('Pricing fetch error:', error);
    return NextResponse.json(
      { error: '가격표를 불러올 수 없습니다' },
      { status: 500 }
    );
  }
}
```

**파일**: `app/api/notion/reviews/route.ts`

```typescript
import { NextResponse } from 'next/server';

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const REVIEWS_DB_ID = process.env.NOTION_REVIEWS_DB_ID;

interface Review {
  id: string;
  author: string;
  content: string;
  rating: number;
  date: string;
  company: string;
  isVerified: boolean;
  order: number;
}

export async function GET() {
  try {
    if (!NOTION_TOKEN || !REVIEWS_DB_ID) {
      throw new Error('Missing Notion configuration');
    }

    const response = await fetch(
      `https://api.notion.com/v1/databases/${REVIEWS_DB_ID}/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NOTION_TOKEN}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sorts: [{ property: 'Order', direction: 'ascending' }],
        }),
        // ISR 캐싱 (1시간)
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error(`Notion API Error: ${response.status}`);
    }

    const data = await response.json();
    const reviews = data.results.map((page: any): Review => ({
      id: page.id,
      author: page.properties.Author?.rich_text?.[0]?.plain_text || '',
      content: page.properties.Content?.rich_text?.[0]?.plain_text || '',
      rating: page.properties.Rating?.number || 5,
      date: page.properties.Date?.date?.start || '',
      company: page.properties.Company?.rich_text?.[0]?.plain_text || '',
      isVerified: page.properties.IsVerified?.checkbox || false,
      order: page.properties.Order?.number || 0,
    }));

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Reviews fetch error:', error);
    return NextResponse.json(
      { error: '후기를 불러올 수 없습니다' },
      { status: 500 }
    );
  }
}
```

### 3.2 가격표 페이지

**파일**: `app/(marketing)/pricing/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/molecules/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/atoms/loading-spinner';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  description: string;
  isPopular: boolean;
  order: number;
}

export const metadata = {
  title: '가격표 | ResumeLens',
  description: 'ResumeLens 가격표',
};

export default function PricingPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('/api/notion/pricing');
        if (!response.ok) throw new Error('Failed to fetch pricing');
        const data = await response.json();
        setPlans(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '가격표를 불러올 수 없습니다');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return (
    <div className="container mx-auto py-12 px-4">
      <PageHeader
        title="가격표"
        description="귀사에 맞는 요금제를 선택하세요"
      />

      {loading && (
        <div className="flex justify-center items-center min-h-96">
          <LoadingSpinner />
        </div>
      )}

      {error && (
        <div className="bg-red-50 p-4 rounded-lg text-red-800 text-center mt-12">
          {error}
        </div>
      )}

      {!loading && !error && plans.length === 0 && (
        <div className="text-center mt-12 text-gray-500">
          가격표 정보가 없습니다.
        </div>
      )}

      {!loading && !error && plans.length > 0 && (
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`p-6 relative ${
                plan.isPopular ? 'ring-2 ring-blue-500 lg:scale-105' : ''
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-bl-lg text-sm font-semibold">
                  인기
                </div>
              )}

              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-gray-600">/월</span>
              </div>

              <p className="text-gray-700 mb-6 text-sm">{plan.description}</p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <span className="text-green-600">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button className="w-full">{plan.isPopular ? '지금 시작' : '선택'}</Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 3.3 후기 페이지

**파일**: `app/(marketing)/reviews/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/molecules/page-header';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/atoms/loading-spinner';

interface Review {
  id: string;
  author: string;
  content: string;
  rating: number;
  date: string;
  company: string;
  isVerified: boolean;
  order: number;
}

export const metadata = {
  title: '사용자 후기 | ResumeLens',
  description: 'ResumeLens 사용자들의 후기',
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/notion/reviews');
        if (!response.ok) throw new Error('Failed to fetch reviews');
        const data = await response.json();
        setReviews(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '후기를 불러올 수 없습니다');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="container mx-auto py-12 px-4">
      <PageHeader
        title="사용자 후기"
        description="ResumeLens를 사용한 분들의 이야기를 들어보세요"
      />

      {loading && (
        <div className="flex justify-center items-center min-h-96">
          <LoadingSpinner />
        </div>
      )}

      {error && (
        <div className="bg-red-50 p-4 rounded-lg text-red-800 text-center mt-12">
          {error}
        </div>
      )}

      {!loading && !error && reviews.length === 0 && (
        <div className="text-center mt-12 text-gray-500">
          후기가 없습니다.
        </div>
      )}

      {!loading && !error && reviews.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {reviews.map((review) => (
            <Card key={review.id} className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{review.author}</h3>
                  {review.company && (
                    <p className="text-sm text-gray-600">{review.company}</p>
                  )}
                </div>
                {review.isVerified && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    인증됨
                  </span>
                )}
              </div>

              <div className="flex gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                  >
                    ⭐
                  </span>
                ))}
              </div>

              <p className="text-gray-700 text-sm mb-3">{review.content}</p>

              <p className="text-xs text-gray-500">
                {new Date(review.date).toLocaleDateString('ko-KR')}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 4. Phase 3: 최적화 & 완성

### 4.1 에러 처리 및 재시도 로직

**파일**: `lib/api-client.ts`

```typescript
interface FetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
}

export async function fetchWithRetry(
  url: string,
  options: FetchOptions = {}
) {
  const { timeout = 30000, retries = 3, ...fetchOptions } = options;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) return response;

      // 재시도 가능한 상태 코드
      if ([429, 500, 502, 503].includes(response.status)) {
        if (attempt < retries - 1) {
          // 지수 백오프
          const delayMs = 1000 * Math.pow(2, attempt);
          await new Promise(resolve => setTimeout(resolve, delayMs));
          continue;
        }
      }

      return response;
    } catch (error) {
      if (attempt === retries - 1) throw error;

      const delayMs = 1000 * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  throw new Error('Max retries exceeded');
}
```

### 4.2 로딩 상태 개선

기존 LoadingSpinner 컴포넌트를 그대로 사용하되, 분석 중 진행 상태 표시 추가:

**파일**: `components/organisms/resume-analyzer-form.tsx` (일부 수정)

```typescript
// 분석 진행 중 진행률 표시
<div className="space-y-2">
  <div className="flex justify-between text-sm">
    <span className="text-gray-600">분석 진행 중...</span>
    <span className="text-gray-600">10-15초 소요</span>
  </div>
  <Progress value={isSubmitting ? 50 : 0} />
</div>
```

### 4.3 캐싱 최적화

Notion API는 이미 ISR 캐싱 적용됨.

Claude API는 사용자 자소서이므로 캐시하지 않음.

---

## 5. 테스트 체크리스트

### 5.1 기능 테스트

- [ ] 자소서 입력 폼 유효성 검사 (최소/최대 길이)
- [ ] Claude API 호출 성공 및 응답 파싱
- [ ] 분석 결과 화면 렌더링
- [ ] Notion API 가격표 조회
- [ ] Notion API 후기 조회
- [ ] 모든 페이지 네비게이션

### 5.2 성능 테스트

- [ ] Claude API 응답 시간 (< 15초)
- [ ] Notion API 응답 시간 (< 2초)
- [ ] 페이지 로드 시간 (< 3초)
- [ ] 번들 크기 확인

### 5.3 에러 처리 테스트

- [ ] Claude API 타임아웃
- [ ] Claude API 레이트 제한 (429)
- [ ] Notion API 인증 실패 (403)
- [ ] 네트워크 오류

---

## 6. 배포 체크리스트

- [ ] 환경 변수 설정 (프로덕션)
- [ ] API 키 보안 검토
- [ ] CORS 설정 (필요시)
- [ ] 라테 제한 정책 구성
- [ ] 모니터링 & 로깅 설정
- [ ] 도메인 변경 시 nav.ts 업데이트

---

## 7. 참고 자료

### 공식 문서
- [Claude API Documentation](https://platform.claude.com/docs)
- [Notion API Reference](https://developers.notion.com/reference)
- [Next.js App Router](https://nextjs.org/docs/app)
- [React 19 Docs](https://react.dev)

### 관련 라이브러리
- [React Hook Form Docs](https://react-hook-form.com)
- [Zod Docs](https://zod.dev)
- [Zustand Docs](https://zustand-demo.vercel.app)
- [shadcn/ui](https://ui.shadcn.com)

---

**마지막 업데이트**: 2026-02-17
**검증 문서**: PRD-VALIDATION-REPORT.md 참조
