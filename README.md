# Virtualization Lab

React 리스트 가상화와 클라이언트 페이지네이션을 비교하며 학습하는 프로젝트입니다. 같은 데이터를 화면에 필요한 만큼만 렌더링하는 방법을 직접 구현하고, TanStack Virtual을 사용한 방식과 비교합니다.

## 실행

Node.js 22를 권장합니다.

```bash
nvm use
npm ci
npm run dev
```

브라우저에서 `http://localhost:3000`에 접속하면 실습을 선택할 수 있습니다.

프로덕션 빌드와 실행:

```bash
npm run build
npm start
```

## 실습 목록

| 경로 | 내용 |
|---|---|
| `/` | 실습 선택 |
| `/demo/virtualization` | 라이브러리 없이 구현한 스크롤 가상화 |
| `/demo/virtualization-library` | TanStack Virtual을 이용한 가상화 |
| `/demo/pagination` | 라이브러리 없이 구현한 클라이언트 페이지네이션 |

### 클라이언트 페이지네이션

전체 데이터를 배열에 보관하고, 페이지 번호와 페이지당 개수를 기준으로 선택한 구간만 렌더링합니다.

- 전체 데이터 23·1,000·10,000개 선택
- 페이지당 10·20·50개 선택
- 처음·이전·페이지 번호·다음·마지막 버튼으로 이동
- 현재 페이지, 표시 범위, 행 DOM 개수 확인
- `totalPages`, `start`, `end`, `slice()` 계산 결과 확인
- 데이터 개수나 페이지 크기를 변경하면 첫 페이지로 초기화

핵심 코드:

```tsx
const totalPages = Math.ceil(items.length / pageSize);
const start = (page - 1) * pageSize;
const end = Math.min(start + pageSize, items.length);
const pageItems = items.slice(start, end);
```

`start`는 포함하고 `end`는 제외합니다. 데이터 23개를 페이지당 10개씩 표시하면 마지막 페이지는 `slice(20, 23)`으로 3개만 렌더링합니다.

학습 순서:

1. 데이터 23개·페이지당 10개로 설정합니다.
2. 페이지를 이동하며 `start`와 `end`의 변화를 확인합니다.
3. 마지막 페이지에 3개가 남는 이유를 계산합니다.
4. 페이지당 개수를 바꾸고 총 페이지 수와 현재 페이지 변화를 확인합니다.
5. 가상화 실습과 렌더링 범위를 결정하는 기준을 비교합니다.

[페이지네이션 코드](./src/app/demo/pagination/pagination-lab.tsx) · [상세 학습 노트](./src/app/demo/pagination/클라이언트페이지네이션.md)

## 가상화와 페이지네이션 비교

| 항목 | 스크롤 가상화 | 클라이언트 페이지네이션 |
|---|---|---|
| 범위 결정 | 스크롤 위치·영역 높이·행 높이 | 페이지 번호·페이지당 개수 |
| 범위 변경 | 스크롤할 때 | 페이지를 선택할 때 |
| 행 배치 | 현재 실습은 `absolute`와 `translateY` 사용 | 일반적인 목록 배치 |
| 행 높이 | 현재 실습은 고정 높이 전제 | 페이지 계산에 영향 없음 |
| 렌더링 대상 | 화면 주변 행과 overscan | 현재 페이지의 행 |

두 방식 모두 전체 배열을 보관하는 경우 데이터 메모리 비용은 남습니다. 실제 API에서 전체 데이터를 받는다면 초기 다운로드 비용도 줄이지 못합니다. 필요한 구간만 서버에서 받는 서버 페이지네이션은 별도의 데이터 요청 방식입니다.

현재 모든 실습은 API 없이 mock data를 사용합니다. React Query Provider는 연결되어 있지만 데이터 요청에는 사용하지 않습니다.

## 학습 노트

- [라이브러리 없는 가상화](./src/app/demo/virtualization/라이브러리없는버전.md)
- [TanStack Virtual 버전](./src/app/demo/virtualization-library/라이브러리버전.md)
- [클라이언트 페이지네이션](./src/app/demo/pagination/클라이언트페이지네이션.md)
