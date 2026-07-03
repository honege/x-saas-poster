"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import HeaderNav from "@/components/HeaderNav";

export default function GlobalHeaderWrapper() {
  const pathname = usePathname();

  // ダッシュボード画面ではグローバルトップヘッダーを非表示にする
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <header className="header">
      <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="logo">X-Driver</div>
      </Link>
      <HeaderNav />
    </header>
  );
}
