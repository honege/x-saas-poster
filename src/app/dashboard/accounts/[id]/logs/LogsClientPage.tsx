'use client';

import { useState, useEffect } from 'react';
import { PostLog } from '@prisma/client';

export default function LogsClientPage({ account }: { account: any }) {
  const [logs, setLogs] = useState<PostLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = async (pageNumber: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/accounts/${account.id}/logs?page=${pageNumber}&limit=20`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs);
        setTotalPages(data.pagination.totalPages);
        setPage(data.pagination.page);
      }
    } catch (error) {
      console.error('Failed to fetch logs', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(page);
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString('ja-JP', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>最近の稼働履歴</h2>
        <button onClick={() => fetchLogs(1)} className="btn" style={{ background: 'rgba(255,255,255,0.1)', padding: '6px 12px', fontSize: '0.9rem' }}>
          ↻ 更新
        </button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>読み込み中...</div>
      ) : logs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          まだ稼働履歴がありません。<br />
          自動投稿や追撃リプライが実行されるとここに表示されます。
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <th style={{ padding: '12px' }}>日時</th>
                <th style={{ padding: '12px' }}>処理タイプ</th>
                <th style={{ padding: '12px' }}>ステータス</th>
                <th style={{ padding: '12px' }}>詳細</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px', fontSize: '0.9rem' }}>{formatDate(log.createdAt as any)}</td>
                  <td style={{ padding: '12px' }}>
                    {log.postType === 'NORMAL_POST' && <span style={{ color: '#10b981' }}>📝 自動ポスト</span>}
                    {log.postType === 'QUOTE_TWEET' && <span style={{ color: '#3b82f6' }}>🎯 追撃リプライ</span>}
                    {log.postType !== 'NORMAL_POST' && log.postType !== 'QUOTE_TWEET' && <span>{log.postType}</span>}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {log.status === 'SUCCESS' && <span style={{ display: 'inline-block', background: 'rgba(16,185,129,0.2)', color: '#10b981', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>成功</span>}
                    {log.status === 'FAILED' && <span style={{ display: 'inline-block', background: 'rgba(239,68,68,0.2)', color: '#ef4444', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>失敗</span>}
                    {log.status === 'DELETED' && <span style={{ display: 'inline-block', background: 'rgba(107,114,128,0.2)', color: '#9ca3af', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>お掃除済</span>}
                  </td>
                  <td style={{ padding: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {log.postType === 'QUOTE_TWEET' && log.targetHandle ? `@${log.targetHandle} を追撃` : ''}
                    {log.replyPosted ? ' (ツリー化済)' : ''}
                    {log.newPostId && (
                      <a href={`https://x.com/i/web/status/${log.newPostId}`} target="_blank" rel="noreferrer" style={{ color: '#60a5fa', marginLeft: '8px', textDecoration: 'underline' }}>
                        🔗 見る
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
              <button 
                disabled={page === 1} 
                onClick={() => fetchLogs(page - 1)}
                className="btn" style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.1)' }}
              >
                前へ
              </button>
              <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {page} / {totalPages}
              </span>
              <button 
                disabled={page === totalPages} 
                onClick={() => fetchLogs(page + 1)}
                className="btn" style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.1)' }}
              >
                次へ
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
