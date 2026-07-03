export default function TermsPage() {
  return (
    <main className="container" style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <div className="glass-panel">
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '32px', textAlign: 'center' }}>利用規約</h1>
        
        <div style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
          <p style={{ marginBottom: '16px' }}>本利用規約（以下「本規約」といいます。）は、X-Poster Pro（以下「本サービス」といいます。）の提供条件及び本サービスの利用者（以下「ユーザー」といいます。）と当方との間の権利義務関係を定めるものです。</p>
          
          <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white', marginTop: '32px', marginBottom: '12px' }}>第1条（適用）</h2>
          <p style={{ marginBottom: '16px' }}>1. 本規約は、本サービスの提供条件及び本サービスの利用に関する当方とユーザーとの間の権利義務関係を定めることを目的とし、ユーザーと当方との間の本サービスの利用に関わる一切の関係に適用されます。</p>
          
          <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white', marginTop: '32px', marginBottom: '12px' }}>第2条（禁止事項）</h2>
          <p style={{ marginBottom: '16px' }}>ユーザーは、本サービスの利用にあたり、以下の各号のいずれかに該当する行為をしてはなりません。</p>
          <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            <li>(1) X（Twitter）の利用規約に違反する行為（スパム行為、過剰な自動化など）</li>
            <li>(2) 当方、本サービスの他の利用者の知的財産権等を侵害する行為</li>
            <li>(3) 本サービスのネットワークまたはシステム等に過度な負荷をかける行為</li>
          </ul>

          <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white', marginTop: '32px', marginBottom: '12px' }}>第3条（免責事項）</h2>
          <p style={{ marginBottom: '16px' }}>1. 当方は、本サービスがユーザーの特定の目的に適合すること、期待する機能・商品的価値・正確性・有用性を有することについて、何ら保証するものではありません。</p>
          <p style={{ marginBottom: '16px' }}>2. 本サービスの利用に関連して、ユーザーのXアカウントが凍結、停止、制限された場合であっても、当方は一切の責任を負わず、返金や損害賠償等の義務を負わないものとします。</p>
          <p style={{ marginBottom: '16px' }}>3. <strong>【連鎖凍結に関する免責】</strong>X（Twitter）の仕様上、1つのアカウントが規約違反等により凍結された場合、同一の環境（同一IPアドレス、同一API、同一デバイス等）で運用されている他の関連アカウントもAIによって自動的に検知され、一斉に凍結（いわゆる「連鎖凍結」や「巻き添え凍結」）されるリスクが常に存在します。本サービスで複数アカウントを運用中に発生した、いかなる連鎖凍結についてもユーザー自身の自己責任とし、当方は一切の補償を行いません。</p>
        </div>
      </div>
    </main>
  );
}
