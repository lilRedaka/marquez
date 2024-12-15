// pages/api/writer.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { characters, environment, plot } = req.body;

  if (!characters || !environment || !plot) {
    return res.status(400).json({ error: 'Missing required fields: characters, environment, plot' });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.DASHSCOPE_API_KEY,
      baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    });

    const prompt = `生成一章小说，包含以下内容：\n\n人物：${characters}\n环境：${environment}\n情节：${plot}\n每章大约3000字。`;

    const completion = await openai.chat.completions.create({
      model: 'qwen-plus',
      messages: [
        { role: 'system', content: '你是一个小说生成器，可以根据用户提供的提示词生成小说内容。' },
        { role: 'user', content: prompt },
      ],
    });

    const chapter = completion.choices[0].message.content;

    return res.status(200).json({ chapter });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error generating novel chapter' });
  }
}
