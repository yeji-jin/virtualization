# Virtualization Lab

React와 TanStack Virtual을 비교하는 독립 학습 프로젝트입니다.

## 실행

Node.js 22를 권장합니다.

```bash
nvm use
npm ci
npm run dev
```

- `/`: 실습 선택
- `/demo/virtualization`: 직접 구현
- `/demo/virtualization-library`: TanStack Virtual

각 데모 폴더의 Markdown 파일에 학습 노트가 있습니다.
React Query Provider는 연결되어 있지만 현재 실습은 API 없이 mock data를 사용합니다.

```bash
npm run build
npm start
```
