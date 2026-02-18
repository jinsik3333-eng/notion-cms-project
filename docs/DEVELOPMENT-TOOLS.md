# 개발 도구 설정 가이드

ResumeLens 프로젝트의 코드 품질 및 일관성을 유지하기 위한 개발 도구 설정 문서입니다.

---

## 📋 목차

1. [설치된 도구](#설치된-도구)
2. [각 도구의 역할](#각-도구의-역할)
3. [사용 방법](#사용-방법)
4. [개발자 워크플로우](#개발자-워크플로우)
5. [문제 해결](#문제-해결)

---

## 설치된 도구

| 도구 | 버전 | 용도 |
|------|------|------|
| **ESLint** | 9.x | 코드 품질 검사 |
| **Prettier** | 3.x | 코드 포매팅 |
| **TypeScript** | 5.x | 타입 검사 |
| **Husky** | 9.x | Git Hooks 관리 |
| **lint-staged** | 16.x | 커밋 전 스테이징된 파일만 검사 |
| **commitlint** | 20.x | 커밋 메시지 규칙 검사 |

---

## 각 도구의 역할

### 1️⃣ ESLint (코드 품질)

**역할**: JavaScript/TypeScript 코드의 문제점 검출 및 코드 품질 개선

**설정 파일**: `eslint.config.js`

**적용 규칙**:
- ✅ TypeScript strict 모드
- ✅ React/Next.js 규칙
- ✅ 명확한 타입 지정 필수 (`no-explicit-any` 금지)
- ✅ 사용하지 않는 변수 감지
- ✅ 비동기 함수 Promise 처리

```bash
# ESLint 검사 실행
npm run lint

# 자동 수정
npm run lint:fix
```

### 2️⃣ Prettier (코드 포매팅)

**역할**: 코드 스타일을 자동으로 정렬하여 일관성 유지

**설정 파일**: `.prettierrc.json`

**주요 설정**:
- Print Width: 100자
- Tab Width: 2칸
- Single Quote: 사용
- Trailing Comma: ES5
- Line Ending: LF

```bash
# 포매팅 적용
npm run format

# 포매팅 확인 (변경 없이)
npm run format:check
```

### 3️⃣ TypeScript (타입 검사)

**역할**: 정적 타입 검사로 런타임 에러 사전 방지

**설정 파일**: `tsconfig.json`

**활성화된 옵션**:
- `strict: true` - 모든 TypeScript 엄격 검사 활성화
- `noEmit: true` - 컴파일 파일 생성 안 함
- `moduleResolution: bundler` - 모듈 해석

```bash
# 타입 검사 실행
npm run type-check

# 변경 감시 모드 (개발 중 사용)
npm run type-check:watch
```

### 4️⃣ Husky (Git Hooks)

**역할**: Git 커밋/푸시 전 자동으로 코드 검사 실행

**설정 파일**: `.husky/pre-commit`, `.husky/commit-msg`

**동작**:
1. **pre-commit**: 커밋 전 `lint-staged` 실행
2. **commit-msg**: 커밋 메시지 형식 검사

```bash
# Husky 초기화
npm run prepare
```

### 5️⃣ lint-staged (선택적 검사)

**역할**: 커밋 시 스테이징된 파일만 검사하여 성능 최적화

**설정 파일**: `.lintstagedrc.json`

**동작**:
- `.ts/.tsx` → ESLint 수정 + Prettier 포매팅
- `.js/.jsx` → ESLint 수정 + Prettier 포매팅
- `.json/.md` → Prettier 포매팅만

### 6️⃣ commitlint (커밋 메시지)

**역할**: 커밋 메시지가 Conventional Commits 규칙을 따르도록 강제

**설정 파일**: `commitlint.config.js`

**허용되는 Type**:
- `feat` - 새로운 기능
- `fix` - 버그 수정
- `docs` - 문서 변경
- `style` - 코드 스타일 (포매팅, 세미콜론 등)
- `refactor` - 코드 리팩토링
- `perf` - 성능 개선
- `test` - 테스트 추가/수정
- `chore` - 빌드, 의존성 변경
- `ci` - CI/CD 설정 변경
- `revert` - 이전 커밋 되돌림

**예시 커밋 메시지**:
```
feat: 자소서 분석 결과 공유 기능 추가

- 공유 링크 생성 API 구현
- 공개 페이지 UI 완성
- 조회수 추적 기능 추가

Closes #123
```

---

## 사용 방법

### 🔍 전체 검사 실행

모든 검사를 한 번에 실행하는 명령어:

```bash
# 타입 검사 + ESLint + Prettier 검사 (모두 통과해야 함)
npm run validate
```

### 📝 개발 중 사용

```bash
# 개발 서버 실행 (코드 변경 감시)
npm run dev

# 타입 검사를 실시간으로 (변경 감시)
npm run type-check:watch
```

### ✨ 코드 자동 정리

커밋 전에 자동으로 코드 정리:

```bash
# ESLint 자동 수정 + Prettier 포매팅
npm run lint:fix && npm run format
```

### 📦 빌드 전 검사

배포 전에 반드시 실행:

```bash
npm run build  # TypeScript 타입 검사 포함
npm run validate  # 최종 검증
```

---

## 개발자 워크플로우

### ✅ 권장 커밋 워크플로우

1. **기능 개발**:
   ```bash
   git checkout -b feat/feature-name
   npm run dev
   ```

2. **코드 검사 및 정리**:
   ```bash
   npm run lint:fix  # ESLint 자동 수정
   npm run format    # Prettier 포매팅
   npm run type-check  # TypeScript 검사
   ```

3. **변경 사항 스테이징**:
   ```bash
   git add .
   # 또는 선택적 추가
   git add <file1> <file2>
   ```

4. **커밋 (Husky 자동 검사)**:
   ```bash
   git commit -m "feat: 새로운 기능 설명"
   # 자동으로 lint-staged 실행
   # 자동으로 commitlint 검사
   ```

5. **푸시 및 PR**:
   ```bash
   git push origin feat/feature-name
   ```

### 🚫 Husky가 차단한 경우

커밋이 실패한 경우:

```bash
# 1. 자동 수정 가능한 부분은 자동으로 처리
npm run lint:fix
npm run format

# 2. 수정이 필요한 부분 확인
npm run validate

# 3. 다시 커밋 시도
git add <files>
git commit -m "..."
```

---

## 문제 해결

### Q1: "ESLint 에러가 자동으로 수정되지 않음"

ESLint 규칙에 따라 자동 수정 불가능한 경우가 있습니다.

```bash
# 문제 파일 확인
npm run lint

# 수동으로 수정 후 다시 시도
npm run lint:fix
```

**흔한 에러**:
- `no-explicit-any`: `any` 타입 제거 → 명시적 타입 지정
- `strict-boolean-expressions`: Boolean 명시적 표현 필요

### Q2: "타입 검사는 통과하는데 ESLint 에러 발생"

ESLint와 TypeScript의 검사 항목이 다를 수 있습니다.

```bash
# 순서대로 확인
npm run type-check  # TypeScript
npm run lint        # ESLint
npm run format:check  # Prettier
```

### Q3: "커밋 메시지가 거부됨 (commitlint)"

Conventional Commits 형식을 따르지 않았습니다.

```bash
# ❌ 잘못된 예
git commit -m "fixed bug"
git commit -m "Updated code"

# ✅ 올바른 예
git commit -m "fix: 로그인 화면 버그 수정"
git commit -m "refactor: 자소서 분석 컴포넌트 구조 개선"
```

### Q4: "Husky hooks가 실행되지 않음"

Husky 초기화 필요:

```bash
npm run prepare

# 또는 수동 초기화
npx husky install
```

### Q5: "특정 파일만 검사하고 싶음"

```bash
# 특정 파일 ESLint 검사
npx eslint src/components/button.tsx

# 특정 디렉토리 검사
npx eslint app/api --fix

# Prettier 특정 파일 포매팅
npx prettier --write src/components/*.tsx
```

---

## 설정 파일 위치

```
notion-cms-project/
├── .eslintrc.json              # ESLint 설정 (레거시, 현재는 eslint.config.js 사용)
├── eslint.config.js            # ESLint 설정 (Flat Config - 새 형식)
├── .prettierrc.json            # Prettier 설정
├── .prettierignore             # Prettier 무시 파일 목록
├── .lintstagedrc.json          # lint-staged 설정
├── commitlint.config.js        # commitlint 설정
├── .editorconfig               # 에디터 설정 (IDE 간 일관성)
├── tsconfig.json               # TypeScript 설정
├── .npmrc                       # npm 설정
├── .husky/
│   ├── pre-commit              # Git pre-commit hook
│   └── commit-msg              # Git commit-msg hook
└── package.json                # npm 스크립트
```

---

## IDE/에디터 통합

### VS Code

**권장 확장프로그램**:
1. **ESLint** - dbaeumer.vscode-eslint
2. **Prettier** - esbenp.prettier-vscode
3. **EditorConfig** - editorconfig.editorconfig
4. **TypeScript Vue Plugin** (Vue 사용 시)

**VS Code settings.json**:
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[typescript]": {
    "editor.formatOnSave": true
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### WebStorm / IntelliJ IDEA

1. **Settings** → **Languages & Frameworks** → **JavaScript** → **Code Quality Tools** → **ESLint**
   - ESLint 패키지: 자동 감지
   - Configuration file: 자동 검색

2. **Settings** → **Languages & Frameworks** → **JavaScript** → **Prettier**
   - Prettier 패키지: 자동 감지

3. **Reformat Code** 실행 시 자동으로 적용됨

---

## CI/CD 통합

### GitHub Actions 예시

```yaml
name: Code Quality

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run format:check
```

---

## 성능 최적화 팁

### 1. lint-staged로 커밋 시간 단축

`lint-staged`는 **스테이징된 파일만** 검사하므로 매우 빠릅니다:

```bash
# 변경된 모든 파일 검사 (느림)
npm run lint

# 스테이징된 파일만 검사 (빠름) - pre-commit hook에서 자동 실행
npx lint-staged
```

### 2. Watch 모드 활용

개발 중에는 Watch 모드로 실시간 검사:

```bash
npm run type-check:watch
```

### 3. 증분 빌드

TypeScript의 `incremental` 옵션이 활성화되어 있어 빌드 시간 단축:

```bash
npm run build  # 변경된 파일만 다시 컴파일
```

---

## 추가 자료

- [ESLint 공식 문서](https://eslint.org)
- [Prettier 공식 문서](https://prettier.io)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs)
- [Husky 문서](https://typicode.github.io/husky)
- [Conventional Commits](https://www.conventionalcommits.org)

---

**최종 업데이트**: 2026-02-18
**버전**: 1.0
