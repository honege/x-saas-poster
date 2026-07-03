export default function LawPage() {
  return (
    <main className="container" style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <div className="glass-panel">
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '32px', textAlign: 'center' }}>特定商取引法に基づく表記</h1>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-muted)' }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '16px', textAlign: 'left', width: '30%', color: 'white' }}>販売事業者名</th>
              <td style={{ padding: '16px' }}>X-Driver運営事務局</td>
            </tr>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '16px', textAlign: 'left', color: 'white' }}>運営責任者名</th>
              <td style={{ padding: '16px' }}>[氏名を入力]</td>
            </tr>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '16px', textAlign: 'left', color: 'white' }}>所在地</th>
              <td style={{ padding: '16px' }}>[住所を入力]（※請求があった場合は遅滞なく開示いたします）</td>
            </tr>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '16px', textAlign: 'left', color: 'white' }}>お問い合わせ窓口</th>
              <td style={{ padding: '16px' }}>support@example.com</td>
            </tr>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '16px', textAlign: 'left', color: 'white' }}>販売価格</th>
              <td style={{ padding: '16px' }}>プランごとに設定（料金プランページに記載）</td>
            </tr>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '16px', textAlign: 'left', color: 'white' }}>商品代金以外の必要料金</th>
              <td style={{ padding: '16px' }}>インターネット接続に関する通信回線等の諸費用</td>
            </tr>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '16px', textAlign: 'left', color: 'white' }}>お支払い方法</th>
              <td style={{ padding: '16px' }}>クレジットカード決済</td>
            </tr>
            <tr>
              <th style={{ padding: '16px', textAlign: 'left', color: 'white' }}>返品・キャンセルについて</th>
              <td style={{ padding: '16px' }}>デジタルコンテンツという商品の特性上、決済完了後の返品・返金・キャンセルはお受けできません。解約はいつでも可能であり、次回の請求日から課金が停止されます。</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}
