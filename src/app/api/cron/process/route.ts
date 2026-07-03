import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fetchTargetTweets, postQuoteTweet, postNormalTweet } from '@/lib/twitter';
import { generateQRTComment } from '@/lib/ai';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow 60 seconds for processing

export async function GET(req: Request) {
  try {
    // 1. 稼働中 (isActive: true) のすべてのアカウントを取得
    const activeAccounts = await prisma.xAccount.findMany({
      where: { isActive: true },
      include: {
        targetAccounts: true,
      }
    });

    const results = [];

    // 2. 各アカウントについて処理を実行
    for (const account of activeAccounts) {
      // ----------------------------------------------------
      // PART 1: NORMAL POST LOGIC (通常ポストの自動化)
      // ----------------------------------------------------
      try {
        if (account.normalPostEnabled) {
          const now = new Date();
          // Find the last NORMAL_POST for this account
          const lastNormalLog = await prisma.postLog.findFirst({
            where: { xAccountId: account.id, postType: 'NORMAL_POST', status: 'SUCCESS' },
            orderBy: { createdAt: 'desc' }
          });
          
          const lastNormalDate = lastNormalLog ? new Date(lastNormalLog.createdAt) : new Date(0);
          const diffMinutesNormal = Math.floor((now.getTime() - lastNormalDate.getTime()) / (1000 * 60));
          const targetIntervalNormal = Math.floor(Math.random() * (account.normalPostIntervalMax - account.normalPostIntervalMin + 1)) + account.normalPostIntervalMin;

          if (diffMinutesNormal >= targetIntervalNormal) {
            // Find an unposted normal post stock
            const stock = await prisma.normalPostStock.findFirst({
              where: { xAccountId: account.id, isPosted: false },
              orderBy: { createdAt: 'asc' } // Oldest first
            });

            if (stock) {
              let newPostId = "dummy_normal_post_id_" + Date.now();
              if (account.apiKey && account.apiSecret && account.accessToken && account.accessSecret) {
                const tweetResult = await postNormalTweet(
                  account.apiKey,
                  account.apiSecret,
                  account.accessToken,
                  account.accessSecret,
                  stock.content
                );
                newPostId = tweetResult.id;
              } else {
                console.log(`[MOCK NORMAL POST] Account: ${account.handle}`);
                console.log(`[MOCK NORMAL POST] Content: ${stock.content}`);
              }

              // Update stock to posted
              await prisma.normalPostStock.update({
                where: { id: stock.id },
                data: { isPosted: true }
              });

              // Log success
              await prisma.postLog.create({
                data: {
                  xAccountId: account.id,
                  postType: 'NORMAL_POST',
                  newPostId: newPostId,
                  status: 'SUCCESS',
                }
              });
              results.push({ handle: account.handle, type: 'NORMAL_POST', status: 'SUCCESS', newPostId });
            } else {
               results.push({ handle: account.handle, type: 'NORMAL_POST', status: 'SKIPPED', reason: 'No unposted stocks' });
            }
          } else {
             results.push({ handle: account.handle, type: 'NORMAL_POST', status: 'SKIPPED', reason: `Not enough time passed (${diffMinutesNormal}m < ${targetIntervalNormal}m)` });
          }
        }
      } catch (err: any) {
        console.error(`Error processing normal post for ${account.handle}:`, err);
        results.push({ handle: account.handle, type: 'NORMAL_POST', status: 'FAILED', error: err.message });
      }

      // ----------------------------------------------------
      // PART 2: QUOTE TWEET (QRT) LOGIC (引用リポストの自動化)
      // ----------------------------------------------------
      try {
        const now = new Date();
        const lastQrtLog = await prisma.postLog.findFirst({
          where: { xAccountId: account.id, postType: 'QUOTE_TWEET', status: 'SUCCESS' },
          orderBy: { createdAt: 'desc' }
        });
        const lastQrtDate = lastQrtLog ? new Date(lastQrtLog.createdAt) : (account.lastPostDate ? new Date(account.lastPostDate) : new Date(0));
        
        const diffMinutes = Math.floor((now.getTime() - lastQrtDate.getTime()) / (1000 * 60));
        const targetInterval = Math.floor(Math.random() * (account.postIntervalMax - account.postIntervalMin + 1)) + account.postIntervalMin;

        if (diffMinutes < targetInterval) {
          results.push({ handle: account.handle, type: 'QUOTE_TWEET', status: 'SKIPPED', reason: `Not enough time passed (${diffMinutes}m < ${targetInterval}m)` });
          continue; 
        }

        if (!account.targetAccounts || account.targetAccounts.length === 0) {
          results.push({ handle: account.handle, type: 'QUOTE_TWEET', status: 'SKIPPED', reason: 'No target accounts configured' });
          continue;
        }

        const randomTarget = account.targetAccounts[Math.floor(Math.random() * account.targetAccounts.length)];
        const tweets = await fetchTargetTweets(randomTarget.handle, randomTarget.minLikesFilter);
        
        if (tweets.length === 0) {
          results.push({ handle: account.handle, type: 'QUOTE_TWEET', status: 'SKIPPED', reason: 'No matching tweets found from target' });
          continue;
        }

        // すでにQRT済みかどうかのチェック
        const tweetToQuote = tweets[0]; // 最適な1件
        const alreadyPosted = await prisma.postLog.findFirst({
          where: {
            xAccountId: account.id,
            originalPostId: tweetToQuote.id
          }
        });

        if (alreadyPosted) {
          results.push({ handle: account.handle, type: 'QUOTE_TWEET', status: 'SKIPPED', reason: 'Tweet already quoted recently' });
          continue;
        }

        // AIによるコメント生成
        const qrtComment = await generateQRTComment(tweetToQuote.text);

        // 実際にXへ投稿 (QRT)
        let newPostId = "dummy_post_id_" + Date.now();
        
        if (account.apiKey && account.apiSecret && account.accessToken && account.accessSecret) {
          // 本番APIコール
          const tweetResult = await postQuoteTweet(
            account.apiKey,
            account.apiSecret,
            account.accessToken,
            account.accessSecret,
            tweetToQuote.id,
            qrtComment
          );
          newPostId = tweetResult.id;
        } else {
          // モック用のログ出力
          console.log(`[MOCK POST] Account: ${account.handle}`);
          console.log(`[MOCK POST] Comment: ${qrtComment}`);
          console.log(`[MOCK POST] Quoting: ${tweetToQuote.id}`);
        }

        // データベース更新 (ログ保存と最終投稿時間の更新)
        await prisma.postLog.create({
          data: {
            xAccountId: account.id,
            postType: 'QUOTE_TWEET',
            targetHandle: randomTarget.handle,
            originalPostId: tweetToQuote.id,
            newPostId: newPostId,
            status: 'SUCCESS',
            replyPosted: false,
          }
        });

        await prisma.xAccount.update({
          where: { id: account.id },
          data: { lastPostDate: new Date().toISOString() }
        });

        results.push({ handle: account.handle, type: 'QUOTE_TWEET', status: 'SUCCESS', newPostId });

      } catch (err: any) {
        console.error(`Error processing QRT for account ${account.handle}:`, err);
        
        await prisma.postLog.create({
          data: {
            xAccountId: account.id,
            postType: 'QUOTE_TWEET',
            status: 'FAILED',
          }
        });

        results.push({ handle: account.handle, type: 'QUOTE_TWEET', status: 'FAILED', error: err.message });
      }
    }

    return NextResponse.json({ processed: activeAccounts.length, results });

  } catch (error) {
    console.error('CRON Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
