"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddAccount() {
  const [handle, setHandle] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [accessSecret, setAccessSecret] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          handle,
          apiKey,
          apiSecret,
          accessToken,
          accessSecret
        }),
      });

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        alert("追加に失敗しました");
      }
    } catch (error) {
      console.error(error);
      alert("エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container" style={{ padding: "20px 10px", maxWidth: "600px" }}>
      <div className="flex" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Xアカウントの追加</h1>
        <Link href="/dashboard" className="btn" style={{ background: "rgba(255,255,255,0.1)" }}>戻る</Link>
      </div>

      <div className="glass-panel">
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "var(--text-muted)" }}>
              XのユーザーID (@から始まるID)
            </label>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="@username"
              required
              style={{
                width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-light)",
                background: "rgba(0,0,0,0.3)", color: "white", fontSize: "1rem"
              }}
            />
          </div>

          <div style={{ background: "rgba(0,0,0,0.2)", padding: "16px", borderRadius: "8px" }}>
            <h3 style={{ marginBottom: "12px", color: "var(--primary)", fontSize: "1.1rem" }}>APIキー設定 (Freeプラン対応)</h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "12px" }}>Xの開発者ポータルで取得した4つのキーを入力してください。</p>
            
            <a href="/guide" target="_blank" style={{ display: "inline-block", marginBottom: "20px", fontSize: "0.85rem", color: "#60a5fa", textDecoration: "underline" }}>
              👉 初めての方へ：X APIキーの取得手順（図解マニュアル）はこちら
            </a>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.9rem", marginBottom: "4px" }}>API Key</label>
                <input type="text" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="API Key" style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "rgba(255,255,255,0.1)", color: "white", border: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.9rem", marginBottom: "4px" }}>API Secret</label>
                <input type="password" value={apiSecret} onChange={(e) => setApiSecret(e.target.value)} placeholder="API Secret" style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "rgba(255,255,255,0.1)", color: "white", border: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.9rem", marginBottom: "4px" }}>Access Token</label>
                <input type="text" value={accessToken} onChange={(e) => setAccessToken(e.target.value)} placeholder="Access Token" style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "rgba(255,255,255,0.1)", color: "white", border: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.9rem", marginBottom: "4px" }}>Access Secret</label>
                <input type="password" value={accessSecret} onChange={(e) => setAccessSecret(e.target.value)} placeholder="Access Secret" style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "rgba(255,255,255,0.1)", color: "white", border: "none" }} />
              </div>
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ padding: "14px", fontSize: "1.1rem" }}>
            {isLoading ? "追加中..." : "このアカウントを追加する"}
          </button>
        </form>
      </div>
    </main>
  );
}
