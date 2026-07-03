'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TargetClientPage({ account, initialTargets }: { account: any, initialTargets: any[] }) {
  const router = useRouter();
  const [targets, setTargets] = useState(initialTargets);
  
  // Settings State
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(account.autoReplyEnabled);
  const [replyTemplate, setReplyTemplate] = useState(account.replyTemplate || '');
  const [isSaving, setIsSaving] = useState(false);

  // New Target State
  const [newHandle, setNewHandle] = useState('');
  const [minLikes, setMinLikes] = useState(1000);
  const [isAdding, setIsAdding] = useState(false);

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/accounts/${account.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          autoReplyEnabled,
          replyTemplate,
        })
      });
      if (res.ok) {
        alert('設定を保存しました。');
        router.refresh();
      } else {
        alert('保存に失敗しました。');
      }
    } catch (err) {
      console.error(err);
      alert('エラーが発生しました。');
    } finally {
      setIsSaving(false);
    }
  };

  const addTarget = async () => {
    if (!newHandle.trim()) return;
    setIsAdding(true);
    try {
      let cleanHandle = newHandle.trim().replace('@', '');
      const res = await fetch(`/api/targets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          xAccountId: account.id,
          handle: cleanHandle,
          minLikesFilter: minLikes
        })
      });
      if (res.ok) {
        setNewHandle('');
        router.refresh();
        // Since we don't have the returned object easily mapped without parsing, we can just reload the page data
        window.location.reload();
      } else {
        alert('追加に失敗しました。');
      }
    } catch (err) {
      console.error(err);
      alert('エラーが発生しました。');
    } finally {
      setIsAdding(false);
    }
  };

  const deleteTarget = async (targetId: string) => {
    if (!confirm('本当に削除しますか？')) return;
    try {
      const res = await fetch(`/api/targets?id=${targetId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setTargets(targets.filter(t => t.id !== targetId));
      }
    } catch (err) {
      console.error(err);
      alert('削除に失敗しました。');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Settings Panel */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px' }}>自動リプライ設定（アフィリエイト定型文）</h2>
        
        <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', flexWrap: 'wrap' }}>
          
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>追撃リプライ（自動）</label>
            <button 
              onClick={() => setAutoReplyEnabled(!autoReplyEnabled)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                background: autoReplyEnabled ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)',
                color: autoReplyEnabled ? '#3b82f6' : 'white',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {autoReplyEnabled ? '稼働中 (ON)' : '停止中 (OFF)'}
            </button>
          </div>

          <div style={{ flex: '2 1 400px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>リプライ定型文</label>
            <textarea 
              value={replyTemplate} 
              onChange={e => setReplyTemplate(e.target.value)}
              placeholder="ここにアフィリエイトリンクや定型文を入力..."
              className="form-input"
              style={{ 
                width: '100%', 
                minHeight: '120px',
                padding: '12px', 
                borderRadius: '8px', 
                background: 'rgba(0,0,0,0.3)', 
                border: '1px solid rgba(255,255,255,0.1)', 
                color: 'white',
                resize: 'vertical'
              }}
            />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              ※ターゲットのツイートがバズった（いいね数が基準を超えた）際に、この文章が自動でリプライされます。
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

      {/* Target Management Panel */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px' }}>監視ターゲット一覧</h2>
        
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginBottom: '24px',
          padding: '16px',
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '8px',
          alignItems: 'flex-end',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>追加するアカウント (@なしでも可)</label>
            <input 
              type="text" 
              placeholder="elonmusk"
              value={newHandle}
              onChange={e => setNewHandle(e.target.value)}
              className="form-input"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
            />
          </div>
          <div style={{ flex: '1 1 150px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>発動基準 (いいね数)</label>
            <input 
              type="number" 
              value={minLikes}
              onChange={e => setMinLikes(Number(e.target.value))}
              className="form-input"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
            />
          </div>
          <button 
            onClick={addTarget}
            disabled={isAdding || !newHandle}
            className="btn btn-primary"
            style={{ padding: '10px 24px', borderRadius: '8px', height: '42px' }}
          >
            {isAdding ? '追加中...' : '＋ 監視を追加'}
          </button>
        </div>

        {targets.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>監視ターゲットは登録されていません。</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {targets.map((target) => (
              <div key={target.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                background: 'rgba(255,255,255,0.03)', 
                padding: '16px', 
                borderRadius: '8px', 
                borderLeft: '4px solid #3b82f6'
              }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>@{target.handle}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    発動基準: <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>{target.minLikesFilter.toLocaleString()} いいね</span> 以上
                  </p>
                </div>
                
                <button 
                  onClick={() => deleteTarget(target.id)}
                  style={{
                    background: 'rgba(244, 63, 94, 0.1)',
                    color: '#f43f5e',
                    border: '1px solid rgba(244, 63, 94, 0.2)',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  削除
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
