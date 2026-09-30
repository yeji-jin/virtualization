"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const format = (value: number) => value.toLocaleString("en-US");
const buttonClass = "rounded-lg border px-3 py-2 text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2";

function createItems(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    title: `실습 데이터 ${index + 1}`,
    category: ["React", "TypeScript", "Next.js"][index % 3],
  }));
}

export function PaginationLab() {
  // 1. 전체 데이터와 사용자가 선택한 페이지를 관리한다. page는 1부터 시작한다.
  const [count, setCount] = useState(1000);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const items = useMemo(() => createItems(count), [count]);

  // 2. 현재 페이지의 배열 범위를 계산한다. start는 포함, end는 미포함이다.
  const totalPages = Math.ceil(items.length / pageSize);
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, items.length);
  const pageItems = items.slice(start, end);

  // 3. 페이지 번호 버튼은 최대 5개만 보여준다. 데이터 선택 범위와는 별개다.
  const firstPageButton = Math.max(1, Math.min(page - 2, totalPages - 4));
  const pageNumbers = Array.from(
    { length: Math.min(5, totalPages) },
    (_, index) => firstPageButton + index,
  );

  function goToPage(nextPage: number) {
    setPage(Math.max(1, Math.min(nextPage, totalPages)));
  }

  return (
    <main className="mx-auto w-full max-w-5xl space-y-8 px-4 py-12 sm:px-8">
      <header className="space-y-3">
        <Link href="/" className="text-sm underline underline-offset-4">← 실습 선택</Link>
        <p className="text-sm font-semibold tracking-widest text-brand">FRONTEND LAB / 03</p>
        <h1 className="text-3xl font-bold">클라이언트 페이지네이션</h1>
        <p className="text-muted-foreground">전체 데이터는 배열에 보관하고, 선택한 페이지의 데이터만 렌더링합니다. 스크롤 좌표와 행 높이 계산은 필요하지 않습니다.</p>
      </header>

      <section aria-label="실험 설정" className="flex flex-wrap gap-6 rounded-2xl bg-muted p-5">
        <label className="space-y-2 text-sm">
          <span className="block font-semibold">전체 데이터</span>
          <select className="rounded-lg border bg-background p-2" value={count} onChange={(event) => {
            setCount(Number(event.target.value));
            setPage(1); // 총 페이지 수가 줄어도 존재하지 않는 페이지에 남지 않게 한다.
          }}>
            {[23, 1000, 10000].map((value) => <option key={value} value={value}>{format(value)}개</option>)}
          </select>
        </label>
        <label className="space-y-2 text-sm">
          <span className="block font-semibold">페이지당 개수</span>
          <select className="rounded-lg border bg-background p-2" value={pageSize} onChange={(event) => {
            setPageSize(Number(event.target.value));
            setPage(1); // 이 실습에서는 개수 변경 시 첫 페이지로 돌아간다.
          }}>
            {[10, 20, 50].map((value) => <option key={value} value={value}>{value}개</option>)}
          </select>
        </label>
      </section>

      <section aria-label="현재 계산 결과" className="space-y-4 rounded-2xl border p-5">
        <p role="status">현재 <strong>{format(page)} / {format(totalPages)} 페이지</strong> · {format(start + 1)}–{format(end)}번째 데이터 · 행 DOM {pageItems.length}개</p>
        <pre className="overflow-x-auto rounded-xl bg-muted p-4 text-sm leading-7"><code>{`totalPages = ceil(${items.length} / ${pageSize}) = ${totalPages}
start = (${page} - 1) × ${pageSize} = ${start}
end = min(${start} + ${pageSize}, ${items.length}) = ${end}
items.slice(${start}, ${end}) → 인덱스 ${start}~${end - 1}`}</code></pre>
        <nav aria-label="페이지 이동" className="flex flex-wrap items-center gap-2">
          <button className={buttonClass} disabled={page === 1} onClick={() => goToPage(1)}>처음</button>
          <button className={buttonClass} disabled={page === 1} onClick={() => goToPage(page - 1)}>이전</button>
          {pageNumbers.map((number) => (
            <button key={number} aria-label={`${number}페이지`} aria-current={page === number ? "page" : undefined}
              className={`${buttonClass} ${page === number ? "bg-foreground text-background hover:bg-foreground" : ""}`}
              onClick={() => goToPage(number)}>{number}</button>
          ))}
          <button className={buttonClass} disabled={page === totalPages} onClick={() => goToPage(page + 1)}>다음</button>
          <button className={buttonClass} disabled={page === totalPages} onClick={() => goToPage(totalPages)}>마지막</button>
        </nav>
      </section>

      {/* 4. 선택한 데이터만 일반 문서 흐름으로 배치한다. absolute/translateY 없음. */}
      <ul aria-label="현재 페이지 데이터" data-list="pagination" className="overflow-hidden rounded-2xl border">
        {pageItems.map((item) => (
          <li key={item.id} data-row className="flex items-center gap-4 border-b px-4 py-3 last:border-b-0">
            <span className="w-16 shrink-0 font-mono text-xs text-muted-foreground">#{item.id}</span>
            <div className="min-w-0"><p className="font-medium">{item.title}</p><p className="text-xs text-muted-foreground">{item.category} · 로컬에서 생성한 데이터</p></div>
          </li>
        ))}
      </ul>

      <section className="space-y-4 rounded-2xl bg-muted p-6">
        <h2 className="text-xl font-bold">이 순서로 관찰해보세요</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm">
          <li>다음을 누르고 start와 end가 페이지당 개수만큼 바뀌는지 확인하세요.</li>
          <li>데이터 23개·페이지당 10개를 선택하고 마지막으로 이동하세요. 마지막 페이지에는 3개만 남습니다.</li>
          <li>페이지당 개수를 바꾸면 첫 페이지로 돌아갑니다. 이전 페이지 번호를 유지하면 어떤 문제가 생길지 생각해보세요.</li>
          <li>10,000개를 선택해도 현재 페이지의 행만 DOM에 있는지 DevTools에서 data-list를 확인하세요.</li>
        </ol>
        <p className="text-sm">버튼 클릭 → setPage → 컴포넌트 재렌더링 → start/end 계산 → slice → map 순서입니다. pageNumbers는 페이지 버튼 목록일 뿐, 실제 데이터를 고르는 pageItems와는 별개입니다.</p>
        <p className="text-sm">가상화는 스크롤 위치로 범위를 선택하고, 페이지네이션은 페이지 번호로 선택합니다. 이 실습은 API 요청이 없으며, 실제로 전체 데이터를 받아 사용하는 경우 초기 다운로드와 배열 메모리 비용은 그대로 남습니다.</p>
        <Link href="/demo/virtualization" className="inline-block text-sm underline underline-offset-4">직접 구현한 가상화와 비교하기 →</Link>
      </section>
    </main>
  );
}
