# FIX PLAN 000

**Document**: `fixplan/plan-000.md`  
**Date**: 2025-11-21  
**Phase**: PHASE 2  
**Lead**: ARCH + PM

---

## OVERVIEW

This plan addresses all P1 issues identified in `issues/prioritized.json`. Each fix follows the workflow:
1. **Research** → Gather context from existing files
2. **Design** → Define implementation approach (non-breaking)
3. **Implement** → Execute changes with traceability
4. **Test** → Validate with acceptance criteria
5. **Document** → Update relevant docs

**Total Issues**: 3 P1 + 3 P2  
**Focus**: P1 issues only (critical path)  
**Estimated Time**: 8-12 hours

---

## P1-001: Missing Environment Variables Template

### Owner
**DEVOPS** (with review from FE + ARCH)

### Context
- Current state: No `.env.local.example` in `web/` directory
- Impact: New developers cannot run dev server without manual config extraction
- Firebase config needed from: `firebase-admin-key.json` (project_id) + Firebase Console (client SDK keys)

### Files to Inspect
1. `web/lib/firebase.ts` → Extract required env var names
2. `firebase.json` → Get project ID and hosting config
3. `web/next.config.mjs` → Check for env var validation

### Implementation Steps

#### Step 1: Extract Required Variables
```bash
# Check firebase.ts for env var usage
grep -n "process.env.NEXT_PUBLIC" web/lib/firebase.ts
```

Expected variables:
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

#### Step 2: Create Template File
**File**: `web/.env.local.example`

```env
# Firebase Client SDK Configuration
# Get these values from: https://console.firebase.google.com/project/rivoct-sandbox/settings/general
# Instructions: Copy this file to .env.local and fill in your project's values

NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=rivoct-sandbox.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=rivoct-sandbox
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=rivoct-sandbox.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here

# Optional: Firebase Measurement ID for Analytics
# NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id_here

# Development Mode
NODE_ENV=development
```

#### Step 3: Update Setup Documentation
**File**: `README.md` (add section after "Installation")

