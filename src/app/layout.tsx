import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Virtualization Lab", template: "%s | Virtualization Lab" },
  description: "React 리스트 가상화 학습 프로젝트",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="ko"><body><Providers>{children}</Providers></body></html>;
}
