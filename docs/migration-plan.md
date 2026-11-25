# FI-FE-PC 마이그레이션 계획

FI-FE(모바일 웹 리포)의 환경과 규칙을 기반으로 FI-FE-PC를 세팅하기 위한 단계별 계획이다. 각 단계를 진행하면서 체크리스트를 갱신한다.

## 전제

- 브랜치 전략은 FI-FE와 동일하다. `develop`(개발 통합) → `release`(QA, 배포 준비) → `main`(운영).
- 다국어(ko/en)를 FI-FE와 동일하게 지원한다.
- FI-FE 파일은 로컬 작업 트리가 아니라 `git fetch` 후 `origin/develop` 기준으로 가져온다.
- FI-FE와의 공통 코드 공유 방식(공통 패키지 분리 여부)은 보류하고, 우선 필요한 만큼 복사한다.
- 워크플로용 GitHub App은 FI-FE의 finditem-bot을 쓰지 않고 PC 전용 App(`finditem-pc-bot`)을 새로 만든다. 생성과 연결은 나중에 처리한다.
- 0단계를 제외한 모든 단계는 `develop`에서 분기한 브랜치 하나와 PR 하나로 진행하고 `develop`으로 머지한다.
- `CLAUDE.md`는 3단계에서 규칙 부분만 먼저 넣고, 스택과 구조, 코드 컨벤션 부분은 해당 코드가 들어오는 단계에서 함께 채운다. 아직 없는 코드를 가리키는 규칙이 섞이지 않게 하기 위함이다.

## 0단계. 저장소 기본 세팅 (GitHub 작업)

- [x] `main`에서 `develop`, `release` 브랜치를 생성하고 push한다.
- [x] 기본 브랜치를 `develop`으로 변경한다.
- [x] FI-FE 라벨을 복사한다. (`gh label clone finditem/FI-FE -R finditem/FI-FE-PC`)
- [x] FI-FE와 동일하게 머지 후 브랜치 자동 삭제(`delete_branch_on_merge`)를 켠다. 이전 단계 브랜치 위에 쌓은 PR은 이전 PR이 머지되어 브랜치가 삭제될 때 base가 `develop`으로 자동 변경된다.
- [x] FI-FE의 Ruleset(`develop`, `release`, `main`, `hotfix/*`)을 그대로 옮겨 브랜치 보호 규칙을 설정한다. 세 상시 브랜치는 merge 방식만 허용하고, `develop`은 승인 1명이 필요하다. FI-FE의 `Vercel` 필수 상태 검사는 Vercel 연결 전에는 모든 PR의 머지를 막으므로 제외하고 9단계에서 추가한다.

## 1단계. Next.js 프로젝트 초기화 (`chore/init-nextjs`)

- [x] FI-FE와 동일한 버전(Next 15, React 19, TypeScript 5, Tailwind 3.4)으로 프로젝트를 구성한다.
- [x] `tsconfig.json`(`@/*` 경로 별칭), `postcss.config.mjs`, `.gitignore`를 가져온다. `.gitignore`는 `node_modules`가 생기는 시점부터 필요하므로 이 단계에서 가져온다.
- [x] `next.config.ts`의 기본 골격(reactCompiler, svgr, 보안 헤더, images)을 가져온다.
- [x] `npm run build`가 성공하고, 빌드 결과를 `next start`로 띄웠을 때 `/`가 응답하며 보안 헤더가 적용되는지 확인한다.

## 2단계. 커밋 규칙 도구 (`chore/commit-convention`)

1단계 직후에 진행한다. 이후 커밋부터 규칙이 자동으로 검사된다.

- [x] husky, commitlint, lint-staged, prettier, prettier-plugin-tailwindcss를 설치한다.
- [x] `commitlint.config.cjs`, `prettier.config.cjs`, `.husky/commit-msg`, `.husky/pre-commit`을 가져온다.
- [x] `package.json`에 `lint-staged` 설정을 추가한다.
- [x] `.vscode/settings.json`을 가져온다.
- [x] 규칙에 맞지 않는 커밋(예: `git commit -m "test"`)이 거절되는지 확인한다.

## 3단계. 협업 규칙 (`chore/github-templates`)

