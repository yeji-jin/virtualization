"use client";

import { useMemo, useRef, useState } from "react";

const ROW_HEIGHT = 64;
const VIEWPORT_HEIGHT = 384;
const format = (value: number) => value.toLocaleString("en-US");
const buttonClass = "rounded-lg border px-3 py-2 text-sm transition hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-40";

// API 대신 항상 동일한 데이터를 생성해서 두 방식의 조건을 맞춘다.
function createItems(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    title: `실습 데이터 ${index + 1}`,
    category: ["React", "TypeScript", "Next.js"][index % 3],
  }));
}

type Item = ReturnType<typeof createItems>[number];

function Row({ item, total, virtual }: { item: Item; total: number; virtual: boolean }) {
  return (
    <div
      role="listitem"
      aria-posinset={item.id}
      aria-setsize={total}
      data-row
      className="flex items-center gap-4 border-b bg-background px-4"
      style={{ height: ROW_HEIGHT, ...(virtual ? { position: "absolute", top: 0, left: 0, width: "100%", transform: `translateY(${(item.id - 1) * ROW_HEIGHT}px)` } : {}) }}
    >
      <span className="w-14 shrink-0 font-mono text-xs text-muted-foreground">#{item.id}</span>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{item.title}</p>
        <p className="text-xs text-muted-foreground">{item.category} · 로컬에서 생성한 데이터</p>
      </div>
    </div>
  );
}

