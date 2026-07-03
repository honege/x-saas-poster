import Link from 'next/link';

export default function Home() {
  return (
    <main className="container">
      {/* 1. Hero Section */}
      <section className="hero-section">

        <h1 className="hero-title" style={{ padding: '0 16px' }}>
          X収益化を完全自動化する<br />
          最強の<span className="hero-highlight">自動運転システム</span>
        </h1>
        
        {/* 1. Proof of "最強" */}
        <ul className="proof-grid">
          <li className="glass-panel" style={{ padding: '8px 16px', borderRadius: '30px', fontSize: '1rem', fontWeight: 'bold', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '64px' }}>
            <span>✓ 30アカ一括管理</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--accent)', marginTop: '2px', fontWeight: 'normal' }}>※マスタープラン時</span>
          </li>
          <li className="glass-panel" style={{ padding: '8px 16px', borderRadius: '30px', fontSize: '1rem', fontWeight: 'bold', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '64px' }}>
            <span>✓ 1000件CSVストック</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--accent)', marginTop: '2px', fontWeight: 'normal' }}>※マスタープラン時</span>
          </li>
          <li className="glass-panel" style={{ padding: '8px 16px', borderRadius: '30px', fontSize: '1rem', fontWeight: 'bold', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '64px' }}>
            <span>✓ バズ自動検知</span>
          </li>
          <li className="glass-panel" style={{ padding: '8px 16px', borderRadius: '30px', fontSize: '1rem', fontWeight: 'bold', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '64px' }}>
            <span>✓ アフィリエイト自己リプ</span>
          </li>
          <li className="glass-panel" style={{ padding: '8px 16px', borderRadius: '30px', fontSize: '1rem', fontWeight: 'bold', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '64px' }}>
            <span>✓ 24時間フル稼働</span>
          </li>
          <li className="glass-panel" style={{ padding: '8px 16px', borderRadius: '30px', fontSize: '1rem', fontWeight: 'bold', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '64px' }}>
            <span>✓ 完全クラウド運用</span>
          </li>
        </ul>

        <div className="hero-buttons">
          <Link href="/login" className="btn btn-primary" style={{ padding: '16px 40px', fontSize: '1.2rem', boxShadow: '0 0 20px rgba(16,185,129,0.4)' }}>
            今すぐ無料で始める
          </Link>
          <a href="#features" className="btn" style={{ padding: '16px 32px', fontSize: '1.2rem', background: 'rgba(255,255,255,0.1)' }}>
            機能を見る
          </a>
        </div>

        {/* 2. Video Placeholder */}
        <div style={{ margin: '40px auto 0', width: 'auto', maxWidth: '900px', aspectRatio: '16/9', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', borderRadius: '24px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', padding: '0 16px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px', opacity: '0.8' }}>▶️</div>
          <p style={{ color: 'var(--text-main)', fontSize: '1.5rem', fontWeight: 'bold', lineHeight: '1.6', textAlign: 'center' }}>
            15秒で<br/>
            <span style={{ color: 'var(--accent)' }}>初期設定 ↓ 投稿 ↓ 収益まで</span><br/>
            全部見れます
          </p>
        </div>
      </section>

      {/* 5. Target Audience (誰向け？) */}
      <section id="target" style={{ padding: '80px 0', borderTop: '1px solid var(--border-light)', background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(16,185,129,0.05) 100%)' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '50px' }}>こんな方におすすめです</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', maxWidth: '1000px', margin: '0 auto' }}>
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', borderLeft: '4px solid var(--primary)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🔗</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>アフィリエイト</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>リンク誘導を極限まで効率化したい</p>
          </div>
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', borderLeft: '4px solid #FE2C55' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📱</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>TikTok・他SNS誘導</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>Xから別媒体へアクセスを流したい</p>
          </div>
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', borderLeft: '4px solid #8b5cf6' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🤖</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>AI運用</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>コンテンツ生成も投稿も自動化したい</p>
          </div>
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>👥</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>複数アカウント運用</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>数十個のアカウントを手動で回すのが限界</p>
          </div>
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', borderLeft: '4px solid #3b82f6' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>💼</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>副業プレイヤー</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>本業中に全自動で稼働させておきたい</p>
          </div>
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', borderLeft: '4px solid #10b981' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>💰</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>X収益化プロ</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>インプレッションを極大化させたい</p>
          </div>
        </div>
      </section>

      {/* 4. Comparison Table */}
      <section id="comparison" style={{ padding: '80px 0', borderTop: '1px solid var(--border-light)' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '16px' }}>圧倒的な運用効率の差</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '50px' }}>手動運用との比較</p>
        
        <div style={{ maxWidth: '800px', margin: '0 auto', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', background: 'rgba(30, 41, 59, 0.5)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                <th style={{ padding: '20px', fontSize: '1.1rem', fontWeight: 'bold', borderBottom: '1px solid var(--border-light)', width: '40%' }}>機能・要素</th>
                <th style={{ padding: '20px', fontSize: '1.1rem', fontWeight: 'bold', borderBottom: '1px solid var(--border-light)', color: '#94a3b8', width: '30%' }}>手動運用</th>
                <th style={{ padding: '20px', fontSize: '1.3rem', fontWeight: 'bold', borderBottom: '1px solid var(--border-light)', color: 'var(--primary)', width: '30%', background: 'rgba(16,185,129,0.1)' }}>X-Driver</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: '毎日投稿の維持', manual: '×', xposter: '〇' },
                { label: '大量CSVストック予約 (最大1000件※)', manual: '×', xposter: '〇' },
                { label: 'バズ投稿の自動検知', manual: '×', xposter: '〇' },
                { label: 'アフィリ用 自己リプ', manual: '×', xposter: '〇' },
                { label: '完全放置（クラウド稼働）', manual: '×', xposter: '〇' },
                { label: '複数アカウントの同時管理 (最大30アカ※)', manual: '×', xposter: '〇' },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: i !== 5 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <td style={{ padding: '20px', textAlign: 'left', fontWeight: '500', color: '#e2e8f0' }}>
                    {row.label}
                    {(i === 1 || i === 5) && <div style={{ fontSize: '0.75rem', color: 'var(--accent)', marginTop: '4px' }}>※マスタープラン時</div>}
                  </td>
                  <td style={{ padding: '20px', fontSize: '1.5rem', color: '#64748b' }}>{row.manual}</td>
                  <td style={{ padding: '20px', fontSize: '1.5rem', color: 'var(--primary)', background: 'rgba(16,185,129,0.05)' }}>{row.xposter}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Features (Original) */}
      <section id="features" style={{ padding: '80px 0', borderTop: '1px solid var(--border-light)' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '50px' }}>選ばれる6つの理由</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
          
          <div className="glass-panel" style={{ borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.03)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>📱</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--text-main)', fontWeight: 'bold' }}>30アカウント同時管理</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--accent)', marginBottom: '16px' }}>※マスタープラン限定</p>
            <ul style={{ color: 'var(--text-muted)', lineHeight: '2', listStyle: 'none', paddingLeft: '0', fontSize: '1rem' }}>
              <li><span style={{ color: 'var(--accent)', marginRight: '8px' }}>✓</span>ログイン切替 一切不要</li>
              <li><span style={{ color: 'var(--accent)', marginRight: '8px' }}>✓</span>クラウドで24時間完全稼働</li>
              <li><span style={{ color: 'var(--accent)', marginRight: '8px' }}>✓</span>スマホ1台で完結のUI</li>
              <li><span style={{ color: 'var(--accent)', marginRight: '8px' }}>✓</span>大規模な複数アカウント運用をサポート</li>
            </ul>
          </div>

          <div className="glass-panel">
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>🔄</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--text-main)', fontWeight: 'bold' }}>自動引用投稿</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
              指定したターゲットアカウントの過去の投稿から、エンゲージメント（いいね数など）の高いものを自動抽出し、自然なランダム間隔で引用リポストを実行します。
            </p>
          </div>

          <div className="glass-panel">
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>💬</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--text-main)', fontWeight: 'bold' }}>追撃リプライ（自己リプ）</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
              引用投稿へのアクセスが急増したタイミングを逃さず、最適な間隔でアフィリエイトリンクを自動リプライ。機会損失を防ぎ、収益化を最大化します。
            </p>
          </div>

          <div className="glass-panel">
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⚡</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--text-main)', fontWeight: 'bold' }}>1000件を30秒で（CSV）</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--accent)', marginBottom: '16px' }}>※マスタープラン限定</p>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
              大量の投稿データを手作業で入力する手間を省きます。Excel等で作成したCSVファイルから、数百件規模の投稿ストックをワンクリックで一括インポート可能な業務効率化機能を備えています。
            </p>
          </div>

          <div className="glass-panel">
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>📝</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '16px', color: 'var(--text-main)' }}>単発ランダム自動投稿</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>
              引用リポスト機能とは独立して、事前に登録したテキストを設定したランダム間隔で自動配信する機能を搭載。アカウントの稼働状況を自然かつアクティブに維持します。
            </p>
          </div>

          <div className="glass-panel">
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>🛡️</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '16px', color: 'var(--text-main)' }}>API制限オーバー防止機能</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>
              Xの無料API利用上限（月間1500件）の超過を防ぐため、1日あたりの最大実行回数を自動制御するセーフティ機能を搭載。意図せぬAPI制限リスクを抑えます。
            </p>
            <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '12px', lineHeight: '1.4' }}>
              ※注意：本機能はAPI制限を防ぐためのものであり、アカウントの凍結を完全に防ぐものではありません。過度なアフィリエイトリンクの連続投稿や、Xの利用規約に違反するスパム的な運用を行った場合、ペナルティ（凍結やシャドウバン）を受ける可能性があります。
            </p>
          </div>

        </div>
      </section>

      {/* 3. Pricing at Bottom */}
      <section id="pricing" style={{ padding: '80px 0', borderTop: '1px solid var(--border-light)' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>さあ、自動化を始めましょう</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>あなたに合わせた最適なプラン</p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px',
          alignItems: 'stretch'
        }}>
          
          {/* Trial Plan */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: '24px 20px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px', color: '#d1d5db' }}>トライアル</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '16px' }}>0円</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>最大1アカウントまで</p>
            <Link href="/pricing" className="btn" style={{ background: '#374151', color: 'white', marginTop: 'auto', textAlign: 'center', width: '100%', padding: '12px' }}>詳細・登録</Link>
          </div>

          {/* Lite Plan */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: '24px 20px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px', color: '#60a5fa' }}>ライト</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '16px' }}>¥980<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/月</span></div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>最大3アカウントまで</p>
            <Link href="/pricing" className="btn" style={{ background: '#2563eb', color: 'white', marginTop: 'auto', textAlign: 'center', width: '100%', padding: '12px' }}>詳細・登録</Link>
          </div>

          {/* Standard Plan */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: '24px 20px', border: '1px solid rgba(139, 92, 246, 0.3)', background: 'rgba(139, 92, 246, 0.05)', position: 'relative' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px', color: '#a78bfa' }}>スタンダード</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '16px' }}>¥1,980<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/月</span></div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>最大10アカウントまで</p>
            <Link href="/pricing" className="btn" style={{ background: '#7c3aed', color: 'white', marginTop: 'auto', textAlign: 'center', width: '100%', padding: '12px', boxShadow: '0 0 15px rgba(124, 58, 237, 0.5)' }}>詳細・登録</Link>
          </div>

          {/* Premium Plan */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: '24px 20px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px', color: '#34d399' }}>プレミアム</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '16px' }}>¥2,980<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/月</span></div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>最大20アカウントまで</p>
            <Link href="/pricing" className="btn" style={{ background: '#059669', color: 'white', marginTop: 'auto', textAlign: 'center', width: '100%', padding: '12px' }}>詳細・登録</Link>
          </div>

          {/* Master Plan */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: '24px 20px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px', color: '#fbbf24' }}>マスター</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '16px' }}>¥3,980<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/月</span></div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>最大30アカウントまで</p>
            <Link href="/pricing" className="btn" style={{ background: '#d97706', color: 'white', marginTop: 'auto', textAlign: 'center', width: '100%', padding: '12px' }}>詳細・登録</Link>
          </div>

        </div>
      </section>

    </main>
  );
}
