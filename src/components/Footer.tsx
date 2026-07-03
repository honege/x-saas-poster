import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ 
      marginTop: 'auto', 
      borderTop: '1px solid rgba(255,255,255,0.1)', 
      background: 'rgba(0,0,0,0.5)', 
      backdropFilter: 'blur(10px)',
      padding: '40px 20px',
      color: 'var(--text-muted)'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '40px', justifyContent: 'space-between' }}>
        
        {/* Logo & Info */}
        <div style={{ flex: '1 1 300px' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '16px' }}>
            X-Driver
          </h3>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '16px' }}>
            X（旧Twitter）の自動化・運用効率化をサポートするクラウドサービス。複数アカウントの管理からAIを活用した自動バズ生成まで、すべてを一つのプラットフォームで。
          </p>
          <p style={{ fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} X-Driver. All rights reserved.
          </p>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          <div>
            <h4 style={{ color: 'white', fontWeight: 'bold', marginBottom: '16px', fontSize: '1rem' }}>サポート</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li>
                <Link href="/guide" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>
                  📘 ご利用ガイド・FAQ
                </Link>
              </li>

              <li>
                <Link href="/pricing" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>
                  💰 料金プラン
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: 'white', fontWeight: 'bold', marginBottom: '16px', fontSize: '1rem' }}>法的情報</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li>
                <Link href="/terms" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>
                  📜 利用規約
                </Link>
              </li>
              <li>
                <Link href="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>
                  🛡️ プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link href="/law" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>
                  ⚖️ 特定商取引法に基づく表記
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
