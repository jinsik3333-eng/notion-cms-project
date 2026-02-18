# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Quick Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)

# Building & Testing
npm run build        # Production build
npm start           # Run production server
npm run lint        # Run ESLint

# Useful during development
npm run lint -- --fix  # Auto-fix linting issues
```

---

## Project Overview

**ResumeLens**: A Next.js 15 + Supabase application for resume analysis using Google Gemini API, with user authentication and profile management.

**Key Features**:
- User authentication (email/password via Supabase Auth)
- User profile management with PostgreSQL
- Resume analysis with Google Gemini API
- Notion CMS integration for content management
- Dark mode support via next-themes
- Protected routes and row-level security (RLS)

---

## Architecture & Structure

### Route Organization

```
app/
├── layout.tsx                    # Root layout with ThemeProvider
├── page.tsx                      # Home/landing page
├── auth/                         # Public auth routes
│   ├── login/page.tsx
│   ├── sign-up/page.tsx          # SignUpForm component
│   ├── forgot-password/page.tsx
│   └── error/page.tsx
└── protected/                    # Private routes (require auth)
    ├── layout.tsx                # ProtectedLayout with navbar/footer
    ├── page.tsx                  # Protected home
    └── profile/page.tsx          # Profile management
```

**Route Protection Pattern**:
- `/auth/*` routes are public
- `/protected/*` routes check authentication via `createClient().auth.getUser()`
- Server-side auth check: `const { data: { user } } = await supabase.auth.getUser()`
- Redirect to `/auth/login` if not authenticated

### Component Structure

```
components/
├── auth-related components
│   ├── sign-up-form.tsx          # Registration form (creates profile)
│   └── login-form.tsx
├── profile-form.tsx              # Profile edit form
├── theme-switcher.tsx
└── ui/                           # shadcn/ui primitives
```

**Component Patterns**:
- Use `"use client"` for interactive components
- Form components: React Hook Form + Zod validation (see `components/sign-up-form.tsx` for pattern)
- UI components from shadcn/ui for consistency

### Database & API

```
lib/
├── supabase/
│   ├── client.ts                 # Browser client
│   ├── server.ts                 # Server client (SSR-safe)
│   └── profile.ts                # Profile CRUD functions
├── types/
│   └── profile.ts                # TypeScript interfaces
└── utils.ts                      # Utility functions
```

**Supabase Database**:
- `profiles` table: User profile data (linked to `auth.users` by UUID)
- Automatic profile creation on signup via trigger
- RLS policies enforce user-owned data access
- Auto-updated `updated_at` via trigger

```sql
profiles {
  id: UUID (Primary Key → auth.users.id)
  email, full_name, phone, bio
  job_role, job_field, company, years_of_experience
  created_at, updated_at (auto-managed)
}
```

---

## Key Technologies & Patterns

### Authentication (Supabase Auth)

**Flow**:
1. User signs up at `/auth/sign-up` → `SignUpForm` component
2. Component calls `supabase.auth.signUp()`
3. On success, profile auto-created via:
   - Function `createProfile()` in `lib/supabase/profile.ts`, OR
   - Database trigger `on_auth_user_created`
4. Redirect to `/auth/sign-up-success`

**Protected Pages**:
```typescript
// Server component pattern
const { data: { user } } = await supabase.auth.getUser();
if (!user) redirect("/auth/login");
```

### Profile Management

**Functions in `lib/supabase/profile.ts`**:
- `getProfile(supabase, userId)` - Fetch user profile
- `createProfile(supabase, userId, email, fullName?)` - Create new profile
- `updateProfile(supabase, userId, profileData)` - Update existing
- `deleteProfile(supabase, userId)` - Delete profile
- `profileExists(supabase, userId)` - Check existence
- `searchProfiles(supabase, filter, limit)` - Search by filters
- `batchUpdateProfiles(supabase, profiles)` - Bulk updates

**Usage Example**:
```typescript
const { data: profile, error } = await getProfile(supabase, userId);
if (profile) {
  await updateProfile(supabase, userId, {
    full_name: "New Name",
    job_role: "Senior Developer"
  });
}
```

### Supabase Client Initialization

**Browser Client** (`lib/supabase/client.ts`):
```typescript
const supabase = createClient();
```
Use in Client Components ("use client").

**Server Client** (`lib/supabase/server.ts`):
```typescript
const supabase = await createClient();
```
Use in Server Components and Route Handlers.

### Forms & Validation

**Pattern** (see `components/sign-up-form.tsx`):
```typescript
import { useState } from "react";

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validation logic
    try {
      const result = await supabase.auth.signUp({...});
      // Create profile if needed
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Input fields with state binding */}
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
```

### Styling

- **TailwindCSS v3.4.1** for utility-based styling
- **next-themes** for dark mode toggle
- **shadcn/ui** for pre-built accessible components
- Custom CSS in `app/globals.css`

---

## Database Migrations & Schema

### Current Migrations

```
supabase/migrations/
└── 20260218_create_profiles_table.sql   # Profile table + RLS + triggers
```

**To Apply Migration**:
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy & paste the migration SQL
4. Execute

**Or via Supabase CLI**:
```bash
supabase migration up
```

### Row-Level Security (RLS)

All `profiles` table policies:
- **SELECT**: Users see only their own profile
- **UPDATE**: Users update only their own profile
- **DELETE**: Users delete only their own profile
- **INSERT**: Users create new profiles with their own ID

Enforced in database, not in application code.

---

## External APIs

### Google Gemini API

**Usage** (see `app/api/analyze-resume/route.ts`):
- Endpoint: `/api/analyze-resume` (POST)
- Input: `{ resumeText: string }`
- Output: Structured analysis with 5 perspectives (logic, job fit, differentiation, writing, interview)
- Handled via `@supabase/supabase-js` server-side

**Environment Variable**:
```
GOOGLE_API_KEY=<your-gemini-api-key>
```

### Notion API

**Usage**:
- Fetch CMS content (pricing, testimonials, pages)
- Cached for performance

**Environment Variables**:
```
NOTION_API_KEY=<your-notion-integration-token>
NOTION_PRICING_DB_ID=<database-id>
NOTION_TESTIMONIALS_DB_ID=<database-id>
NOTION_CONTENT_DB_ID=<database-id>
```

---

## Environment Variables

**Required for Development** (`.env.local`):
```
# Supabase (from https://app.supabase.com/project/_/settings/api)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_published_key_here
NEXT_PUBLIC_ANON_KEY=eyJhbGc...

