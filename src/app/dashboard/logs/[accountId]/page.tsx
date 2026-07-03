import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function LogsPage({ params }: { params: { accountId: string } }) {
  const accountId = params.accountId;
  
  const account = await prisma.xAccount.findUnique({
    where: { id: accountId },
    include: {
      postLogs: {
        orderBy: { createdAt: 'desc' },
        take: 50,
      }
    }
  });

  if (!account) {
    return <div>Account not found</div>;
  }

  return (
    <main className="container" style={{ padding: '20px 10px', maxWidth: '800px' }}>
      <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>投稿ログ ({account.handle})</h1>
        <Link href="/dashboard" className="btn" style={{ background: 'rgba(255,255,255,0.1)' }}>戻る</Link>
      </div>

      <div className="glass-panel">
        <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--text-muted)' }}>最近の活動 (最新50件)</h2>
        
        {account.postLogs.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>まだ投稿の記録がありません。</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {account.postLogs.map(log => (
              <div key={log.id} style={{ 
                background: 'rgba(0,0,0,0.2)', 
                padding: '16px', 
                borderRadius: '8px',
                borderLeft: log.status === 'SUCCESS' ? '4px solid #10b981' : '4px solid #f43f5e'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold', color: log.status === 'SUCCESS' ? '#10b981' : '#f43f5e' }}>
                    {log.status === 'SUCCESS' ? '✅ 成功' : '❌ 失敗'}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {new Date(log.createdAt).toLocaleString('ja-JP')}
                  </span>
                </div>
                
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <p><strong>種類:</strong> {log.postType}</p>
                  {log.targetHandle && <p><strong>対象:</strong> @{log.targetHandle}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
