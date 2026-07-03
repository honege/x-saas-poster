import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ accountId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const { accountId } = await params;

    // Verify account belongs to user
    const account = await prisma.xAccount.findFirst({
      where: {
        id: accountId,
        userId: userId,
      }
    });

    if (!account) {
      return NextResponse.json({ error: 'Account not found or unauthorized' }, { status: 404 });
    }

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const logs = await prisma.postLog.findMany({
      where: {
        xAccountId: accountId
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit,
    });

    const totalCount = await prisma.postLog.count({
      where: {
        xAccountId: accountId
      }
    });

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error: any) {
    console.error('Failed to fetch logs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
