"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NormalPostsPage({ params }: { params: { accountId: string } }) {
  const router = useRouter();
  const [account, setAccount] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [newContent, setNewContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAccount();
    fetchPosts();
  }, [params.accountId]);

  const fetchAccount = async () => {
    const res = await fetch(`/api/accounts/${params.accountId}`);
    if (res.ok) setAccount(await res.json());
  };

  const fetchPosts = async () => {
    const res = await fetch(`/api/normal-posts/${params.accountId}`);
    if (res.ok) setPosts(await res.json());
    setIsLoading(false);
  };

  const handleUpdateSettings = async () => {
    setIsSaving(true);
    await fetch(`/api/accounts/${params.accountId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(account),
    });
    setIsSaving(false);
    alert("設定を保存しました。");
  };

  const handleAddPost = async () => {
    if (!newContent.trim()) return;
    const res = await fetch(`/api/normal-posts/${params.accountId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newContent }),
    });
    if (res.ok) {
      setNewContent("");
      fetchPosts();
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("本当に削除しますか？")) return;
    const res = await fetch(`/api/normal-posts/${params.accountId}?postId=${postId}`, {
      method: "DELETE",
    });
    if (res.ok) fetchPosts();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const csvText = event.target?.result as string;
      const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== "");
      
      if (lines.length === 0) {
        alert("有効なデータが見つかりませんでした。");
        return;
      }

      const res = await fetch(`/api/normal-posts/${params.accountId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ posts: lines }),
      });

      if (res.ok) {
        alert(`${lines.length}件の投稿ストックを一括登録しました！`);
        fetchPosts();
      } else {
        alert("一括登録に失敗しました。");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (isLoading || !account) {
    return <div style={{ color: "white", padding: "20px" }}>読み込み中...</div>;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: "bold", color: "white" }}>
          単発ランダム自動投稿 (Auto Threads機能)
        </h1>
        <Link href={`/dashboard/${params.accountId}`} className="btn btn-secondary">
          戻る
        </Link>
      </div>

      <div className="glass-panel" style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "16px", color: "white" }}>
          自動投稿の動作設定
        </h2>
        
        <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
          <label style={{ display: "flex", alignItems: "center", cursor: "pointer", color: "white" }}>
            <input
              type="checkbox"
              checked={account.normalPostEnabled}
              onChange={(e) => setAccount({ ...account, normalPostEnabled: e.target.checked })}
              style={{ width: "20px", height: "20px", marginRight: "12px", accentColor: "#3b82f6" }}
            />
            <span style={{ fontSize: "1.1rem", fontWeight: "bold" }}>単発ランダム自動投稿を「ON」にする</span>
          </label>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", color: "white" }}>最短間隔 (分)</label>
            <input
              type="number"
              value={account.normalPostIntervalMin}
              onChange={(e) => setAccount({ ...account, normalPostIntervalMin: e.target.value })}
              style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "rgba(255,255,255,0.1)", color: "white", border: "none" }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", color: "white" }}>最長間隔 (分)</label>
            <input
              type="number"
              value={account.normalPostIntervalMax}
              onChange={(e) => setAccount({ ...account, normalPostIntervalMax: e.target.value })}
              style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "rgba(255,255,255,0.1)", color: "white", border: "none" }}
            />
          </div>
        </div>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "16px" }}>
          ※引用リポスト（バズ便乗）とは完全に独立して、設定された時間間隔（ランダム）で下のストックから投稿を1つ選んでツイートします。
        </p>

        <button onClick={handleUpdateSettings} disabled={isSaving} className="btn btn-primary">
          {isSaving ? "保存中..." : "設定を保存する"}
        </button>
      </div>

      <div className="glass-panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", color: "white" }}>
            投稿ストック一覧 ({posts.filter(p => !p.isPosted).length}件 未投稿)
          </h2>
          <div>
            <input
              type="file"
              accept=".csv,.txt"
              ref={fileInputRef}
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
            <button 
              onClick={() => fileInputRef.current?.click()} 
              className="btn btn-secondary"
              style={{ background: "#10b981", color: "white", border: "none" }}
            >
              CSV一括登録 (改行区切り)
            </button>
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="ここに自動で呟かせたい文章を入力してください（アフィリエイトリンクを含めてもOKです）..."
            style={{ width: "100%", height: "100px", padding: "12px", borderRadius: "8px", background: "rgba(255,255,255,0.05)", color: "white", border: "1px solid rgba(255,255,255,0.1)", marginBottom: "8px", resize: "vertical" }}
          />
          <button onClick={handleAddPost} className="btn btn-primary" style={{ width: "100%" }}>
            リストに追加する
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {posts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>
              まだストックがありません。上の入力欄かCSVから追加してください。
            </div>
          ) : (
            posts.map(post => (
              <div key={post.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "12px", background: "rgba(0,0,0,0.2)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ flex: 1, marginRight: "16px" }}>
                  <p style={{ color: post.isPosted ? "var(--text-muted)" : "white", whiteSpace: "pre-wrap", margin: 0 }}>
                    {post.content}
                  </p>
                  <div style={{ fontSize: "0.8rem", color: post.isPosted ? "#f43f5e" : "#10b981", marginTop: "8px" }}>
                    {post.isPosted ? "済 (投稿済み)" : "待機中"}
                  </div>
                </div>
                <button onClick={() => handleDeletePost(post.id)} className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "0.8rem", color: "#f43f5e", borderColor: "rgba(244,63,94,0.3)" }}>
                  削除
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
