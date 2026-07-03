import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * 取得した対象のツイート内容から、AI（Gemini）を使って自然な引用リポスト用のコメントを生成する
 */
export async function generateQRTComment(originalTweetText: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.warn("[MOCK AI] GEMINI_API_KEY is not set. Returning a mock comment.");
    return `なるほど、これは非常に興味深いですね！全く同感です。 #学び`;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
以下のSNSの投稿（X/Twitter）に対して、引用リポストするためのコメントを生成してください。

【元の投稿内容】
${originalTweetText}

【指示】
- 投稿を肯定・共感しつつ、少し自分の意見を加えた自然な感想にすること
- スパムやBotっぽくならないように、人間らしい自然な日本語にすること
- インプレッションを集めやすくするため、共感を呼ぶトーンにすること
- 140文字以内に収めること
- ハッシュタグを1〜2個程度つけること
- コメントの文章のみを出力すること（前置きや解説は不要）
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    
    // 不要な記号や前置きを削除（AIが勝手につけた場合）
    text = text.replace(/^"|"$/g, '');
    
    return text;
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "これ凄すぎる…。みんなも絶対見た方がいい！ #おすすめ"; // エラー時のフォールバック
  }
}
