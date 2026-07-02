import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: Promise<{ accountId: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = (session.user as any).id;
    const { accountId } = await params;

    const account = await prisma.xAccount.findUnique({
      where: { id: accountId }
    });

    if (!account || account.userId !== userId) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json(account);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch account settings' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ accountId: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = (session.user as any).id;
    const { accountId } = await params;

    // Verify ownership
    const account = await prisma.xAccount.findUnique({
      where: { id: accountId }
    });
    if (!account || account.userId !== userId) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });
    }

    const data = await req.json();

    const updatedAccount = await prisma.xAccount.update({
      where: { id: accountId },
      data: {
        postIntervalMin: data.postIntervalMin !== undefined ? parseInt(data.postIntervalMin) : undefined,
        postIntervalMax: data.postIntervalMax !== undefined ? parseInt(data.postIntervalMax) : undefined,
        autoReplyEnabled: data.autoReplyEnabled,
        replyTemplate: data.replyTemplate,
        isActive: data.isActive,
        proxyUrl: data.proxyUrl,
        dailyApiLimit: data.dailyApiLimit !== undefined ? parseInt(data.dailyApiLimit) : undefined,
        normalPostEnabled: data.enabled,
        normalPostOrder: data.order,
        normalPostInterval: data.interval !== undefined ? parseInt(data.interval) : undefined,
        normalPostFluctuation: data.fluctuation !== undefined ? parseInt(data.fluctuation) : undefined,
        autoCleanupHours: data.autoCleanupHours !== undefined ? parseInt(data.autoCleanupHours) : undefined,
      }
    });

    return NextResponse.json(updatedAccount);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update account settings' }, { status: 500 });
  }
}
export async function DELETE(req: Request, { params }: { params: Promise<{ accountId: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = (session.user as any).id;
    const { accountId } = await params;

    // Verify ownership
    const account = await prisma.xAccount.findUnique({
      where: { id: accountId }
    });
    if (!account || account.userId !== userId) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });
    }

    await prisma.xAccount.delete({
      where: { id: accountId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}
