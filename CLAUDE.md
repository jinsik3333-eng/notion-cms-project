# CLAUDE.md

이 파일은 Claude Code가 이 저장소에서 작업할 때 따라야 할 개발 지침입니다.

## ResumeLens 프로젝트 소개

**ResumeLens**는 Claude AI로 자소서를 5가지 관점(논리구조, 직무적합성, 차별성, 문장력, 면접관 시선)에서 동시 분석하고 개선점을 제시하는 서비스입니다. Notion CMS를 활용하여 비개발자도 마케팅 콘텐츠를 관리할 수 있습니다.

**상세 요구사항**: @docs/PRD.md 참조

---

## 📋 Project Context

프로젝트 진행 시 다음 문서들을 참고하세요:

- **@docs/PRD.md** - 상세 요구사항, 기능 명세(F001~F011), 기술 스택, API 통합 전략
- **@docs/ROADMAP.md** - 개발 로드맵, 5개 Phase별 Task 분해, 일정 계획, 성공 지표

---

### 핵심 페이지 구조 (6개)

| 경로 | 설명 | 핵심 기능 |
|------|------|----------|
| `/` | 랜딩 페이지 | F001, F002, F003, F004 |
| `/analyze` | 자소서 분석 입력 | F001, F002, F011 |
| `/result` | 분석 결과 표시 | F002, F003, F011 |
| `/about` | 서비스 소개 (Notion CMS) | F004, F010 |
| `/pricing` | 가격표 (Notion CMS) | F004, F010 |
| `/testimonials` | 후기 (Notion CMS) | F004, F010 |

### 분석 결과 타입 (핵심)

분석 결과 데이터 구조는 `lib/types/analysis.ts`에 정의됩니다.
- 5가지 카테고리: `logicStructure`, `jobSuitability`, `differentiation`, `writingQuality`, `interviewerPerspective`
- 각 카테고리: `score(0-100)`, `feedback(string)`, `suggestions(string[])`
- Zustand store: `stores/analysis-store.ts` (클라이언트 메모리에만 저장)

### API 엔드포인트 (구현 예정)

- **자소서 분석**: `POST /api/analyze-resume` (Claude API 연동)
- **Notion 데이터**: `GET /api/notion/pricing`, `GET /api/notion/testimonials`, `GET /api/notion/content/[slug]`

---

## Project Overview

ResumeLens: Next.js 15 + React 19 with Atomic Design pattern, shadcn/ui, and TypeScript. The project implements a self-contained AI resume analysis service with Notion CMS integration.

**Tech Stack:**
- Next.js 15 (App Router), React 19, TypeScript 5.6+
- Styling: Tailwind CSS 4 + shadcn/ui
- Forms: React Hook Form + Zod for validation
- State Management: Zustand
- Notifications: Sonner
- Icons: Lucide React
- Theme: next-themes (light/dark mode)
- APIs: Claude API (Anthropic), Notion API

---

## Essential Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)

# Building
npm run build        # Production build
npm start            # Start production server

# Linting
npm run lint         # Run ESLint check
npm run lint -- --fix  # Auto-fix linting issues
```

---

## Project Architecture

### Directory Structure

```
app/                          # Next.js App Router
├── (marketing)/              # ResumeLens 공개 페이지 (마케팅 + 분석 기능)
│   ├── page.tsx              # 랜딩 페이지 (/)
│   ├── analyze/page.tsx      # 자소서 분석 입력 (/analyze)
│   ├── result/page.tsx       # 분석 결과 표시 (/result)
│   ├── about/page.tsx        # 서비스 소개 (/about)
│   ├── pricing/page.tsx      # 가격표 (/pricing)
│   └── testimonials/page.tsx # 후기 (/testimonials)
├── layout.tsx                # Root layout with header, footer, theme provider
└── not-found.tsx             # 404 page

components/                   # Atomic Design hierarchy
├── ui/                       # shadcn/ui primitive components (button, input, etc.)
├── atoms/                    # Smallest reusable units (Logo, ThemeToggle)
├── molecules/                # Simple component combinations (NavItem, PageHeader)
├── organisms/                # Complex features (Header, Sidebar, ContactForm)
└── templates/                # Layout wrappers (DefaultLayout, DashboardLayout)

lib/
├── utils.ts                  # Utility functions (cn() for Tailwind classes)
├── constants/
│   ├── nav.ts               # Navigation configuration (홈, 서비스소개, 가격표, 후기)
│   └── site.ts              # Site metadata (ResumeLens)
├── validations/
│   └── resume.ts            # 자소서 입력 검증 스키마 (50-5000자)
└── types/
    └── analysis.ts          # 분석 결과 타입 정의 (Claude API Response)

