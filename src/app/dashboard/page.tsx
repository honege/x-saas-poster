import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AccountSwitcher from './AccountSwitcher';

export default async function Dashboard({ searchParams }: { searchParams: { accountId?: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !(session.user as any).id) {
    redirect('/login');
  }
  
  const userId = (session.user as any).id;

  const accounts = await prisma.xAccount.findMany({
    where: { userId: userId },
    include: {
      targetAccounts: true,
      postLogs: { take: 5, orderBy: { createdAt: 'desc' } }
    }
  });

  if (accounts.length === 0) {
    return (
      <main className="container" style={{ padding: '20px 10px' }}>
        <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>ダッシュボード</h1>
        </div>
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '1.1rem' }}>まだXアカウントが登録されていません。</p>
          <Link href="/dashboard/add-account" className="btn btn-primary" style={{ padding: '12px 32px', fontSize: '1.1rem', borderRadius: '30px' }}>
            + 最初のアカウントを追加する
          </Link>
        </div>
      </main>
    );
  }

  // Get selected account
  let selectedAccountId = searchParams.accountId;
  let selectedAccount = accounts.find(a => a.id === selectedAccountId);

  if (!selectedAccount) {
    selectedAccount = accounts[0];
    selectedAccountId = selectedAccount.id;
  }

  return (
    <main style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Main Dashboard Panel */}
      <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px', position: 'relative' }}>
        
        {/* Account Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              {selectedAccount.handle}
              <span style={{ 
                fontSize: '0.85rem', 
                padding: '4px 12px', 
                borderRadius: '20px', 
                background: selectedAccount.isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)',
                color: selectedAccount.isActive ? '#10b981' : '#f43f5e',
                fontWeight: 'normal'
              }}>
                {selectedAccount.isActive ? '稼働中' : '停止中'}
              </span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              APIキー状態: {selectedAccount.apiKey ? '設定済み' : '未設定'}
            </p>
          </div>
          <Link href={`/dashboard/settings/${selectedAccount.id}`} className="btn" style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 24px', borderRadius: '8px' }}>
            ⚙️ 基本設定
          </Link>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>追撃ターゲット数</div>
            <div style={{ fontWeight: 'bold', fontSize: '2rem' }}>{selectedAccount.targetAccounts.length} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>件</span></div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>追撃リプライ（自動）</div>
            <div style={{ fontWeight: 'bold', fontSize: '2rem', color: selectedAccount.autoReplyEnabled ? 'var(--accent)' : 'var(--text-muted)' }}>
              {selectedAccount.autoReplyEnabled ? 'ON' : 'OFF'}
            </div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>自動ポスト（CSV投稿）</div>
            <div style={{ fontWeight: 'bold', fontSize: '2rem', color: selectedAccount.normalPostEnabled ? '#10b981' : 'var(--text-muted)' }}>
              {selectedAccount.normalPostEnabled ? 'ON' : 'OFF'}
            </div>
          </div>
        </div>

        {/* Big Action Buttons */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Link href={`/dashboard/targets/${selectedAccount.id}`} className="btn" style={{ flex: '1 1 300px', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', textAlign: 'left', padding: '24px', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.3)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>🎯 ターゲット設定 (追撃)</span>
            <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>バズっているツイートを監視し、自動でリプライを送信して露出を増やすメイン機能です。</span>
          </Link>
          
          <Link href={`/dashboard/accounts/${selectedAccount.id}/stock`} className="btn" style={{ flex: '1 1 300px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', textAlign: 'left', padding: '24px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>📝 自動ポスト (CSV投稿)</span>
            <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>CSVでツイート本文と画像URLを一括登録し、指定間隔で自動連投・スレッド化します。</span>
          </Link>

          <Link href={`/dashboard/accounts/${selectedAccount.id}/logs`} className="btn" style={{ flex: '1 1 300px', background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa', textAlign: 'left', padding: '24px', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.3)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>📊 稼働ログ確認</span>
            <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>自動投稿や追撃リプライの成功・失敗履歴、およびお掃除機能の実行結果を確認します。</span>
          </Link>
        </div>
        
        <div style={{ marginTop: '32px', textAlign: 'right' }}>
          <Link href={`/dashboard/logs/${selectedAccount.id}`} style={{ color: 'var(--text-muted)', textDecoration: 'underline', fontSize: '0.9rem' }}>
            稼働ログを確認する →
          </Link>
        </div>

      </div>
    </main>
  );
}
