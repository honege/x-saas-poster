import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import TargetClientPage from './TargetClientPage';

export default async function TargetsPage({ params }: { params: { accountId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !(session.user as any).id) {
    redirect('/login');
  }

  const userId = (session.user as any).id;
  const accountId = params.accountId;

  const account = await prisma.xAccount.findFirst({
    where: {
      id: accountId,
      userId: userId,
    },
    include: {
      targetAccounts: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!account) {
    redirect('/dashboard');
  }

  return (
    <main className="container" style={{ padding: '20px 10px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <Link href={`/dashboard?accountId=${account.id}`} className="btn" style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
          ← 戻る
        </Link>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>
          ターゲット設定（追撃自動リプ） <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>- {account.handle}</span>
        </h1>
      </div>

      <TargetClientPage account={account} initialTargets={account.targetAccounts} />
    </main>
  );
}
