import Link from 'next/link';

export default function GuidePage() {
  return (
    <main className="container" style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '32px', textAlign: 'center' }}>ご利用ガイド・Q&A</h1>

      <div className="glass-panel" style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px', color: 'var(--accent)' }}>使い方ステップ</h2>
        <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px', lineHeight: '1.6' }}>
          <li><strong>アカウント登録:</strong> ログイン画面から新規登録を行います。</li>
          <li><strong>Xアカウントの連携:</strong> ダッシュボードから「アカウント追加」を選び、X（Twitter）のAPIキーを入力して連携させます。（<Link href="/guide/api" style={{ color: '#60a5fa', textDecoration: 'underline' }}>APIキーの取得方法はこちら</Link>）</li>
          <li><strong>ターゲット設定:</strong> 運用したいアカウントの設定画面から、「バズ投稿をパクる（引用する）」ターゲットのIDと、最低いいね数を設定します。</li>
          <li><strong>コメントの設定:</strong> AIに自動で感想を書かせるか、あらかじめストックしたコメントをランダムで使うか選びます。</li>
          <li><strong>稼働開始:</strong> 設定を「オン」にしておけば、指定された間隔（例：60分〜120分）で自動的にバズ投稿を検知し、引用リポストを行います。</li>
        </ol>
      </div>

      <div className="glass-panel">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px', color: 'var(--primary)' }}>よくある質問 (Q&A)</h2>
        
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ fontWeight: "bold", marginBottom: "8px" }}>Q. アカウントが凍結されるリスクはありますか？</h3>
          <p style={{ color: "var(--text-muted)", marginBottom: "12px" }}>A. 投稿間隔を短くしすぎたり、過剰なスパム投稿を行ったりすると凍結リスクが高まります。ランダムな投稿間隔（60分〜120分など）を設定し、自然な運用を心がけてください。</p>
          <div style={{ padding: "12px", background: "rgba(244, 63, 94, 0.1)", borderLeft: "4px solid #f43f5e", borderRadius: "4px" }}>
            <p style={{ color: "#f43f5e", fontWeight: "bold", fontSize: "0.9rem", marginBottom: "4px" }}>⚠️【重要】連鎖凍結（巻き添え凍結）に関する警告</p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: 0 }}>
              XのAIは、規約違反を行ったアカウントを検知した際、そのアカウントと「関連性がある」と判断した別のアカウントも同時に一斉凍結（全滅）させる仕様があります。
              本ツールに登録している複数のアカウントのうち、たった1つのアカウントでも過激なアダルト画像やスパムリンクを投稿して凍結された場合、他の安全に運用していたアカウントも道連れになる可能性が極めて高いです。
              これを防ぐため、リスクの高い投稿（過激な画像や規約違反リンク等）は絶対に行わないよう自己防衛をお願いいたします。
            </p>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '8px' }}>Q. AI自動生成はどのようなコメントを作りますか？</h3>
          <p style={{ color: 'var(--text-muted)' }}>A. 引用元の投稿の文脈を読み取り、「とても参考になります！」といった自然な共感や感想を生成します。不適切なワードは自動でフィルタリングされます。</p>
        </div>

        <div>
          <h3 style={{ fontWeight: 'bold', marginBottom: '8px' }}>Q. 複数のアカウントを連携できますか？</h3>
          <p style={{ color: 'var(--text-muted)' }}>A. プランによって連携可能なアカウント数が異なります（ライトプランは3個、スタンダードは10個等）。ダッシュボードから一括管理が可能です。</p>
        </div>
      </div>
    </main>
  );
}
