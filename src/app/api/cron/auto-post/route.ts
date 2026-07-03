import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TwitterApi } from 'twitter-api-v2';

export const maxDuration = 300; // Allow 5 minutes for cron job

async function uploadMediaFromUrl(client: TwitterApi, urlStr: string) {
  try {
    const response = await fetch(urlStr.trim());
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Guess mime type from URL or fallback
    let mimeType = 'image/jpeg';
    if (urlStr.includes('.png')) mimeType = 'image/png';
    else if (urlStr.includes('.gif')) mimeType = 'image/gif';
    else if (urlStr.includes('.mp4')) mimeType = 'video/mp4';

    const mediaId = await client.v1.uploadMedia(buffer, { mimeType });
    return mediaId;
  } catch (error) {
    console.error(`Failed to upload media from URL: ${urlStr}`, error);
    return null;
  }
}

export async function GET(req: Request) {
  // 1. Fetch active accounts
  const activeAccounts = await prisma.xAccount.findMany({
    where: {
      isActive: true,
      normalPostEnabled: true,
      apiKey: { not: null },
      apiSecret: { not: null },
      accessToken: { not: null },
      accessSecret: { not: null },
    },
    include: {
      postLogs: {
        where: { postType: 'NORMAL_POST' },
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    }
  });

  const results = [];

  for (const account of activeAccounts) {
    try {
      const lastPost = account.postLogs[0];
      let shouldPost = false;

      if (!lastPost) {
        shouldPost = true; // Never posted before
      } else {
        // Calculate next post time
        const lastPostTime = new Date(lastPost.createdAt).getTime();
        const now = Date.now();
        
        // Randomize the interval based on base + fluctuation
        // e.g. interval = 60, fluctuation = 15 -> random between 45 and 75
        const minMins = Math.max(1, account.normalPostInterval - account.normalPostFluctuation);
        const maxMins = account.normalPostInterval + account.normalPostFluctuation;
        
        // Determine the actual threshold needed (we simulate random by checking if time passed is > random threshold)
        // A better approach: we just check if (now - lastPost) > (interval + random fluctuation)
        // Wait, if we generate random every minute, it skews to lower times. 
        // We should just check if (now - last) >= min. If yes, and (now-last) >= max, definitely post.
        // Or simple: 10% chance every minute after min passes.
        const diffMins = (now - lastPostTime) / (1000 * 60);

        if (diffMins >= maxMins) {
          shouldPost = true; // Exceeded max
        } else if (diffMins >= minMins) {
          // Inside fluctuation window. Let's do a random chance to post to simulate natural timing.
          // The window size is (maxMins - minMins).
          const windowSize = maxMins - minMins || 1;
          const chance = 1 / windowSize; // E.g., 1/30 chance every minute
          if (Math.random() < chance) {
            shouldPost = true;
          }
        }
      }

      if (!shouldPost) {
        results.push({ handle: account.handle, status: 'SKIPPED_TIME_NOT_MET' });
        continue;
      }

      // Fetch a stock
      let stock;
      if (account.normalPostOrder === 'RANDOM') {
        // Fetch all unposted
        const unposted = await prisma.normalPostStock.findMany({
          where: { xAccountId: account.id, isPosted: false }
        });
        if (unposted.length > 0) {
          stock = unposted[Math.floor(Math.random() * unposted.length)];
        }
      } else {
        // Sequential (oldest first)
        stock = await prisma.normalPostStock.findFirst({
          where: { xAccountId: account.id, isPosted: false },
          orderBy: { createdAt: 'asc' }
        });
      }

      if (!stock) {
        // No stocks left
        // Optionally loop? For now, we just skip and wait for user to add more.
        results.push({ handle: account.handle, status: 'SKIPPED_NO_STOCKS' });
        continue;
      }

      // Initialize Twitter Client
      const client = new TwitterApi({
        appKey: account.apiKey!,
        appSecret: account.apiSecret!,
        accessToken: account.accessToken!,
        accessSecret: account.accessSecret!,
      });

      // Handle Media for main tweet
      const mediaIds: string[] = [];
      if (stock.mediaUrls) {
        const urls = stock.mediaUrls.split(',').filter(u => u.trim() !== '');
        for (const u of urls.slice(0, 4)) {
          const mId = await uploadMediaFromUrl(client, u);
          if (mId) mediaIds.push(mId);
        }
      }

      // Post Main Tweet
      const tweetParams: any = { text: stock.content };
      if (mediaIds.length > 0) {
        tweetParams.media = { media_ids: mediaIds };
      }

      const postResponse = await client.v2.tweet(tweetParams);
      const mainTweetId = postResponse.data.id;

      let replyPosted = false;

      // Handle Thread/Auto-Reply
      if (stock.replyContent) {
        const replyMediaIds: string[] = [];
        if (stock.replyMediaUrls) {
          const rUrls = stock.replyMediaUrls.split(',').filter(u => u.trim() !== '');
          for (const u of rUrls.slice(0, 4)) {
            const mId = await uploadMediaFromUrl(client, u);
            if (mId) replyMediaIds.push(mId);
          }
        }

        const replyParams: any = {
          text: stock.replyContent,
          reply: { in_reply_to_tweet_id: mainTweetId }
        };
        if (replyMediaIds.length > 0) {
          replyParams.media = { media_ids: replyMediaIds };
        }

        try {
          await client.v2.tweet(replyParams);
          replyPosted = true;
        } catch (err) {
          console.error(`Failed to post thread reply for account ${account.handle}:`, err);
        }
      }

      // Update Stock as posted
      await prisma.normalPostStock.update({
        where: { id: stock.id },
        data: { isPosted: true }
      });

      // Log
      await prisma.postLog.create({
        data: {
          xAccountId: account.id,
          postType: 'NORMAL_POST',
          newPostId: mainTweetId,
          status: 'SUCCESS',
          replyPosted: replyPosted
        }
      });

      results.push({ handle: account.handle, status: 'SUCCESS', stockId: stock.id });

    } catch (error: any) {
      console.error(`Error processing account ${account.handle}:`, error);
      // Log error
      await prisma.postLog.create({
        data: {
          xAccountId: account.id,
          postType: 'NORMAL_POST',
          status: 'FAILED',
        }
      });
      results.push({ handle: account.handle, status: 'FAILED', error: error.message });
    }
  }

  return NextResponse.json({ success: true, results });
}