# Google Gemini API
GOOGLE_API_KEY=AIzaSy...

# Notion API
NOTION_API_KEY=ntn_...
NOTION_PRICING_DB_ID=30bae03ae61080fa8d39d2e96b30a201
NOTION_TESTIMONIALS_DB_ID=30bae03ae61080f6ad3dd71da71e42aa
NOTION_CONTENT_DB_ID=30bae03ae610803f9844ce9754cededd

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Common Development Tasks

### Adding a New Protected Page

1. Create file in `app/protected/[feature]/page.tsx`
2. Add auth check at the top:
   ```typescript
   const supabase = await createClient();
   const { data: { user } } = await supabase.auth.getUser();
   if (!user) redirect("/auth/login");
   ```
3. Use ProtectedLayout automatically

### Updating User Profile

```typescript
// Client component example
const supabase = createClient();
const { data, error } = await updateProfile(supabase, userId, {
  full_name: "New Name",
  job_field: "개발"
});

if (error) {
  console.error("Update failed:", error);
} else {
  console.log("Profile updated:", data);
}
```

### Adding a New Form

1. Create component in `components/`
2. Use React state + hooks for form management
3. Validate with try/catch error handling
4. Import UI components from `@/components/ui`
5. Show errors and success states

### Debugging Supabase Queries

Enable Supabase logs:
```typescript
const supabase = createClient();
supabase.auth.onAuthStateChange((event, session) => {
  console.log("Auth event:", event, session);
});
```

Check RLS policies in Supabase Dashboard > Table Editor > policies tab

---

## Performance Considerations

- **Server Components**: Use for data fetching, auth checks
- **Client Components**: Use only for interactivity (forms, toggles)
- **Image Optimization**: Use `next/image` for images
- **Code Splitting**: Next.js automatically splits per route
- **Caching**: Implement in API routes for Notion/external APIs

---

## Type Safety

- **TypeScript 5.x** enabled
- Profile types in `lib/types/profile.ts`
- Import types: `import type { Profile } from "@/lib/types/profile"`
- Avoid `any` type; use proper interfaces

---

## Known Limitations & Notes

1. **Profile Creation**: Auto-created on signup via database trigger. If trigger fails, `createProfile()` is called as fallback in `SignUpForm.tsx`.

2. **File Structure**: This is a standard Next.js 15 App Router project. Most Supabase-specific code is in `lib/supabase/`.

3. **Testing**: Currently no test suite. For future expansion, consider adding `jest` + `@testing-library/react`.

4. **Deployment**: Ready for Vercel. Ensure environment variables are set in Vercel project settings.

5. **Rate Limiting**: Google Gemini API has usage limits. Implement rate limiting on `/api/analyze-resume` if needed.

---

## Useful Resources

- [Next.js 15 Docs](https://nextjs.org/docs)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [shadcn/ui Components](https://ui.shadcn.com)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Google Gemini API](https://ai.google.dev)
