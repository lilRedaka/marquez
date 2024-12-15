// pages/api/editor.js
import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { chapter, characters, environment, plot } = req.body;

    if (!chapter || !characters || !environment || !plot) {
        return res.status(400).json({ error: 'Missing required fields: chapter, characters, environment, plot' });
    }

    try {
        const openai = new OpenAI({
            apiKey: process.env.DASHSCOPE_API_KEY,
            baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
        });

        const prompt = `
    以下是用户输入的小说提示词：
    人物：${characters}
    环境：${environment}
    情节：${plot}
    
    以下是生成的章节内容：
    ${chapter}
    
    请检查生成的内容，确保与提示词一致，并修正任何错误或不合理的部分。`;

        const completion = await openai.chat.completions.create({
            model: 'qwen-plus',
            messages: [
                {
                    role: 'system',
                    content: '你是一个小说编辑器，负责审核和编辑生成的小说内容，确保其符合提示词要求。请直接输出修改后的内容。'
                },
                { role: 'user', content: prompt },
            ],
        });

        const editedChapter = completion.choices[0].message.content;

        return res.status(200).json({ editedChapter });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error editing novel chapter' });
    }
}
