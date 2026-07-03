import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
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

    const body = await req.json();
    const { autoReplyEnabled, replyTemplate } = body;

    const updatedAccount = await prisma.xAccount.update({
      where: { 
        id: accountId,
        userId: userId 
      },
      data: {
        autoReplyEnabled: autoReplyEnabled,
        replyTemplate: replyTemplate,
      }
    });

    return NextResponse.json(updatedAccount);
  } catch (error) {
    console.error('[REPLY_SETTINGS_PUT]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
