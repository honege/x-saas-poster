"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function HeaderNav() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <nav><span className="btn" style={{ opacity: 0.5 }}>読込中...</span></nav>;
  }

  if (session) {
    return (
      <nav style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Link href="/dashboard" className="btn" style={{ background: 'var(--accent)', color: '#fff' }}>ダッシュボード</Link>
        <button onClick={() => signOut()} className="btn" style={{ background: 'transparent', border: '1px solid var(--border-light)' }}>
          ログアウト
        </button>
      </nav>
    );
  }

  return (
    <nav>
      <Link href="/login" className="btn btn-primary">ログイン</Link>
    </nav>
  );
}
