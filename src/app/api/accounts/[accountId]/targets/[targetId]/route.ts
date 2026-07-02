import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  req: Request,
  { params }: { params: { accountId: string, targetId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const userId = (session.user as any).id;
    const accountId = params.accountId;
    const targetId = params.targetId;

    // Verify account ownership
    const account = await prisma.xAccount.findFirst({
      where: { id: accountId, userId: userId }
    });

    if (!account) {
      return new NextResponse('Account not found', { status: 404 });
    }

    await prisma.targetAccount.delete({
      where: { id: targetId, xAccountId: account.id }
    });

    return new NextResponse('Deleted', { status: 200 });
  } catch (error) {
    console.error('[TARGETS_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
