'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Papa from 'papaparse';

export default function StockClientPage({ account, initialStocks }: { account: any, initialStocks: any[] }) {
  const router = useRouter();
  const [stocks, setStocks] = useState(initialStocks);
  
  // Settings State
  const [enabled, setEnabled] = useState(account.normalPostEnabled);
  const [order, setOrder] = useState(account.normalPostOrder);
  const [interval, setIntervalVal] = useState(account.normalPostInterval);
  const [fluctuation, setFluctuation] = useState(account.normalPostFluctuation);
  const [autoCleanupHours, setAutoCleanupHours] = useState(account.autoCleanupHours || 0);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const clearAllStocks = async () => {
    if (!confirm('本当に全てのストックを削除（お掃除）しますか？この操作は取り消せません。')) return;
    setIsClearing(true);
    try {
      const res = await fetch(`/api/accounts/${account.id}/stock/clear`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setStocks([]);
        alert('ストックをすべてお掃除しました！✨');
      } else {
        alert('削除に失敗しました。');
      }
    } catch (err) {
      console.error(err);
      alert('エラーが発生しました。');
    } finally {
      setIsClearing(false);
    }
  };

  // Parse CSV on file select
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    Papa.parse(file, {
      complete: async (results) => {
        // results.data is an array of arrays representing rows and columns
        // Expected format: A: Content, B: MediaUrls, C: ReplyContent, D: ReplyMediaUrls
        const newStocks = results.data
          .filter((row: any) => row[0] && row[0].trim() !== '') // Ensure content exists
          .map((row: any) => ({
            content: row[0],
            mediaUrls: row[1] || null,
            replyContent: row[2] || null,
            replyMediaUrls: row[3] || null,
          }));

        if (newStocks.length === 0) {
          alert('有効なデータが見つかりませんでした。');
          setIsUploading(false);
          return;
        }

        // Send to API
        try {
          const res = await fetch(`/api/accounts/${account.id}/stock`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stocks: newStocks })
          });
          
          if (res.ok) {
            alert(`${newStocks.length}件のストックを登録しました！`);
            router.refresh();
          } else {
            alert('登録に失敗しました。');
          }
        } catch (err) {
          console.error(err);
          alert('エラーが発生しました。');
        } finally {
          setIsUploading(false);
          if (e.target) e.target.value = ''; // reset input
        }
      }
    });
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/accounts/${account.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enabled,
          order,
          interval: Number(interval),
          fluctuation: Number(fluctuation),
          autoCleanupHours: Number(autoCleanupHours)
        })
      });
      if (res.ok) {
        alert('設定を保存しました。');
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      alert('保存に失敗しました。');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Settings Panel */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px' }}>自動投稿設定</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>自動ポスト稼働</label>
            <button 
              onClick={() => setEnabled(!enabled)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                background: enabled ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)',
                color: enabled ? '#10b981' : 'white',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {enabled ? '稼働中 (ON)' : '停止中 (OFF)'}
            </button>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>投稿順序</label>
            <select 
              value={order} 
              onChange={e => setOrder(e.target.value)}
              className="form-input"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
            >
              <option value="SEQUENTIAL">上から順番に投稿</option>
              <option value="RANDOM">ランダムに選んで投稿</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>投稿間隔 (ベース)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="number" 
                value={interval} 
                onChange={e => setIntervalVal(Number(e.target.value))}
                className="form-input"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
              />
              <span>分</span>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>ゆらぎ (前後ランダム)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>±</span>
              <input 
                type="number" 
                value={fluctuation} 
                onChange={e => setFluctuation(Number(e.target.value))}
                className="form-input"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
              />
              <span>分</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              例: 60分 ±15分の場合、45分〜75分の間で変動します
            </p>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>自動お掃除 (自己破壊)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="number" 
                value={autoCleanupHours} 
                onChange={e => setAutoCleanupHours(Number(e.target.value))}
                className="form-input"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
              />
              <span>時間後に削除</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              ※ 0にすると無効です。例: 24を設定すると、投稿から24時間後に自動削除されます。
            </p>
          </div>
        </div>

        <button 
          onClick={saveSettings} 
          disabled={isSaving}
          className="btn btn-primary" 
          style={{ width: '100%', padding: '12px', borderRadius: '8px' }}
        >
          {isSaving ? '保存中...' : '設定を保存する'}
        </button>
      </div>

      {/* CSV Upload Panel */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px' }}>一括アップロード (CSV)</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '0.9rem' }}>
          A列: メイン投稿文 / B列: 画像URL(カンマ区切り) / C列: 自動リプ文(スレッド) / D列: リプ画像URL
        </p>
        <div style={{ position: 'relative' }}>
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileUpload}
            disabled={isUploading}
            style={{
              position: 'absolute', width: '100%', height: '100%', opacity: 0, cursor: 'pointer'
            }}
          />
          <div style={{ 
            border: '2px dashed rgba(255,255,255,0.2)', 
            padding: '40px', 
            textAlign: 'center', 
            borderRadius: '12px',
            background: 'rgba(0,0,0,0.2)'
          }}>
            <span style={{ fontSize: '2rem' }}>📄</span>
            <p style={{ marginTop: '8px', fontWeight: 'bold' }}>{isUploading ? '読み込み中...' : 'クリックまたはドラッグ＆ドロップでCSVを選択'}</p>
          </div>
        </div>
      </div>

      {/* Stock List Panel */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>登録済みストック ({stocks.length}件)</span>
            <span style={{ fontSize: '1rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>
              未投稿: {stocks.filter(s => !s.isPosted).length}件
            </span>
          </h2>
          
          <button 
            onClick={clearAllStocks}
            disabled={isClearing || stocks.length === 0}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              background: 'rgba(244, 63, 94, 0.1)',
              color: '#f43f5e',
              border: '1px solid rgba(244, 63, 94, 0.2)',
              cursor: (isClearing || stocks.length === 0) ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {isClearing ? 'お掃除中...' : '🧹 全件お掃除'}
          </button>
        </div>
        
        {stocks.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>ストックはありません。CSVからアップロードしてください。</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '600px', overflowY: 'auto', paddingRight: '8px' }}>
            {stocks.map((stock, i) => (
              <div key={stock.id} style={{ 
                background: 'rgba(0,0,0,0.3)', 
                padding: '16px', 
                borderRadius: '8px', 
                borderLeft: stock.isPosted ? '4px solid #f43f5e' : '4px solid #10b981' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>#{i + 1}</span>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    padding: '2px 8px', 
                    borderRadius: '10px', 
                    background: stock.isPosted ? 'rgba(244, 63, 94, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                    color: stock.isPosted ? '#f43f5e' : '#10b981'
                  }}>
                    {stock.isPosted ? '投稿済み' : '待機中'}
                  </span>
                </div>
                
                <p style={{ whiteSpace: 'pre-wrap', marginBottom: '12px' }}>{stock.content}</p>
                {stock.mediaUrls && (
                  <p style={{ fontSize: '0.8rem', color: '#60a5fa', marginBottom: '8px' }}>📸 添付画像あり</p>
                )}

                {stock.replyContent && (
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '6px', borderLeft: '2px solid rgba(255,255,255,0.2)' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>↳ 自動リプ (スレッド)</p>
                    <p style={{ fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>{stock.replyContent}</p>
                    {stock.replyMediaUrls && (
                      <p style={{ fontSize: '0.8rem', color: '#60a5fa', marginTop: '4px' }}>📸 添付画像あり</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
