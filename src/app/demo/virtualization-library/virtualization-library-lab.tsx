"use client";

import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

const ROW_HEIGHT = 64;
const format = (value: number) => value.toLocaleString("en-US");
const buttonClass = "rounded-lg border px-3 py-2 text-sm hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2";

// 기존 실습과 동일한 데이터. 기존 파일을 수정하지 않고 독립적으로 비교한다.
function createItems(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    title: `실습 데이터 ${index + 1}`,
    category: ["React", "TypeScript", "Next.js"][index % 3],
  }));
}

type Item = ReturnType<typeof createItems>[number];

function LibraryList({ items, overscan, viewportHeight }: { items: Item[]; overscan: number; viewportHeight: number }) {
  "use no memo"; // useVirtualizer의 가변 인스턴스를 React Compiler가 메모화하지 않도록 한다.

  const viewport = useRef<HTMLDivElement>(null);
  const getItemKey = useCallback((index: number) => items[index].id, [items]);

  // 기존 scrollTop 상태, onScroll, floor/ceil, start/end 계산을 대신한다.
  // 이 예제는 고정 높이이므로 예상 크기와 실제 CSS 높이를 똑같이 맞춘다.
  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => viewport.current,
    estimateSize: () => ROW_HEIGHT,
    getItemKey,
    overscan,
  });

  // 데이터 자체가 아니라 index, start, size, key 등의 배치 정보를 반환한다.
  const virtualRows = rowVirtualizer.getVirtualItems();
  const firstRow = virtualRows[0];
  const lastRow = virtualRows[virtualRows.length - 1];

  return (
    <section className="overflow-hidden rounded-2xl border">
      <div className="space-y-3 p-5">
        <h2 className="text-xl font-bold">TanStack Virtual 목록</h2>
        <p>
          <strong className="text-3xl tabular-nums text-brand">{format(virtualRows.length)}</strong> / {format(items.length)}개 행 DOM
        </p>
        <p className="text-sm text-muted-foreground">
          {firstRow && lastRow ? `렌더링 범위: ${format(firstRow.index + 1)}–${format(lastRow.index + 1)}번` : "스크롤 영역 측정 중"}
          {" · "}전체 높이: {format(rowVirtualizer.getTotalSize())}px
        </p>
        <div className="flex flex-wrap gap-2">
          <button className={buttonClass} onClick={() => rowVirtualizer.scrollToIndex(0, { align: "start" })}>
            처음
          </button>
          <button className={buttonClass} onClick={() => rowVirtualizer.scrollToIndex(Math.floor(items.length / 2), { align: "start" })}>
            중간
          </button>
          <button className={buttonClass} onClick={() => rowVirtualizer.scrollToIndex(items.length - 1, { align: "end" })}>
            마지막
          </button>
        </div>
      </div>
      {/* 테두리는 바깥에 두어 실제 스크롤 영역과 지정 높이를 일치시킨다. */}
      <div className="border-t">
        <div
          ref={viewport}
          role="region"
          aria-label="TanStack Virtual 목록 스크롤 영역"
          tabIndex={0}
          className="overflow-y-auto overscroll-contain focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
          style={{ height: viewportHeight, scrollbarGutter: "stable" }}
        >
          <div role="list" data-list="tanstack" style={{ height: rowVirtualizer.getTotalSize(), position: "relative" }}>
            {virtualRows.map((virtualRow) => {
              const item = items[virtualRow.index];
              return (
                <div
                  key={virtualRow.key}
                  role="listitem"
                  aria-posinset={virtualRow.index + 1}
                  aria-setsize={items.length}
                  data-row
                  className="flex items-center gap-4 border-b bg-background px-4"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: virtualRow.size,
                    // 직접 index * ROW_HEIGHT를 계산하지 않고 라이브러리 좌표를 사용한다.
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <span className="w-14 shrink-0 font-mono text-xs text-muted-foreground">#{item.id}</span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.category} · 로컬에서 생성한 데이터</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

const comparisons = [
  ["scrollTop 상태 + onScroll", "getScrollElement", "라이브러리가 스크롤 요소를 관찰"],
  ["firstVisible / visibleEnd / start / end", "getVirtualItems()", "보이는 범위와 overscan을 계산"],
  ["items.slice(start, end)", "items[virtualRow.index]", "배치 정보의 index로 원본 데이터 조회"],
  ["items.length * ROW_HEIGHT", "getTotalSize()", "전체 스크롤 공간의 높이"],
  ["인덱스 * ROW_HEIGHT", "virtualRow.start", "행의 시작 좌표"],
  ["ROW_HEIGHT", "estimateSize / virtualRow.size", "계산에 사용할 크기 / 계산된 행 크기"],
  ["scrollTo({ top: ... })", "scrollToIndex(index)", "원하는 행으로 이동"],
];

export function VirtualizationLibraryLab() {
  const [count, setCount] = useState(1000);
  const [overscan, setOverscan] = useState(3);
  const [viewportHeight, setViewportHeight] = useState(384);
  const [run, setRun] = useState(0);
  const items = useMemo(() => createItems(count), [count]);

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-12 sm:px-8">
      <header className="space-y-3">
        <Link href="/demo/virtualization" className="text-sm underline underline-offset-4">
          ← 라이브러리 없는 버전 보기
        </Link>
        <p className="text-sm font-semibold tracking-widest text-brand">FRONTEND LAB / 02</p>
        <h1 className="text-3xl font-bold sm:text-4xl">계산을 라이브러리에 맡기면?</h1>
        <p className="max-w-3xl text-muted-foreground">
          같은 데이터, 같은 64px 행으로 비교합니다. 직접 작성했던 범위 계산은 useVirtualizer가 맡고, 행의 UI와 absolute 배치는 우리가 작성합니다.
        </p>
      </header>

      <section aria-label="실험 설정" className="flex flex-wrap items-end gap-6 rounded-2xl bg-muted p-5">
        <label className="space-y-2 text-sm">
          <span className="block font-semibold">데이터 개수</span>
          <select value={count} onChange={(event) => setCount(Number(event.target.value))} className="rounded-lg border bg-background p-2">
            {[100, 1000, 10000].map((value) => (
              <option key={value} value={value}>
                {format(value)}개
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm">
          <span className="block font-semibold">Overscan: 앞뒤 {overscan}개</span>
          <input type="range" min={0} max={10} value={overscan} onChange={(event) => setOverscan(Number(event.target.value))} />
        </label>
        <label className="space-y-2 text-sm">
          <span className="block font-semibold">영역 높이: {viewportHeight}px</span>
          <input type="range" min={192} max={576} step={32} value={viewportHeight} onChange={(event) => setViewportHeight(Number(event.target.value))} />
        </label>
        <button className={`${buttonClass} bg-background`} onClick={() => setRun((value) => value + 1)}>
          목록 다시 마운트
        </button>
      </section>

      <LibraryList key={`${count}-${run}`} items={items} overscan={overscan} viewportHeight={viewportHeight} />
      <p className="text-sm text-muted-foreground">
        카운트는 전체 자식 노드 수가 아닌 행 DOM 수입니다. 데이터 10,000개는 배열에 그대로 남아 있습니다. 이 실습에는 API 요청이 없습니다.
      </p>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">직접 구현한 코드와 연결해보기</h2>
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted">
              <tr>
                {["기존 직접 구현", "라이브러리 버전", "역할"].map((title) => (
                  <th key={title} scope="col" className="p-4">
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisons.map(([before, after, meaning]) => (
                <tr key={before} className="border-t">
                  <td className="p-4 font-mono text-xs">{before}</td>
                  <td className="p-4 font-mono text-xs">{after}</td>
                  <td className="p-4">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="space-y-3 rounded-2xl border p-6">
          <h2 className="text-xl font-bold">핵심 설정은 네 가지</h2>
          <pre className="overflow-x-auto rounded-xl bg-muted p-4 text-xs leading-7">
            <code>{`useVirtualizer({
  count: items.length,
  getScrollElement: () => viewport.current,
  estimateSize: () => ROW_HEIGHT,
  overscan,
});`}</code>
          </pre>
          <p className="text-sm">
            몇 개인지, 어디를 스크롤하는지, 행 높이가 얼마인지, 여유분이 몇 개인지를 알려줍니다. 실제 코드의 getItemKey는 데이터 ID를 안정적인 키로 사용하기 위한 추가 설정입니다.
          </p>
        </article>
        <article className="space-y-3 rounded-2xl border p-6">
          <h2 className="text-xl font-bold">이 순서로 실험해보세요</h2>
          <ol className="list-decimal space-y-2 pl-5 text-sm">
            <li>기존 버전과 각각 1,000개·overscan 3으로 설정해 중간 위치의 행 수를 비교하세요. 경계 처리와 실제 영역 치수에 따라 한 행 정도 차이 날 수 있습니다.</li>
            <li>10,000개로 늘려도 행 DOM 수가 크게 늘지 않는지 확인하세요.</li>
            <li>영역 높이를 바꿔보세요. 별도의 floor·ceil 계산 없이 라이브러리가 크기 변화를 관찰해 범위를 갱신합니다.</li>
            <li>코드의 useVirtualizer → getVirtualItems → items[index] → translateY 순서로 읽어보세요.</li>
          </ol>
        </article>
      </section>
      <section className="space-y-3 rounded-2xl bg-muted p-6">
        <h2 className="text-xl font-bold">유동 높이까지 자동으로 해결될까요?</h2>
        <p className="text-sm">
          이 버전도 행은 고정 높이입니다. estimateSize는 CSS를 설정하는 옵션이 아니므로 실제 행 높이를 일치시켜야 합니다. 콘텐츠마다 높이가 달라지는 다음 단계에서는 고정 height를
          해제하고 data-index와 measureElement를 연결해 실제 크기를 측정해야 합니다.
        </p>
        <p className="text-sm">
          라이브러리는 데이터 다운로드나 페이지네이션을 대신하지 않습니다. 이번 비교의 목적은 같은 가상화 원리를 어떻게 간결하게 구현하는지 이해하는 것입니다.
        </p>
        <a
          className="inline-block text-sm underline underline-offset-4"
          href="https://tanstack.com/virtual/latest/docs/framework/react/examples/fixed"
          target="_blank"
          rel="noreferrer"
        >
          참고: TanStack Virtual 고정 높이 공식 예제 ↗
        </a>
      </section>
    </main>
  );
}
