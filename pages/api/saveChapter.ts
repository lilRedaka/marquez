import type { NextApiRequest, NextApiResponse } from 'next';
import { getNextChapterId, readNovel, saveChapter, saveNovel } from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { novelId, title, content } = req.body;
    const id = await getNextChapterId();
    await saveChapter({ id, title, novelId, content });
    const novel = await readNovel(novelId);
    if (novel) {
        await saveNovel({ ...novel, chapterIds: [...(novel.chapterIds ?? []), id] });
    }
    res.status(200).json({ message: 'Novel saved successfully' });
}