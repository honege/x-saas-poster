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
    const { accountId } = await params;

    const account = await prisma.xAccount.findFirst({
      where: { id: accountId, userId: userId }
    });

    if (!account) {
      return new NextResponse('Account not found', { status: 404 });
    }

    const body = await req.json();
    const { stocks } = body; // Array of { content, mediaUrls, replyContent, replyMediaUrls }

    if (!stocks || !Array.isArray(stocks)) {
      return new NextResponse('Invalid data', { status: 400 });
    }

    // Bulk create stocks
    await prisma.normalPostStock.createMany({
      data: stocks.map((s: any) => ({
        xAccountId: account.id,
        content: s.content,
        mediaUrls: s.mediaUrls,
        replyContent: s.replyContent,
        replyMediaUrls: s.replyMediaUrls,
        isPosted: false
      }))
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[STOCK_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
