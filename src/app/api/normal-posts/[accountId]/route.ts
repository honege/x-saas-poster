import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all normal post stocks for an account
export async function GET(
  req: Request,
  { params }: { params: Promise<{ accountId: string }> }
) {
  try {
    const { accountId } = await params;
    const posts = await prisma.normalPostStock.findMany({
      where: { xAccountId: accountId },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// Add a new normal post stock (single or bulk CSV)
export async function POST(
  req: Request,
  { params }: { params: Promise<{ accountId: string }> }
) {
  try {
    const data = await req.json();
    const { accountId } = await params;
    
    if (Array.isArray(data.posts)) {
      // Bulk insert from CSV
      const createData = data.posts.map((content: string) => ({
        xAccountId: accountId,
        content: content,
      }));
      await prisma.normalPostStock.createMany({
        data: createData
      });
      return NextResponse.json({ success: true, count: createData.length });
    } else {
      // Single insert
      const newPost = await prisma.normalPostStock.create({
        data: {
          xAccountId: accountId,
          content: data.content,
        }
      });
      return NextResponse.json(newPost);
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

// Delete a normal post stock
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ accountId: string }> }
) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');
    
    if (!postId) {
      return NextResponse.json({ error: 'Missing postId' }, { status: 400 });
    }

    await prisma.normalPostStock.delete({
      where: { id: postId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
