# FI-FE-PC

[찾길](https://www.finditem.kr/)(영문 finditem!, 구 서비스명 찾아줘!) 서비스의 PC 전용 프론트엔드. 모바일 웹 리포(FI-FE)의 환경과 규칙을 그대로 따른다.

현재 FI-FE의 환경을 단계별로 옮기는 중이며 진행 상황은 [`docs/migration-plan.md`](docs/migration-plan.md)에 있다. 이 문서에는 지금 리포에 실제로 적용된 규칙만 적고, 스택·구조·코드 컨벤션 섹션은 해당 코드가 들어오는 단계에서 추가한다.

## 스택

- Next.js 15 / React 19 / TypeScript 5 (`next.config.ts`에서 `reactCompiler: true` — React Compiler 활성화)
- Tailwind CSS 3. 디자인 토큰은 `src/utils/tokens/`, 커스텀 유틸리티 플러그인은 `src/utils/customStylePlugins/`, 타이포그래피는 `src/utils/customFonts/`에 있고 `tailwind.config.ts`가 이를 조합한다.
- 아이콘: `src/components/common/Icon`. 자주 쓰는 아이콘은 `icon-manifest.json`에 등록해 `public/icons/sprite.svg` 스프라이트로 묶는다. 스프라이트는 `predev`/`prebuild`에서 `scripts/generate-icon-sprite.js`가 다시 생성하므로, 아이콘을 추가하면 생성된 스프라이트도 함께 커밋한다.
- 다국어: next-intl(`ko` 기본, `en`). 메시지는 `src/messages/{ko,en}.json`, 라우팅 설정은 `src/i18n/`

## 구조

```
src/
  app/
    [locale]/     # 모든 라우트는 로케일 세그먼트 아래에 둔다
  components/     # 전역 공통 컴포넌트
  utils/          # 디자인 토큰, Tailwind 플러그인, 타이포그래피
  i18n/ messages/ # next-intl 라우팅 설정과 ko/en 메시지
  middleware.ts   # 로케일 처리
```

- 라우트 전용 코드는 해당 라우트 폴더 하위 `_components`/`_hooks`/`_types`/`_utils`(private 폴더)에 둔다. 여러 라우트에서 재사용되면 그때 `src/components`, `src/hooks` 등 전역 폴더로 올린다.
- `hooks/`, `store/`, `utils/`는 도메인별로 묶지 않고, 함수/훅 하나당 폴더 하나(`utils/formatDate/`, `hooks/useLogout/` 등)로 세분화하는 컨벤션이다. 새 유틸/훅을 추가할 때도 이 패턴을 따른다.
- `_components` 하위 컴포넌트도 동일하게 컴포넌트 하나당 폴더 하나. 그 컴포넌트 내부에서만 쓰는 하위 조각은 `_internal` 폴더에 둔다.

## 커밋 컨벤션 (commitlint 강제)

- type: `feat`, `fix`, `docs`, `hotfix`, `refactor`, `test`, `chore`, `rename`, `asset`, `design`, `a11y` 중 하나
- scope 필수 (비워두면 커밋 실패)
- 예: `feat(chat): 채팅방 목록 무한 스크롤 추가`

## 브랜치 전략

Git Flow 변형. 상시 브랜치 3개와 작업별 임시 브랜치로 나눈다.

- 상시 브랜치: `develop`(모든 작업이 모이는 개발 통합) → `release`(출시 전 테스트 서버/QA 점검, 배포 준비) → `main`(운영/출시, 최종 릴리즈).
- 임시 브랜치: `develop`에서 분기해 작업 후 `develop`으로 머지한다. 접두어는 커밋 type에 맞춘다 — `feature/*`, `fix/*`, `docs/*`, `design/*`, `refactor/*`, `test/*`, `chore/*`, `rename/*`, `asset/*`. (커밋 type `feat`에 대응하는 브랜치 접두어는 `feature/*`임에 주의)
- `hotfix/*`만 예외로 `main`에서 분기해 운영 중 긴급 수정에 쓰고 `main`으로 머지한다.
- 일반 작업 PR의 base는 항상 `develop`이다.

## 검증 커맨드

- 기본: `npm run test` + `npm run build` (타입체크 포함). 대부분의 회귀를 이 둘로 잡는다.
- `npm run check:fast`(test/e2e/storybook 병렬) 또는 `npm run check:all`(순차)은 변경이 e2e로 커버되는 플로우나 컴포넌트 스토리를 직접 건드릴 때, 또는 사용자가 요청할 때만 실행한다. 매 응답마다 기본으로 돌리지 않는다.
- mock/fixture 데이터 규칙은 `AGENTS.md`에 있다.

## 텍스트 작성 원칙

커밋 메시지, PR 본문, 코드 주석 등 Claude가 작성하는 모든 텍스트 산출물은 온전한 문장으로만 작성하고 이모티콘을 사용하지 않는다.

## React Compiler와 메모이제이션

이 프로젝트는 React Compiler가 켜져 있다(`next.config.ts`의 `reactCompiler: true`). 컴포넌트/훅 내부에서 `useMemo`, `useCallback`을 수동으로 작성하지 않는다 — 컴파일러가 자동으로 처리한다. 새 훅이나 컴포넌트를 작성할 때도, 기존 코드를 참고해 복사할 때도 이 패턴을 넣지 않는다. 외부 라이브러리 API가 메모이즈된 함수/값을 명시적으로 요구하는 경우처럼 컴파일러가 커버하지 못하는 예외적 상황에서만 사용하고, 그 경우 왜 필요한지 주석으로 남긴다.

## 코드 컨벤션

- 상수 분리: 여러 곳에서 참조하도록 export하는 대문자 상수는 컴포넌트·훅 안에 인라인하지 않고 별도 상수 파일 또는 타입 파일로 분리한다.
- 주석(TSDoc): 태그 사용법과 컴포넌트/훅/유틸 유형별 템플릿은 [`docs/tsdoc-guide.md`](docs/tsdoc-guide.md)에 있다. 새 컴포넌트·훅·유틸·타입을 작성할 때 참고하고, 아래 핵심 규칙은 항상 지킨다.
  - 타입으로 알 수 있는 정보(string, number 등)는 주석에 중복해 적지 않는다.
  - "무엇을 하는지"를 넘어 "어떻게 쓰는지"와 "주의할 점"에 집중한다.
  - 3단 구조로 쓴다: `[요약/상세]` → `[인터페이스/파라미터]` → `[예시]`. props(또는 매개변수)가 없으면 `[요약/상세]` → `[예시]` 2단으로 줄인다.
  - JSDoc 스타일(`@param {string} name`처럼 중괄호로 타입을 명시)을 쓰지 않는다. 태그 표기에 주의한다 — `@remark`(X) → `@remarks`(O), `@return`(X) → `@returns`(O).
  - 매개변수가 1~2개면 함수 매개변수에 직접 정의하고 `@param`으로 설명한다. 매개변수가 많거나 객체 구조면 `interface`로 분리한다 — 인터페이스 필드 주석이 IDE 인텔리센스와 연동되어 정의부로 이동하지 않고도 필드 역할을 바로 확인할 수 있기 때문이다. default 값이 있으면 함께 적는다.
- TODO 주석: 나중에 처리할 작업을 남길 때는 `TODO(담당자): 할 일` 형태로 담당자 이름을 괄호 안에 명시한다. 담당자를 적어 누구에게 물어보면 되는지 추적할 수 있게 하기 위함이다. 예: `// TODO(수현): 후기 등록 API 연동 시 성공 응답 후 완료 팝업을 열도록 교체`.
- 다국어(i18n): 화면에 보이는 정적 텍스트를 하드코딩하지 않는다. 클라이언트는 `useTranslations`, 서버는 `getTranslations`로 `t()`를 쓰고, 키는 `src/messages/ko.json`과 `en.json`에 동시에 추가한다. 링크와 라우터는 로케일 접두사를 붙여 주는 `@/i18n/navigation`의 것을 쓴다. 로컬에서는 `npm run lint:i18n-literal`, `npm run check:i18n-keys`로 확인한다. 라우트 작업일 때의 체크리스트는 `plan-route` 스킬에 있다.

## 표준 작업 흐름

1. 기존 코드 패턴과 디렉토리 구조를 그대로 따른다. 새 추상화나 새로운 디렉토리 규칙을 임의로 만들지 않는다. 이 리포에 아직 없는 패턴은 FI-FE의 구현을 기준으로 삼는다. FI-FE를 참고할 때는 로컬 작업 트리가 아니라 `git fetch` 후 `origin/develop`의 내용을 기준으로 한다 — 로컬 FI-FE는 다른 작업 브랜치에 있거나 뒤처져 있을 수 있다.
2. `npm run dev`는 사용자가 이미 띄워서 켜둔 상태라고 가정한다. Claude가 직접 실행하지 않는다 — 장기 실행 프로세스라 포트 충돌이나 좀비 프로세스를 남길 수 있다.
3. 로컬 `git commit`은 응답 흐름에 맞춰 자율적으로 수행할 수 있다. 단, 이번 응답에서 Claude가 Edit/Write로 직접 건드린 파일만 `git add`한다 (`git add -A`/`git add .` 금지). 커밋 직전 `git status`로 staging 대상이 의도한 파일과 정확히 일치하는지 확인한다.
4. `git push`, PR 생성 등 원격 저장소에 영향을 주는 작업은 사용자가 명시적으로 요청하기 전에는 수행하지 않는다. force-push는 요청 여부와 관계없이 수행하지 않는다.

## PR 생성

PR은 작업 단위로 쪼개 올리고, 작업 성격이 다르면 PR을 나눈다.

- 기능 코드와 스토리북/테스트 코드를 같은 PR(브랜치)에 올리지 않는다. 기능은 `feature`/`fix`/`design` 등 해당 브랜치로, 스토리북·테스트는 `test/*` 브랜치로 분리해 별도 PR로 올린다. (팀에서 가장 중요하게 보는 규칙)
- 따라서 기능 작업 중 `*.test.tsx`/`*.stories.tsx`를 함께 수정했더라도 기능 PR에는 포함하지 않는다. 커밋·스테이징 단계에서 테스트/스토리 변경을 분리한다.
- 사용자가 PR 생성을 요청하면 `create-pr` 스킬을 실행한다. `gh pr create` 실행 자체는 항상 사용자 확인 후 진행한다 (표준 작업 흐름 4번 규칙).

## PR 리뷰 반영

- 리뷰 반영 내용을 개별 리뷰 스레드에 답글로 남기지 않는다. 한 PR의 리뷰를 모두 반영한 뒤 커밋, 주요 변경 사항, 검증 결과를 합쳐 PR 상단 코멘트 하나로 남긴다.
- 인라인 리뷰를 실제 코드에 반영하고 원격 브랜치에 푸시한 뒤, 해당 리뷰 코멘트에는 반영 표시로 `+1` 반응(👍)만 추가한다.
- 리뷰 스레드의 `Resolve conversation`을 누르거나 API로 해결 처리하지 않는다. 해결 여부는 다른 팀원이 확인한 뒤 처리한다.
- 여러 리뷰가 있더라도 각 스레드에 같은 설명을 반복하지 않고, 통합 코멘트와 `+1` 반응으로만 반영 상태를 알린다.
- GitHub 리뷰 반응의 👍은 위 텍스트 작성 원칙의 이모티콘 금지 대상에서 제외한다. 커밋 메시지, PR 본문, 코드 주석 등 텍스트에는 계속 이모티콘을 사용하지 않는다.

## 라우트 작업 계획

특정 라우트(`page.tsx`가 있는 디렉토리) 하나에 국한된 작업을 시작하기 전에 `plan-route` 스킬을 실행한다. 해당 라우트 폴더의 `_docs/plan.md`에 작업 항목을 todo 체크리스트로 기록하고 진행에 따라 갱신해, 세션이 끊겨도 다음 세션이나 다른 팀원이 이어받을 수 있게 한다. 여러 라우트에 걸친 작업이나 전역 공통 코드(`src/components`, `src/hooks` 등) 작업에는 적용하지 않는다.
