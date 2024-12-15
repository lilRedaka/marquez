import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 调用外部大语言模型 API 生成小说
  const response = await fetch('https://api.example.com/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt: req.body.prompt }),
  });
  const data = await response.json();
  res.status(200).json(data);
}