types/                       # Global TypeScript definitions
```

### Atomic Design Implementation

**Components follow strict hierarchy:**

1. **ui/** - shadcn/ui primitives (no business logic)
2. **atoms/** - Single interactive elements, no dependencies between atoms
3. **molecules/** - Combinations of atoms (e.g., NavItem = Link + Icon + Label)
4. **organisms/** - Complex features with state/logic (e.g., LoginForm, Header)
5. **templates/** - Layout structures (e.g., DefaultLayout, DashboardLayout)

### Route Groups

- `(marketing)` - ResumeLens 모든 공개 페이지 (DefaultLayout: Header + Footer)
  - MVP 범위: 인증/대시보드 없음 (MVP 이후 추가 예정)

---

## Key Files & Patterns

### Form Validation

All forms use **React Hook Form + Zod** pattern:

**Location:** `lib/validations/auth.ts`

```typescript
// Define schema with Zod
export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
```

**Usage in component:** `components/organisms/login-form.tsx`

```typescript
const form = useForm<LoginInput>({
  resolver: zodResolver(loginSchema),
});
```

### Configuration & Constants

- **Navigation:** `lib/constants/nav.ts` - Menu structure for header and sidebar
- **Site Config:** `lib/constants/site.ts` - Site metadata, links

### Styling

**Utility function:** `lib/utils.ts` exports `cn()` for merging Tailwind classes:

```typescript
cn("px-2 py-1", isActive && "bg-blue-500", className)
```

---

## Adding New Features

### Adding a New Page

1. Create folder structure: `app/(group)/new-page/page.tsx`
2. Export `metadata` object for SEO
3. Use appropriate layout (DefaultLayout for marketing, DashboardLayout for dashboard)
4. Example:
   ```typescript
   export const metadata = {
     title: "New Page | Claude Next.js Starters",
   };
   export default function NewPage() { ... }
   ```

### Adding a New Component

**Follow Atomic Design hierarchy:**

1. **If primitive (button, input, card):** Use shadcn/ui
2. **If single element with styling:** Add to `components/atoms/`
3. **If combination of atoms:** Add to `components/molecules/`
4. **If complex with logic/state:** Add to `components/organisms/`
5. **If layout wrapper:** Add to `components/templates/`

**Component structure:**
```typescript
"use client"; // Add if using hooks
import { cn } from "@/lib/utils";

interface ComponentProps {
  className?: string;
  // props...
}

/**
 * Brief description
 */
export function ComponentName({ className, ...props }: ComponentProps) {
  return (
    <div className={cn("base-styles", className)}>
      {/* content */}
    </div>
  );
}
```

### Adding Form Validation

1. Create schema in `lib/validations/feature-name.ts`
2. Export both schema and type: `z.infer<typeof schema>`
3. Use in component with `zodResolver` from `@hookform/resolvers/zod`

### Adding Navigation Items

Edit `lib/constants/nav.ts` and add to appropriate menu:

```typescript
{
  title: "New Page",
  href: "/new-page",
  description: "Description",
  icon: IconComponent, // from lucide-react
}
```

---

## Important Implementation Details

### Type Safety

- **No `any` type** - Use `ComponentProps<"element">` or define interfaces
- **Global types:** `types/index.ts` - NavItem, SiteConfig, User
- **Form types:** Generated from Zod schemas using `z.infer<typeof schema>`

### Dark Mode Support

- Handled by `next-themes` provider in root layout
- All shadcn/ui components support dark mode automatically
- Custom styles should respect dark mode: `dark:bg-slate-900`

### Responsive Design

- All pages are responsive by default with Tailwind breakpoints
- Use `md:`, `lg:` prefixes for responsive behavior
- Mobile-first approach: base styles apply to all sizes

### State Management (Zustand)

If needed, create stores in `lib/store/` and use hooks in components:

```typescript
import { useStore } from "@/lib/store/user-store";
const { user, setUser } = useStore();
```

### Page Metadata

All page components must export `metadata`:

```typescript
export const metadata = {
  title: "Page Title | Claude Next.js Starters",
  description: "Page description for SEO",
};
```

---

## 변경 이력

### 초기화 완료 (ResumeLens MVP 기준)
- 스타터킷 데모 페이지 제거 (about, contact, docs, faq, privacy, terms)
- (auth), (dashboard) 라우트 그룹 제거 (MVP 이후 추가 예정)
- ResumeLens 6개 페이지 구조 생성
- nav.ts: 홈, 서비스소개, 가격표, 후기 메뉴로 교체
- site.ts: ResumeLens 브랜드 정보로 교체
- Header: UserMenu 제거, 분석 시작 CTA 버튼 추가
- lib/types/analysis.ts: 분석 결과 타입 정의 추가
- lib/validations/resume.ts: 자소서 입력 검증 스키마 추가
- stores/analysis-store.ts: 분석 결과 Zustand store 추가
- .env.local.example: 환경 변수 템플릿 추가

---

## Development Tips

1. **Hot Reload:** Changes auto-reload in dev mode (preserve form state with React Hook Form)
2. **Component Preview:** Use shadcn/ui storybook components as reference
3. **Validation First:** Define Zod schemas before building forms
4. **CSS Conflicts:** Use `cn()` utility instead of direct string concatenation
5. **Internationalization:** All text is currently in Korean; extract to i18n if needed
6. **SEO:** Always include metadata for new pages

---

## Common Workflows

### Building a Form Page

1. Define validation schema in `lib/validations/`
2. Create organism component in `components/organisms/` with React Hook Form
3. Use shadcn/ui inputs, buttons
4. Add error messages with FormMessage
5. Handle submission with async function + toast notifications

### Creating a Settings Section

1. Use Card component for sections (shadcn/ui)
2. Group related inputs in div with space-y-4
3. Use Label + Input/Select for form fields
4. Wrap password fields in `<form>` tag for browser support
5. Use Button with `type="submit"` inside form

### Adding a New API Route (Future)

1. Create `app/api/route-name/route.ts`
2. Export `async function POST/GET(request: Request)`
3. Use proper error handling and response formats
4. Add request/response types for type safety

---

## Debugging

- **Console errors:** Check browser console and terminal
- **Build errors:** Run `npm run build` locally
- **Type errors:** IDE shows errors; run `npx tsc --noEmit` to verify
- **Styling issues:** Inspect element and check Tailwind class conflicts with DevTools

---

## Performance Considerations

- **Code splitting:** Next.js handles automatically per route
- **Image optimization:** Use Next.js `Image` component
- **Bundle size:** Check with `npm run build` output
- **Lazy loading:** Use `React.lazy()` for heavy components
- **Memoization:** Use `React.memo()` for frequently re-rendering atoms

