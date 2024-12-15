import type { NextApiRequest, NextApiResponse } from 'next';
import { getNextChapterId, saveChapter } from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { novelId, title, content } = req.body;
    const id = await getNextChapterId();
    await saveChapter({ id, title, novelId, content });
    res.status(200).json({ message: 'Novel saved successfully' });
}