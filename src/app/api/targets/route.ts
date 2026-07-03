import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const { searchParams } = new URL(req.url);
    const accountId = searchParams.get('accountId');

    if (!accountId) {
      return NextResponse.json({ error: 'Missing accountId' }, { status: 400 });
    }

    // Verify ownership
    const account = await prisma.xAccount.findUnique({
      where: { id: accountId }
    });
    if (!account || account.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 404 });
    }

    const targets = await prisma.targetAccount.findMany({
      where: { xAccountId: accountId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(targets);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch targets' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = (session.user as any).id;
    const data = await req.json();

    if (!data.xAccountId || !data.handle) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify ownership
    const account = await prisma.xAccount.findUnique({
      where: { id: data.xAccountId }
    });
    if (!account || account.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 404 });
    }

    const target = await prisma.targetAccount.create({
      data: {
        xAccountId: data.xAccountId,
        handle: data.handle.startsWith('@') ? data.handle : `@${data.handle}`,
        minLikesFilter: parseInt(data.minLikesFilter) || 0,
      }
    });

    return NextResponse.json(target);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to add target' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing target ID' }, { status: 400 });
    }

    // Verify ownership indirectly via target -> xAccount -> userId
    const target = await prisma.targetAccount.findUnique({
      where: { id },
      include: { xAccount: true }
    });

    if (!target || target.xAccount.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized or not found' }, { status: 404 });
    }

    await prisma.targetAccount.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete target' }, { status: 500 });
  }
}
