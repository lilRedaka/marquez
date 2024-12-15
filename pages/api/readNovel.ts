import type { NextApiRequest, NextApiResponse } from 'next';
import { readNovel } from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.body;
    const novels = await readNovel(id);
    res.status(200).json(novels);
}