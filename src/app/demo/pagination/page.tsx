import type { Metadata } from "next";
import { PaginationLab } from "./pagination-lab";

export const metadata: Metadata = { title: "클라이언트 페이지네이션 실습" };

export default function PaginationPage() {
  return <PaginationLab />;
}
