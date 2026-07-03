"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function AccountSettings() {
  const params = useParams();
  const router = useRouter();
  const accountId = params.accountId as string;

  const [isLoading, setIsLoading] = useState(false);
  
  // State for form
  const [postIntervalMin, setPostIntervalMin] = useState("60");
  const [postIntervalMax, setPostIntervalMax] = useState("120");
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(false);
  const [replyTemplate, setReplyTemplate] = useState("");
  const [isActive, setIsActive] = useState(true);
  
  // New states for safety
  const [proxyUrl, setProxyUrl] = useState("");
  const [dailyApiLimit, setDailyApiLimit] = useState("45");

  // In a real app, we'd fetch the existing settings here on mount using useEffect.
  useEffect(() => {
    fetch(`/api/accounts/${accountId}`)
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setPostIntervalMin(data.postIntervalMin?.toString() || "60");
          setPostIntervalMax(data.postIntervalMax?.toString() || "120");
          setAutoReplyEnabled(data.autoReplyEnabled || false);
          setReplyTemplate(data.replyTemplate || "");
          setIsActive(data.isActive ?? true);
          setProxyUrl(data.proxyUrl || "");
          setDailyApiLimit(data.dailyApiLimit?.toString() || "45");
        }
      })
      .catch(err => console.error(err));
  }, [accountId]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`/api/accounts/${accountId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          postIntervalMin, 
          postIntervalMax, 
          autoReplyEnabled, 
          replyTemplate,
          isActive,
          proxyUrl,
          dailyApiLimit
        }),
      });

      if (res.ok) {
        alert("設定を保存しました！");
        router.push("/dashboard");
        router.refresh();
      } else {
        alert("保存に失敗しました");
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
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>アカウント設定</h1>
        <Link href="/dashboard" className="btn" style={{ background: "rgba(255,255,255,0.1)" }}>戻る</Link>
      </div>

      <div className="glass-panel">
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          <div style={{ background: "rgba(0,0,0,0.2)", padding: "16px", borderRadius: "8px" }}>
             <h3 style={{ marginBottom: "12px", color: "var(--primary)" }}>基本稼働設定</h3>
             <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                <input 
                  type="checkbox" 
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  style={{ width: "20px", height: "20px" }}
                />
                <span>ボットを稼働させる</span>
             </label>
          </div>

          <div style={{ background: "rgba(0,0,0,0.2)", padding: "16px", borderRadius: "8px" }}>
            <h3 style={{ marginBottom: "12px", color: "var(--primary)" }}>投稿スケジュール（ランダム間隔）</h3>
            <div className="flex gap-4" style={{ alignItems: "center" }}>
              <input
                type="number"
                value={postIntervalMin}
                onChange={(e) => setPostIntervalMin(e.target.value)}
                min="10"
                style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "rgba(255,255,255,0.1)", color: "white", border: "none" }}
              />
              <span>〜</span>
              <input
                type="number"
                value={postIntervalMax}
                onChange={(e) => setPostIntervalMax(e.target.value)}
                min="10"
                style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "rgba(255,255,255,0.1)", color: "white", border: "none" }}
              />
              <span>分</span>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "8px" }}>
              指定した時間の間隔でランダムに自動引用投稿を行います。
            </p>
          </div>

          <div style={{ background: "rgba(0,0,0,0.2)", padding: "16px", borderRadius: "8px" }}>
            <h3 style={{ marginBottom: "12px", color: "var(--primary)" }}>QRTコメントの生成方式</h3>
            <div className="flex gap-4" style={{ flexDirection: "column" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                <input 
                  type="radio" 
                  name="qrtCommentMode"
                  value="AI"
                  defaultChecked
                  style={{ width: "18px", height: "18px" }}
                />
                <div>
                  <span style={{ fontWeight: "bold" }}>AIによる自動生成</span>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>Gemini等のAIが元のポストの内容を読んで自然な感想を生成します。</p>
                </div>
              </label>
              
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                <input 
                  type="radio" 
                  name="qrtCommentMode"
                  value="RANDOM_STOCK"
                  style={{ width: "18px", height: "18px" }}
                />
                <div>
                  <span style={{ fontWeight: "bold" }}>手動ストックからのランダム抽出</span>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>あらかじめ登録しておいたコメント一覧の中からランダムで選んでQRTします。</p>
                </div>
              </label>
            </div>
            
            <div style={{ marginTop: "16px", padding: "12px", background: "rgba(255,255,255,0.05)", borderRadius: "6px" }}>
               <Link href={`/dashboard/settings/${accountId}/comments`} style={{ color: "var(--primary)", textDecoration: "underline", fontSize: "0.9rem" }}>
                 → ストック用コメントの管理・追加はこちら
               </Link>
            </div>
          </div>

          <div style={{ background: "rgba(0,0,0,0.2)", padding: "16px", borderRadius: "8px" }}>
            <h3 style={{ marginBottom: "12px", color: "var(--accent)" }}>追撃リプライ（収益化）設定</h3>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", marginBottom: "16px" }}>
              <input 
                type="checkbox" 
                checked={autoReplyEnabled}
                onChange={(e) => setAutoReplyEnabled(e.target.checked)}
                style={{ width: "20px", height: "20px", accentColor: "var(--accent)" }}
              />
              <span>自動リプライを有効にする</span>
            </label>
            
            {autoReplyEnabled && (
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem" }}>リプライ内容（アフィリエイトリンク等）</label>
                <textarea
                  value={replyTemplate}
                  onChange={(e) => setReplyTemplate(e.target.value)}
                  placeholder={"詳細はこちら👇\nhttps://example.com/affiliate"}
                  rows={4}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "rgba(255,255,255,0.1)", color: "white", border: "none", resize: "vertical" }}
                ></textarea>
              </div>
            )}
          </div>

          <div style={{ background: "rgba(244, 63, 94, 0.1)", border: "1px solid rgba(244, 63, 94, 0.3)", padding: "16px", borderRadius: "8px" }}>
            <h3 style={{ marginBottom: "12px", color: "#f43f5e" }}>安全対策（凍結防止）設定</h3>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem" }}>1日の投稿上限（API制限対策）</label>
              <input
                type="number"
                value={dailyApiLimit}
                onChange={(e) => setDailyApiLimit(e.target.value)}
                min="1"
                max="100"
                style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "rgba(255,255,255,0.1)", color: "white", border: "none" }}
              />
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "8px" }}>Xの無料API（Freeプラン）は月間1,500件（1日約50件）が上限です。これを超えるとAPIが停止されるため、安全圏の「45」以下を推奨します。</p>
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ padding: "14px", fontSize: "1.1rem" }}>
            {isLoading ? "保存中..." : "設定を保存する"}
          </button>
        </form>
      </div>
    </main>
  );
}
