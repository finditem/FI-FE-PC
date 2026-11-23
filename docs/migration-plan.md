# FI-FE-PC 마이그레이션 계획

FI-FE(모바일 웹 리포)의 환경과 규칙을 기반으로 FI-FE-PC를 세팅하기 위한 단계별 계획이다. 각 단계를 진행하면서 체크리스트를 갱신한다.

## 전제

- 브랜치 전략은 FI-FE와 동일하다. `develop`(개발 통합) → `release`(QA, 배포 준비) → `main`(운영).
- 다국어(ko/en)를 FI-FE와 동일하게 지원한다.
- FI-FE와의 공통 코드 공유 방식(공통 패키지 분리 여부)은 보류하고, 우선 필요한 만큼 복사한다.
- GitHub App(finditem-bot) 연결은 나중에 처리한다.
- 0단계를 제외한 모든 단계는 `develop`에서 분기한 브랜치 하나와 PR 하나로 진행하고 `develop`으로 머지한다.

## 0단계. 저장소 기본 세팅 (GitHub 작업)

- [x] `main`에서 `develop`, `release` 브랜치를 생성하고 push한다.
- [x] 기본 브랜치를 `develop`으로 변경한다.
- [x] FI-FE 라벨을 복사한다. (`gh label clone finditem/FI-FE -R finditem/FI-FE-PC`)
- [ ] 브랜치 보호 규칙을 설정한다. 초기 세팅 중에는 PR이 잦으므로 4단계 이후에 설정한다.

## 1단계. Next.js 프로젝트 초기화 (`chore/init-nextjs`)

- [ ] FI-FE와 동일한 버전(Next 15, React 19, TypeScript 5, Tailwind 3.4)으로 프로젝트를 생성한다. 기존 README와 충돌하지 않도록 임시 폴더에서 생성한 뒤 옮긴다.
- [ ] `tsconfig.json`(`@/*` 경로 별칭), `postcss.config.mjs`를 가져온다.
- [ ] `next.config.ts`의 기본 골격(reactCompiler, svgr, 보안 헤더, images)을 가져온다.
- [ ] `npm run dev`, `npm run build`가 성공하는지 확인한다.

## 2단계. 커밋 규칙 도구 (`chore/commit-convention`)

1단계 직후에 진행한다. 이후 커밋부터 규칙이 자동으로 검사된다.

- [ ] husky, commitlint, lint-staged, prettier, prettier-plugin-tailwindcss를 설치한다.
- [ ] `commitlint.config.cjs`, `prettier.config.cjs`, `.husky/commit-msg`, `.husky/pre-commit`을 가져온다.
- [ ] `package.json`에 `lint-staged` 설정을 추가한다.
- [ ] `.gitignore`, `.vscode/settings.json`을 가져온다.
- [ ] 규칙에 맞지 않는 커밋(예: `git commit -m "test"`)이 거절되는지 확인한다.

## 3단계. GitHub 템플릿 (`chore/github-templates`)

- [ ] `.github/pull_request_template.md`를 가져온다.
- [ ] `.github/ISSUE_TEMPLATE/`(bug_report, refactor, task)를 가져온다.
- [ ] `.github/dependabot.yml`을 가져온다.

## 4단계. GitHub 자동화 워크플로 (`chore/github-workflows`)

- [ ] `.github/auto_assign.yml`, `.github/drafter-config.yml`을 가져온다.
- [ ] 워크플로 `auto-assign`, `auto-label`, `auto-assign-issue`, `re-request-review`, `drafter`, `release-promotion`, `hotfix-sync`를 가져온다.
- [ ] GitHub App 연결 후 머지한다. 연결 전에 머지하면 모든 PR에서 워크플로가 실패한다.
- [ ] 0단계에서 미룬 브랜치 보호 규칙을 설정한다.

## 5단계. AI 협업 설정과 문서 (`docs/claude-setup`)

- [ ] `CLAUDE.md`, `AGENTS.md`를 가져와 PC 환경에 맞게 수정한다(리포 이름, Capacitor 등 모바일 전용 내용, 아직 없는 기능 설명 정리).
- [ ] `docs/tsdoc-guide.md`, `docs/data-fetching-guide.md`를 가져온다.
- [ ] `.claude/skills/create-pr`, `.claude/skills/plan-route`, `.claude/hooks/`를 가져온다.
- [ ] 지도 기능을 사용한다면 `.claude/skills/naver-map`, `docs/naver-map/`을 가져온다.

