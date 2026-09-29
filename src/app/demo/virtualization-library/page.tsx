import type { Metadata } from "next";
import { VirtualizationLibraryLab } from "./virtualization-library-lab";

export const metadata: Metadata = { title: "TanStack Virtual 실습" };

export default function VirtualizationLibraryPage() {
  return <VirtualizationLibraryLab />;
}
