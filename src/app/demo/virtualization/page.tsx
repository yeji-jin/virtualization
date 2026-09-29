import type { Metadata } from "next";
import { VirtualizationLab } from "./virtualization-lab";

export const metadata: Metadata = { title: "리스트 가상화 실습" };

export default function VirtualizationPage() {
  return <VirtualizationLab />;
}