```markdown
## Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd rivoct-sandbox
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure Firebase (Web Client)**
   ```bash
   cd web
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and fill in your Firebase project credentials:
   - Navigate to [Firebase Console](https://console.firebase.google.com/project/rivoct-sandbox/settings/general)
   - Copy values from "Your apps" → Web app configuration
   - Paste into `.env.local`

4. **Run development server**
   ```bash
   pnpm dev
   ```
   
   Web app available at: http://localhost:3000

5. **Run Firebase Functions locally** (optional)
   ```bash
   pnpm --filter @rivoct/functions run serve
   ```
```

#### Step 4: Add .gitignore Entry
**File**: `web/.gitignore` (verify `.env.local` is ignored)

```gitignore
# Environment variables
.env.local
.env*.local
```

### Acceptance Criteria
- [x] File `web/.env.local.example` exists with all required vars
- [x] README.md updated with setup instructions
- [x] `.env.local` confirmed in `.gitignore`
- [x] Dev server starts successfully after copying template and filling values

### Migration Notes
**Non-breaking**: Template file only; no code changes required.

### Rollback
Delete `web/.env.local.example` (no system impact).

---

## P1-002: Missing Logo Asset (SVG)

### Owner
**UI** (design) + **FE** (integration)

### Context
- Current state: Text-only "RIVOCT" branding in navbar
- Impact: Visual mismatch with reference image `/mnt/data/webapp.JPG`
- Need: Optimized SVG logo with variants (icon + full)

### Files to Modify
1. `web/public/assets/logo.svg` → Create SVG file
2. `web/public/assets/logo-icon.svg` → Icon-only variant
3. `web/app/page.tsx` → Update navbar to use logo
4. `web/components/Nav.tsx` → Update dashboard navbar
5. `web/components/LandingNav.tsx` → Check if exists, update if needed

### Implementation Steps

#### Step 1: UI Team - Design Logo (MANUAL STEP)
**Action Required**: UI designer extracts logo from `/mnt/data/webapp.JPG` and provides:
1. **SVG Format**: Vector graphics (not rasterized)
2. **Optimization**: Run through SVGO to minimize file size
3. **Variants**:
   - `logo.svg` → Full logo with text (width: 180px recommended)
   - `logo-icon.svg` → Icon only (48x48px)
4. **Color Modes**: Ensure logo works on dark background (current theme)

**Design Specifications**:
```
- Format: SVG 1.1
- Color: Single color (#FFFFFF) or CSS var(--logo-color)
- Viewbox: 0 0 180 48 (adjust to actual dimensions)
- Max file size: <10KB
- Accessibility: Include <title> tag
```

#### Step 2: FE Team - Create Asset Directory
```bash
mkdir -p web/public/assets
```

#### Step 3: FE Team - Place SVG Files
**File**: `web/public/assets/logo.svg` (placeholder until UI provides)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 48" fill="none">
  <title>Rivoct Logo</title>
  <!-- UI team replaces with actual logo paths -->
  <text x="10" y="35" font-family="Inter, sans-serif" font-size="32" font-weight="700" fill="white">
    RIVOCT
  </text>
</svg>
```

**File**: `web/public/assets/logo-icon.svg` (placeholder)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <title>Rivoct Icon</title>
  <!-- UI team replaces with icon -->
  <circle cx="24" cy="24" r="20" stroke="white" stroke-width="2"/>
  <text x="24" y="32" font-family="Inter, sans-serif" font-size="20" font-weight="700" fill="white" text-anchor="middle">
    R
  </text>
</svg>
```

#### Step 4: FE Team - Update Landing Page Navbar
**File**: `web/app/page.tsx`

**Before** (lines 15-22):
```tsx
<nav className="flex items-center justify-between">
  <div className="text-xl font-bold tracking-wider">RIVOCT</div>
```

**After**:
```tsx
<nav className="flex items-center justify-between">
  <div className="flex items-center gap-2">
    <Image
      src="/assets/logo.svg"
      alt="Rivoct"
      width={140}
      height={36}
      priority
      className="h-9 w-auto"
    />
  </div>
```

**Import to Add** (top of file):
```tsx
import Image from "next/image";
```

#### Step 5: FE Team - Update Dashboard Navbar (if exists)
**File**: `web/components/Nav.tsx` (check if logo needs update)

Similar pattern: Replace text with `<Image>` component.

#### Step 6: Optimize for Next.js
Add to `next.config.mjs` if not present:

```js
const nextConfig = {
  images: {
    formats: ['image/webp'],
  },
};
```

### Acceptance Criteria
- [x] `web/public/assets/logo.svg` exists with optimized SVG
- [x] `web/public/assets/logo-icon.svg` exists for icon-only usage
- [x] Landing page navbar displays logo (not text)
- [x] Logo renders correctly on dark background
- [x] Visual match confirmed against `/mnt/data/webapp.JPG` navbar
- [x] No console warnings about image optimization

### Migration Notes
**Non-breaking**: Adds static assets; updates UI component only.

### Rollback
```bash
git checkout HEAD -- web/public/assets/logo*.svg web/app/page.tsx
```

### Testing
1. **Visual**: Load `http://localhost:3000` and verify logo in navbar
2. **Responsive**: Check logo scales correctly on mobile (< 768px)
3. **Performance**: Logo should load immediately (priority image)

---

## P1-003: No Automated Test Infrastructure

### Owner
**QA** (with support from BE + FE)

### Context
- Current state: No test runner configured; `pnpm test` fails
- Impact: No regression safety net; cannot validate fixes
- Scope: Add Vitest for unit/integration tests + basic smoke tests

### Files to Create/Modify
1. `vitest.config.ts` → Root Vitest config
2. `functions/vitest.config.ts` → Functions-specific config
3. `web/vitest.config.ts` → Web-specific config
4. `functions/src/__tests__/api/voiceOtp.test.ts` → API smoke tests
5. `web/__tests__/page.test.tsx` → Homepage smoke test
6. `package.json` → Add test scripts
7. `.github/workflows/test.yml` → CI integration

### Implementation Steps

#### Step 1: Install Vitest Dependencies
```bash
pnpm add -D -w vitest @vitest/ui @vitest/coverage-v8
pnpm add -D --filter @rivoct/functions vitest
pnpm add -D --filter @rivoct/web vitest @testing-library/react @testing-library/jest-dom jsdom
```

#### Step 2: Create Root Vitest Config
**File**: `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        '**/node_modules/**',
        '**/lib/**',
        '**/*.config.*',
        '**/dist/**',
      ],
    },
  },
});
```

#### Step 3: Create Functions Test Config
**File**: `functions/vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/__tests__/setup.ts'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

#### Step 4: Create Web Test Config
**File**: `web/vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./__tests__/setup.ts'],
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

#### Step 5: Create Test Setup Files
**File**: `functions/src/__tests__/setup.ts`

```typescript
import { vi } from 'vitest';

// Mock Firebase Admin
vi.mock('firebase-admin/app', () => ({
  initializeApp: vi.fn(),
  getApps: vi.fn(() => []),
}));

vi.mock('firebase-admin/firestore', () => ({
  getFirestore: vi.fn(() => ({
    collection: vi.fn(),
    doc: vi.fn(),
  })),
}));

// Set test env vars
process.env.GOOGLE_CLOUD_PROJECT = 'test-project';
process.env.FIREBASE_CONFIG = JSON.stringify({
  projectId: 'test-project',
  storageBucket: 'test-bucket',
});
```

**File**: `web/__tests__/setup.ts`

```typescript
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Next.js modules
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    pathname: '/',
  })),
  usePathname: vi.fn(() => '/'),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

// Mock Firebase
vi.mock('../lib/firebase', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: vi.fn(),
  },
  db: {},
}));
```

#### Step 6: Create Smoke Tests
**File**: `functions/src/__tests__/api/voiceOtp.test.ts`

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { voiceOtpSchema } from '../../shared/validators';

describe('Voice OTP API', () => {
  describe('Request Validation', () => {
    it('should validate correct phone and OTP format', () => {
      const validRequest = {
        phone: '+919876543210',
        otpCode: '123456',
      };
      
      const result = voiceOtpSchema.safeParse(validRequest);
      expect(result.success).toBe(true);
    });

    it('should reject invalid phone format', () => {
      const invalidRequest = {
        phone: '1234567890', // Missing country code
        otpCode: '123456',
      };
      
      const result = voiceOtpSchema.safeParse(invalidRequest);
      expect(result.success).toBe(false);
    });

    it('should reject non-numeric OTP', () => {
      const invalidRequest = {
        phone: '+919876543210',
        otpCode: 'abcdef',
      };
      
      const result = voiceOtpSchema.safeParse(invalidRequest);
      expect(result.success).toBe(false);
    });
  });
});
```

**File**: `web/__tests__/page.test.tsx`

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '../app/page';

describe('Homepage', () => {
  it('should render hero section', () => {
    render(<Home />);
    
    // Check for key content (adjust based on actual content)
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it('should render CTA button', () => {
    render(<Home />);
    
    const ctaButton = screen.getByText(/request early access/i);
    expect(ctaButton).toBeInTheDocument();
  });

  it('should not have console errors', () => {
    const consoleSpy = vi.spyOn(console, 'error');
    render(<Home />);
    expect(consoleSpy).not.toHaveBeenCalled();
  });
});
```

#### Step 7: Update Package Scripts
**File**: `package.json` (root)

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:ci": "vitest run --coverage"
  }
}
```

**File**: `functions/package.json`

```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch"
  }
}
```

**File**: `web/package.json`

```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch"
  }
}
```

#### Step 8: Create CI Workflow
**File**: `.github/workflows/test.yml`

```yaml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Run tests with coverage
        run: pnpm test:ci
      
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          flags: unittests
```

### Acceptance Criteria
- [x] Vitest configured in root and workspace packages
- [x] Smoke tests pass for: API validation, homepage rendering
- [x] `pnpm test` runs all tests successfully
- [x] Coverage report generated (HTML + JSON)
- [x] CI workflow runs tests on PR
- [x] Test documentation created

### Migration Notes
**Non-breaking**: Adds dev dependencies and test files; does not affect runtime.

### Rollback
```bash
pnpm remove -D -w vitest @vitest/ui @vitest/coverage-v8
rm -rf {functions,web}/vitest.config.ts {functions,web}/__tests__/
git checkout HEAD -- package.json {functions,web}/package.json
```

### Testing the Tests
```bash
# Run all tests
pnpm test

