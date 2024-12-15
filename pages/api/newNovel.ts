import type { NextApiRequest, NextApiResponse } from 'next';
import { saveNovel, Novel } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const novel: Novel = req.body;

        if (!novel.title || !Array.isArray(novel.chapters)) {
            res.status(400).json({ error: 'Invalid novel data' });
            return;
        }

        try {
            await saveNovel(novel);
            res.status(200).json({ message: 'Novel saved successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to save novel' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}