마이그레이션 PR이 계속 올라가므로 PR 형식과 작업 규칙을 초기에 갖춘다.

- [x] `.github/pull_request_template.md`를 가져온다.
- [x] `.github/ISSUE_TEMPLATE/`(bug_report, refactor, task)를 가져온다.
- [x] `.github/dependabot.yml`을 가져온다.
- [x] `.claude/skills/create-pr`를 가져온다. PR 템플릿에 의존하므로 같은 PR에 넣는다.
- [x] `CLAUDE.md`의 규칙 부분(커밋 컨벤션, 브랜치 전략, 텍스트 작성 원칙, 표준 작업 흐름, PR 생성, PR 리뷰 반영)을 가져온다.
- [x] (선택) `.claude/hooks/check-claude-local.sh`를 가져온다. 각자 `settings.local.json`에 등록해야 동작하므로 다른 팀원에게 영향이 없다.

## 4단계. GitHub 자동화 워크플로 (`chore/github-workflows`)

- [ ] `.github/auto_assign.yml`, `.github/drafter-config.yml`을 가져온다.
- [ ] 워크플로 `auto-assign`, `auto-label`, `auto-assign-issue`, `re-request-review`, `drafter`, `release-promotion`, `hotfix-sync`를 가져온다.
- [ ] `finditem-pc-bot` 연결 후 머지한다. 연결 전에 머지하면 모든 PR에서 워크플로가 실패한다. 워크플로는 `vars.APP_ID`와 `secrets.APP_PRIVATE_KEY`만 읽으므로 FI-FE 파일을 수정 없이 그대로 쓴다.

## 5단계. 디자인 기반 (`chore/design-foundation`)

- [ ] `src/utils/tokens/`, `src/utils/customStylePlugins/`, `src/utils/customFonts/`를 가져온다.
- [ ] `tailwind.config.ts`, `src/app/globals.css`, 폰트를 가져온다.
- [ ] `scripts/generate-icon-sprite.js`, 아이콘 원본, `predev`/`prebuild` 스크립트를 가져온다.
- [ ] 토큰 클래스와 커스텀 유틸리티가 빌드에 반영되는지 확인한다.
- [ ] `CLAUDE.md`에 스택, 코드 컨벤션(상수 분리, TSDoc, TODO 주석), React Compiler 섹션을 추가하고 `docs/tsdoc-guide.md`를 가져온다.

## 6단계. 다국어 (`chore/i18n`)

- [ ] next-intl을 설치한다.
- [ ] `src/i18n/`, `src/messages/{ko,en}.json`(골격), `src/middleware.ts`, `src/app/[locale]/` 라우트 구조를 가져온다.
- [ ] `eslint.config.mjs`, `eslint-rules/no-korean-literal.js`, `scripts/check-i18n-keys.js`와 관련 npm 스크립트를 가져온다.
- [ ] `/`, `/en` 접속과 `npm run check:i18n-keys` 통과를 확인한다.
- [ ] `.claude/skills/plan-route`를 가져온다.
- [ ] `CLAUDE.md`에 구조, 라우트 작업 계획 섹션을 추가한다.

## 7단계. 테스트 환경 (`test/setup`)

팀 규칙에 따라 테스트 관련 작업은 `test/*` 브랜치로 분리한다.

- [ ] Jest: `jest.config.js`, `jest.setup.ts`와 관련 패키지를 가져온다.
- [ ] MSW: `src/mock/`(handlers, `data/index.ts` 골격), `public/mockServiceWorker.js`를 가져온다.
- [ ] Playwright: `playwright.config.ts`, `tests/e2e/`를 가져온다.
- [ ] Storybook: `.storybook/`을 가져온다.
- [ ] 5단계에서 제외한 `Icon`의 테스트와 스토리를 가져온다.
- [ ] 샘플 테스트로 `npm run test`, `npm run test:e2e`, `npm run storybook`이 동작하는지 확인한다.
- [ ] `AGENTS.md`(mock 데이터 규칙)를 가져오고 `CLAUDE.md`에 검증 커맨드 섹션을 추가한다.

## 8단계. CI와 보안 스캔 (`chore/ci`)

