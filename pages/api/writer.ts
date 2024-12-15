// pages/api/writer.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { characters, environment, plot, previousChapter, index } = req.body;

  if (!characters || !environment || !plot) {
    return res.status(400).json({ error: 'Missing required fields: characters, environment, plot' });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.DASHSCOPE_API_KEY,
      baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    });

    console.log("index", index);

    let prompt = `请生成小说的一个章节，章节内容中不包含小标题，内容应该包括以下要素：，
                    \n\n人物：${characters}\n环境：${environment}\n情节：${plot}\n
                    请根据上一章内容：${previousChapter},继续展开故事。     
                    请生成的小说内容应该符合提示词要求，内容应该连贯，不要出现明显的断层。
                    小说总计划5章，当前是第${index}章,请根据故事进展合理安排情节。
                    `

    if (index == 1) {
      prompt = `请生成小说的一个章节，章节内容中不包含小标题，内容应该包括以下要素：，
      \n\n人物：${characters}\n环境：${environment}\n情节：${plot}\n
      请生成的小说内容应该符合提示词要求，内容应该连贯，不要出现明显的断层。
      小说总计划5章，当前是第1章。
      `
    }

    if (index == 5) {
      prompt = `请生成小说的一个章节，章节内容中不包含小标题，内容应该包括以下要素：，
      \n\n人物：${characters}\n环境：${environment}\n情节：${plot}\n
      请根据上一章内容：${previousChapter},继续展开故事。 
      该章节为最终章章，请给出一个合理的结局。
      `
    }

    const completion = await openai.chat.completions.create({
      model: 'qwen-plus',
      messages: [
        {
          role: 'system',
          content: `你是一个小说作家，可以根据用户提供的提示词生成小说内容。
                    每次生成小说的一个章节，字数约3000字。  
                  `
        },
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
