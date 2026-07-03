"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";

function LoginForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("メールアドレスまたはパスワードが間違っています。");
      setIsLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  if (status === "loading") {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)', padding: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '8px', textAlign: 'center' }}>おかえりなさい</h1>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '32px' }}>アカウントにログインして開始</p>

        {registered && (
          <div style={{ background: 'rgba(52, 211, 153, 0.1)', color: '#34d399', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '0.9rem', textAlign: 'center' }}>
            登録が完了しました。ログインしてください。
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(248, 113, 113, 0.1)', color: '#f87171', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '0.9rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>メールアドレス</label>
            <input 
              type="email" 
              required 
              className="input-field" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>パスワード</label>
            <input 
              type="password" 
              required 
              className="input-field" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ marginTop: '10px' }}>
            {isLoading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <hr style={{ flex: 1, borderTop: '1px solid rgba(255,255,255,0.1)' }} />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>または</span>
          <hr style={{ flex: 1, borderTop: '1px solid rgba(255,255,255,0.1)' }} />
        </div>

        <button 
          onClick={() => signIn('google')}
          className="btn" 
          style={{ width: '100%', background: 'white', color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '24px', padding: '10px' }}
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="20" height="20" />
          Googleでログイン
        </button>

        <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          アカウントをお持ちでないですか？ <Link href="/register" style={{ color: '#60a5fa', textDecoration: 'underline' }}>新規登録</Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
