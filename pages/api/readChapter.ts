import type { NextApiRequest, NextApiResponse } from 'next';
import { readChapter } from '@/lib/db';

// FILE: pages/api/readChapter.ts

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (!id || Array.isArray(id)) {
        res.status(400).json({ error: 'Invalid chapter ID' });
        return;
    }

    const chapterId = parseInt(id, 10);
    if (isNaN(chapterId)) {
        res.status(400).json({ error: 'Invalid chapter ID' });
        return;
    }

    const chapter = await readChapter(chapterId);

    if (!chapter) {
        res.status(404).json({ error: 'Chapter not found' });
        return;
    }

    res.status(200).json(chapter);
}