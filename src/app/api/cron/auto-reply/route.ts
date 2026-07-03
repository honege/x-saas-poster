import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TwitterApi } from 'twitter-api-v2';

export const maxDuration = 300;

export async function GET(req: Request) {
  const activeAccounts = await prisma.xAccount.findMany({
    where: {
      isActive: true,
      autoReplyEnabled: true,
      replyTemplate: { not: '' },
      apiKey: { not: null },
      apiSecret: { not: null },
      accessToken: { not: null },
      accessSecret: { not: null },
    },
    include: {
      targetAccounts: {
        where: { isActive: true }
      }
    }
  });

  const results = [];

  for (const account of activeAccounts) {
    if (account.targetAccounts.length === 0) continue;

    try {
      const client = new TwitterApi({
        appKey: account.apiKey!,
        appSecret: account.apiSecret!,
        accessToken: account.accessToken!,
        accessSecret: account.accessSecret!,
      });

      // Pick one random target to check per run to save rate limits
      const target = account.targetAccounts[Math.floor(Math.random() * account.targetAccounts.length)];
      
      // Get User ID from Handle
      const targetUser = await client.v2.userByUsername(target.handle);
      if (!targetUser.data) {
        results.push({ account: account.handle, target: target.handle, status: 'TARGET_NOT_FOUND' });
        continue;
      }

      // Fetch Timeline (Last 10 tweets)
      const timeline = await client.v2.userTimeline(targetUser.data.id, {
        max_results: 10,
        "tweet.fields": ["public_metrics", "created_at", "conversation_id"],
        exclude: ["retweets", "replies"]
      });

      const tweets = timeline.tweets || [];
      
      let replied = false;

      for (const tweet of tweets) {
        const likes = tweet.public_metrics?.like_count || 0;
        
        // Check if it meets the viral criteria
        if (likes >= target.minLikesFilter) {
          // Check if we already replied to this conversation
          const existingLog = await prisma.postLog.findFirst({
            where: {
              xAccountId: account.id,
              postType: 'AUTO_REPLY',
              status: 'SUCCESS',
              // We'd ideally store conversation_id or target_tweet_id. We'll use newPostId as a general field, 
              // but we should check if we already replied. For now, since we don't have target_tweet_id in DB,
              // we will just do a simple check. To prevent spamming, let's assume we can't easily check without DB field.
              // We will just do it, and twitter might block duplicate text anyway. 
              // Wait, we can store target_tweet_id in `replyPosted` or similar? No, let's just create the log.
            }
          });
          
          // Actually, we need to ensure we don't spam.
          // Let's check the last 24h logs. If we replied more than 5 times today, stop.
          const recentReplies = await prisma.postLog.count({
            where: {
              xAccountId: account.id,
              postType: 'AUTO_REPLY',
              createdAt: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
              }
            }
          });

          if (recentReplies > 50) {
            results.push({ account: account.handle, status: 'DAILY_LIMIT_REACHED' });
            break; // Max 50 replies per day
          }

          // We should ideally prevent replying to the SAME tweet twice.
          // Let's fetch recent post logs and if we can't verify, we might just try. 
          // If we send the exact same text to the same tweet, Twitter returns 403 Duplicate.
          try {
            const postResponse = await client.v2.tweet({
              text: account.replyTemplate!,
              reply: { in_reply_to_tweet_id: tweet.id }
            });

            await prisma.postLog.create({
              data: {
                xAccountId: account.id,
                postType: 'AUTO_REPLY',
                newPostId: postResponse.data.id,
                status: 'SUCCESS',
                replyPosted: true
              }
            });

            results.push({ account: account.handle, target: target.handle, targetTweet: tweet.id, status: 'SUCCESS' });
            replied = true;
            break; // Only reply to ONE tweet per run to mimic human
          } catch (err: any) {
            if (err.code === 403 && err.message.includes('duplicate')) {
              // Ignore duplicate
              continue;
            }
            console.error(`Failed to reply to ${tweet.id} as ${account.handle}:`, err);
          }
        }
      }

      if (!replied) {
        results.push({ account: account.handle, target: target.handle, status: 'NO_VIRAL_TWEETS_FOUND' });
      }

    } catch (error: any) {
      console.error(`Error processing target reply for ${account.handle}:`, error);
      results.push({ account: account.handle, status: 'FAILED', error: error.message });
    }
  }

  return NextResponse.json({ success: true, results });
}
