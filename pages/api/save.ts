import type { NextApiRequest, NextApiResponse } from 'next';
import { saveNovel } from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { title, content, chapter } = req.body;
    await saveNovel({ title, chapter, content });
    res.status(200).json({ message: 'Novel saved successfully' });
}