import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ accountId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const userId = (session.user as any).id;
    const accountId = (await params).accountId;

    const account = await prisma.xAccount.findFirst({
      where: { id: accountId, userId: userId }
    });

    if (!account) {
      return new NextResponse('Account not found', { status: 404 });
    }

    const body = await req.json();
    const { handle, minLikesFilter } = body;

    if (!handle) {
      return new NextResponse('Handle is required', { status: 400 });
    }

    const target = await prisma.targetAccount.create({
      data: {
        xAccountId: account.id,
        handle: handle,
        minLikesFilter: minLikesFilter || 1000,
        isActive: true
      }
    });

    return NextResponse.json(target);
  } catch (error) {
    console.error('[TARGETS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
