import { TwitterApi } from 'twitter-api-v2';

export interface TargetTweet {
  id: string;
  text: string;
  authorHandle: string;
  likes: number;
}

/**
 * Xアカウント（ユーザーのAPIキー）を使って引用リポストを行う
 */
export async function postQuoteTweet(
  apiKey: string,
  apiSecret: string,
  accessToken: string,
  accessSecret: string,
  originalTweetId: string,
  text: string
) {
  const client = new TwitterApi({
    appKey: apiKey,
    appSecret: apiSecret,
    accessToken: accessToken,
    accessSecret: accessSecret,
  });

  const rwClient = client.readWrite;

  try {
    // 引用リポスト（QRT）の投稿
    const result = await rwClient.v2.tweet(text, {
      quote_tweet_id: originalTweetId
    });
    return result.data;
  } catch (error) {
    console.error('Twitter API Post Error:', error);
    throw error;
  }
}

/**
 * ターゲットアカウントの最新ポストを取得する（RapidAPI連携）
 */
export async function fetchTargetTweets(handle: string, minLikes: number): Promise<TargetTweet[]> {
  const rapidApiKey = process.env.RAPIDAPI_KEY;
  const rapidApiHost = process.env.RAPIDAPI_HOST || 'twitter-api45.p.rapidapi.com';
  
  if (!rapidApiKey) {
    console.log(`[MOCK] RAPIDAPI_KEY is not set. Fetching mock tweets for ${handle} with minLikes ${minLikes}...`);
    return [
      {
        id: "1234567890123456789", 
        text: "これはダミーのバズポストです。AIは今後世界をどう変えるのか？AIの進化は止まらない！ #AI #テクノロジー",
        authorHandle: handle,
        likes: Math.max(minLikes + 100, 1500), 
      }
    ];
  }

  try {
    const cleanHandle = handle.replace('@', '');
    // エンドポイントは一例。利用するRapidAPIによって調整が必要
    const url = `https://${rapidApiHost}/timeline.php?screenname=${cleanHandle}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': rapidApiKey,
        'x-rapidapi-host': rapidApiHost
      }
    });

    if (!response.ok) {
      throw new Error(`RapidAPI Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // 一般的なAPIのレスポンス形式を想定（providerによって異なる）
    let tweets: any[] = [];
    if (data && data.timeline) {
      tweets = data.timeline;
    } else if (Array.isArray(data)) {
      tweets = data;
    } else if (data && data.data) {
      tweets = data.data; // Official API style
    }

    const filteredTweets = tweets
      .filter(t => {
        const likes = t.favorites || t.favorite_count || t.likes || t.public_metrics?.like_count || 0;
        return likes >= minLikes;
      })
      .map(t => ({
        id: t.tweet_id || t.id_str || String(t.id),
        text: t.text || t.full_text || "",
        authorHandle: handle,
        likes: t.favorites || t.favorite_count || t.likes || t.public_metrics?.like_count || 0,
      }));

    return filteredTweets;

  } catch (error) {
    console.error("Fetch Target Tweets Error:", error);
    return [];
  }
}

/**
 * Xアカウント（ユーザーのAPIキー）を使って通常ツイートを行う
 */
export async function postNormalTweet(
  apiKey: string,
  apiSecret: string,
  accessToken: string,
  accessSecret: string,
  text: string
) {
  const client = new TwitterApi({
    appKey: apiKey,
    appSecret: apiSecret,
    accessToken: accessToken,
    accessSecret: accessSecret,
  });

  const rwClient = client.readWrite;

  try {
    const result = await rwClient.v2.tweet(text);
    return result.data;
  } catch (error) {
    console.error('Twitter API Post Normal Error:', error);
    throw error;
  }
}

