import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-6 py-16">
      <h1 className="text-3xl font-bold">Virtualization Lab</h1>
      <p className="text-muted-foreground">같은 데이터를 직접 구현과 TanStack Virtual로 비교하며 학습합니다.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link className="rounded-xl border p-6 hover:bg-muted" href="/demo/virtualization">01. 라이브러리 없이 구현하기 →</Link>
        <Link className="rounded-xl border p-6 hover:bg-muted" href="/demo/virtualization-library">02. TanStack Virtual 사용하기 →</Link>
        <Link className="rounded-xl border p-6 hover:bg-muted" href="/demo/pagination">03. 클라이언트 페이지네이션 →</Link>
      </div>
    </main>
  );
}
