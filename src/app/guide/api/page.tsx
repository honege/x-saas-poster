import Image from 'next/image';
import Link from 'next/link';

export default function ApiGuidePage() {
  return (
    <main className="container" style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Header Section */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '16px', color: 'var(--text-primary)' }}>
          X APIキーの取得手順（完全版）
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
          X-Driverから自動投稿を行うためには、X Developer Portalで4つのキーを取得する必要があります。
          電話番号なしの無料プラン（Free）で簡単に取得できます。以下の図解手順に沿って設定を進めてください。
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Step 1 */}
        <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px', border: '1px solid var(--border-color)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-16px', left: '-16px', background: 'var(--primary)', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.5)' }}>1</div>
          
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            Developer Portalにログインしてアプリを選択
          </h2>
          
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 300px' }}>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '16px' }}>
                まずは、自動投稿させたいXアカウントでログインした状態で、<a href="https://console.x.com/accounts" target="_blank" style={{ color: '#60a5fa', textDecoration: 'underline', fontWeight: 'bold' }}>X Developer Console</a> にアクセスします。
              </p>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>
                ダッシュボード画面の <strong>「Development」</strong> の欄に、初期状態で作成されているアプリ（黒い四角い枠）があります。これをクリックしてアプリの詳細設定画面に入ります。
              </p>
            </div>
            <div style={{ flex: '1 1 300px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ position: 'relative', width: '100%', height: '200px', borderRadius: '8px', overflow: 'hidden' }}>
                <Image src="/guide/step1.png" alt="Step 1: アプリの選択" fill style={{ objectFit: 'cover' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px', border: '1px solid var(--border-color)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-16px', left: '-16px', background: 'var(--primary)', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.5)' }}>2</div>
          
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px' }}>
            アプリの権限（Read and Write）を変更
          </h2>
          
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 300px' }}>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '16px' }}>
                初期状態では「読み取り（見るだけ）」の権限しかないため、これを「書き込み（自動投稿）」ができる権限に変更します。
              </p>
              <ul style={{ color: 'var(--text-muted)', lineHeight: '1.7', paddingLeft: '20px', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>画面下部にある <strong>「ユーザー認証設定（User authentication set up）」</strong> の <strong>「セットアップ」</strong> をクリックします。</li>
                <li>アプリの権限：<strong>「読み取りと書き込み」</strong> を選択します。</li>
                <li>アプリの種類：<strong>「ウェブアプリ、自動化アプリまたはボット」</strong> を選択します。</li>
                <li>コールバックURI： <code>https://google.com</code> と入力します。</li>
                <li>ウェブサイトURL： <code>https://google.com</code> と入力します。</li>
              </ul>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginTop: '16px', background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                💡 URLは形式さえ合っていれば何でもOKです。入力後、一番下の「保存（Save）」ボタンを押してください。
              </p>
            </div>
            <div style={{ flex: '1 1 300px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ position: 'relative', width: '100%', height: '240px', borderRadius: '8px', overflow: 'hidden' }}>
                <Image src="/guide/step2.png" alt="Step 2: 権限の変更" fill style={{ objectFit: 'cover' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px', border: '1px solid var(--border-color)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-16px', left: '-16px', background: 'var(--primary)', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.5)' }}>3</div>
          
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px' }}>
            4つのAPIキーを発行して貼り付け
          </h2>
          
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 300px' }}>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '16px' }}>
                設定を保存したら、上部タブの <strong>「Keys & Tokens（キーとトークン）」</strong> に戻り、キーを発行します。ポップアップが出たら都度コピーしてください。
              </p>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                <h4 style={{ color: 'white', fontWeight: 'bold', marginBottom: '8px' }}>① Consumer Keys（コンシューマーキー）</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>「再生成（Regenerate）」ボタンを押し、表示された <strong>API Key</strong> と <strong>API Secret</strong> の2つをX-Driverの上2つの入力欄に貼り付けます。</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px' }}>
                <h4 style={{ color: 'white', fontWeight: 'bold', marginBottom: '8px' }}>② Access Tokens（アクセストークン）</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>「生成する（Generate）」ボタンを押し、表示された <strong>Access Token</strong> と <strong>Access Secret</strong> の2つをX-Driverの下2つの入力欄に貼り付けます。</p>
              </div>
            </div>
            <div style={{ flex: '1 1 300px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ position: 'relative', width: '100%', height: '240px', borderRadius: '8px', overflow: 'hidden' }}>
                <Image src="/guide/step3.png" alt="Step 3: キーの発行" fill style={{ objectFit: 'cover' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <p style={{ color: 'white', fontSize: '1.1rem', marginBottom: '24px', fontWeight: 'bold' }}>
            🎉 4つのキーをすべて貼り付けて「連携する」を押せば設定完了です！
          </p>
          <Link href="/dashboard/add-account" className="btn-primary" style={{ display: 'inline-flex', padding: '16px 40px', fontSize: '1.1rem', borderRadius: '30px' }}>
            アカウント追加画面に戻る
          </Link>
        </div>

      </div>
    </main>
  );
}