- [ ] 워크플로 `jest`, `playwright`, `chromatic`, `trufflehog`, `osv-scanner`를 가져온다.
- [ ] secret `NEXT_PUBLIC_API_URL`, `CHROMATIC_PROJECT_TOKEN`(PC용 Chromatic 프로젝트)을 등록한다.

## 9단계. 배포 흐름 검증

- [ ] Vercel에 PC 프로젝트를 연결하고 환경 변수를 등록한다.
- [ ] PC 운영 도메인을 정하고 FI-FE처럼 `src/constants/PRODUCTION_HOST.ts`, 운영 외 호스트의 `X-Robots-Tag: noindex` 헤더(`next.config.ts`), `src/app/robots.ts`를 가져온다.
- [ ] FI-FE와 동일하게 `develop`(최신 base 기준 검사), `release` Ruleset에 `Vercel` 필수 상태 검사를 추가한다.
- [ ] `develop` 머지 → release PR 자동 생성 → `release` 머지 → `main` 머지 → 릴리즈 초안 생성까지 전체 흐름을 한 번 실행해 확인한다.

## 기능 작업과 함께 진행할 단계

아래 두 단계는 기능 코드가 없으면 동작을 확인할 수 없으므로 번호 단계에서 분리하고, 첫 기능 작업을 시작할 때 별도 PR로 먼저 진행한다.

### 데이터와 상태 레이어 (`chore/data-layer`)

- [ ] axios, @tanstack/react-query, zustand, cookies-next, zod, react-hook-form 등을 설치한다.
- [ ] `src/api/_base/`, `src/providers/`, 필요한 `src/store`, `src/types`를 가져온다.
- [ ] `src/middleware.ts`에 FI-FE의 보호 라우트 접근 제어와 `/admin` 리다이렉트를 옮긴다.
- [ ] `next.config.ts`에 `NEXT_PUBLIC_API_URL`로 보내는 `/api/:path*` rewrites를 가져온다.
- [ ] `.env.example`을 가져온다. `.env.local`의 실제 값은 팀에게 받는다.
- [ ] 첫 기능에서 쓰는 API를 `useAppQuery`로 호출해 동작을 확인한다.
- [ ] `CLAUDE.md`에 데이터 패칭 섹션을 추가하고 `docs/data-fetching-guide.md`를 가져온다.

### 모니터링과 분석 (`chore/monitoring`)

배포해 실제 트래픽을 받기 직전에 진행한다.

- [ ] Sentry 프로젝트를 FI-FE와 공유할지, PC용으로 새로 만들지 결정한다.
- [ ] `sentry.*.config.ts`, `src/instrumentation*.ts`, `next.config.ts`의 `withSentryConfig`를 가져오고 secret `SENTRY_AUTH_TOKEN`을 등록한다.
- [ ] Vercel Analytics, Speed Insights, GA, Clarity를 설정한다.
- [ ] Sentry 이슈를 GitHub 이슈로 옮기는 `sentry-issue-sync` 워크플로를 가져온다.

## 기능 이전 시 함께 가져올 항목

- 지도 기능: `.claude/skills/naver-map`, `docs/naver-map/`, `CLAUDE.md`의 지도 작업 섹션. 스킬은 문서에 의존하므로 반드시 함께 가져온다.

## 가져오지 않는 항목

- 모바일 앱 전용: `capacitor.config.ts`, `ios/`, `@capacitor/*` 패키지
- 빌드와 로컬 산출물: `.next/`, `node_modules/`, `coverage/`, `reports/`, `tsconfig.tsbuildinfo`, `.env.local`
- 개인 도구 설정: `.agents/`, `.codex/`, `.claude/settings.local.json`
- 확인 후 결정: `emails/`

## 외부 의존 항목

| 항목                                                                                                                                       | 영향받는 단계          |
| ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------- |
| `finditem-pc-bot` App 생성(Contents, Pull requests, Issues 쓰기 권한, Webhook 비활성화)과 FI-FE-PC 설치, `APP_ID`와 `APP_PRIVATE_KEY` 등록 | 4단계 머지             |
| `.env.local` 실제 값                                                                                                                       | 데이터와 상태 레이어   |
| Sentry, Chromatic 프로젝트 결정과 토큰                                                                                                     | 8단계, 모니터링과 분석 |
| Vercel 프로젝트 연결                                                                                                                       | 9단계                  |