function ListExperiment({ items, virtual, overscan }: { items: Item[]; virtual: boolean; overscan: number }) {
  const viewport = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  // 끝 인덱스는 slice처럼 포함하지 않는다. 부분적으로 보이는 행도 포함한다.
  const firstVisible = Math.floor(scrollTop / ROW_HEIGHT);
  const visibleEnd = Math.min(items.length, Math.ceil((scrollTop + VIEWPORT_HEIGHT) / ROW_HEIGHT));
  const start = virtual ? Math.max(0, firstVisible - overscan) : 0;
  const end = virtual ? Math.min(items.length, visibleEnd + overscan) : items.length;
  const renderedItems = items.slice(start, end);

  function jump(position: number) {
    viewport.current?.scrollTo({ top: position, behavior: "instant" });
  }

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border bg-background">
      <div className="space-y-3 p-5">
        <h2 className="text-lg font-bold">{virtual ? "가상화 렌더링" : "일반 렌더링"}</h2>
        <p className="text-sm text-muted-foreground">{virtual ? "보이는 행 + 앞뒤 여유분만 DOM에 생성" : "화면 밖의 행까지 모두 DOM에 생성"}</p>
        <p>
          <strong className="text-3xl tabular-nums text-brand">{format(renderedItems.length)}</strong> <span className="text-sm">/ {format(items.length)}개 행 DOM</span>
        </p>
        <p className="text-xs text-muted-foreground">
          렌더링 범위: {format(start + 1)}–{format(end)}번 · 스크롤: {Math.round(scrollTop)}px
        </p>
        <div className="flex flex-wrap gap-2">
          <button className={buttonClass} onClick={() => jump(0)}>
            처음
          </button>
          <button className={buttonClass} onClick={() => jump(Math.floor(items.length / 2) * ROW_HEIGHT)}>
            중간
          </button>
          <button className={buttonClass} onClick={() => jump(items.length * ROW_HEIGHT)}>
            마지막
          </button>
        </div>
      </div>
      <div
        ref={viewport}
        tabIndex={0}
        role="region"
        aria-label={`${virtual ? "가상화" : "일반"} 목록 스크롤 영역`}
        className="overflow-y-auto overscroll-contain border-t focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
        style={{ height: VIEWPORT_HEIGHT, scrollbarGutter: "stable" }}
        onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
      >
        {/* 빈 공간이 전체 스크롤 높이를 유지한다. 실제 행만 절대 위치로 배치한다. */}
        <div role="list" data-list={virtual ? "virtual" : "normal"} style={{ height: items.length * ROW_HEIGHT, position: "relative" }}>
          {renderedItems.map((item) => (
            <Row key={item.id} item={item} total={items.length} virtual={virtual} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function VirtualizationLab() {
  const [count, setCount] = useState(1000);
  const [overscan, setOverscan] = useState(3);
  const [mode, setMode] = useState("both");
  const [run, setRun] = useState(0);
  const items = useMemo(() => createItems(count), [count]);

  console.log(items);

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-12 sm:px-8">
      <header className="max-w-3xl space-y-3">
        <p className="text-sm font-semibold tracking-widest text-brand">FRONTEND LAB / 01</p>
        <h1 className="text-3xl font-bold sm:text-4xl">데이터 10,000개, DOM은 몇 개?</h1>
        <p className="text-muted-foreground">백엔드 없이 배우는 리스트 가상화. 같은 데이터를 두 방식으로 렌더링하고, 스크롤할 때 실제로 남아 있는 행의 개수를 관찰해보세요.</p>
      </header>

      <section aria-label="실험 설정" className="flex flex-wrap items-end gap-6 rounded-2xl bg-muted p-5">
        <label className="space-y-2 text-sm">
          <span className="block font-semibold">데이터 개수</span>
          <select className="rounded-lg border bg-background p-2" value={count} onChange={(event) => setCount(Number(event.target.value))}>
            {[100, 1000, 10000].map((n) => (
              <option key={n} value={n}>
                {format(n)}개
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm">
          <span className="block font-semibold">보기</span>
          <select className="rounded-lg border bg-background p-2" value={mode} onChange={(event) => setMode(event.target.value)}>
            <option value="both">나란히 비교</option>
            <option value="normal">일반만 측정</option>
            <option value="virtual">가상화만 측정</option>
          </select>
        </label>
        <label className="space-y-2 text-sm">
          <span className="block font-semibold">Overscan: 앞뒤 {overscan}개</span>
          <input aria-label="Overscan" type="range" min={0} max={10} value={overscan} onChange={(event) => setOverscan(Number(event.target.value))} />
        </label>
        <button className={`${buttonClass} bg-background`} onClick={() => setRun((value) => value + 1)}>
          목록 다시 마운트
        </button>
      </section>

      <div key={`${count}-${mode}-${run}`} className={`grid gap-6 ${mode === "both" ? "lg:grid-cols-2" : ""}`}>
        {mode !== "virtual" && <ListExperiment items={items} virtual={false} overscan={overscan} />}
        {mode !== "normal" && <ListExperiment items={items} virtual overscan={overscan} />}
      </div>
      <p className="text-sm text-muted-foreground">
        표시 수치는 목록의 행 개수이며 모든 자식 DOM 노드의 합계가 아닙니다. 두 목록은 따로 스크롤됩니다. 384px 영역에 64px 행이 6개 보이고, 중간 위치에서는 overscan 3일 때 보통
        12–13개 행만 생성됩니다.
      </p>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="space-y-3 rounded-2xl border p-6">
          <h2 className="text-xl font-bold">01. 먼저 관찰하기</h2>
          <ol className="list-decimal space-y-2 pl-5 text-sm">
            <li>1,000개에서 10,000개로 바꿔보세요. 어느 쪽의 행 DOM 수가 늘어나나요?</li>
            <li>가상화 목록의 중간으로 이동하세요. 렌더링 범위가 바뀌어도 스크롤바 길이가 유지되는 이유를 생각해보세요.</li>
            <li>Overscan을 0과 10으로 바꿔보세요. 화면 밖에 미리 만드는 행이 얼마나 달라지나요?</li>
            <li>
              DevTools Elements에서 <code>data-list</code>를 찾아 자식 <code>data-row</code> 개수를 확인하세요.
            </li>
          </ol>
        </article>
        <article className="space-y-3 rounded-2xl border p-6">
          <h2 className="text-xl font-bold">02. 성능 측정하기</h2>
          <ol className="list-decimal space-y-2 pl-5 text-sm">
            <li>10,000개와 ‘일반만 측정’을 선택하세요.</li>
            <li>Chrome DevTools Performance에서 녹화를 시작하고 ‘목록 다시 마운트’를 누른 뒤 같은 거리만큼 스크롤하세요.</li>
            <li>‘가상화만 측정’에서도 반복하고 Scripting, Rendering, Painting 시간을 비교하세요. 같은 CPU 제한 조건으로 여러 번 기록하세요.</li>
            <li>
              개발 모드는 추가 비용이 있습니다. 최종 비교는 <code>npm run build</code> 후 <code>npm run start</code>로 실행하세요.
            </li>
          </ol>
          <p className="text-xs text-muted-foreground">
            나란히 보기에서는 일반 목록의 작업도 영향을 줍니다. 빠른 기기에서는 체감 차이가 작을 수 있으며, DOM 감소율이 실행 시간 감소율과 같지는 않습니다.
          </p>
        </article>
      </section>

      <section className="space-y-4 rounded-2xl bg-muted p-6">
        <h2 className="text-xl font-bold">03. 코드로 원리 이해하기</h2>
        <pre className="overflow-x-auto rounded-xl bg-background p-4 text-xs leading-7 sm:text-sm">
          <code>{`전체 높이 = 데이터 수 × 행 높이
첫 번째 보이는 인덱스 = floor(scrollTop / 행 높이)
시작 = max(0, 첫 번째 보이는 인덱스 - overscan)
끝 = min(데이터 수, ceil((scrollTop + 영역 높이) / 행 높이) + overscan)
렌더링 = items.slice(시작, 끝)
각 행 위치 = translateY(인덱스 × 행 높이)`}</code>
        </pre>
        <p className="text-sm">
          이 실습은 고정 높이 전용입니다. <code>virtualization-lab.tsx</code>의 <code>createItems → ListExperiment → Row</code> 순서로 읽어보세요. 다음에는 ListExperiment의 범위
          계산을 TanStack Virtual의 <code>useVirtualizer</code>로 바꾸고, 높이가 다른 행을 측정하는 실습으로 확장할 수 있습니다.
        </p>
        <p className="text-sm">
          가상화는 DOM과 렌더링 부담을 줄입니다. 데이터 배열은 여전히 메모리에 있고, 다운로드·검색·정렬 비용은 별도로 남습니다. 페이지네이션은 데이터를 나눠 가져오고, 무한 스크롤은
          추가 데이터를 불러오는 UX이므로 가상화와 함께 사용할 수 있습니다. 또한 DOM에서 빠진 내용은 브라우저 찾기로 검색되지 않으며, 입력 상태와 키보드 포커스 관리도 추가로
          설계해야 합니다.
        </p>
        <div className="flex flex-wrap gap-4 text-sm underline underline-offset-4">
          <a href="https://jobkaehenry.tistory.com/62" target="_blank" rel="noreferrer">
            참고한 실습 글 ↗
          </a>
          <a href="https://tanstack.com/virtual/latest/docs/introduction" target="_blank" rel="noreferrer">
            TanStack Virtual 공식 문서 ↗
          </a>
        </div>
      </section>
    </main>
  );
}
