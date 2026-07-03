"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams, useParams } from "next/navigation";
import { signOut } from "next-auth/react";

type SidebarProps = {
  user: { name?: string | null; email?: string | null; subscriptionTier: string };
  accounts: any[];
};

export default function DashboardSidebar({ user, accounts }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  // URLから現在のaccountIdを取得する
  const selectedAccountId = 
    (params?.accountId as string) || 
    (params?.id as string) || 
    searchParams?.get("accountId") || 
    (accounts.length > 0 ? accounts[0].id : undefined);

  const handleAccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    if (id) {
      // 現在のパスを維持しつつ、accountIdパラメーターを更新する
      const url = new URL(window.location.href);
      url.searchParams.set("accountId", id);
      router.push(url.pathname + url.search);
    } else {
      router.push("/dashboard/add-account");
    }
  };

  const navItems = [
    { name: "ダッシュボード", href: "/dashboard", icon: "📊" },
    { name: "🎯 ターゲット設定", href: `/dashboard/targets/${selectedAccountId}`, icon: "", requiresAccount: true },
    { name: "📝 自動ポスト (CSV)", href: `/dashboard/accounts/${selectedAccountId}/stock`, icon: "", requiresAccount: true },
    { name: "⚙️ アカウント設定", href: `/dashboard/settings/${selectedAccountId}`, icon: "", requiresAccount: true },
    { name: "稼働ログ", href: `/dashboard/accounts/${selectedAccountId}/logs`, icon: "📋", requiresAccount: true },
  ];

  const bottomItems = [
    { name: "ご利用ガイド", href: "/guide", icon: "❓" },
    { name: "料金プラン", href: "/pricing", icon: "💎" },
  ];

  return (
    <aside className="w-full md:w-[280px] bg-[#0f172a] border-b md:border-b-0 md:border-r border-white/10 flex flex-col md:h-screen md:sticky top-0">
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#fff', fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>X-Driver</span>
        </Link>
      </div>

      {/* Account Switcher */}
      <div style={{ padding: '20px' }}>
        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>操作中のアカウント</div>
        <select 
          value={selectedAccountId || ""} 
          onChange={handleAccountChange}
          style={{
            width: '100%',
            backgroundColor: 'rgba(0,0,0,0.3)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '10px 12px',
            borderRadius: '8px',
            outline: 'none',
            fontSize: '0.95rem',
            cursor: 'pointer'
          }}
        >
          {accounts.length === 0 && <option value="">アカウントなし</option>}
          {accounts.map(acc => (
            <option key={acc.id} value={acc.id}>{acc.handle}</option>
          ))}
          <option value="">+ アカウントを追加</option>
        </select>
      </div>

      {/* Main Navigation */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '0 12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item, idx) => {
            if (item.requiresAccount && !selectedAccountId) return null;
            
            // Check active state
            let isActive = false;
            if (item.href === '/dashboard' && pathname === '/dashboard') isActive = true;
            else if (item.href !== '/dashboard' && pathname?.includes(item.href.split('?')[0])) isActive = true;

            return (
              <Link 
                key={idx} 
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                  backgroundColor: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  fontWeight: isActive ? 'bold' : 'normal',
                  transition: 'all 0.2s'
                }}
              >
                {item.icon && <span>{item.icon}</span>}
                {item.name}
              </Link>
            );
          })}
        </div>

        <div style={{ marginTop: '32px', marginBottom: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
          {bottomItems.map((item, idx) => (
            <Link 
              key={idx} 
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 16px',
                borderRadius: '8px',
                color: 'rgba(255,255,255,0.6)',
                textDecoration: 'none',
                fontSize: '0.9rem',
              }}
            >
              <span>{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* Plan & Usage Info */}
      <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>現在のプラン</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '4px 8px', borderRadius: '4px' }}>
              {user.subscriptionTier}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>連携アカウント数</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
              {accounts.length} <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>/ 無制限</span>
            </span>
          </div>
        </div>
      </div>

      {/* User Profile / Logout */}
      <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.email}</div>
          </div>
        </div>
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '4px' }}
          title="ログアウト"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>
    </aside>
  );
}
