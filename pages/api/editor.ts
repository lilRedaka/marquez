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
                    content: `
                            你是一个编辑校验员，负责审核和编辑生成的小说内容，确保其符合提示词要求。输出格式为json，其中包含以下字段：

                            {
                            "title": "小说章节标题",
                            "content": "小说正文，约3000字。",
                            "abstract": "小说摘要，供后续章节参考。"
                            }

                            请注意：
                            1. 输出仅应包含上述字段的 JSON 数据。
                            2. 确保 JSON 格式正确，包含有效的键和值，并用双引号包裹字符串。
                            3. 不要包含其他内容，只输出符合要求的纯 JSON 格式。
                              `
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
