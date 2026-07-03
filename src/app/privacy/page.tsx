export default function PrivacyPage() {
  return (
    <main className="container" style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <div className="glass-panel">
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '32px', textAlign: 'center' }}>プライバシーポリシー</h1>
        
        <div style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
          <p style={{ marginBottom: '16px' }}>X-Driver（以下「当サービス」）は、ユーザーの個人情報について以下のとおりプライバシーポリシーを定めます。</p>
          
          <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white', marginTop: '32px', marginBottom: '12px' }}>1. 個人情報の収集方法</h2>
          <p style={{ marginBottom: '16px' }}>当サービスは、ユーザーが利用登録をする際にメールアドレス、APIキー、アクセストークンなどの情報を取得します。APIキー等の認証情報は、当サービスの自動投稿機能を提供するためにのみ使用され、暗号化されて安全に保管されます。</p>
          
          <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white', marginTop: '32px', marginBottom: '12px' }}>2. 個人情報を収集・利用する目的</h2>
          <p style={{ marginBottom: '16px' }}>当サービスが個人情報を収集・利用する目的は、以下のとおりです。</p>
          <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            <li>・当サービス（自動化ボット機能等）の提供・運営のため</li>
            <li>・ユーザーからのお問い合わせに回答するため</li>
            <li>・利用規約に違反したユーザーの特定・利用停止等の対応のため</li>
          </ul>

          <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white', marginTop: '32px', marginBottom: '12px' }}>3. 個人情報の第三者提供</h2>
          <p style={{ marginBottom: '16px' }}>当サービスは、次に掲げる場合を除いて、あらかじめユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。</p>
          <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            <li>・法令に基づく場合</li>
            <li>・人の生命、身体または財産の保護のために必要がある場合</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