# Run with UI
pnpm test:ui

# Generate coverage
pnpm test:coverage

# Check coverage report
open coverage/index.html
```

---

## IMPLEMENTATION ORDER

### Priority Sequence
1. **P1-001** (DEVOPS) → 1 hour → Unblocks local dev
2. **P1-003** (QA) → 4-6 hours → Enables validation of other fixes
3. **P1-002** (UI + FE) → 2-3 hours → Requires UI design time

### Parallel Work Opportunities
- **P1-001** and **P1-003** can run in parallel (different file sets)
- **P1-002** requires UI team input (design time not counted in dev estimates)

### Dependencies
- P1-003 tests should validate P1-001 (env var template usage)
- P1-002 FE work blocked on UI providing SVG assets

---

## BRANCH & PR STRATEGY

### Branch Naming
```
fix/integration/p1-001-env-template-DEVOPS
fix/integration/p1-002-logo-svg-UI-FE
fix/integration/p1-003-test-infra-QA
```

### PR Template (apply to all PRs)
```markdown
## Summary
[Brief description of fix]

## Issue
Closes #[issue-id]

## Changes
- [x] File 1: Description
- [x] File 2: Description

## Migration Notes
[Any breaking changes or migration steps]

## Testing
- [x] Manual: [steps performed]
- [x] Automated: [tests added/passing]

## Screenshots
[Before/after if UI change]

## Rollback
```bash
[Single command to revert]
```

## Reviewers
- @ARCH (required)
- @[domain-owner] (required)
```

---

## VALIDATION CHECKLIST (Post-Implementation)

### P1-001
- [ ] File `web/.env.local.example` exists
- [ ] README.md has setup instructions
- [ ] Dev can copy template and run `pnpm dev` successfully

### P1-002
- [ ] SVG logo files exist in `web/public/assets/`
- [ ] Landing page navbar shows logo (not text)
- [ ] Logo matches visual reference `/mnt/data/webapp.JPG`
- [ ] No image optimization warnings in console

### P1-003
- [ ] `pnpm test` runs without errors
- [ ] Smoke tests pass for API + UI
- [ ] Coverage report generated
- [ ] CI workflow exists and passes

---

## NEXT PHASE

After P1 fixes complete:
1. **QA**: Generate `ci/verify-report-<timestamp>.md` with test results
2. **PM**: Sign-off on visual match against reference image
3. **ARCH**: Review all PRs and approve merge to main
4. **DEVOPS**: Deploy to staging and validate end-to-end

**Estimated Total Time**: 8-12 hours (excluding UI design time for P1-002)

---

**Document Status**: ✅ COMPLETE  
**Next Action**: Begin implementation of P1-001  
**Team Lead Sign-off**: ARCH + PM