## 6단계. 디자인 기반 (`chore/design-foundation`)

- [ ] `src/utils/tokens/`, `src/utils/customStylePlugins/`, `src/utils/customFonts/`를 가져온다.
- [ ] `tailwind.config.ts`, `src/app/globals.css`, 폰트를 가져온다.
- [ ] `scripts/generate-icon-sprite.js`, 아이콘 원본, `predev`/`prebuild` 스크립트를 가져온다.
- [ ] 토큰 클래스와 커스텀 유틸리티가 빌드에 반영되는지 확인한다.

## 7단계. 다국어 (`chore/i18n`)

- [ ] next-intl을 설치한다.
- [ ] `src/i18n/`, `src/messages/{ko,en}.json`(골격), `src/middleware.ts`, `src/app/[locale]/` 라우트 구조를 가져온다.
- [ ] `eslint.config.mjs`, `eslint-rules/no-korean-literal.js`, `scripts/check-i18n-keys.js`와 관련 npm 스크립트를 가져온다.
- [ ] `/`, `/en` 접속과 `npm run check:i18n-keys` 통과를 확인한다.

## 8단계. 데이터와 상태 레이어 (`chore/data-layer`)

- [ ] axios, @tanstack/react-query, zustand, cookies-next, zod, react-hook-form 등을 설치한다.
- [ ] `src/api/_base/`, `src/providers/`, 필요한 `src/store`, `src/types`를 가져온다.
- [ ] `.env.example`을 가져온다. `.env.local`의 실제 값은 팀에게 받는다.
- [ ] API 하나를 `useAppQuery`로 호출해 동작을 확인한다.

## 9단계. 모니터링과 분석 (`chore/monitoring`)

- [ ] Sentry 프로젝트를 FI-FE와 공유할지, PC용으로 새로 만들지 결정한다.
- [ ] `sentry.*.config.ts`, `src/instrumentation*.ts`, `next.config.ts`의 `withSentryConfig`를 가져온다.
- [ ] Vercel Analytics, Speed Insights, GA, Clarity를 설정한다.

## 10단계. 테스트 환경 (`test/setup`)

팀 규칙에 따라 테스트 관련 작업은 `test/*` 브랜치로 분리한다.

- [ ] Jest: `jest.config.js`, `jest.setup.ts`와 관련 패키지를 가져온다.
- [ ] MSW: `src/mock/`(handlers, `data/index.ts` 골격), `public/mockServiceWorker.js`를 가져온다.
- [ ] Playwright: `playwright.config.ts`, `tests/e2e/`를 가져온다.
- [ ] Storybook: `.storybook/`을 가져온다.
- [ ] 샘플 테스트로 `npm run test`, `npm run test:e2e`, `npm run storybook`이 동작하는지 확인한다.

## 11단계. CI와 보안 스캔 (`chore/ci`)

- [ ] 워크플로 `jest`, `playwright`, `chromatic`, `trufflehog`, `osv-scanner`를 가져온다.
- [ ] secret `NEXT_PUBLIC_API_URL`, `CHROMATIC_PROJECT_TOKEN`(PC용 Chromatic 프로젝트), `SENTRY_AUTH_TOKEN`을 등록한다.

## 12단계. 배포 흐름 검증

- [ ] Vercel에 PC 프로젝트를 연결하고 환경 변수를 등록한다.
- [ ] `develop` 머지 → release PR 자동 생성 → `release` 머지 → `main` 머지 → 릴리즈 초안 생성까지 전체 흐름을 한 번 실행해 확인한다.

## 가져오지 않는 항목

- 모바일 앱 전용: `capacitor.config.ts`, `ios/`, `@capacitor/*` 패키지
- 빌드와 로컬 산출물: `.next/`, `node_modules/`, `coverage/`, `reports/`, `tsconfig.tsbuildinfo`, `.env.local`
- 개인 도구 설정: `.agents/`, `.codex/`
- 확인 후 결정: `emails/`

## 외부 의존 항목

| 항목 | 영향받는 단계 |
| --- | --- |
| finditem-bot App에 FI-FE-PC 추가, `APP_ID`와 `APP_PRIVATE_KEY` 등록 | 4단계 머지 |
| `.env.local` 실제 값 | 8단계 |
| Sentry, Chromatic 프로젝트 결정과 토큰 | 9단계, 11단계 |
| Vercel 프로젝트 연결 | 12단계 |
