import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import LogsClientPage from './LogsClientPage';
import Link from 'next/link';

export default async function LogsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !(session.user as any).id) {
    redirect('/login');
  }
  const userId = (session.user as any).id;

  const accountId = params.id;

  const account = await prisma.xAccount.findFirst({
    where: {
      id: accountId,
      userId: userId,
    }
  });

  if (!account) {
    redirect('/dashboard');
  }

  return (
    <main className="container" style={{ padding: '20px 10px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <Link href="/dashboard" className="btn" style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '8px' }}>
          ← 戻る
        </Link>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>
          稼働ログ確認 <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>- @{account.handle}</span>
        </h1>
      </div>

      <LogsClientPage account={account} />
    </main>
  );
}
