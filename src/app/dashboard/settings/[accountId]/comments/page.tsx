"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function CommentStockSettings() {
  const params = useParams();
  const accountId = params.accountId as string;

  // Temporary mock state for development
  const [comments, setComments] = useState([
    { id: "1", content: "これめっちゃ参考になります！", isActive: true },
    { id: "2", content: "有益な情報ありがとうございます🙏", isActive: true },
    { id: "3", content: "なるほど、そういう考え方もあるのか🤔", isActive: true },
  ]);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setComments([
      ...comments, 
      { id: Date.now().toString(), content: newComment, isActive: true }
    ]);
    setNewComment("");
  };

  const handleDelete = (id: string) => {
    setComments(comments.filter(c => c.id !== id));
  };

  return (
    <main className="container" style={{ padding: "20px 10px", maxWidth: "600px" }}>
      <div className="flex" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>QRTコメントストック</h1>
        <Link href={`/dashboard/settings/${accountId}`} className="btn" style={{ background: "rgba(255,255,255,0.1)" }}>戻る</Link>
      </div>

      <div className="glass-panel">
        <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>
          ここに登録したコメントの中から、システムが毎回ランダムに1つ選んで引用リポストを行います。
          （※なるべく多くのバリエーションを登録しておくと、スパム判定されにくくなります）
        </p>

        {/* 新規追加フォーム */}
        <form onSubmit={handleAddComment} style={{ marginBottom: "30px", background: "rgba(0,0,0,0.2)", padding: "16px", borderRadius: "8px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>新しいコメントを追加</label>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={"素晴らしい内容ですね！参考にします。"}
            rows={3}
            style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "rgba(255,255,255,0.1)", color: "white", border: "none", resize: "vertical", marginBottom: "12px" }}
          ></textarea>
          <button type="submit" className="btn btn-primary" style={{ padding: "8px 16px" }}>追加する</button>
        </form>

        {/* コメント一覧 */}
        <h3 style={{ marginBottom: "12px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "8px" }}>
          登録済みコメント（{comments.length}件）
        </h3>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {comments.length === 0 ? (
            <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "20px" }}>コメントが登録されていません。</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.05)", padding: "12px", borderRadius: "6px" }}>
                <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{comment.content}</p>
                <button 
                  onClick={() => handleDelete(comment.id)}
                  style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer", padding: "4px" }}
                  title="削除"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
