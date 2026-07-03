import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TwitterApi } from 'twitter-api-v2';

export const maxDuration = 300;

export async function GET(req: Request) {
  // 1. Fetch active accounts that have auto-cleanup enabled
  const activeAccounts = await prisma.xAccount.findMany({
    where: {
      isActive: true,
      autoCleanupHours: { gt: 0 },
      apiKey: { not: null },
      apiSecret: { not: null },
      accessToken: { not: null },
      accessSecret: { not: null },
    }
  });

  const results = [];

  for (const account of activeAccounts) {
    try {
      const client = new TwitterApi({
        appKey: account.apiKey!,
        appSecret: account.apiSecret!,
        accessToken: account.accessToken!,
        accessSecret: account.accessSecret!,
      });

      // Calculate cutoff time
      const cutoffTime = new Date(Date.now() - account.autoCleanupHours * 60 * 60 * 1000);

      // Fetch successful posts that are older than cutoff time and not yet deleted
      const postsToDelete = await prisma.postLog.findMany({
        where: {
          xAccountId: account.id,
          status: 'SUCCESS',
          newPostId: { not: null },
          createdAt: { lt: cutoffTime }
        },
        take: 10 // Limit deletion per cron run to avoid rate limits (50 per 15 min limit on X API)
      });

      if (postsToDelete.length === 0) {
        results.push({ account: account.handle, status: 'NO_TWEETS_TO_CLEAN' });
        continue;
      }

      let deletedCount = 0;

      for (const log of postsToDelete) {
        try {
          if (log.newPostId) {
            await client.v2.deleteTweet(log.newPostId);
          }
          
          // Mark as DELETED in DB
          await prisma.postLog.update({
            where: { id: log.id },
            data: { status: 'DELETED' }
          });
          
          deletedCount++;
        } catch (err: any) {
          // If tweet is already deleted (e.g. manually by user), Twitter returns 404 or similar.
          // We should mark it as deleted so we don't keep trying.
          if (err.code === 404 || (err.data && err.data.detail && err.data.detail.includes('not found'))) {
             await prisma.postLog.update({
              where: { id: log.id },
              data: { status: 'DELETED' }
            });
          } else {
            console.error(`Failed to delete tweet ${log.newPostId} for account ${account.handle}:`, err);
          }
        }
      }

      results.push({ account: account.handle, status: 'SUCCESS', deletedCount });

    } catch (error: any) {
      console.error(`Error processing auto-cleanup for ${account.handle}:`, error);
      results.push({ account: account.handle, status: 'FAILED', error: error.message });
    }
  }

  return NextResponse.json({ success: true, results });
}
