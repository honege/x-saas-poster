import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
  req: Request,
  { params }: { params: { accountId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const userId = (session.user as any).id;
    const accountId = params.accountId;

    const body = await req.json();
    const { enabled, order, interval, fluctuation, autoCleanupHours } = body;

    const updatedAccount = await prisma.xAccount.update({
      where: { 
        id: accountId,
        userId: userId 
      },
      data: {
        normalPostEnabled: enabled,
        normalPostOrder: order,
        normalPostInterval: interval,
        normalPostFluctuation: fluctuation,
        autoCleanupHours: autoCleanupHours
      }
    });

    return NextResponse.json(updatedAccount);
  } catch (error) {
    console.error('[STOCK_SETTINGS_PUT]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
