"use client";

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const currentTier = (session?.user as any)?.subscriptionTier || 'FREE';

  const handleCheckout = async (tier: string, priceId: string) => {
    if (!session) {
      router.push('/login');
      return;
    }

    setLoadingTier(tier);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          priceId, 
          userId: (session.user as any).id,
          tier 
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('エラーが発生しました。');
      }
    } catch (err) {
      console.error(err);
      alert('通信エラーが発生しました。');
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <main className="container" style={{ padding: '40px 10px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <span style={{ fontSize: '2rem' }}>💳</span> 料金プラン
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>あなたのアカウント規模に合わせた最適なプランをお選びください。</p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px',
        alignItems: 'stretch'
      }}>
        
        {/* FREE Plan */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: '24px 20px', border: '1px solid rgba(255,255,255,0.1)', opacity: currentTier === 'FREE' ? 1 : 0.7 }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px', color: '#d1d5db', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🛡️</span> トライアル (FREE)
          </h2>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px' }}>0円</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.9rem', color: '#d1d5db' }}>
            <li>✅ 連携アカウント<br/><span style={{ fontWeight: 'bold', color: 'white', fontSize: '1rem' }}>1 <span style={{ fontSize: '0.7rem', color: 'gray' }}>個</span></span></li>
            <li>✅ ストック上限<br/><span style={{ fontWeight: 'bold', color: 'white', fontSize: '1rem' }}>10 <span style={{ fontSize: '0.7rem', color: 'gray' }}>個</span></span></li>
            <li>✅ AIリライト生成<br/><span style={{ fontWeight: 'bold', color: 'gray', fontSize: '1rem' }}>利用不可</span></li>
            <li>✅ 単発予約投稿<br/><span style={{ fontWeight: 'bold', color: 'gray', fontSize: '1rem' }}>利用不可</span></li>
          </ul>
          {currentTier === 'FREE' ? (
             <button disabled className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', marginTop: 'auto', textAlign: 'center', width: '100%', padding: '12px' }}>現在のプラン</button>
          ) : (
             <Link href="/login" className="btn" style={{ background: '#374151', color: 'white', marginTop: 'auto', textAlign: 'center', width: '100%', padding: '12px' }}>このプランを選択</Link>
          )}
        </div>

        {/* Lite Plan */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: '24px 20px', border: '1px solid rgba(255,255,255,0.1)', opacity: currentTier === 'LITE' ? 1 : 0.7 }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px', color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⚡</span> ライト (LITE)
          </h2>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px' }}>¥980<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/月</span></div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.9rem', color: '#60a5fa' }}>
            <li>✅ 連携アカウント<br/><span style={{ fontWeight: 'bold', color: 'white', fontSize: '1rem' }}>3 <span style={{ fontSize: '0.7rem', color: 'gray' }}>個</span></span></li>
            <li>✅ ストック上限<br/><span style={{ fontWeight: 'bold', color: 'white', fontSize: '1rem' }}>100 <span style={{ fontSize: '0.7rem', color: 'gray' }}>個</span></span></li>
            <li>✅ AIリライト生成<br/><span style={{ fontWeight: 'bold', color: 'white', fontSize: '1rem' }}>100 <span style={{ fontSize: '0.7rem', color: 'gray' }}>回 / 月</span></span></li>
            <li>✅ 単発予約投稿<br/><span style={{ fontWeight: 'bold', color: 'white', fontSize: '1rem' }}>5 <span style={{ fontSize: '0.7rem', color: 'gray' }}>個待ちまで</span></span></li>
          </ul>
          {currentTier === 'LITE' ? (
             <button disabled className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', marginTop: 'auto', textAlign: 'center', width: '100%', padding: '12px' }}>現在のプラン</button>
          ) : (
             <button onClick={() => handleCheckout('LITE', 'price_mock_lite')} disabled={loadingTier !== null} className="btn" style={{ background: '#2563eb', color: 'white', marginTop: 'auto', textAlign: 'center', width: '100%', padding: '12px' }}>{loadingTier === 'LITE' ? '処理中...' : 'このプランを選択'}</button>
          )}
        </div>

        {/* Standard Plan */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: '24px 20px', border: '1px solid rgba(139, 92, 246, 0.3)', background: 'rgba(139, 92, 246, 0.05)', position: 'relative', opacity: currentTier === 'STANDARD' ? 1 : 0.7 }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px', color: '#a78bfa', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>✔️</span> スタンダード (STANDARD)
          </h2>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px' }}>¥1,980<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/月</span></div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.9rem', color: '#a78bfa' }}>
            <li>✅ 連携アカウント<br/><span style={{ fontWeight: 'bold', color: 'white', fontSize: '1rem' }}>10 <span style={{ fontSize: '0.7rem', color: 'gray' }}>個</span></span></li>
            <li>✅ ストック上限<br/><span style={{ fontWeight: 'bold', color: 'white', fontSize: '1rem' }}>500 <span style={{ fontSize: '0.7rem', color: 'gray' }}>個</span></span></li>
            <li>✅ AIリライト生成<br/><span style={{ fontWeight: 'bold', color: 'white', fontSize: '1rem' }}>500 <span style={{ fontSize: '0.7rem', color: 'gray' }}>回 / 月</span></span></li>
            <li>✅ 単発予約投稿<br/><span style={{ fontWeight: 'bold', color: 'white', fontSize: '1rem' }}>10 <span style={{ fontSize: '0.7rem', color: 'gray' }}>個待ちまで</span></span></li>
          </ul>
          {currentTier === 'STANDARD' ? (
             <button disabled className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', marginTop: 'auto', textAlign: 'center', width: '100%', padding: '12px' }}>現在のプラン</button>
          ) : (
             <button onClick={() => handleCheckout('STANDARD', 'price_mock_standard')} disabled={loadingTier !== null} className="btn" style={{ background: '#7c3aed', color: 'white', marginTop: 'auto', textAlign: 'center', width: '100%', padding: '12px', boxShadow: '0 0 15px rgba(124, 58, 237, 0.5)' }}>{loadingTier === 'STANDARD' ? '処理中...' : 'このプランを選択'}</button>
          )}
        </div>

        {/* Premium Plan */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: '24px 20px', border: '1px solid rgba(255,255,255,0.1)', opacity: currentTier === 'PREMIUM' ? 1 : 0.7 }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px', color: '#34d399', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⭐</span> プレミアム (PREMIUM)
          </h2>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px' }}>¥2,980<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/月</span></div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.9rem', color: '#34d399' }}>
            <li>✅ 連携アカウント<br/><span style={{ fontWeight: 'bold', color: 'white', fontSize: '1rem' }}>20 <span style={{ fontSize: '0.7rem', color: 'gray' }}>個</span></span></li>
            <li>✅ ストック上限<br/><span style={{ fontWeight: 'bold', color: 'white', fontSize: '1rem' }}>700 <span style={{ fontSize: '0.7rem', color: 'gray' }}>個</span></span></li>
            <li>✅ AIリライト生成<br/><span style={{ fontWeight: 'bold', color: 'white', fontSize: '1rem' }}>700 <span style={{ fontSize: '0.7rem', color: 'gray' }}>回 / 月</span></span></li>
            <li>✅ 単発予約投稿<br/><span style={{ fontWeight: 'bold', color: 'white', fontSize: '1rem' }}>20 <span style={{ fontSize: '0.7rem', color: 'gray' }}>個待ちまで</span></span></li>
          </ul>
          {currentTier === 'PREMIUM' ? (
             <button disabled className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', marginTop: 'auto', textAlign: 'center', width: '100%', padding: '12px' }}>現在のプラン</button>
          ) : (
             <button onClick={() => handleCheckout('PREMIUM', 'price_mock_premium')} disabled={loadingTier !== null} className="btn" style={{ background: '#059669', color: 'white', marginTop: 'auto', textAlign: 'center', width: '100%', padding: '12px' }}>{loadingTier === 'PREMIUM' ? '処理中...' : 'このプランを選択'}</button>
          )}
        </div>

        {/* Master Plan */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: '24px 20px', border: '2px solid #a78bfa', background: 'rgba(139, 92, 246, 0.1)', position: 'relative', transform: 'scale(1.02)', opacity: currentTier === 'MASTER' ? 1 : 0.7 }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px', marginTop: '16px', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>👑</span> マスター (MASTER)
          </h2>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px' }}>¥3,980<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/月</span></div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.9rem', color: '#fbbf24' }}>
            <li>✅ 連携アカウント<br/><span style={{ fontWeight: 'bold', color: 'white', fontSize: '1rem' }}>30 <span style={{ fontSize: '0.7rem', color: 'gray' }}>個</span></span></li>
            <li>✅ ストック上限<br/><span style={{ fontWeight: 'bold', color: 'white', fontSize: '1rem' }}>1000 <span style={{ fontSize: '0.7rem', color: 'gray' }}>個</span></span></li>
            <li>✅ AIリライト生成<br/><span style={{ fontWeight: 'bold', color: 'white', fontSize: '1rem' }}>1000 <span style={{ fontSize: '0.7rem', color: 'gray' }}>回 / 月</span></span></li>
            <li>✅ 単発予約投稿<br/><span style={{ fontWeight: 'bold', color: 'white', fontSize: '1rem' }}>30 <span style={{ fontSize: '0.7rem', color: 'gray' }}>個待ちまで</span></span></li>
          </ul>
          {currentTier === 'MASTER' ? (
             <button disabled className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', marginTop: 'auto', textAlign: 'center', width: '100%', padding: '12px' }}>現在のプラン</button>
          ) : (
             <button onClick={() => handleCheckout('MASTER', 'price_mock_master')} disabled={loadingTier !== null} className="btn" style={{ background: '#d97706', color: 'white', marginTop: 'auto', textAlign: 'center', width: '100%', padding: '12px' }}>{loadingTier === 'MASTER' ? '処理中...' : 'このプランを選択'}</button>
          )}
        </div>

      </div>
    </main>
  );
}
