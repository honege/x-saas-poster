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
    const accounts = await prisma.xAccount.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(accounts);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = (session.user as any).id;
    
    // Fetch user tier
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { subscriptionTier: true }
    });
    
    const tier = user?.subscriptionTier || 'FREE';
    
    // Check limits
    const limits: Record<string, number> = {
      FREE: 3,
      TRIAL: 1,
      LITE: 3,
      STANDARD: 10,
      PREMIUM: 20,
      MASTER: 30
    };
    
    const maxAccounts = limits[tier] || 1;
    
    // オーナー特権（cjp490114@gmail.com の場合は無制限）
    const isOwner = session.user.email === 'cjp490114@gmail.com';
    
    const accountCount = await prisma.xAccount.count({
      where: { userId: userId }
    });
    
    if (!isOwner && accountCount >= maxAccounts) {
      return NextResponse.json(
        { error: `現在のプラン(${tier})ではこれ以上アカウントを追加できません。上限は${maxAccounts}個です。` }, 
        { status: 403 }
      );
    }

    const data = await req.json();

    const newAccount = await prisma.xAccount.create({
      data: {
        userId: userId,
        handle: data.handle,
        apiKey: data.apiKey,
        apiSecret: data.apiSecret,
        accessToken: data.accessToken,
        accessSecret: data.accessSecret,
        isActive: true,
      }
    });

    return NextResponse.json(newAccount);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}
